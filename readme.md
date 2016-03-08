# esctags

[![](https://img.shields.io/travis/okcompute/esctags.svg)](https://travis-ci.org/okcompute/esctags)
[![](https://img.shields.io/npm/v/esctags.svg)](https://www.npmjs.com/package/esctags)

CTags generator built/for ES6 using [tern](https://github.com/marijnh/tern). The
goal of this tool is to replicate the same CLI of the original *CTags* as close
as possible. This should enable *ESCtags* usage with tools like *CtrlP*,
*TagBar* and many others.

## Origin

This software is derived/inspired from
[jsctags](https://github.com/ramitos/jsctags). The source code to convert tern
ast to tags is mostly the same.

## install

```sh
npm install -g esctags
```

## usage

```sh

  Usage: esctags [options] <file> [others...]

  Options:

    -h, --help               output usage information
    -R, --recurse            Recurse into directories
    -a, --append             Append the tags to an existing tag file.
    --exclude  <patterns>    Comma separated list of exclusion patterns. Exclude files and directories matching one of the `patterns`.
    -f <name>                Write tags to specified file. Value of "-" writes tags to stdout ["tags"; or "TAGS" when -e supplied].
    --extension <extension>  File extension to look for. Default is `.js`

## license

MIT
