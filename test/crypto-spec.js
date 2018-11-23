/* eslint-env mocha */

const tymly = require('@wmfs/tymly')
const path = require('path')
const expect = require('chai').expect

const ADD_VALUE_STATE_MACHINE = 'test_addCryptoValue'
const DELETE_VALUE_STATE_MACHINE = 'test_deleteCryptoValue'
const DELETE_EXPIRED_STATE_MACHINE = 'test_deleteExpiredValue'

describe('Test general crypto actions', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService, statebox, cryptoModel

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
        done()
      }
    )
  })

  it('should run the add crypto value state machine', async () => {
    const execDesc = await statebox.startExecution(
      {},
      ADD_VALUE_STATE_MACHINE,
      {
        sendResponse: 'COMPLETE'
      }
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.currentStateName).to.eql('AddValue')
  })

  it('should run the delete crypto value state machine', async () => {
    const execDesc = await statebox.startExecution(
      {},
      DELETE_VALUE_STATE_MACHINE,
      {
        sendResponse: 'COMPLETE'
      }
    )

    console.log('>>> ', execDesc)
    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.currentStateName).to.eql('DeleteValue')
  })

  it('should run the delete expired crypto value state machine', async () => {
    const execDesc = await statebox.startExecution(
      {},
      DELETE_EXPIRED_STATE_MACHINE,
      {
        sendResponse: 'COMPLETE'
      }
    )

    console.log('>>> ', execDesc)
    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.currentStateName).to.eql('DeleteExpired')
  })
})
