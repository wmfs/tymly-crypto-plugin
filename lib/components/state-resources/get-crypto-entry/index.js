const jwt = require('jsonwebtoken')
const { JSONPath } = require('jsonpath-plus')
const dottie = require('dottie')
const encryptionKey = process.env.TYMLY_AUTH_AUDIENCE

module.exports = class GetCryptoEntry {
  init (resourceConfig, env, callback) {
    this.values = resourceConfig.values || ''
    this.sourceModel = env.bootedServices.storage.models[resourceConfig.source]
    this.cryptoModel = env.bootedServices.storage.models['tymly_cryptoLocker']
    this.pathToDecryptionTargets = resourceConfig.pathToDecryptionTargets
    callback(null)
  }

  async run (event, context) {
    for (const path of this.values) {
      const key = path.split('.').pop()
      for (const decPath of this.pathToDecryptionTargets) {
        const decryptItem = JSONPath({ path: decPath, json: event })
        for (const target of decryptItem) {
          const value = JSONPath({ path: path, json: target[0] })
          for (const item of value) {
            const doc = await this.sourceModel.find(
              {
                where: {
                  [key]: { equals: item }
                }
              })

            for (const document of doc) {
              const id = JSONPath({ path: path, json: document })
              const cryptoRecord = await this.cryptoModel.findById(id)

              try {
                const decrypted = await jwt.verify(cryptoRecord.encryptedValue, encryptionKey)
                for (const decryptionItem of event.decryptionTarget) {
                  dottie.set(decryptionItem, key, decrypted.res[0])
                }
                context.sendTaskSuccess(event.decryptionTarget)
              } catch (err) {
                console.log('An error occured. Please check your encryption key has been set\n\n', err)
                context.sendTaskFailure()
              }
            }
          }
        }
      }
    }
  }
}
