# CSS Color Extractor CLI

Extract colors (named, hex, rgb, rgba, hsl, and hsla) from CSS.

```css
.foo {
  color: red;
  border: 1px solid #ab560f;
  font-size: 16px;
  background-image: linear-gradient(to-bottom, red, blue);
}

.bar {
  color: rgba(0, 128, 255, 0.5);
}

.baz {
  display: block;
}
```

Yields:
```
red
#ab560f
blue
rgba(0, 128, 255, 0.5)
```

This module looks at the following CSS properties for colors:

* `color`
* `background`
* `background-color`
* `background-image`
* `border`
* `border-top`
* `border-right`
* `border-bottom`
* `border-left`
* `border-color`
* `border-top-color`
* `border-right-color`
* `border-bottom-color`
* `border-left-color`
* `outline`
* `outline-color`
* `text-shadow`
* `box-shadow`
* `fill`
* `stroke`
* `stop-color`
* `flood-color`
* `lighting-color`

## Installation

[![NPM version](https://badge.fury.io/js/css-color-extractor.svg)](https://www.npmjs.org/package/css-color-extractor)

[Use npm](https://www.npmjs.org/doc/cli/npm-install.html).

```
npm install -g css-color-extractor-cli
```

## Usage

Extract colors as a list to stdout:

```
css-color-extractor input.css
```

Extract colors from stdin:

```
cat input.css | css-color-extractor
```

Use the `--without-grey` or `--without-monochrome` flag(s):

```
css-color-extractor input.css --without-grey
```

Use the `--color-format` option to transform color output format (`hexString`, `rgbString`, `percentString`, `hslString`, `hwbString`, or `keyword`):

```
css-color-extractor input.css --color-format=hslString
```

Use the `--sort` option to sort the list of colors (`hue` or `frequency`):

```
css-color-extractor input.css --sort=hue
```

Use the `--inverse` option to remove colors from rules:

```
css-color-extractor input.css output.css --inverse
```

Extract colors to file:

```
css-color-extractor input.css output.txt
```

Extract colors to CSS format (includes original CSS selectors):

```
css-color-extractor input.css output.css

# or to stdout
css-color-extractor input.css --format=css
```

```css
.foo {
  color: red;
  border: 1px solid #ab560f;
  font-size: 16px;
  background-image: linear-gradient(to-bottom, red, blue);
}

.bar {
  color: rgba(0, 128, 255, 0.5);
}

.baz {
  display: block;
}
```

Yields:
```css
.foo {
  color: red;
  border-color: #ab560f;
  background-image: linear-gradient(to-bottom, red, blue);
}

.bar {
  color: rgba(0, 128, 255, 0.5);
}
```

Extract colors to JSON format:

```
css-color-extractor input.css output.json

# or to stdout
css-color-extractor input.css --format=json
```

```css
.foo {
  color: red;
  border: 1px solid #ab560f;
  font-size: 16px;
  background-image: linear-gradient(to-bottom, red, blue);
}

.bar {
  color: rgba(0, 128, 255, 0.5);
}

.baz {
  display: block;
}
```

Yields:
```js
["red","#ab560f","blue","rgba(0, 128, 255, 0.5)"]
```

Extract colors to HTML format (page of color swatches):

```
css-color-extractor input.css output.html

# or to stdout
css-color-extractor input.css --format=html
```

Specify custom Underscore.js template for html:

```
css-color-extractor input.css output.html -t /path/to/templatefile.tpl

# or to stdout
css-color-extractor input.css --format=html  --template-html=/path/to/templatefile.tpl
```

```css
.foo {
  color: yellow;
  border: 1px solid #ab560f;
  font-size: 16px;
  background-image: linear-gradient(to-bottom, red, blue);
}

.bar {
  color: rgba(0, 128, 255, 0.5);
}

.baz {
  display: block;
}
```

Yields:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Colors</title>
</head>
<body>
    <div class="container">
        <ul class="swatches">
            <li class="swatch swatch" style="background-color: yellow;">yellow</li>
            <li class="swatch swatch-dark" style="background-color: #ab560f;">#ab560f</li>
            <li class="swatch swatch-dark" style="background-color: rgba(0, 128, 255, 0.5);">rgba(0, 128, 255, 0.5)</li>
            <li class="swatch swatch-dark" style="background-color: blue;">blue</li>
        </ul>
    </div>
</body>
</html>
```

## License

Copyright (c) 2015 [Rob Sanchez](https://github.com/rsanchez)

Licensed under [the MIT License](./LICENSE).
