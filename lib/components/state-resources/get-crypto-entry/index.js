const jwt = require('jsonwebtoken')
const { JSONPath } = require('jsonpath-plus')
const dottie = require('dottie')
const encryptionKey = process.env.TYMLY_AUTH_AUDIENCE || ''

module.exports = class GetCryptoEntry {
  /**
   * Init function for GetCryptoEntry class
   * @param {object} resourceConfig Pre-stated configuration of any required resources
   * @param {object} env The environment of the Tymly instance
   * @param {function} callback Callback function for when init is complete
   */
  init (resourceConfig, env, callback) {
    this.values = resourceConfig.values || ''
    this.sourceModel = env.bootedServices.storage.models[resourceConfig.source]
    this.cryptoModel = env.bootedServices.storage.models['tymly_cryptoLocker']
    this.pathToDecryptionTargets = resourceConfig.pathToDecryptionTargets
    callback(null)
  }

  /**
   * Run function for main state resource execution
   * @param {object} event The event of the current Tymly execution
   * @param {object} context The current Tymly context object
   * @returns {void} sendTaskSuccess Whether the 'get' of this crypto record was successful or not
   * @example
   * const execDesc = await statebox.startExecution(
      {},
      test_getCryptoValue_1_0,
      {
        sendResponse: 'AFTER_RESOURCE_CALLBACK.TYPE:awaitingHumanInput'
      }
   )
   */
  async run (event, context) {
    for (const path of this.values) {
      const key = path.split('.').pop()
      for (const decPath of this.pathToDecryptionTargets) {
        const decryptItem = JSONPath({ path: decPath, json: event, flatten: true })
        for (const target of decryptItem) {
          const value = JSONPath({ path: path, json: target })
          for (const item of value) {
            const doc = await this.sourceModel.find(
              {
                where: {
                  [key]: { equals: item }
                }
              })

            for (const document of doc) {
              const id = JSONPath({ path: path, json: document })
              if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)) {
                try {
                  const cryptoRecord = await this.cryptoModel.findById(id)
                  const decrypted = await jwt.verify(cryptoRecord.encryptedValue, encryptionKey, { algorithm: 'HS256' })
                  for (const decryptionItem of this.pathToDecryptionTargets) {
                    const data = JSONPath({ path: decryptionItem, json: event, flatten: true })
                    dottie.set(data[0], key, decrypted.res[0])
                  }
                } catch (e) {
                  console.error(`\nAn error occurred \n ${e}`)
                  return context.sendTaskSuccess(event)
                }
              } else {
                console.warn(`\nA none UUID value was found (${Object.entries(id)}), not attempting decryption`)
                return context.sendTaskSuccess(event)
              }
            }
          }
        }
      }
    }
    context.sendTaskSuccess(event)
  }
}
