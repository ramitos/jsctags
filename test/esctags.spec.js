const expect = require('expect')
const execSync = require('child_process').execSync
const fs = require('fs')
const path = require('path')
const tmp = require('tmp')

function run(args, target) {
  const cmd = 'node --use_strict ' + path.resolve(__dirname, '../bin/esctags')
  const _args = args ? args : ''
  const _target = target ? target : ''
  return execSync(
    `${cmd} ${_args} ${_target}`,
    {
      encoding: 'utf-8',
    }
  )
}


describe('ESCtags', () => {
  let tmpDirectory
  let expectedCtags

  before(() => {
    // Change current wording directory to a temp output directory that will be
    // cleaned up after.
    tmpDirectory = tmp.dirSync({unsafeCleanup: true})
    process.chdir(tmpDirectory.name)

    // Cache the expected ctags output for re-use.
    expectedCtags = fs.readFileSync(
      path.resolve(__dirname, './fixtures/module.ctags'),
      {
        encoding: 'utf-8',
      }
    )
    // Update `{dir}` marker with the real current directory of computer running
    // the tests.
    expectedCtags = expectedCtags.replace(
      /\{dir\}/g,
      path.resolve(__dirname)
    )
  })

  after(() => {
    tmpDirectory.removeCallback()
  })

  describe('command line interface', () => {
    it('should display error message when no arguments', () => {
      const output = run()
      const expected = 'jsctags: No files specified. Try "jsctags --help".\n'
      expect(output).toEqual(expected)
    })

    it('should accept output to stdout', () => {
      const output = run(
        '-f -',
        path.resolve(__dirname, './fixtures/module.js')
      )
      expect(output).toEqual(expectedCtags + '\n')
    })

    it('should default output to `tags` file', () => {
      run('', path.resolve(__dirname, './fixtures/module.js'))
      const output = fs.readFileSync(
        path.resolve(tmpDirectory.name, 'tags'),
        {
          encoding: 'utf-8',
        }
      )
      expect(output).toEqual(expectedCtags)
    })
  })
})
