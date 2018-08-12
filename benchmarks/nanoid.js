'use strict'

const nanoid = require('nanoid')

module.exports = function (suite) {
  suite.add('nanoid', function () {
    nanoid()
  }, {
    format: 'other',
    example: nanoid(),
    guid: true
  })
}
