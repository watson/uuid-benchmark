'use strict'

const fs = require('fs')

module.exports = function (suite) {
  const randomGen = ['/dev/random', '/dev/urandom']

  for (const path of randomGen) {
    suite.add(path, function (deferred) {
      fs.read(this.fd, this.buf, 0, 16, null, function (_, bytesRead, buf) {
        buf.toString('hex')
        deferred.resolve()
      })
    }, {
      onStart () {
        this.fd = fs.openSync(path, 'r')
        this.buf = Buffer.alloc(16)
      },
      defer: true,
      secure: path === '/dev/random',
      format: 'hex',
      reuse: true
    })

    suite.add(path, function () {
      fs.readSync(this.fd, this.buf, 0, 16)
      this.buf.toString('hex')
    }, {
      onStart () {
        this.fd = fs.openSync(path, 'r')
        this.buf = Buffer.alloc(16)
      },
      secure: path === '/dev/random',
      format: 'hex',
      reuse: true
    })

    suite.add(path, function (deferred) {
      fs.read(this.fd, this.buf, 0, 16, null, function (_, bytesRead, buf) {
        deferred.resolve()
      })
    }, {
      onStart () {
        this.fd = fs.openSync(path, 'r')
        this.buf = Buffer.alloc(16)
      },
      defer: true,
      secure: path === '/dev/random',
      format: 'buffer',
      reuse: true
    })

    suite.add(path, function () {
      fs.readSync(this.fd, this.buf, 0, 16)
    }, {
      onStart () {
        this.fd = fs.openSync(path, 'r')
        this.buf = Buffer.alloc(16)
      },
      secure: path === '/dev/random',
      format: 'buffer',
      reuse: true
    })

    for (const cacheSize of suite.cacheSizes) {
      suite.add(path, function (deferred) {
        if (this.offset % cacheSize === 0) {
          fs.read(this.fd, this.cache, 0, cacheSize, null, (_, bytesRead, cache) => {
            const buf = cache.slice(0, 16)
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
          this.fd = fs.openSync(path, 'r')
          this.cache = Buffer.alloc(cacheSize)
          this.offset = 0
        },
        defer: true,
        secure: path === '/dev/random',
        format: 'hex',
        cacheSize
      })

      suite.add(path, function (deferred) {
        if (this.offset % cacheSize === 0) {
          fs.read(this.fd, this.cache, 0, cacheSize, null, (_, bytesRead, cache) => {
            cache.copy(this.buf, 0, 0, 16)
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
          this.fd = fs.openSync(path, 'r')
          this.cache = Buffer.alloc(cacheSize)
          this.buf = Buffer.alloc(16)
          this.offset = 0
        },
        defer: true,
        secure: path === '/dev/random',
        format: 'hex',
        reuse: true,
        cacheSize
      })

      suite.add(path, function () {
        if (this.offset % cacheSize === 0) {
          fs.readSync(this.fd, this.cache, 0, cacheSize)
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
          this.fd = fs.openSync(path, 'r')
          this.cache = Buffer.alloc(cacheSize)
          this.buf = Buffer.alloc(16)
          this.offset = 0
        },
        secure: path === '/dev/random',
        format: 'hex',
        reuse: true,
        cacheSize
      })

      suite.add(path, function (deferred) {
        if (this.offset % cacheSize === 0) {
          fs.read(this.fd, this.cache, 0, cacheSize, null, (_, bytesRead, cache) => {
            cache.slice(0, 16)
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
          this.fd = fs.openSync(path, 'r')
          this.cache = Buffer.alloc(cacheSize)
          this.offset = 0
        },
        defer: true,
        secure: path === '/dev/random',
        format: 'buffer',
        cacheSize
      })

      suite.add(path, function (deferred) {
        if (this.offset % cacheSize === 0) {
          fs.read(this.fd, this.cache, 0, cacheSize, null, (_, bytesRead, cache) => {
            cache.copy(this.buf, 0, 0, 16)
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
          this.fd = fs.openSync(path, 'r')
          this.cache = Buffer.alloc(cacheSize)
          this.buf = Buffer.alloc(16)
          this.offset = 0
        },
        defer: true,
        secure: path === '/dev/random',
        format: 'buffer',
        reuse: true,
        cacheSize
      })

      suite.add(path, function () {
        if (this.offset % cacheSize === 0) {
          fs.readSync(this.fd, this.cache, 0, cacheSize)
          this.cache.copy(this.buf, 0, 0, 16)
          this.offset = 16
        } else {
          this.cache.copy(this.buf, 0, this.offset, this.offset + 16)
          this.offset += 16
        }
      }, {
        onStart () {
          this.fd = fs.openSync(path, 'r')
          this.cache = Buffer.alloc(cacheSize)
          this.buf = Buffer.alloc(16)
          this.offset = 0
        },
        secure: path === '/dev/random',
        format: 'buffer',
        reuse: true,
        cacheSize
      })
    }
  }
}
