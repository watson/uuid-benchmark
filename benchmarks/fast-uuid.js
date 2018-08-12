'use strict'

const uuid = require('fast-uuid').uuid4

module.exports = function (suite) {
  suite.add('fast-uuid', function () {
    uuid()
  }, {
    leaky: true,
    format: 'uuid'
  })
}
