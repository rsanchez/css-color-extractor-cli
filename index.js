'use strict';

module.exports = function (inputFile, outputFile, options) {
    var fs = require('fs');
    var path = require('path');
    var events = require('events');
    var eventEmitter = new events.EventEmitter();
    var _ = require('underscore');
    var colorObj = require('color');
    var noInputError = new Error('No input specified.');

    function sortColors(colors) {
        colors.sort(function (a, b) {
            return colorObj(a).hue() - colorObj(b).hue();
        });
    }

    function toHtml(data) {
        var extractor = require('css-color-extractor');
        var colors = extractor.fromCss(data, options);
        var filePath = options.templateHTML === undefined || options.templateHTML === null || (options.templateHTML !== undefined && options.templateHTML !== null && !fs.existsSync(options.templateHTML)) ? path.join(__dirname, '/templates/html.tpl') : options.templateHTML;
        var template = fs.readFileSync(filePath, 'utf8');
        var transparentPath = path.join(__dirname, '/templates/transparent_pattern.svg');
        var transparent = fs.readFileSync(transparentPath, 'utf-8');
        var render = _.template(template);

        sortColors(colors);

        return render({
            colors:      colors,
            colorObj:    colorObj,
            transparent: 'url("data:image/svg+xml;base64,' + new Buffer(transparent).toString('base64') + '")'
        });
    }

    function toList(data) {
        var extractor = require('css-color-extractor');
        var colors = extractor.fromCss(data, options);

        sortColors(colors);

        return colors.join('\n');
    }

    function toJson(data) {
        var extractor = require('css-color-extractor');
        var colors = extractor.fromCss(data, options);

        sortColors(colors);

        return JSON.stringify(colors);
    }

    function toCss(data) {
        var postcss = require('postcss');
        var colorsOnly = require('postcss-colors-only');
        var css = postcss(colorsOnly(options)).process(data).css;

        return css.toString();
    }

    function processInput(input) {
        var output;

        if (outputFile && typeof options.format === 'undefined') {
            var extension = path.extname(outputFile);

            switch (extension) {
                case '.css':
                case '.sass':
                case '.scss':
                case '.less':
                    options.format = 'css';
                    break;
                case '.json':
                case '.js':
                    options.format = 'json';
                    break;
                case '.html':
                case '.htm':
                    options.format = 'html';
                    break;
                default:
                    break;
            }
        }

        switch (options.format) {
            case 'json':
                output = toJson(input);
                break;
            case 'css':
                output = toCss(input);
                break;
            case 'html':
                output = toHtml(input);
                break;
            default:
                output = toList(input);
                break;
        }

        if (outputFile) {
            fs.writeFileSync(outputFile, output);
        } else {
            console.log(output);
        }
    }

    function processStdin() {
        var data = '';

        process.stdin.setEncoding('utf8');

        process.stdin.on('readable', function () {
            var chunk = process.stdin.read();

            if (chunk !== null) {
                data += chunk;
            }
        });

        process.stdin.on('end', function () {
            if (!data) {
                emitError(noInputError);
                return;
            }

            processInput(data);
        });
    }

    function processInputFile() {
        if (!inputFile) {
            emitError(noInputError);
            return;
        }

        fs.readFile(inputFile, 'utf8', function (err, data) {
            if (err) {
                emitError(new Error(err));
                return;
            }

            processInput(data);
        });
    }

    function emitError(error) {
        process.nextTick(function () {
            eventEmitter.emit('error', error);
        });
    }

    this.process = function () {
        if (!process.stdin.isTTY) {
            processStdin();
        } else {
            processInputFile();
        }
    };

    this.ERROR_NO_INPUT = noInputError;

    this.onError = function (callback) {
        eventEmitter.on('error', callback);
    };
};
