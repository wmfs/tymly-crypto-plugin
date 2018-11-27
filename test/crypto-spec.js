/* eslint-env mocha */

const tymly = require('@wmfs/tymly')
const path = require('path')
const expect = require('chai').expect

const ADD_VALUE_STATE_MACHINE = 'test_addCryptoValue'
const DELETE_VALUE_STATE_MACHINE = 'test_deleteCryptoValue'
const DELETE_EXPIRED_STATE_MACHINE = 'test_deleteExpiredValue'

const FORM_DATA = {
  dontEncryptThis: 'test string',
  encryptThisOne: 'test string'
}

describe('Test general crypto actions', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService, statebox, cryptoModel, testFormModel, execName, id

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
          path.resolve(__dirname, '../node_modules/@wmfs/tymly-users-plugin'),
          path.resolve(__dirname, '../node_modules/@wmfs/tymly-rbac-plugin'),
          path.resolve(__dirname, '../node_modules/@wmfs/tymly-solr-plugin'),
          path.resolve(__dirname, '../node_modules/@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
        ],
        blueprintPaths: [
          path.resolve(__dirname, './fixtures/test-blueprint')
        ]
      },
      (err, tymlyServices) => {
        expect(err).to.eql(null)
        tymlyService = tymlyServices.tymly
        statebox = tymlyServices.statebox
        cryptoModel = tymlyServices.storage.models['tymly_cryptoLocker']
        testFormModel = tymlyServices.storage.models['test_cryptoTest']
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

  it('should complete the test form', async () => {
    const execDesc = await statebox.sendTaskSuccess(
      execName,
      FORM_DATA,
      {}
    )

    expect(execDesc.status).to.eql('RUNNING')
    expect(execDesc.currentStateName).to.eql('AddValue')
  })

  it('should wait for ADD_VALUE_STATE_MACHINE to finish', async () => {
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

  xit('should run the delete crypto value state machine', async () => {
    const execDesc = await statebox.startExecution(
      {},
      DELETE_VALUE_STATE_MACHINE,
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.currentStateName).to.eql('DeleteValue')
  })

  xit('should run the delete expired crypto value state machine', async () => {
    const execDesc = await statebox.startExecution(
      {},
      DELETE_EXPIRED_STATE_MACHINE,
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.currentStateName).to.eql('DeleteExpired')
  })
})
