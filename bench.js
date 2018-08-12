'use strict'

const fs = require('fs')
const {Suite} = require('benchmark')
const numeral = require('numeral')

const result = fs.createWriteStream('bench.md')
const randomGen = ['/dev/random', '/dev/urandom']
const cacheSizes = [16 ** 2, 16 ** 3, 16 ** 4]
const suite = new Suite()

{
  const name = 'uuid/v1'

  suite.add(name, function () {
    this.uuid()
  }, {
    onStart () {
      this.uuid = require('uuid/v1')
    },
    format: 'uuid'
  })

  suite.add(name, function () {
    const buf = Buffer.alloc(16)
    this.uuid(null, buf)
    buf.toString('hex')
  }, {
    onStart () {
      this.uuid = require('uuid/v1')
    },
    format: 'hex'
  })

  suite.add(name, function () {
    this.uuid(null, this.buf)
    this.buf.toString('hex')
  }, {
    onStart () {
      this.uuid = require('uuid/v1')
      this.buf = Buffer.alloc(16)
    },
    format: 'hex',
    reuse: true
  })
}

{
  const name = 'uuid/v4'

  suite.add(name, function () {
    this.uuid()
  }, {
    onStart () {
      this.uuid = require('uuid/v4')
    },
    secure: true,
    format: 'uuid'
  })

  suite.add(name, function () {
    const buf = Buffer.alloc(16)
    this.uuid(null, buf)
    buf.toString('hex')
  }, {
    onStart () {
      this.uuid = require('uuid/v4')
    },
    secure: true,
    format: 'hex'
  })

  suite.add(name, function () {
    this.uuid(null, this.buf)
    this.buf.toString('hex')
  }, {
    onStart () {
      this.uuid = require('uuid/v4')
      this.buf = Buffer.alloc(16)
    },
    secure: true,
    format: 'hex',
    reuse: true
  })
}

suite.add('fast-uuid', function () {
  this.uuid()
}, {
  onStart () {
    this.uuid = require('fast-uuid').uuid4
  },
  format: 'uuid'
})

suite.add('uuid-random', function () {
  this.uuid()
}, {
  onStart () {
    this.uuid = require('uuid-random')
  },
  secure: true,
  format: 'uuid'
})

{
  const name = 'sodium-uuid'

  suite.add(name, function () {
    this.uuid().toString('hex')
  }, {
    onStart () {
      this.uuid = require('sodium-uuid')
    },
    secure: true,
    format: 'hex'
  })

  suite.add(name, function () {
    this.uuid(this.buf)
    this.buf.toString('hex')
  }, {
    onStart () {
      this.uuid = require('sodium-uuid')
      this.buf = Buffer.alloc(16)
    },
    secure: true,
    format: 'hex',
    reuse: true
  })
}

{
  const name = 'crypto.randomBytes'

  suite.add(name, function (deferred) {
    this.randomBytes(16, function (_, buf) {
      buf.toString('hex')
      deferred.resolve()
    })
  }, {
    onStart () {
      this.randomBytes = require('crypto').randomBytes
    },
    defer: true,
    secure: true,
    format: 'hex'
  })

  suite.add(name, function () {
    this.randomBytes(16).toString('hex')
  }, {
    onStart () {
      this.randomBytes = require('crypto').randomBytes
    },
    secure: true,
    format: 'hex'
  })

  for (const cacheSize of cacheSizes) {
    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        this.cache = this.randomBytes(cacheSize)
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
        this.randomBytes = require('crypto').randomBytes
        this.offset = 0
      },
      secure: true,
      format: 'hex',
      cacheSize
    })

    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        this.cache = this.randomBytes(cacheSize)
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
        this.randomBytes = require('crypto').randomBytes
        this.offset = 0
        this.buf = Buffer.alloc(16)
      },
      secure: true,
      format: 'hex',
      reuse: true,
      cacheSize
    })

    suite.add(name, function (deferred) {
      if (this.offset % cacheSize === 0) {
        this.randomBytes(cacheSize, (_, _buf) => {
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
        this.randomBytes = require('crypto').randomBytes
        this.offset = 0
      },
      defer: true,
      secure: true,
      format: 'hex',
      cacheSize
    })

    suite.add(name, function (deferred) {
      if (this.offset % cacheSize === 0) {
        this.randomBytes(cacheSize, (_, _buf) => {
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
        this.randomBytes = require('crypto').randomBytes
        this.offset = 0
        this.buf = Buffer.alloc(16)
      },
      defer: true,
      secure: true,
      format: 'hex',
      reuse: true,
      cacheSize
    })
  }
}

{
  const name = 'crypto.randomFillSync'

  suite.add(name, function () {
    this.randomFillSync(this.buf, 0, 16)
    this.buf.toString('hex')
  }, {
    onStart () {
      this.randomFillSync = require('crypto').randomFillSync
      this.buf = Buffer.alloc(16)
    },
    secure: true,
    format: 'hex',
    reuse: true
  })

  for (const cacheSize of cacheSizes) {
    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        this.randomFillSync(this.cache, 0, cacheSize)
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
        this.randomFillSync = require('crypto').randomFillSync
        this.offset = 0
        this.cache = Buffer.alloc(cacheSize)
      },
      secure: true,
      format: 'hex',
      cacheSize
    })

    suite.add(name, function () {
      if (this.offset % cacheSize === 0) {
        this.randomFillSync(this.cache, 0, cacheSize)
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
        this.randomFillSync = require('crypto').randomFillSync
        this.offset = 0
        this.buf = Buffer.alloc(16)
        this.cache = Buffer.alloc(cacheSize)
      },
      secure: true,
      format: 'hex',
      reuse: true,
      cacheSize
    })
  }
}

{
  const name = 'crypto.randomFill'

  suite.add(name, function (deferred) {
    this.randomFill(this.buf, 0, 16, (_, buf) => {
      buf.toString('hex')
      deferred.resolve()
    })
  }, {
    onStart () {
      this.randomFill = require('crypto').randomFill
      this.buf = Buffer.alloc(16)
    },
    defer: true,
    secure: true,
    reuse: true,
    format: 'hex'
  })

  for (const cacheSize of cacheSizes) {
    suite.add(name, function (deferred) {
      if (this.offset % cacheSize === 0) {
        this.randomFill(this.cache, 0, cacheSize, (_, _buf) => {
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
        this.randomFill = require('crypto').randomFill
        this.offset = 0
        this.cache = Buffer.alloc(cacheSize)
      },
      defer: true,
      secure: true,
      format: 'hex',
      cacheSize
    })

    suite.add(name, function (deferred) {
      if (this.offset % cacheSize === 0) {
        this.randomFill(this.cache, 0, cacheSize, (_, buf) => {
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
        this.randomFill = require('crypto').randomFill
        this.offset = 0
        this.buf = Buffer.alloc(16)
        this.cache = Buffer.alloc(cacheSize)
      },
      defer: true,
      secure: true,
      format: 'hex',
      reuse: true,
      cacheSize
    })
  }
}

for (const path of randomGen) {
  suite.add(path, function (deferred) {
    this.fs.read(this.fd, this.buf, 0, 16, null, function (_, bytesRead, buf) {
      buf.toString('hex')
      deferred.resolve()
    })
  }, {
    onStart () {
      this.fs = require('fs')
      this.fd = this.fs.openSync(path, 'r')
      this.buf = Buffer.alloc(16)
    },
    defer: true,
    secure: path === '/dev/random',
    format: 'hex',
    reuse: true
  })

  suite.add(path, function () {
    this.fs.readSync(this.fd, this.buf, 0, 16)
    this.buf.toString('hex')
  }, {
    onStart () {
      this.fs = require('fs')
      this.fd = this.fs.openSync(path, 'r')
      this.buf = Buffer.alloc(16)
    },
    secure: path === '/dev/random',
    format: 'hex',
    reuse: true
  })

  for (const cacheSize of cacheSizes) {
    suite.add(path, function (deferred) {
      if (this.offset % cacheSize === 0) {
        this.fs.read(this.fd, this.cache, 0, cacheSize, null, (_, bytesRead, cache) => {
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
        this.fs = require('fs')
        this.fd = this.fs.openSync(path, 'r')
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
        this.fs.read(this.fd, this.cache, 0, cacheSize, null, (_, bytesRead, cache) => {
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
        this.fs = require('fs')
        this.fd = this.fs.openSync(path, 'r')
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
        this.fs.readSync(this.fd, this.cache, 0, cacheSize)
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
        this.fs = require('fs')
        this.fd = this.fs.openSync(path, 'r')
        this.cache = Buffer.alloc(cacheSize)
        this.buf = Buffer.alloc(16)
        this.offset = 0
      },
      secure: path === '/dev/random',
      format: 'hex',
      reuse: true,
      cacheSize
    })
  }
}

suite.on('start', function () {
  result.write('# Benchmark Results\n\n')
  result.write('| Method | Secure | Format | Re-use | Cache | Sync | Ops/sec | RME | Samples |\n')
  result.write('|--------|--------|--------|--------|-------|------|---------|-----|---------|\n')
})

suite.on('cycle', function (event) {
  console.log(String(event.target))

  const t = event.target
  result.write(`| [${t.name}] | ${bool(t.secure)} | ${t.format} | ${bool(t.reuse)} | ${t.cacheSize || 'n/a'} | ${bool(!t.defer)} | ${numeral(t.hz).format('0,')} | ±${t.stats.rme.toFixed(2)}% | ${t.stats.sample.length} |\n`)
})

suite.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'))
  result.end()
})

suite.run()

function bool (b) {
  return b ? '✅' : ''
}
