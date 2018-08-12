'use strict'

const crypto = require('crypto')

module.exports = function (suite) {
  const name = 'crypto.randomBytes'

  suite.add(name, function (deferred) {
    crypto.randomBytes(16, function (_, buf) {
      buf.toString('hex')
      deferred.resolve()
    })
  }, {
    defer: true,
    format: 'hex'
  })

  suite.add(name, function () {
    crypto.randomBytes(16).toString('hex')
  }, {
    format: 'hex'
  })

  suite.add(name, function (deferred) {
    crypto.randomBytes(16, function (_, buf) {
      deferred.resolve()
    })
  }, {
    defer: true,
    format: 'buffer'
  })

  suite.add(name, function () {
    crypto.randomBytes(16)
  }, {
    format: 'buffer'
  })

  for (const cacheSize of suite.cacheSizes) {
    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        this.cache = crypto.randomBytes(cacheSize)
        const buf = this.cache.slice(0, 16)
        buf.toString('hex')
        this.offset = 16
      } else {
        const buf = this.cache.slice(this.offset, this.offset + 16)
        buf.toString('hex')
        this.offset += 16
      }
    }, {
      onStart () {
        this.offset = 0
      },
      format: 'hex',
      cacheSize
    })

    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        this.cache = crypto.randomBytes(cacheSize)
        this.cache.copy(this.buf, 0, 0, 16)
        this.buf.toString('hex')
        this.offset = 16
      } else {
        this.cache.copy(this.buf, 0, this.offset, this.offset + 16)
        this.buf.toString('hex')
        this.offset += 16
      }
    }, {
      onStart () {
        this.offset = 0
        this.buf = Buffer.alloc(16)
      },
      format: 'hex',
      reuse: true,
      cacheSize
    })

    suite.add(name, function (deferred) {
      if (this.offset % cacheSize === 0) {
        crypto.randomBytes(cacheSize, (_, _buf) => {
          this.cache = _buf
          const buf = this.cache.slice(0, 16)
          buf.toString('hex')
          this.offset = 16
          deferred.resolve()
        })
      } else {
        const buf = this.cache.slice(this.offset, this.offset + 16)
        buf.toString('hex')
        this.offset += 16
        process.nextTick(function () {
          deferred.resolve()
        })
      }
    }, {
      onStart () {
        this.offset = 0
      },
      defer: true,
      format: 'hex',
      cacheSize
    })

    suite.add(name, function (deferred) {
      if (this.offset % cacheSize === 0) {
        crypto.randomBytes(cacheSize, (_, _buf) => {
          this.cache = _buf
          this.cache.copy(this.buf, 0, 0, 16)
          this.buf.toString('hex')
          this.offset = 16
          deferred.resolve()
        })
      } else {
        this.cache.copy(this.buf, 0, this.offset, this.offset + 16)
        this.buf.toString('hex')
        this.offset += 16
        process.nextTick(function () {
          deferred.resolve()
        })
      }
    }, {
      onStart () {
        this.offset = 0
        this.buf = Buffer.alloc(16)
      },
      defer: true,
      format: 'hex',
      reuse: true,
      cacheSize
    })

    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        this.cache = crypto.randomBytes(cacheSize)
        this.cache.slice(0, 16)
        this.offset = 16
      } else {
        this.cache.slice(this.offset, this.offset + 16)
        this.offset += 16
      }
    }, {
      onStart () {
        this.offset = 0
      },
      format: 'buffer',
      cacheSize
    })

    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        this.cache = crypto.randomBytes(cacheSize)
        this.cache.copy(this.buf, 0, 0, 16)
        this.offset = 16
      } else {
        this.cache.copy(this.buf, 0, this.offset, this.offset + 16)
        this.offset += 16
      }
    }, {
      onStart () {
        this.offset = 0
        this.buf = Buffer.alloc(16)
      },
      format: 'buffer',
      reuse: true,
      cacheSize
    })

    suite.add(name, function (deferred) {
      if (this.offset % cacheSize === 0) {
        crypto.randomBytes(cacheSize, (_, _buf) => {
          this.cache = _buf
          this.cache.slice(0, 16)
          this.offset = 16
          deferred.resolve()
        })
      } else {
        this.cache.slice(this.offset, this.offset + 16)
        this.offset += 16
        process.nextTick(function () {
          deferred.resolve()
        })
      }
    }, {
      onStart () {
        this.offset = 0
      },
      defer: true,
      format: 'buffer',
      cacheSize
    })

    suite.add(name, function (deferred) {
      if (this.offset % cacheSize === 0) {
        crypto.randomBytes(cacheSize, (_, _buf) => {
          this.cache = _buf
          this.cache.copy(this.buf, 0, 0, 16)
          this.offset = 16
          deferred.resolve()
        })
      } else {
        this.cache.copy(this.buf, 0, this.offset, this.offset + 16)
        this.offset += 16
        process.nextTick(function () {
          deferred.resolve()
        })
      }
    }, {
      onStart () {
        this.offset = 0
        this.buf = Buffer.alloc(16)
      },
      defer: true,
      format: 'buffer',
      reuse: true,
      cacheSize
    })
  }
}
