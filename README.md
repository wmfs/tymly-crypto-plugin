# tymly-crypto-plugin

[![Tymly Blueprint](https://img.shields.io/badge/tymly-blueprint-blue.svg)](https://tymly.io/)
[![npm (scoped)](https://img.shields.io/npm/v/@wmfs/tymly-crypto-plugin.svg)](https://www.npmjs.com/package/@wmfs/tymly-crypto-plugin)
[![Build Status](https://travis-ci.com/wmfs/tymly-crypto-plugin.svg?branch=master)](https://travis-ci.com/wmfs/tymly-crypto-plugin)
[![codecov](https://codecov.io/gh/wmfs/tymly-crypto-plugin/branch/master/graph/badge.svg)](https://codecov.io/gh/wmfs/tymly-crypto-plugin)
[![CodeFactor](https://www.codefactor.io/repository/github/wmfs/tymly-crypto-plugin/badge)](https://www.codefactor.io/repository/github/wmfs/tymly-crypto-plugin)
[![Dependabot badge](https://img.shields.io/badge/Dependabot-active-brightgreen.svg)](https://dependabot.com/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/wmfs/tymly-crypto-plugin/blob/master/LICENSE)


> Plugin to enable [Tymly](https://github.com/wmfs/tymly) to perform encryption. Powered by [JSON web tokens](https://www.npmjs.com/package/jsonwebtoken)

tymly-crypto-plugin provides access to the Tymly crypto service, the schema for the cryptoLocker model, and the state resources:

**addCryptoEntry**

> A state resource to grab some sensitive data from a given JSON path, and encrypt within a JWT

Whose ```resourceConfig``` requires:
* A ```values``` array which is a list of [JSON Paths](https://github.com/json-path/JsonPath) to encrypt and store in ```tymly_cryptoLocker``` table

* An ```expiryOffset``` which is the lifetime of the JWT that will hold the sensitive data

```
"AddCryptoEntry": {
      "Type": "Task",
      "Resource": "module:addCryptoEntry",
      "ResourceConfig": {
        "values": [
          "$.JSONPath.to.value.to.encrypt"
        ],
        "expiryOffset": "ExpiryTime"
      },
      "End": true
    }
```



**getCryptoEntry**

> A state resource to grab some some encrypted data, and decrypt a JWT


Whose ```resourceConfig``` requires:
* A ```source``` string which is a path to the [in-memory](https://github.com/wmfs/tymly-core/blob/master/lib/plugin/components/services/storage/Memory-model.js) OR postgres table the data to be decrypted is held in, in the form "NAMESPACE_TABLENAME"

* A ```values``` array which is a list of JSON paths 
```
"GetCryptoEntry": {
      "Type": "Task",
      "Resource": "module:getCryptoEntry",
      "ResourceConfig": {
        "source": "NAMESPACE_TABLENAME",
        "values": [
          "$.JSONPath.to.value.to.decrypt"
        ]
      },
      "End": true
    }
```

and is soon to include:

**deleteExpiredCryptoValues**


## <a name="install"></a> Install
```
$ npm install @wmfs/tymly-crypto-plugin --save
```
## <a name="install"></a> Testing

> tymly-crypto-plugin only requires an encryption string to be present to run.

```
$ npm run test
```

### Environment Variables
```TYMLY_AUTH_AUDIENCE=anyStringYouLike```

