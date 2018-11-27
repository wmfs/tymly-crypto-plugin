const jwt = require('jsonwebtoken')
const { JSONPath } = require('jsonpath-plus')
const dottie = require('dottie')

module.exports = class AddCryptoEntry {
  init (resourceConfig, env, callback) {
    this.cryptoModel = env.bootedServices.storage.models['tymly_cryptoLocker']
    this.values = resourceConfig.values || ''
    this.expiry = resourceConfig.expiryOffset || '30d'
    callback(null)
  }

  async run (event, context) {
    const { formData } = event
    /*
      EXTRACT FROM EVENT/CONTEXT:
        - Path to the value we want to encrypt
        - Path to the booking time (in terms of s&w for now)
        - Expiry offset in ms
        - Path to encryption key (use s&w ID for now)
    */
    const encryptionKey = process.env.TYMLY_AUTH_AUDIENCE || 'You didnt set a key though'
    /*
      CRAFT JWT THAT CONTAINS EXPIRY TIME & VALUE WE WANT TO ENCRYPT
    */
    for (const value of this.values) {
      const res = JSONPath({ path: value, json: event })
      const encryptedValue = jwt.sign(
        { res },
        encryptionKey,
        {
          expiresIn: this.expiry
        }
      )
      /*
      INSERT INTO CRYPTOLOCKER TABLE:
        - Encrypted Value
        - Expiry Date
      */
      const doc = await this.cryptoModel.upsert({
        encryptedValue: encryptedValue,
        expiry: this.expiry
      })
      /*
      RETURN UUID IN PLACE OF ENCRYPTED VALUE
      */
      dottie.set(formData, value.split('.').pop(), doc.idProperties.id)
    }

    context.sendTaskSuccess({ encryptedFormData: formData })
  }
}
