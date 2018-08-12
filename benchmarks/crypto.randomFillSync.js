'use strict'

const crypto = require('crypto')

module.exports = function (suite) {
  const name = 'crypto.randomFillSync'

  suite.add(name, function () {
    crypto.randomFillSync(this.buf, 0, 16)
    this.buf.toString('hex')
  }, {
    onStart () {
      this.buf = Buffer.alloc(16)
    },
    format: 'hex',
    reuse: true
  })

  suite.add(name, function () {
    crypto.randomFillSync(this.buf, 0, 16)
  }, {
    onStart () {
      this.buf = Buffer.alloc(16)
    },
    format: 'buffer',
    reuse: true
  })

  for (const cacheSize of suite.cacheSizes) {
    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        crypto.randomFillSync(this.cache, 0, cacheSize)
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
        this.cache = Buffer.alloc(cacheSize)
      },
      format: 'hex',
      cacheSize
    })

    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        crypto.randomFillSync(this.cache, 0, cacheSize)
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
        this.cache = Buffer.alloc(cacheSize)
      },
      format: 'hex',
      reuse: true,
      cacheSize
    })

    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        crypto.randomFillSync(this.cache, 0, cacheSize)
        this.cache.slice(0, 16)
        this.offset = 16
      } else {
        this.cache.slice(this.offset, this.offset + 16)
        this.offset += 16
      }
    }, {
      onStart () {
        this.offset = 0
        this.cache = Buffer.alloc(cacheSize)
      },
      format: 'buffer',
      cacheSize
    })

    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        crypto.randomFillSync(this.cache, 0, cacheSize)
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
        this.cache = Buffer.alloc(cacheSize)
      },
      format: 'buffer',
      reuse: true,
      cacheSize
    })
  }
}
