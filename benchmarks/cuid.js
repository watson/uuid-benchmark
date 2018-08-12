'use strict'

const cuid = require('cuid')

module.exports = function (suite) {
  suite.add('cuid', function () {
    cuid()
  }, {
    leaky: true,
    format: 'other',
    example: cuid(),
    gid: true
  })
}
