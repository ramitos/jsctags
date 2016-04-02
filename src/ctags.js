// Based on DoctorJS (https://github.com/drudge/doctorjs/blob/node/jsctags/ctags/writer.js)

var isArray = require('lodash.isarray');

var ESCAPES = {
  '\\': '\\\\',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t'
};

var SPECIAL_FIELDS = {
  addr: true,
  kind: true,
  name: true,
  tagfile: true,
  origin: true,
  id: true,
  parent: true
};

var convert = module.exports = function(tags) {
  return tags.map(function(tag) {
    if (isArray(tag)) {
      return convert(tag);
    }

    var buf = [tag.name, '\t', tags.tagfile, '\t'];
    buf.push(tag.addr !== undefined ? tag.addr : '//');
    var tagfields = [];

    Object.keys(tag).forEach(function(key) {
      if (!SPECIAL_FIELDS[key]) {
        tagfields.push(key);
      }
    });

    tagfields.sort();

    if (tag.kind === undefined && tagfields.length === 0) {
      buf.push('\n');
      return buf.join('');
    }

    buf.push(';\"');

    if (tag.kind !== undefined) buf.push('\t', tag.kind);

    tagfields.forEach(function(tagfield) {
      if (!tag[tagfield]) {
        return;
      }

      if (typeof tag[tagfield] !== 'string') {
        tag[tagfield] = tag[tagfield].toString();
      }

      buf.push('\t', tagfield, ':');
      buf.push(tag[tagfield].replace('[\\\n\r\t]', function(str) {
        return ESCAPES[str];
      }));
    });

    buf.push('\n');
    return buf.join('');
  });
};
