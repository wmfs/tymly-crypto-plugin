module.exports = class DeleteCryptoEntry {
  init (resourceConfig, env, callback) {
    this.cryptoModel = env.bootedServices.storage.models['tymly_cryptoLocker']
    callback(null)
  }

  run (event, context) {
    console.log('This is deleting a crypto entry')
    console.log('event: ', event)
    console.log('context: ', context)
  }
}
