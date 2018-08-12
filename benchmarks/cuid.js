'use strict'

const cuid = require('cuid')

module.exports = function (suite) {
  suite.add('cuid', function () {
    cuid()
  }, {
    postfix: `(${cuid()})`,
    leaky: true,
    format: 'other'
  })
}
