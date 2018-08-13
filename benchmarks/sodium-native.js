'use strict'

const sodium = require('sodium-native')

module.exports = function (suite) {
  const name = 'sodium-native'

  suite.add(name, function () {
    const buf = Buffer.alloc(16)
    sodium.randombytes_buf(buf)
    buf.toString('hex')
  }, {
    format: 'hex'
  })

  suite.add(name, function () {
    sodium.randombytes_buf(this.buf)
    this.buf.toString('hex')
  }, {
    onStart () {
      this.buf = Buffer.alloc(16)
    },
    reuse: true,
    format: 'hex'
  })

  suite.add(name, function () {
    const buf = Buffer.alloc(16)
    sodium.randombytes_buf(buf)
  }, {
    format: 'buffer'
  })

  suite.add(name, function () {
    sodium.randombytes_buf(this.buf)
  }, {
    onStart () {
      this.buf = Buffer.alloc(16)
    },
    reuse: true,
    format: 'buffer'
  })

  for (const cacheSize of suite.cacheSizes) {
    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        sodium.randombytes_buf(this.cache)
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
        sodium.randombytes_buf(this.cache)
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
      reuse: true,
      format: 'hex',
      cacheSize
    })

    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        sodium.randombytes_buf(this.cache)
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
        sodium.randombytes_buf(this.cache)
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
      reuse: true,
      format: 'buffer',
      cacheSize
    })
  }
}
