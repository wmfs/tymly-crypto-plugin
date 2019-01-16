class CryptoService {
  /**
   * Boot function to expose Crypto Service class
   * @param {object} options
   * @param {function} callback Callback function for when boot is complete
   */
  boot (options, callback) {
    this.crypto = options.blueprintComponents.crypto || {}
    callback(null)
  }
}

module.exports = {
  serviceClass: CryptoService
}
