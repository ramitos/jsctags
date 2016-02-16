#!/usr/bin/env node --use_strict

const fs = require('fs')
const path = require('path')

const tern = require('tern')
const condense = require('tern/lib/condense')

module.exports = function condense_(filepath, callback) {
  const server = new tern.Server({
    projectDir: path.resolve(__dirname, '../node_modules/tern'),
    getFile(name) {
      return fs.readFileSync(path.resolve(name), 'utf8')
    },
  })

  server.addFile(filepath)

  server.flush(function (err) {
    if (err) {
      callback(err)
    }

    const result = condense.condense(
      [filepath],
      null,
      {sortOutput: true, spans: true}
    )
    callback(null, result, null, 2)
  })
}
