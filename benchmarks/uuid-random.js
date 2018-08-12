'use strict'

const uuid = require('uuid-random')

module.exports = function (suite) {
  const name = 'uuid-random'

  suite.add(name, function () {
    uuid()
  }, {
    format: 'uuid',
    cacheSize: 512
  })

  suite.add(name, function () {
    uuid.bin().toString('hex')
  }, {
    format: 'hex',
    cacheSize: 512
  })

  suite.add(name, function () {
    uuid.bin()
  }, {
    format: 'buffer',
    cacheSize: 512
  })
}
