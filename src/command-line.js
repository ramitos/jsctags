'use strict'

const path = require('path')
const async = require('async')
const fs = require('fs')
const diveSync = require('diveSync')
const program = require('commander')
const globToRegexp = require('glob-to-regexp')

const esctags = require('./parser')
const condense = require('./tern-server')

const glob = pattern => globToRegexp(pattern, {flags: 'i'})

// Process `exclude` arg
function exclude(patterns) {
  return patterns.split(',').map(pattern => glob(pattern))
}

program
.arguments('<file> [others...]')
.option('-R, --recurse', 'Recurse into directories')
.option('-a, --append', 'Append the tags to an existing tag file.')
.option(
  '--exclude  <patterns>',
  'Comma separated list of exclusion patterns. Exclude files and ' +
  'directories matching one of the `patterns`.',
  exclude
)
.option(
  '-f <name>', 'Write tags to specified file. Value of "-" writes tags ' +
  'to stdout ["tags"; or "TAGS" when -e supplied].',
  'tags'
)
.option('--extension <extension>', 'File extension to look for. Default is `.js`', 'js')
.action((file, others) => {
  // Filtering
  const extension = new RegExp(`.*\.${program.extension}$`)
  // Always exclude `node_modules` and '.git' folders
  let patterns = [glob('*/node_modules/*'), glob('*/.git/*')]
  if (program.exclude) {
    patterns = patterns.concat(program.exclude)
  }
  function filter(filepath, dir) {
    if (!dir && !extension.test(filepath)) {
      return true
    }
    return patterns.some(pattern => pattern.test(filepath))
  }

  // Resolve files
  const files = []
  others.push(file)
  let items = others.map(other => other.replace(/\"/g, ''))
  items = items.map(item => path.resolve(item))
  items.forEach(item => {
    if (fs.statSync(item).isDirectory()) {
      if (program.recurse) {
        diveSync(
          item,
          {recursive: program.recurse, filter: (filepath, dir) => !filter(filepath, dir)},
          (err, filepath) => {
            files.push(filepath)
          })
      }
    } else if (!filter(item, false)) {
      files.push(item)
    }
  })

  // Process each file
  async.map(files, (filepath, callback) => {
    condense(filepath, (error, result) => {
      const content = fs.readFileSync(filepath, 'utf8')

      // Generate tags
      esctags({
        condense: result,
        content,
      }, (err, tags) => {
        tags.tagfile = filepath
        tags.forEach(function (tag) {
          tag.tagfile = filepath
        })
        callback(null, tags)
      })
    })
  }, (err, results) => {
    // console.log('results', results)
    if (err) {
      throw err
    }

    // Convert to ctags format
    let ctags = results.map(tags => {
      return esctags.ctags(tags, {args: false, local: false})
    })

    // flatten
    ctags = [].concat.apply([], ctags)

    // Append
    if (program.append) {
      let previous = ''
      try {
        previous = fs.readFileSync(program.F, {encoding: 'utf8'})
      } catch (e) {
        if (e.code !== 'ENOENT') {
          throw e
        }
      }
      // split on new lines/carriage returns
      previous = previous.split(/\r\n|\r|\n/g)
      // remove empty lines
      previous = previous.filter(line => line !== '')
      // add new line
      previous = previous.map(line => `${line}\n`)
      // merge with parsed ctags
      ctags = previous.concat(ctags)
    }

    // Sort
    ctags = ctags.sort()

    // Convert to string
    ctags = ctags.join('')

    // Output
    if (program.F === '-') {
      console.log(ctags)
    } else {
      fs.writeFileSync(program.F, ctags)
    }
  })
})
.parse(process.argv)

if (program.args.length === 0) {
  console.log('es-ctags: No files specified. Try "es-ctags --help".')
}

