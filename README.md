[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/exchange-search-panel.svg)](https://www.npmjs.com/package/@advanced-rest-client/exchange-search-panel)

[![Build Status](https://travis-ci.org/advanced-rest-client/exchange-search-panel.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/exchange-search-panel)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/exchange-search-panel)

## &lt;exchange-search-panel&gt;

An element that displays an UI to search Anypoint Exchange for RAML (REST API) resources

```html
<exchange-search-panel></exchange-search-panel>
```

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @advanced-rest-client/exchange-search-panel
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@advanced-rest-client/exchange-search-panel/exchange-search-panel.js';
    </script>
  </head>
  <body>
    <exchange-search-panel></exchange-search-panel>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@advanced-rest-client/exchange-search-panel/exchange-search-panel.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <exchange-search-panel></exchange-search-panel>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/exchange-search-panel
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
