const jwt = require('jsonwebtoken')
const { JSONPath } = require('jsonpath-plus')
const dottie = require('dottie')
const encryptionKey = process.env.TYMLY_AUTH_AUDIENCE || ''

class CryptoService {
  /**
   * Boot function to expose Crypto Service class
   * @param {object} options
   * @param {function} callback Callback function for when boot is complete
   */
  boot (options) {
    this.crypto = options.blueprintComponents.crypto || {}
    this.cryptoModel = options.bootedServices.storage.models.tymly_cryptoLocker
  }

  async decrypt (event, pathToDecryptionTargets = [], values = []) {
    for (const path of values) {
      const key = path.split('.').pop()
      for (const decPath of pathToDecryptionTargets) {
        const decryptItem = JSONPath({ path: decPath, json: event, flatten: true })
        for (const target of decryptItem) {
          const value = JSONPath({ path: path, json: target })
          for (const id of value) {
            if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)) {
              try {
                const cryptoRecord = await this.cryptoModel.findById(id)
                const decrypted = await jwt.verify(cryptoRecord.encryptedValue, encryptionKey, { algorithm: 'HS256' })
                for (const decryptionItem of pathToDecryptionTargets) {
                  const data = JSONPath({ path: decryptionItem, json: event, flatten: true })
                  dottie.set(data[0], key, decrypted.res[0])
                }
              } catch (e) {
                console.error(`\nAn error occurred \n ${e}`)
                return event
              }
            } else {
              console.warn(`\nA none UUID value was found (${id}), not attempting decryption`)
              return event
            }
          }
        }
      }
    }

    return event
  }
}

module.exports = {
  serviceClass: CryptoService
}
