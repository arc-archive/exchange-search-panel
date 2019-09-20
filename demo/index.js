import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@advanced-rest-client/oauth-authorization/oauth2-authorization.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../exchange-search-panel.js';

class DemoPage extends ArcDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'compatibility',
      'outlined'
    ]);
    this._componentName = 'exchange-search-panel';
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];

    this.redirectUrl = 'https://auth.advancedrestclient.com/oauth-popup.html';
    this.clientId = '59KaqF90hLgZMJec';

    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    this.outlined = state === 1;
    this.compatibility = state === 2;
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      readOnly,
      narrow,
      oauth2RedirectUri,
      request,
      redirectUrl,
      clientId
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the REST APIs menu element with various
          configuration options.
        </p>

        <arc-interactive-demo
          .states="${demoStates}"
          @state-chanegd="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <exchange-search-panel
            ?compatibility="${compatibility}"
            ?outlined="${outlined}"
            ?readOnly="${readOnly}"
            ?narrow="${narrow}"
            .oauth2RedirectUri="${oauth2RedirectUri}"
            .editorRequest="${request}"
            anypointauth
            exchangeredirecturi="${redirectUrl}"
            exchangeclientid="${clientId}"
            slot="content"
          ></exchange-search-panel>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="readOnly"
            @change="${this._toggleMainOption}"
          >
            Read only
          </anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="ignoreContentOnGet"
            @change="${this._toggleMainOption}"
          >
            Ignore content-* headers on GET
          </anypoint-checkbox>
        </arc-interactive-demo>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <h2>Exchange seatch panel</h2>
      ${this._demoTemplate()}
    `;
  }
}

const instance = new DemoPage();
instance.render();
window._demo = instance;
