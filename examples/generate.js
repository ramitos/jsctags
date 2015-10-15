var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var async = require('async');
var interpolate = require('util').format;

var cmd = path.resolve(__dirname, '../bin/jsctags');
var casesDir = path.resolve(__dirname, '../test/cases');
var files = fs.readdirSync(casesDir).filter(function (file) {
  return path.extname(file) === '.js';
}).map(function (file) {
  return path.join(casesDir, file);
});
var outputDir = path.resolve(__dirname, '../examples');

var start = Date.now();
async.eachSeries(files, function (file, callback) {
  var filename = path.basename(file);
  process.stdout.write(interpolate('Generating example for %s...', filename));
  generateExample(file, outputDir, function (e) {
    if (e) return callback(e);
    console.log(successText('DONE'));
    callback(null);
  });
}, function (e) {
  if (e) throw e;
  var elapsed = Date.now() - start;
  console.log(successText(interpolate('\nGenerated %s examples in %ss', files.length, elapsed / 1000)));
});

function generateExample (file, outputDir, callback) {
  async.parallel([
    function (callback) {
      fs.readFile(file, 'utf8', callback);
    },
    function (callback) {
      generateTags({
        input: file,
        args: []
      }, callback);
    },
    function (callback) {
      generateTags({
        input: file,
        args: ['-f']
      }, callback);
    }
  ], function (e, results) {
    if (e) return callback(e);
    var js = results[0];
    var json = results[1].split(casesDir).join('');
    var ctags = results[2].split(casesDir).join('');
    var title = path.basename(file, path.extname(file));
    var outputPath = path.resolve(outputDir, title + '.md');
    var markdown = interpolate('# %s\n\n### Input file\n\n```js\n%s```\n\n### Output - JSON\n\n```json\n%s```\n\n### Output - ctags\n\n```ctags\n%s```\n', title, js, json, ctags);
    fs.writeFile(outputPath, markdown, 'utf8', callback);
  });
}

function generateTags (options, callback) {
  var file = options.input;
  var args = options.args || [];
  var command = interpolate('%s %s %s', cmd, file, args.join(' '));
  cp.exec(command, function (e, stdout, stderr) {
    if (e) return callback(e);
    callback(null, stdout);
  });
}

function successText (string) {
  return '\u001b[32m' + string + '\u001b[39m';
}
