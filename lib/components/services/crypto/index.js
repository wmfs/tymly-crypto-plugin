class CryptoService {
  boot (options, callback) {
    this.crypto = options.blueprintComponents.crypto || {}
    callback(null)
  }
}

module.exports = {
  serviceClass: CryptoService
}
