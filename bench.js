'use strict'

const fs = require('fs')
const {Suite} = require('benchmark')
const toCsv = require('csv-stringify')
const table = require('markdown-table')
const numeral = require('numeral')

const suite = new Suite()

suite.cacheSizes = [16 ** 2, 16 ** 3, 16 ** 4]

const single = process.argv[2]

if (single) {
  require(single)(suite)
} else {
  // uuid
  require('./benchmarks/uuid')(suite)
  require('./benchmarks/fast-uuid')(suite)
  require('./benchmarks/uuid-random')(suite)
  require('./benchmarks/sodium-uuid')(suite)
  require('./benchmarks/crypto.randomBytes')(suite)
  require('./benchmarks/crypto.randomFillSync')(suite)
  require('./benchmarks/crypto.randomFill')(suite)
  require('./benchmarks/dev-random')(suite)

  // other
  require('./benchmarks/hyperid')(suite)
  require('./benchmarks/cuid')(suite)
  require('./benchmarks/shortid')(suite)
  require('./benchmarks/nanoid')(suite)
}

const readmePath = 'README.md'
const csvPath = 'results.csv'
const csv = [[
  'Method',
  'GUID',
  'Leaky',
  'Re-use',
  'Sync',
  'Cache',
  'Format',
  'Ops/sec',
  'Deviation',
  'Mean',
  'MOE',
  'RME',
  'Samples',
  'SEM',
  'Variance'
]]
const uuidTable = [[
  'Method',
  'Leaky',
  'Re-use',
  'Sync',
  'Cache',
  'Format',
  'Ops/sec',
  'RME',
  'Samples'
]]
const otherTable = [[
  'Method',
  'GUID',
  'Leaky',
  'Re-use',
  'Sync',
  'Cache',
  'Ops/sec',
  'RME',
  'Samples',
  'Example'
]]

suite
  .on('cycle', function (event) {
    const t = event.target

    console.log(`${desc(t)} x ${numeral(t.hz).format('0,0')} ops/sec ±${t.stats.rme.toFixed(2)}% (${t.stats.sample.length} runs sampled)`)

    if (t.format === 'other') {
      otherTable.push([
        `[${t.name}] ${t.postfix || ''}`,
        check(t.guid),
        leaky(t),
        check(t.reuse),
        t.cacheSize || 'n/a',
        check(!t.defer),
        numeral(t.hz).format('0,0'),
        `±${t.stats.rme.toFixed(2)}%`,
        t.stats.sample.length,
        `<sub><sub>${t.example}</sub></sub>`
      ])
    } else {
      uuidTable.push([
        `[${t.name}] ${t.postfix || ''}`,
        leaky(t),
        t.format,
        check(t.reuse),
        t.cacheSize || 'n/a',
        check(!t.defer),
        numeral(t.hz).format('0,0'),
        `±${t.stats.rme.toFixed(2)}%`,
        t.stats.sample.length
      ])
    }

    csv.push([
      fullName(t),
      t.guid ? 'Y' : (t.format === 'other' ? 'N' : 'Y'),
      t.leaky ? 'Y' : 'N',
      t.reuse ? 'Y' : 'N',
      t.defer ? 'N' : 'Y',
      t.cacheSize || '',
      t.format,
      t.hz,
      t.stats.deviation,
      t.stats.mean,
      t.stats.moe,
      t.stats.rme,
      t.stats.sample.length,
      t.stats.sem,
      t.stats.variance
    ])
  })
  .on('complete', function () {
    console.log('Fastest is ' + desc(this.filter('fastest')[0]))

    if (single) return // if running just a single benchmark, skip updating result files

    const marker = '<!-- AUTOGENERATED - DO NOT EDIT -->\n'
    const parts = fs.readFileSync(readmePath, 'utf8').split(marker)
    parts[1] = table(uuidTable, {align: ['l', 'c', 'c', 'c', 'r', 'l', 'r', 'l', 'r']})
    parts[3] = table(otherTable, {align: ['l', 'c', 'c', 'c', 'c', 'r', 'r', 'l', 'r', 'l']})
    const readme = parts.join(marker)

    fs.writeFileSync(readmePath, readme)

    toCsv(csv, function (err, output) {
      if (err) throw err
      fs.writeFileSync(csvPath, output)
    })
  })
  .run()

function fullName (t) {
  return t.name + (t.postfix ? ' ' + t.postfix : '')
}

function desc (t) {
  return `${fullName(t)} (format: ${t.format}, re-use: ${!!t.reuse}, cache: ${t.cacheSize || 'n/a'}, sync: ${!t.defer})`
}

function leaky (t) {
  return t.leaky ? '💦' : ''
}

function check (bool) {
  return bool ? '✅' : ''
}
