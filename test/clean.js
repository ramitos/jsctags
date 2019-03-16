const glob = require('glob');
const fs = require('fs');
const path = require('path');

const cases = path.join(__dirname, 'cases');
const examples = path.join(__dirname, '../examples/*.md');
const jsons = path.join(cases, '*.json');
const tags = path.join(cases, '*.tags');

glob.sync(jsons).forEach(file => {
  let json = fs.readFileSync(file, 'utf-8');

  json = json.replace(/\n\s+"id":\s+".+",\n/g, '\n');
  json = json.replace(/\n\s+"parent":\s+".+",\n/g, '\n');

  fs.writeFileSync(file, json, 'utf-8');
});

const cleanPath = function (file) {
  let str = fs
    .readFileSync(file, 'utf-8')
    .split(/\n/)
    .map(line => {
      return line.replace(cases, '__DIR__');
    })
    .join('\n');

  if (/\.tags$/.test(file)) {
    str += '\n';
  }

  fs.writeFileSync(file, str, 'utf-8');
};

glob.sync(examples).forEach(cleanPath);
glob.sync(tags).forEach(cleanPath);
glob.sync(jsons).forEach(cleanPath);
