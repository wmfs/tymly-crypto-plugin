# [1.4.0](https://github.com/wmfs/tymly-crypto-plugin/compare/v1.3.3...v1.4.0) (2019-04-04)


### ✨ Features

* extend tests for null and undefined support ([4829ec3](https://github.com/wmfs/tymly-crypto-plugin/commit/4829ec3))


### 🐛 Bug Fixes

* do not attempt to encrypt null or undefined values ([c4c2806](https://github.com/wmfs/tymly-crypto-plugin/commit/c4c2806))
* no longer try to decrypt target if a UUID is not present ([0a55d06](https://github.com/wmfs/tymly-crypto-plugin/commit/0a55d06))


### 📚 Documentation

* JSDocs for add-crypto-entry ([257daf3](https://github.com/wmfs/tymly-crypto-plugin/commit/257daf3))
* JSDocs for crypto/index ([4b5033f](https://github.com/wmfs/tymly-crypto-plugin/commit/4b5033f))
* JSDocs for get-crypto-entry ([dada5a5](https://github.com/wmfs/tymly-crypto-plugin/commit/dada5a5))


### ⚙️ Continuous Integrations

* **circle:** add circle ci config ([b984927](https://github.com/wmfs/tymly-crypto-plugin/commit/b984927))
* **travis:** update travis config ([d74edc8](https://github.com/wmfs/tymly-crypto-plugin/commit/d74edc8))

## [1.3.3](https://github.com/wmfs/tymly-crypto-plugin/compare/v1.3.2...v1.3.3) (2019-01-10)


### 🐛 Bug Fixes

* add log so we can debug dev ([6f6c942](https://github.com/wmfs/tymly-crypto-plugin/commit/6f6c942))
* algorithm not algorithms ([45d60ea](https://github.com/wmfs/tymly-crypto-plugin/commit/45d60ea))
* algorithm not algorithms pt.2 ([21076da](https://github.com/wmfs/tymly-crypto-plugin/commit/21076da))
* explicitly state encryption and decryption algorithm to prevent mismatch? ([21f79cb](https://github.com/wmfs/tymly-crypto-plugin/commit/21f79cb))

## [1.3.2](https://github.com/wmfs/tymly-crypto-plugin/compare/v1.3.1...v1.3.2) (2019-01-09)


### 🐛 Bug Fixes

* default encryption string to empty if the env var can't be found ([d6ea2a4](https://github.com/wmfs/tymly-crypto-plugin/commit/d6ea2a4))


### 🛠 Builds

* **deps-dev:** update [@semantic-release](https://github.com/semantic-release)/git requirement ([#4](https://github.com/wmfs/tymly-crypto-plugin/issues/4)) ([edd774e](https://github.com/wmfs/tymly-crypto-plugin/commit/edd774e))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly requirement from 1.66.0 to 1.75.0 ([#3](https://github.com/wmfs/tymly-crypto-plugin/issues/3)) ([98b4167](https://github.com/wmfs/tymly-crypto-plugin/commit/98b4167))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly-rbac-plugin requirement ([#7](https://github.com/wmfs/tymly-crypto-plugin/issues/7)) ([1294c92](https://github.com/wmfs/tymly-crypto-plugin/commit/1294c92))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly-solr-plugin requirement ([#5](https://github.com/wmfs/tymly-crypto-plugin/issues/5)) ([45d1264](https://github.com/wmfs/tymly-crypto-plugin/commit/45d1264))
* **deps-dev:** update [@wmfs](https://github.com/wmfs)/tymly-test-helpers requirement ([#6](https://github.com/wmfs/tymly-crypto-plugin/issues/6)) ([2569b67](https://github.com/wmfs/tymly-crypto-plugin/commit/2569b67))
* **deps-dev:** update semantic-release requirement ([#8](https://github.com/wmfs/tymly-crypto-plugin/issues/8)) ([24f5feb](https://github.com/wmfs/tymly-crypto-plugin/commit/24f5feb))

## [1.3.1](https://github.com/wmfs/tymly-crypto-plugin/compare/v1.3.0...v1.3.1) (2018-12-19)


### 🐛 Bug Fixes

* return task success on error in get-crypto-entry to suppress looping errors ([bdf871d](https://github.com/wmfs/tymly-crypto-plugin/commit/bdf871d))


### 🚨 Tests

* Combine a couple of tests - expecting machine state to be running isn't reliable ([f94104a](https://github.com/wmfs/tymly-crypto-plugin/commit/f94104a))
* remove unnecessary state ([e6e4d98](https://github.com/wmfs/tymly-crypto-plugin/commit/e6e4d98))

# [1.3.0](https://github.com/wmfs/tymly-crypto-plugin/compare/v1.2.0...v1.3.0) (2018-12-18)


### ✨ Features

* implementation, error handling and supporting tests for getting a value that is not a JWT ([a358f9f](https://github.com/wmfs/tymly-crypto-plugin/commit/a358f9f))


### 🐛 Bug Fixes

* Standard :( ([2637df7](https://github.com/wmfs/tymly-crypto-plugin/commit/2637df7))

# [1.2.0](https://github.com/wmfs/tymly-crypto-plugin/compare/v1.1.3...v1.2.0) (2018-12-18)


### ✨ Features

* now deals with empty strings and does not upsert empty encoded values to cryptoLocker model ([10f3825](https://github.com/wmfs/tymly-crypto-plugin/commit/10f3825))

## [1.1.3](https://github.com/wmfs/tymly-crypto-plugin/compare/v1.1.2...v1.1.3) (2018-12-11)


### 🐛 Bug Fixes

* readme update & build ([b5fc065](https://github.com/wmfs/tymly-crypto-plugin/commit/b5fc065))


### ♻️ Chores

* **README:** readme update for new implementation ([8a385ea](https://github.com/wmfs/tymly-crypto-plugin/commit/8a385ea))
* **README:** spacing ([83b169f](https://github.com/wmfs/tymly-crypto-plugin/commit/83b169f))
* add example.json to doc folders for add and get resources ([cdbc91e](https://github.com/wmfs/tymly-crypto-plugin/commit/cdbc91e))
* remove test delete state machine ([cee5d0a](https://github.com/wmfs/tymly-crypto-plugin/commit/cee5d0a))
* remove unused state resource ([d87c412](https://github.com/wmfs/tymly-crypto-plugin/commit/d87c412))
* remove unused try/catch ([e36a12b](https://github.com/wmfs/tymly-crypto-plugin/commit/e36a12b))

## [1.1.2](https://github.com/wmfs/tymly-crypto-plugin/compare/v1.1.1...v1.1.2) (2018-12-11)


### 🐛 Bug Fixes

* **get-crypto-value:** align with s&w process ([1c0b1e7](https://github.com/wmfs/tymly-crypto-plugin/commit/1c0b1e7))

## [1.1.1](https://github.com/wmfs/tymly-crypto-plugin/compare/v1.1.0...v1.1.1) (2018-12-11)


### 🐛 Bug Fixes

* **get-crypto-value:** change test expect ([28502f8](https://github.com/wmfs/tymly-crypto-plugin/commit/28502f8))
* **get-crypto-value:** change test expect [#2](https://github.com/wmfs/tymly-crypto-plugin/issues/2) ([85033d2](https://github.com/wmfs/tymly-crypto-plugin/commit/85033d2))
* **get-crypto-value:** refactor to accomodate s&w implementation ([227e612](https://github.com/wmfs/tymly-crypto-plugin/commit/227e612))


### ♻️ Chores

* **README:** big README update ([b3cddb0](https://github.com/wmfs/tymly-crypto-plugin/commit/b3cddb0))

# [1.1.0](https://github.com/wmfs/tymly-crypto-plugin/compare/v1.0.1...v1.1.0) (2018-12-04)


### ✨ Features

* **get-crypto-value:** initial implementation and tests for get-crypto-value state resource ([103e0d6](https://github.com/wmfs/tymly-crypto-plugin/commit/103e0d6))


### 🐛 Bug Fixes

* **get-crypto-value:** standard strikes again ([0c90378](https://github.com/wmfs/tymly-crypto-plugin/commit/0c90378))

## [1.0.1](https://github.com/wmfs/tymly-crypto-plugin/compare/v1.0.0...v1.0.1) (2018-12-04)


### 🐛 Bug Fixes

* **add-crypto-entry:** pass in empty options obj to upsert ([eded480](https://github.com/wmfs/tymly-crypto-plugin/commit/eded480))
* **add-crypto-entry:** standard fixes ([c72db39](https://github.com/wmfs/tymly-crypto-plugin/commit/c72db39))
* **add-crypto-entry:** standard fixes [#2](https://github.com/wmfs/tymly-crypto-plugin/issues/2) ([c64b9cd](https://github.com/wmfs/tymly-crypto-plugin/commit/c64b9cd))


### 📚 Documentation

* add badges ([abc4043](https://github.com/wmfs/tymly-crypto-plugin/commit/abc4043))
* add changelog ([7fb9f20](https://github.com/wmfs/tymly-crypto-plugin/commit/7fb9f20))
* codecov badge ([6a92c9b](https://github.com/wmfs/tymly-crypto-plugin/commit/6a92c9b))
* **readme:** update ([2fbb301](https://github.com/wmfs/tymly-crypto-plugin/commit/2fbb301))


### ⚙️ Continuous Integrations

* **travis:** remove release config - use releaserc.json | update git url ([ee140dd](https://github.com/wmfs/tymly-crypto-plugin/commit/ee140dd))
