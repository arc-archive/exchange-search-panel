import { html } from 'lit-html';
import { DemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-button.js';
import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-group.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@advanced-rest-client/oauth-authorization/oauth2-authorization.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../exchange-search-panel.js';

class ComponentDemoPage extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'compatibility',
      'outlined',
      'columns',
      'type'
    ]);
    this._componentName = 'exchange-search-panel';
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];

    this.redirectUrl = 'https://auth.advancedrestclient.com/oauth-popup.html';
    this.clientId = '2e38d46b60c5476584cdecba8b516711';
    this.columns = 'auto';
    this.type = 'rest-api'

    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
    this._columnsHandler = this._columnsHandler.bind(this);
    window.addEventListener('anypoint-signin-aware-error', this._signInError.bind(this));
    window.addEventListener('oauth2-code-response', this._signInCode.bind(this));
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

  _columnsHandler(e) {
    const { name, checked, value } = e.target;
    if (!checked) {
      return;
    }
    this[name] = value;
  }

  _signInError(e) {
    console.log('Log in error', e.detail);
  }

  _signInCode(e) {
    console.log('Access token code request', e.detail);
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
      clientId,
      columns,
      type
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
            .columns="${columns}"
            .type="${type}"
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

          <label slot="options" id="columnsLabel">Columns</label>
          <anypoint-radio-group
            slot="options"
            selectable="anypoint-radio-button"
            aria-labelledby="columnsLabel"
          >
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="columns"
              value="1"
            >1</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="columns"
              value="2"
            >2</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="columns"
              value="3"
            >3</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="columns"
              value="4"
            >4</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="columns"
              value="5"
            >5</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="columns"
              value="6"
            >6</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="columns"
              checked
              value="auto"
            >Auto</anypoint-radio-button>
          </anypoint-radio-group>


          <label slot="options" id="typeLabel">Asset type</label>
          <anypoint-radio-group
            slot="options"
            selectable="anypoint-radio-button"
            aria-labelledby="typeLabel"
          >
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="type"
              value="rest-api"
              checked
            >REST API</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="type"
              value="connector"
            >Connector</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="type"
              value="template"
            >Template</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="type"
              value="example"
            >Example</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="type"
              value="soap-api"
            >SOAP API</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="type"
              value="raml-fragment"
            >API fragment</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="type"
              value="custom"
            >Custom asset</anypoint-radio-button>
            <anypoint-radio-button
              @change="${this._columnsHandler}"
              name="type"
              value=""
            >Any asset</anypoint-radio-button>
          </anypoint-radio-group>
        </arc-interactive-demo>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <h2>Exchange search panel</h2>
      ${this._demoTemplate()}
    `;
  }
}

const instance = new ComponentDemoPage();
instance.render();
