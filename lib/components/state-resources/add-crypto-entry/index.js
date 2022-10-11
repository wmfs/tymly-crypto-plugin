const jwt = require('jsonwebtoken')
const { JSONPath } = require('jsonpath-plus')
const dottie = require('dottie')

module.exports = class AddCryptoEntry {
  /**
   * Init function for AddCryptoEntry class
   * @param {object} resourceConfig Pre-stated configuration of any required resources
   * @param {object} env The environment of the Tymly instance
   * @param {function} callback Callback function for when init is complete
   */
  init (resourceConfig, env) {
    this.cryptoModel = env.bootedServices.storage.models.tymly_cryptoLocker
    this.values = resourceConfig.values || ''
    this.expiry = resourceConfig.expiryOffset || '30d'
  }

  /**
   * Run function for main state resource execution
   * @param {object} event The event of the current Tymly execution
   * @param {object} context The current Tymly context object
   * @returns {void} sendTaskSuccess Whether the addition of this crypto record was successful or not
   * @example
   * const execDesc = await statebox.startExecution(
      {},
      test_addCryptoValue_1_0,
      {
        sendResponse: 'AFTER_RESOURCE_CALLBACK.TYPE:awaitingHumanInput'
      }
   )
   */
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

      if (res[0] === '' || res[0] === null || res[0] === undefined) continue

      const encryptedValue = jwt.sign(
        { res },
        encryptionKey,
        {
          expiresIn: this.expiry,
          algorithm: 'HS256'
        }
      )
      /*
      INSERT INTO CRYPTOLOCKER TABLE:
        - Encrypted Value
        - Expiry Date
      */

      const doc = await this.cryptoModel.upsert({ encryptedValue, expiry: this.expiry }, {})

      /*
      RETURN UUID IN PLACE OF ENCRYPTED VALUE
      */
      dottie.set(formData, value.split('.').pop(), doc.idProperties.id)
    }

    context.sendTaskSuccess({ encryptedFormData: formData })
  }
}
