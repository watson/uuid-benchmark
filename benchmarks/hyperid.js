'use strict'

const hyperid = require('hyperid')

module.exports = function (suite) {
  const name = 'hyperid'
  const example = hyperid()()

  suite.add(name, function () {
    hyperid()()
  }, {
    postfix: 'cold start',
    leaky: true,
    random: false,
    format: 'other',
    guid: true,
    example
  })

  suite.add(name, function () {
    this.instance()
  }, {
    onStart () {
      this.instance = hyperid()
    },
    postfix: 'normal',
    leaky: true,
    random: false,
    format: 'other',
    guid: true,
    example
  })
}
