#!/usr/bin/env node --use_strict

const fs = require('fs')
const path = require('path')

const tern = require('tern')
const condense = require('tern/lib/condense')

module.exports = function condense_(filepath, callback) {
  const server = new tern.Server({})

  server.addFile(
    'name',
    fs.readFileSync(path.resolve(filepath), 'utf8')
  )

  server.flush(function (err) {
    if (err) {
      callback(err)
    }

    const result = condense.condense(
      ['name'],
      null,
      {sortOutput: true, spans: true}
    )
    callback(null, result, null, 2)
  })
}
