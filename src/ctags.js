// Based on DoctorJS (https://github.com/drudge/doctorjs/blob/node/jsctags/ctags/writer.js)

const isArray = require('lodash.isarray');

const ESCAPES = {
  '\\': '\\\\',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t'
};

const SPECIAL_FIELDS = {
  addr: true,
  kind: true,
  name: true,
  tagfile: true,
  origin: true,
  id: true,
  parent: true
};

const convert = function (tags) {
  return tags.map(tag => {
    if (isArray(tag)) {
      return convert(tag);
    }

    const buf = [tag.name, '\t', tags.tagfile, '\t'];
    buf.push(tag.addr === undefined ? '//' : tag.addr);
    const tagfields = [];

    Object.keys(tag).forEach(key => {
      if (!SPECIAL_FIELDS[key]) {
        tagfields.push(key);
      }
    });

    tagfields.sort();

    if (tag.kind === undefined && tagfields.length === 0) {
      buf.push('\n');
      return buf.join('');
    }

    buf.push(';"');

    if (tag.kind !== undefined) {
      buf.push('\t', tag.kind);
    }

    tagfields.forEach(tagfield => {
      if (!tag[tagfield]) {
        return;
      }

      if (typeof tag[tagfield] !== 'string') {
        tag[tagfield] = tag[tagfield].toString();
      }

      buf.push('\t', tagfield, ':');
      buf.push(
        tag[tagfield].replace('[\\\n\r\t]', str => {
          return ESCAPES[str];
        })
      );
    });

    buf.push('\n');
    return buf.join('');
  });
};

module.exports = convert;
