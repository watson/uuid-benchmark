'use strict'

const shortid = require('shortid')

module.exports = function (suite) {
  suite.add('shortid', function () {
    shortid()
  }, {
    postfix: `(${shortid()})`,
    leaky: true,
    format: 'other'
  })
}
