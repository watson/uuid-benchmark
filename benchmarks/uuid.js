'use strict'

module.exports = function (suite) {
  {
    const uuid = require('uuid/v1')
    const name = 'uuid/v1'

    suite.add(name, function () {
      uuid()
    }, {
      format: 'uuid'
    })

    suite.add(name, function () {
      const buf = Buffer.alloc(16)
      uuid(null, buf)
      buf.toString('hex')
    }, {
      format: 'hex'
    })

    suite.add(name, function () {
      uuid(null, this.buf)
      this.buf.toString('hex')
    }, {
      onStart () {
        this.buf = Buffer.alloc(16)
      },
      format: 'hex',
      reuse: true
    })

    suite.add(name, function () {
      const buf = Buffer.alloc(16)
      uuid(null, buf)
    }, {
      format: 'buffer'
    })

    suite.add(name, function () {
      uuid(null, this.buf)
    }, {
      onStart () {
        this.buf = Buffer.alloc(16)
      },
      format: 'buffer',
      reuse: true
    })
  }

  {
    const uuid = require('uuid/v4')
    const name = 'uuid/v4'

    suite.add(name, function () {
      uuid()
    }, {
      secure: true,
      format: 'uuid'
    })

    suite.add(name, function () {
      const buf = Buffer.alloc(16)
      uuid(null, buf)
      buf.toString('hex')
    }, {
      secure: true,
      format: 'hex'
    })

    suite.add(name, function () {
      uuid(null, this.buf)
      this.buf.toString('hex')
    }, {
      onStart () {
        this.buf = Buffer.alloc(16)
      },
      secure: true,
      format: 'hex',
      reuse: true
    })

    suite.add(name, function () {
      const buf = Buffer.alloc(16)
      uuid(null, buf)
    }, {
      secure: true,
      format: 'buffer'
    })

    suite.add(name, function () {
      uuid(null, this.buf)
    }, {
      onStart () {
        this.buf = Buffer.alloc(16)
      },
      secure: true,
      format: 'buffer',
      reuse: true
    })
  }
}
