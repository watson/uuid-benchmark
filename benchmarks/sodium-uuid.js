'use strict'

const uuid = require('sodium-uuid')

module.exports = function (suite) {
  const name = 'sodium-uuid'

  suite.add(name, function () {
    uuid().toString('hex')
  }, {
    format: 'hex'
  })

  suite.add(name, function () {
    uuid(this.buf)
    this.buf.toString('hex')
  }, {
    onStart () {
      this.buf = Buffer.alloc(16)
    },
    format: 'hex',
    reuse: true
  })

  suite.add(name, function () {
    uuid()
  }, {
    format: 'buffer'
  })

  suite.add(name, function () {
    uuid(this.buf)
  }, {
    onStart () {
      this.buf = Buffer.alloc(16)
    },
    format: 'buffer',
    reuse: true
  })
}
