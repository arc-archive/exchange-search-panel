# Deprecated

This component is deprecated. Use `@advanced-rest-client/anypoint` instead.

----------------

An element that renders an UI to search Anypoint Exchange for available assets.

## Usage

### Installation

```sh
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
      .columns="${columns}"
      @selected="${this._assetHandler}"
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
Set `anypointAuth`, `exchangeRedirectUri`, and `exchangeClientId` attributes to enable the authorization button.

```html
<exchange-search-panel
  anypointAuth
  exchangeRedirectUri="${redirectUrl}"
  exchangeClientId="${clientId}"
  @anypointcodeexchange="${this._processCodeExchange}"
></exchange-search-panel>
```

Note, that currently the Anypoint authorization server only support "code" oauth flow. This means you have to handle code response and exchange the code for access token. To do so, handle the `anypointcodeexchange` event dispatched by the `anypoint-signin` element.

```javascript

/**
 * @param {AnypointCodeExchangeEvent} e
 */
_handleTokenExchange(e) {
  const { code } = e;
  e.detail.result = this.exchangeCode(code);
}

/**
 * @param {string} code
 * @returns {Promise<TokenInfo>}
 */
async exchangeCode(code) {
  const init = {
    method: 'POST',
    body: code,
  };
  const response = await fetch('YOUR SERVER URL', init);
  const info = await response.json();
  return {
    accessToken: info.accessToken,
    expiresAt: Date.now() + info.expiresIn,
    expiresIn: info.expiresIn,
    expiresAssumed: false,
    state: '0', // this is required by the types definition but can be anything. State is checked before this function is called
  };
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
