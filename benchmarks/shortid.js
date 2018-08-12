'use strict'

const shortid = require('shortid')

module.exports = function (suite) {
  suite.add('shortid', function () {
    shortid()
  }, {
    leaky: true,
    format: 'other',
    example: shortid(),
    guid: false
  })
}
