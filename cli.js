#!/usr/bin/env node

/**
 * @typedef Args
 * @property {boolean} g
 * @property {boolean} m
 * @property {boolean} i
 * @property {"css"|"json"|"html"|undefined} f
 * @property {string} c
 * @property {string|null} t
 * @property {(string|number)[]} _
 */

const usage = [
  'Usage: css-color-extractor <inputFile?> <outputFile?> [options]',
  '',
  '-g, --without-grey                    Omit greys.',
  '-m, --without-monochrome              Omit greys, black, and white.',
  '-f <format>, --format=<format>        Output format: css, json, or html.',
  '-c <format>, --color-format=<format>  Transform output color format:',
  '                                      hexString, rgbString,',
  '                                      percentString, hslString,',
  '                                      hwbString, or keyword.',
  '-t <path>, --template-html=<path>     Lodash template file path',
].join('\n');

const colors = require('colors');

/** @type Args */
// @ts-ignore
const argv = require('yargs/yargs')(process.argv.slice(2))
  .usage(usage)
  .options({
    g: { type: 'boolean', default: false, alias: 'without-grey' },
    m: { type: 'boolean', default: false, alias: 'without-monochrome' },
    i: { type: 'boolean', default: false, alias: 'inverse' },
    f: { type: 'string', default: '', alias: 'format' },
    c: { type: 'string', default: '', alias: 'color-format' },
    t: { type: 'string', default: null, alias: 'template-html' },
  }).argv;

const inputFile = argv._[0] ? argv._[0].toString() : null;

const outputFile = argv._[1] ? argv._[1].toString() : null;

const options = {
  withoutGrey: argv.g,
  withoutMonochrome: argv.m,
  inverse: argv.i,
  format: argv.f,
  colorFormat: argv.c,
  templateHTML: argv.t,
};

const Cli = require('./');

const cli = new Cli(inputFile, outputFile, options);

cli.onError(function(error) {
  if (error === cli.ERROR_NO_INPUT) {
    console.log(usage);
  } else {
    console.error(colors.red(error.message || error));
  }
});

cli.process();
