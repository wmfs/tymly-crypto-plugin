const jwt = require('jsonwebtoken')
const { JSONPath } = require('jsonpath-plus')
const dottie = require('dottie')
const encryptionKey = process.env.TYMLY_AUTH_AUDIENCE || ''

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
              try {
                const cryptoRecord = await this.cryptoModel.findById(id)
                console.log('ARON LOOK WHAT DOES THIS SAY? :', encryptionKey)
                const decrypted = await jwt.verify(cryptoRecord.encryptedValue, encryptionKey, { algorithms: ['HS256'] })
                for (const decryptionItem of this.pathToDecryptionTargets) {
                  const data = JSONPath({ path: decryptionItem, json: event, flatten: true })
                  dottie.set(data[0], key, decrypted.res[0])
                }
              } catch (e) {
                console.error('An error occured \n', e)
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
