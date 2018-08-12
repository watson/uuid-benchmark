'use strict'

const hyperid = require('hyperid')

module.exports = function (suite) {
  const name = 'hyperid'
  const example = hyperid()()

  suite.add(name, function () {
    hyperid()()
  }, {
    postfix: 'hyperid()()',
    leaky: true,
    format: 'other',
    gid: true,
    example
  })

  suite.add(name, function () {
    this.instance()
  }, {
    onStart () {
      this.instance = hyperid()
    },
    postfix: 'instance()',
    leaky: true,
    format: 'other',
    gid: true,
    example
  })
}
