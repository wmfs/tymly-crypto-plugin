module.exports = class DeleteExpiredCryptoEntry {
  init (resourceConfig, env, callback) {
    this.cryptoModel = env.bootedServices.storage.models['tymly_cryptoLocker']
    callback(null)
  }

  run (event, context) {
    console.log('This is removing expired entries')
    console.log('event: ', event)
    console.log('context: ', context)

    context.sendTaskSuccess()
  }
}
