# es-ctags

[![](https://img.shields.io/travis/okcompute/es-ctags.svg)](https://travis-ci.org/okcompute/es-ctags)
[![](https://img.shields.io/npm/v/es-ctags.svg)](https://www.npmjs.com/package/es-ctags)
[![npm downloads](https://img.shields.io/npm/dm/es-ctags.svg?style=flat-square)](http://npm-stat.com/charts.html?package=es-ctags&from=2016-03-8)

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
npm install -g es-ctags
```

## usage

```sh

  Usage: es-ctags [options] <file> [others...]

  Options:

    -h, --help               output usage information
    -R, --recurse            Recurse into directories
    -a, --append             Append the tags to an existing tag file.
    --exclude  <patterns>    Comma separated list of exclusion patterns. Exclude files and directories matching one of the `patterns`.
    -f <name>                Write tags to specified file. Value of "-" writes tags to stdout ["tags"; or "TAGS" when -e supplied].
    --extension <extension>  File extension to look for. Default is `.js`

## license

MIT
