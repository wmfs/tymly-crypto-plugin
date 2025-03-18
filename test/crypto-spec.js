/* eslint-env mocha */

const tymly = require('@wmfs/tymly')
const path = require('path')
const expect = require('chai').expect

const ADD_VALUE_STATE_MACHINE = 'test_addCryptoValue'
const GET_VALUE_STATE_MACHINE = 'test_getCryptoValue'
const GET_EMPTY_STATE_MACHINE = 'test_getEmptyValue'

const FORM_DATA = {
  dontEncryptThis: 'test string',
  encryptThisOne: 'test string'
}

const FORM_DATA_2 = {
  dontEncryptThis: 'test string',
  encryptThisOne: ''
}

const FORM_DATA_3 = {
  dontEncryptThis: 'test string',
  encryptThisOne: null
}

describe('Test general crypto actions', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let statebox, cryptoModel, testFormModel, execName, id

  before(function () {
    if (process.env.PG_CONNECTION_STRING && !/^postgres:\/\/[^:]+:[^@]+@(?:localhost|127\.0\.0\.1).*$/.test(process.env.PG_CONNECTION_STRING)) {
      console.log(`Skipping tests due to unsafe PG_CONNECTION_STRING value (${process.env.PG_CONNECTION_STRING})`)
      this.skip()
    }
  })

  it('should run the tymly service', done => {
    tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, './..'),
          path.resolve(__dirname, '../node_modules/@wmfs/tymly-cardscript-plugin'),
          path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
        ],
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/test-blueprint')
        ]
      },
      (err, tymlyServices) => {
        expect(err).to.eql(null)
        statebox = tymlyServices.statebox
        cryptoModel = tymlyServices.storage.models.tymly_cryptoLocker
        testFormModel = tymlyServices.storage.models.test_cryptoTest
        done()
      }
    )
  })

  it('should run the add crypto value state machine', async () => {
    const execDesc = await statebox.startExecution(
      {},
      ADD_VALUE_STATE_MACHINE,
      {
        sendResponse: 'AFTER_RESOURCE_CALLBACK.TYPE:awaitingHumanInput'
      }
    )

    // console.log('>>>', execDesc)

    execName = execDesc.executionName
    expect(execDesc.status).to.eql('RUNNING')
    expect(execDesc.currentStateName).to.eql('AwaitingHumanInput')
  })

  it('should complete the test form and wait for ADD_VALUE_STATE_MACHINE to finish', async () => {
    await statebox.sendTaskSuccess(
      execName,
      FORM_DATA,
      {}
    )

    const execDesc = await statebox.waitUntilStoppedRunning(
      execName
    )

    expect(execDesc.currentStateName).to.eql('Upserting')
    expect(execDesc.status).to.eql('SUCCEEDED')
    id = execDesc.ctx.encryptedFormData.encryptThisOne
  })

  it('should find an encrypted value in the crypto model', async () => {
    const res = await cryptoModel.findById(id)

    expect(res.id).to.eql(id)
    expect(res.encryptedValue).to.not.eql('test string')
    expect(res.expiry).to.eql('3d')
  })

  it('should also find an encrypted value in the test form model', async () => {
    const res = await testFormModel.find({})

    expect(res[0].encryptThisOne).to.not.eql('test string')
    expect(res[0].dontEncryptThis).to.eql('test string')
  })

  it('should run the get crypto value state machine', async () => {
    const execDesc = await statebox.startExecution(
      {},
      GET_VALUE_STATE_MACHINE,
      {
        sendResponse: 'COMPLETE'
      }
    )

    execName = execDesc.executionName
    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.currentStateName).to.eql('DecryptValue')
  })

  it('should wait for GET_VALUE_STATE_MACHINE to finish', async () => {
    const execDesc = await statebox.waitUntilStoppedRunning(
      execName
    )

    console.log('***', JSON.stringify(execDesc, null, 2))
    expect(execDesc.ctx.data.decryptionTarget[0].encryptThisOne).to.eql('test string')
    expect(execDesc.status).to.eql('SUCCEEDED')
  })

  it('should attempt encryption of an empty string', async () => {
    const execDesc = await statebox.startExecution(
      {},
      ADD_VALUE_STATE_MACHINE,
      {
        sendResponse: 'AFTER_RESOURCE_CALLBACK.TYPE:awaitingHumanInput'
      }
    )

    // console.log('>>>', execDesc)

    execName = execDesc.executionName
    expect(execDesc.status).to.eql('RUNNING')
    expect(execDesc.currentStateName).to.eql('AwaitingHumanInput')
  })

  it('should complete the test form with empty crypto value and wait for ADD_VALUE_STATE_MACHINE to finish', async () => {
    await statebox.sendTaskSuccess(
      execName,
      FORM_DATA_2,
      {}
    )

    const execDesc = await statebox.waitUntilStoppedRunning(
      execName
    )

    expect(execDesc.currentStateName).to.eql('Upserting')
    expect(execDesc.status).to.eql('SUCCEEDED')
  })

  it('should not find any additional value in the crypto model', async () => {
    const res = await cryptoModel.find({})

    expect(res.length).to.eql(1)
  })

  it('should attempt encryption of a null value', async () => {
    const execDesc = await statebox.startExecution(
      {},
      ADD_VALUE_STATE_MACHINE,
      {
        sendResponse: 'AFTER_RESOURCE_CALLBACK.TYPE:awaitingHumanInput'
      }
    )

    // console.log('>>>', execDesc)

    execName = execDesc.executionName
    expect(execDesc.status).to.eql('RUNNING')
    expect(execDesc.currentStateName).to.eql('AwaitingHumanInput')
  })

  it('should complete the test form with null crypto value and wait for ADD_VALUE_STATE_MACHINE to finish', async () => {
    await statebox.sendTaskSuccess(
      execName,
      FORM_DATA_3,
      {}
    )

    const execDesc = await statebox.waitUntilStoppedRunning(
      execName
    )

    expect(execDesc.currentStateName).to.eql('Upserting')
    expect(execDesc.status).to.eql('SUCCEEDED')
  })

  it('should not find any additional value in the crypto model', async () => {
    const res = await cryptoModel.find({})

    expect(res.length).to.eql(1)
  })

  it('should run the get empty value state machine', async () => {
    const execDesc = await statebox.startExecution(
      {},
      GET_EMPTY_STATE_MACHINE,
      {
        sendResponse: 'COMPLETE'
      }
    )

    let found = false
    execName = execDesc.executionName
    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.currentStateName).to.eql('DecryptValue')
    for (const record of execDesc.ctx.data.decryptionTarget) {
      if (record.encryptThisOne === '') found = true
    }
    expect(found).to.eql(true)
  })
})
