'use strict'

const crypto = require('crypto')

module.exports = function (suite) {
  const name = 'crypto.randomFill'

  suite.add(name, function (deferred) {
    crypto.randomFill(this.buf, 0, 16, (_, buf) => {
      buf.toString('hex')
      deferred.resolve()
    })
  }, {
    onStart () {
      this.buf = Buffer.alloc(16)
    },
    defer: true,
    reuse: true,
    format: 'hex'
  })

  suite.add(name, function (deferred) {
    crypto.randomFill(this.buf, 0, 16, (_, buf) => {
      deferred.resolve()
    })
  }, {
    onStart () {
      this.buf = Buffer.alloc(16)
    },
    defer: true,
    reuse: true,
    format: 'buffer'
  })

  for (const cacheSize of suite.cacheSizes) {
    suite.add(name, function (deferred) {
      if (this.offset % cacheSize === 0) {
        crypto.randomFill(this.cache, 0, cacheSize, (_, _buf) => {
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
        this.cache = Buffer.alloc(cacheSize)
      },
      defer: true,
      format: 'hex',
      cacheSize
    })

    suite.add(name, function (deferred) {
      if (this.offset % cacheSize === 0) {
        crypto.randomFill(this.cache, 0, cacheSize, (_, buf) => {
          this.cache = buf
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
        this.cache = Buffer.alloc(cacheSize)
      },
      defer: true,
      format: 'hex',
      reuse: true,
      cacheSize
    })

    suite.add(name, function (deferred) {
      if (this.offset % cacheSize === 0) {
        crypto.randomFill(this.cache, 0, cacheSize, (_, _buf) => {
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
        this.cache = Buffer.alloc(cacheSize)
      },
      defer: true,
      format: 'buffer',
      cacheSize
    })

    suite.add(name, function (deferred) {
      if (this.offset % cacheSize === 0) {
        crypto.randomFill(this.cache, 0, cacheSize, (_, buf) => {
          this.cache = buf
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
        this.cache = Buffer.alloc(cacheSize)
      },
      defer: true,
      format: 'buffer',
      reuse: true,
      cacheSize
    })
  }
}
