'use strict'

const cuid = require('cuid')

module.exports = function (suite) {
  suite.add('cuid', function () {
    cuid()
  }, {
    leaky: true,
    random: false,
    format: 'other',
    example: cuid(),
    guid: true
  })
}
