const test = require('ava');
const Execa = require('execa');
const { readFileSync } = require('fs');
const { sync: Globby } = require('globby');
const { join } = require('path');

const bin = join(__dirname, '../bin/jsctags');
const cwd = join(__dirname, 'fixtures');

for (const fixture of Globby('*.js', { cwd })) {
  const input = readFileSync(join(cwd, fixture));

  for (const output of ['', '-f']) {
    for (const arg of ['--file', '--find', '']) {
      const args = [arg, fixture, output].filter(Boolean);

      test(args.join(' '), async (t) => {
        const { stdout } = await Execa(bin, args, {
          cwd,
          input: arg === '--file' ? input : undefined,
          stdio: 'pipe',
        });

        t.snapshot(['jsctags', ...args].join(' '), 'Command');
        t.snapshot(input.toString(), arg === '--file' ? 'stdin' : 'Source');
        t.snapshot(stdout.replace(new RegExp(cwd, 'g'), '__DIR__'), 'Output');
      });
    }
  }
}
