module.exports = class AddCryptoEntry {
  init (resourceConfig, env, callback) {
    this.cryptoModel = env.bootedServices.storage.models['tymly_cryptoLocker']
    callback(null)
  }

  run (event, context) {
    console.log('This is adding a crypto entry')
    console.log('event: ', event)
    console.log('context: ', context)

    context.sendTaskSuccess()
  }
}
