var glob = require('glob');
var fs = require('fs');
var path = require('path');

var cases = path.join(__dirname, 'cases');
var examples = path.join(__dirname, '../examples/*.md');
var jsons = path.join(cases, '*.json');
var tags = path.join(cases, '*.tags');

glob.sync(jsons).forEach(function(file) {
  var json = fs.readFileSync(file, 'utf-8');

  json = json.replace(/\n\s+"id"\:\s+".+",\n/g, '\n');
  json = json.replace(/\n\s+"parent"\:\s+".+",\n/g, '\n');

  fs.writeFileSync(file, json, 'utf-8');
});

var cleanPath = function(file) {
  var str = fs.readFileSync(file, 'utf-8').split(/\n/).map(function(line) {
    return line.replace(cases, '__DIR__');
  }).join('\n');

  if ((/\.tags$/).test(file)) {
    str += '\n';
  }

  fs.writeFileSync(file, str, 'utf-8');
};

glob.sync(examples).forEach(cleanPath);
glob.sync(tags).forEach(cleanPath);
glob.sync(jsons).forEach(cleanPath);
