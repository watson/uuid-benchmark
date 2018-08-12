'use strict'

const uuid = require('uuid-random')

module.exports = function (suite) {
  suite.add('uuid-random', function () {
    uuid()
  }, {
    format: 'uuid'
  })
}
