'use strict'

const hyperid = require('hyperid')

module.exports = function (suite) {
  const name = 'hyperid'

  suite.add(name, function () {
    hyperid()()
  }, {
    postfix: 'hyperid()()',
    format: 'custom'
  })

  suite.add(name, function () {
    this.instance()
  }, {
    onStart () {
      this.instance = hyperid()
    },
    postfix: 'instance()',
    format: 'custom'
  })
}
