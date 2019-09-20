[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/exchange-search-panel.svg)](https://www.npmjs.com/package/@advanced-rest-client/exchange-search-panel)

[![Build Status](https://travis-ci.org/advanced-rest-client/exchange-search-panel.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/exchange-search-panel)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/exchange-search-panel)

## &lt;exchange-search-panel&gt;

An element that renders an UI to search Anypoint Exchange for available assets.

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

### In a LitElement template

```js
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/exchange-search-panel/exchange-search-panel.js';

class SampleElement extends LitElement {

  render() {
    return html`
    <exchange-search-panel
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
      .oauth2RedirectUri="${oauth2RedirectUri}"
      .editorRequest="${request}"
      .columns="${columns}"
      .type="${type}"
      @process-exchange-asset-data="${this._assetHandler}"
    ></exchange-search-panel>
    `;
  }

  _assetHandler(e) {
    console.log(e.detail);
  }
}
customElements.define('sample-element', SampleElement);
```

### Authorization

The element uses `@anypoint-web-components/anypoint-signin` to sing a user in.
Set `anypointauth`, `exchangeredirecturi`, and `exchangeclientid` attributes to enable authorization button.

```html
<exchange-search-panel
  anypointauth
  exchangeredirecturi="${redirectUrl}"
  exchangeclientid="${clientId}"
  @oauth2-code-response="${this._processCodeExchange}"
></exchange-search-panel>
```

Note, that currently the Anypoint authorization server only support "code" oauth flow. This means you have to handle code response and
exchange the code for access token. When token data is ready dispatch `oauth2-token-response` on the `window` object.
The event's detail property should contain `accessToken` and `sate` property.

```javascript
async _processCodeExchange(e) {
  const { code, state } = e.detail;
  const at = await exchangeTokens(code, state);
  window.dispatchEvent(new CustomEvent('oauth2-token-response', {
    detail: {
      accessToken: at,
      state
    }
  }));
}
```

## Development

```sh
git clone https://github.com/advanced-rest-client/exchange-search-panel
cd exchange-search-panel
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests
```sh
npm test
```

## API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)
