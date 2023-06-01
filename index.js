'use strict';

const fs = require('fs');
const path = require('path');
const events = require('events');
const template = require('lodash.template');
const Color = require('color');
const extractor = require('css-color-extractor');
const postcss = require('postcss');
const colorsOnly = require('postcss-colors-only');

/**
 * @typedef Options
 * @property {boolean} withoutGrey
 * @property {boolean} withoutMonochrome
 * @property {boolean} inverse
 * @property {boolean} allColors
 * @property {string|null} colorFormat
 * @property {"hue"|"frequency"|null} sort
 * @property {string|null|undefined} templateHTML
 * @property {"css"|"json"|"html"|undefined} format
 */

/**
 * @param {string|null} inputFile
 * @param {string|null} outputFile
 * @param {Partial<Options>} options
 */
module.exports = function(inputFile, outputFile, options) {
  const eventEmitter = new events.EventEmitter();
  const noInputError = new Error('No input specified.');

  /**
   * @param {string} data
   * @returns {string}
   */
  function toHtml(data) {
    const colors = extractor.fromCss(data, options);
    const filePath = options.templateHTML === undefined || options.templateHTML === null || (options.templateHTML !== undefined && options.templateHTML !== null && !fs.existsSync(options.templateHTML)) ? path.join(__dirname, '/templates/html.tpl') : options.templateHTML;
    const templateString = fs.readFileSync(filePath, 'utf8');
    const transparentPath = path.join(__dirname, '/templates/transparent_pattern.svg');
    const transparent = fs.readFileSync(transparentPath, 'utf-8');
    const render = template(templateString);
    const isDark = (value) => new Color(value).isDark();

    return render({
      colors,
      isDark,
      transparent: 'url("data:image/svg+xml;base64,' + Buffer.from(transparent).toString('base64') + '")',
    });
  }

  /**
   * @param {string} data
   * @returns {string}
   */
  function toList(data) {
    const colors = extractor.fromCss(data, options);

    return colors.join('\n');
  }

  /**
   * @param {string} data
   * @returns {string}
   */
  function toJson(data) {
    const colors = extractor.fromCss(data, options);

    return JSON.stringify(colors);
  }

  /**
   * @param {string} data
   * @returns {string}
   */
  function toCss(data) {
    const css = postcss(colorsOnly(options)).process(data).css;

    return css.toString();
  }

  /**
   * @param {string} input
   * @returns {void}
   */
  function processInput(input) {
    let output;

    if (outputFile && typeof options.format === 'undefined') {
      const extension = path.extname(outputFile);

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
    let data = '';

    process.stdin.setEncoding('utf8');

    process.stdin.on('readable', function() {
      const chunk = process.stdin.read();

      if (chunk !== null) {
        data += chunk;
      }
    });

    process.stdin.on('end', function() {
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

    fs.readFile(inputFile, 'utf8', function(err, data) {
      if (err) {
        emitError(err);
        return;
      }

      processInput(data);
    });
  }

  /**
   * @param {Error} error
   */
  function emitError(error) {
    process.nextTick(function() {
      eventEmitter.emit('error', error);
    });
  }

  this.process = function() {
    if (!process.stdin.isTTY) {
      processStdin();
    } else {
      processInputFile();
    }
  };

  this.ERROR_NO_INPUT = noInputError;

  /**
   * @param {() => void} callback
   */
  this.onError = function(callback) {
    eventEmitter.on('error', callback);
  };
};
