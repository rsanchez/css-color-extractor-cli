#!/usr/bin/env node

var usage = [
    'Usage: css-color-extractor <inputFile?> <outputFile?> [options]',
    '',
    '-g, --without-grey                    Omit greys.',
    '-m, --without-monochrome              Omit greys, black, and white.',
    '-f <format>, --format=<format>        Output format: css, json, or html.',
    '-c <format>, --color-format=<format>  Transform output color format:',
    '                                      hexString, rgbString,',
    '                                      percentString, hslString,',
    '                                      hwbString, or keyword.'
].join('\n');

var colors = require('colors');

var argv = require('yargs')
    .usage(usage)
    .alias('g', 'without-grey')
    .alias('m', 'without-monochrome')
    .alias('f', 'format')
    .alias('c', 'color-format')
    .argv;

var inputFile = argv._[0] || null;

var outputFile = argv._[1] || null;

var options = {
    withoutGrey:       argv.g,
    withoutMonochrome: argv.m,
    format:            argv.f,
    colorFormat:       argv.c
};

var cli = require('./');

try {
    cli(inputFile, outputFile, options);
} catch (e) {
    console.error(colors.red(e.message || e));
}
