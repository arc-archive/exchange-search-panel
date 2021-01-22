/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { LitElement, html } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { AnypointSignedInErrorType, AnypointSignedOutType, AnypointSignedInType } from '@anypoint-web-components/anypoint-signin';
import { viewColumn, viewList, search } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@anypoint-web-components/anypoint-item/anypoint-icon-item.js';
import '@anypoint-web-components/anypoint-item/anypoint-item-body.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@anypoint-web-components/anypoint-signin/anypoint-signin.js';
import '@advanced-rest-client/star-rating/star-rating.js';
import { exchange } from './icons.js';
import elementStyles from './Styles.js';
import { register, unregister, mediaResult } from './MediaQueryMatcher.js';

/** @typedef {import('@polymer/iron-ajax').IronAjaxElement} IronAjaxElement */
/** @typedef {import('lit-element').TemplateResult} TemplateResult */
/** @typedef {import('lit-html/directives/style-map').StyleInfo} StyleInfo */
/** @typedef {import('@anypoint-web-components/anypoint-signin').AnypointSigninElement} AnypointSigninElement */
/** @typedef {import('./types').ExchangeAsset} ExchangeAsset */
/** @typedef {import('./types').MediaQueryResult} MediaQueryResult */

export const assetsUri = 'https://anypoint.mulesoft.com/exchange/api/v2/assets';

export const columnsValue = Symbol('columnsValue');
export const attachMediaQueries = Symbol('attachMediaQueries');
export const detachMediaQueries = Symbol('detachMediaQueries');
export const mediaQueryHandler = Symbol('mediaQueryHandler');
export const processMediaResult = Symbol('processMediaResult');
export const oauthCallback = Symbol('oauthCallback');
export const queryingValue = Symbol('queryingValue');
export const notifyQuerying = Symbol('notifyQuerying');
export const documentValue = Symbol('documentValue');
export const ajaxValue = Symbol('ajaxValue');
export const scrollHandler = Symbol('scrollHandler');
export const queryInputHandler = Symbol('queryInputHandler');
export const queryKeydownHandler = Symbol('queryKeydownHandler');
export const querySearchHandler = Symbol('querySearchHandler');
export const computeColumns = Symbol('computeColumns');
export const columnsValueLocal = Symbol('columnsValueLocal');
export const accessTokenValue = Symbol('accessTokenValue');
export const typeValue = Symbol('typeValue');
export const typeChanged = Symbol('typeChanged');
export const anypointAuthValue = Symbol('anypointAuthValue');
export const anypointAuthChanged = Symbol('anypointAuthChanged');
export const listenOauth = Symbol('listenOauth');
export const unlistenOauth = Symbol('unlistenOauth');
export const itemActionHandler = Symbol('itemActionHandler');
export const accessTokenChanged = Symbol('accessTokenChanged');
export const setupAuthHeaders = Symbol('setupAuthHeaders');
export const notifyTokenExpired = Symbol('notifyTokenExpired');
export const exchangeResponseError = Symbol('exchangeResponseError');
export const exchangeResponse = Symbol('exchangeResponse');
export const enableGrid = Symbol('enableGrid');
export const enableList = Symbol('enableList');
export const signedInHandler = Symbol('signedInHandler');
export const accessTokenHandler = Symbol('accessTokenHandler');
export const authButtonTemplate = Symbol('authButtonTemplate');
export const headerTemplate = Symbol('headerTemplate');
export const searchTemplate = Symbol('searchTemplate');
export const busyTemplate = Symbol('busyTemplate');
export const listTemplate = Symbol('listTemplate');
export const emptyTemplate = Symbol('emptyTemplate');
export const renderItem = Symbol('renderItem');
export const renderGridItem = Symbol('renderGridItem');
export const renderListItem = Symbol('renderListItem');
export const ratingTemplate = Symbol('ratingTemplate');
export const itemIconTemplate = Symbol('itemIconTemplate');
export const actionButtonTemplate = Symbol('actionButtonTemplate');

/**
 * An element that displays an UI to search Anypoint Exchange for RAML (REST API) resources.
 *
 * It handles queries to the exchange server, displays list of results, handles user query
 * and informs the application when the user request asset details.
 *
 * It dispatches `process-exchange-asset-data` custom event when user requested
 * an action to be performed on the asset. Default label for an action is
 * `Download` but it can be changed by setting `actionLabel` property.
 *
 * ### Example
 *
 * ```html
 * <exchange-search-panel
 *  @selected="_getAssetDetails"
 *  actionLabel="Details"></exchange-search-panel>
 * ```
 */
export class ExchangeSearchPanelElement extends LitElement {
  static get styles() {
    return elementStyles;
  }

  /**
   * @return {boolean} `true` when the element is querying the API for the data.
   */
  get querying() {
    return this[queryingValue];
  }

  /**
   * @return {boolean} `true` if the `items` property has values.
   */
  get hasItems() {
    const { items } = this;
    return !!(items && items.length);
  }

  /**
   * @return {boolean} `true` if query ended and there's no results.
   */
  get dataUnavailable() {
    const { hasItems, querying } = this;
    return !hasItems && !querying;
  }

  get queryParams() {
    const { exchangeLimit, exchangeOffset, query } = this;
    const params = {
      types: this.types,
      limit: exchangeLimit,
      offset: exchangeOffset
    };
    if (query) {
      params.search = query;
    }
    return params;
  }

  /**
   * Parses list of types to an array of types.
   * If the argument is array then it returns the same array.
   *
   * Note, this always returns array, even if the argument is empty.
   * @returns {string[]} List of asset types.
   */
  get types() {
    const { type } = this;
    if (!type) {
      return [];
    }
    if (Array.isArray(type)) {
      return type;
    }
    if (type.indexOf(',') !== -1) {
      return type.split(',').map((item) => item.trim());
    }
    return [type];
  }

  get effectivePanelTitle() {
    const { panelTitle, type } = this;
    if (panelTitle) {
      return panelTitle;
    }
    const prefix = 'Explore ';
    let content;
    switch (type) {
      case 'rest-api': content = 'REST APIs'; break;
      case 'connector': content = 'connectors'; break;
      case 'template': content = 'templates'; break;
      case 'example': content = 'examples'; break;
      case 'soap-api': content = 'SOAP APIs'; break;
      case 'raml-fragment': content = 'API fragments'; break;
      case 'custom': content = 'custom assets'; break;
      default: content = 'Exchange assets';
    }
    return prefix + content;
  }

  /**
   * @return {boolean} if true then it renders "load more" button below the list
   */
  get renderLoadMore() {
    const { querying, noMoreResults } = this;
    return !querying && !noMoreResults;
  }

  /**
   * Shortcut for the document element
   *
   * @type {HTMLElement}
   */
  get [documentValue]() {
    return this.ownerDocument.documentElement;
  }

  /**
   * @returns {string}
   */
  get type() {
    return this[typeValue];
  }

  /**
   * @param {string} value
   */
  set type(value) {
    const old = this[typeValue];
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this[typeValue] = value;
    this[typeChanged](old);
  }

  /**
   * @returns {boolean}
   */
  get anypointAuth() {
    return this[anypointAuthValue];
  }

  /**
   * @param {boolean} value
   */
  set anypointAuth(value) {
    const old = this[anypointAuthValue];
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this[anypointAuthValue] = value;
    this[anypointAuthChanged](value);
  }

  /**
   * @returns {string}
   */
  get accessToken() {
    return this[accessTokenValue];
  }

  /**
   * @param {string} value
   */
  set accessToken(value) {
    const old = this[accessTokenValue];
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this[accessTokenValue] = value;
    this[accessTokenChanged](value, old);
  }

  /**
   * @returns {number|string}
   */
  get columns() {
    return this[columnsValueLocal];
  }

  /**
   * @param {number|string} value
   */
  set columns(value) {
    const old = this[columnsValueLocal];
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this[columnsValueLocal] = value;
    this[computeColumns]();
    this.requestUpdate('columns', old);
  }

  /**
   * @returns {IronAjaxElement}
   */
  get [ajaxValue]() {
    return this.shadowRoot.querySelector('#query');
  }

  static get properties() {
    return {
      /**
       * Saved items restored from the datastore.
       */
      items: { type: Array },
      /**
       * Search query for the list.
       */
      query: { type: String },
      /**
       * True if the Grid view is active
       */
      listView: { type: Boolean },
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean },
      /**
       * Enables material's outlined theme for inputs.
       */
      outlined: { type: Boolean },
      /**
       * Rows offset in the Exchange's query.
       */
      exchangeOffset: { type: Number },
      /**
       * Limit of the results in single query to the Exchange's API.
       */
      exchangeLimit: { type: Number },
      /**
       * Exchange's asset type to search.
       * Note that this also determines the title of panel unless you set
       * `panelTitle` property.
       */
      type: { type: String },
      /**
       * Use this to set panel title value. By default is uses `type`
       * property to determine the title. When this property is set the title
       * will always be as the value defined in this property regardless the value
       * of `type`.
       */
      panelTitle: { type: String },
      /**
       * Padding in pixels that will trigger query to the Exchange server
       * when the user scrolls the list.
       */
      listOffsetTrigger: { type: Number },
      /**
       * Set when no more results are available for current offset - limit
       * values.
       */
      noMoreResults: { type: Boolean },
      /**
       * If true it renders the authorize button.
       * See `@anypoint-web-components/anypoint-signin` element for
       * more info.
       */
      anypointAuth: { type: Boolean },
      /**
       * The `redirect_uri` parameter of the OAuth2 request.
       * It must be set when `anypointAuth` is true or otherwise it will throw an
       * error when trying to request the token.
       */
      exchangeRedirectUri: { type: String },
      /**
       * Registered within the exchange client id for OAuth2 calls.
       * It must be set when `anypointAuth` is true or otherwise it will throw an
       * error when trying to request the token.
       */
      exchangeClientId: { type: String },
      /**
       * User access token to authorize the requests in the exchange
       */
      accessToken: { type: String },
      /**
       * Computed value, true when access token is set.
       */
      signedIn: { type: Boolean },
      /**
       * Forces `anypoint-signin` element to use ARC's OAuth events.
       */
      forceOauthEvents: { type: Boolean },
      /**
       * Flag indicating the authorization process has been initialized
       */
      authInitialized: { type: Boolean },
      /**
       * Label to display in main action button of a list item.
       * Default is `Download`.
       */
      actionLabel: { type: String },
      /**
       * When set the component will not query the Exchange for assets when
       * attached to DOM or when authentication state change.
       */
      noAuto: { type: Boolean },
      /**
       * Number of columns to render in "grid" view.
       * Set to `auto` to use media queries to determine pre set number of colum
       * depending on the screen size. It won't checks for element size so
       * do not use `auto` when embedding the element not as whole width
       * view.
       */
      columns: { type: Number },
    };
  }

  constructor() {
    super();
    this.exchangeOffset = 0;
    this.exchangeLimit = 20;
    this.type = 'rest-api';
    this.scrollTarget = this[documentValue];
    this.listOffsetTrigger = 120;
    this.columns = 4;
    this.actionLabel = 'Download';
    this.noAuto = false;
    this.compatibility = false;
    this.outlined = false;
    this.forceOauthEvents = false;
    /**
     * @type {string}
     */
    this.panelTitle = undefined;
    /**
     * @type {string}
     */
    this.exchangeRedirectUri = undefined;
    /**
     * @type {string}
     */
    this.exchangeClientId = undefined;
    /**
     * @type {ExchangeAsset[]}
     */
    this.items = undefined;

    this[oauthCallback] = this[oauthCallback].bind(this);
    this[mediaQueryHandler] = this[mediaQueryHandler].bind(this);
  }

  /**
   * @param {Map<string | number | symbol, unknown>} args
   */
  firstUpdated(args) {
    super.firstUpdated(args);
    const toggle = this.shadowRoot.querySelector('[data-action="grid-enable"]');
    // @ts-ignore
    toggle.active = true;

    if (!this.anypointAuth) {
      this.authInitialized = true;
      if (!this.noAuto) {
        this.updateSearch();
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this[attachMediaQueries]();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this[detachMediaQueries]();
  }

  [attachMediaQueries]() {
    register(this[mediaQueryHandler]);
  }

  [detachMediaQueries]() {
    unregister();
  }

  /**
   * @param {MediaQueryResult[]} result 
   */
  [mediaQueryHandler](result) {
    const { columns } = this;
    const typedColumns = Number(columns);
    if (!Number.isNaN(typedColumns)) {
      // does not set the media query value when columns value is set
      return;
    }
    this[processMediaResult](result);
  }

  /**
   * @param {MediaQueryResult[]} result 
   */
  [processMediaResult](result) {
    const matched = result.find((item) => item.matches);
    const value = matched ? matched.value : 1;
    this[columnsValue] = value;
    this.requestUpdate();
  }

  [notifyQuerying]() {
    this.dispatchEvent(new CustomEvent('queryingchange'));
  }

  /**
   * Resets element state so it re-enables querying.
   */
  reset() {
    this.items = /** @type ExchangeAsset[] */ ([]);
    this.exchangeOffset = 0;
    this.noMoreResults = false;
    this[queryingValue] = false;
    this[notifyQuerying]();
    this.requestUpdate();
  }

  /**
   * Handler for grid view button click
   */
  [enableGrid]() {
    if (this.listView) {
      this.listView = false;
    }
    const toggle = this.shadowRoot.querySelector('[data-action="list-enable"]');
    // @ts-ignore
    toggle.active = false;
  }

  /**
   * Handler for list view button click
   */
  [enableList]() {
    if (!this.listView) {
      this.listView = true;
    }
    const toggle = this.shadowRoot.querySelector('[data-action="grid-enable"]');
    // @ts-ignore
    toggle.active = false;
  }

  /**
   * Resets current list of results and makes a query to the Exchange server.
   * It will use current value of search query (which might be empty) to
   * search for an asset.
   */
  async updateSearch() {
    this.reset();
    await this.updateComplete;
    this.queryCurrent();
  }

  /**
   * @param {KeyboardEvent} e
   */
  [queryKeydownHandler](e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.updateSearch();
    }
  }

  /**
   * @param {Event} e 
   */
  [querySearchHandler](e) {
    const input = /** @type HTMLInputElement */ (e.target);
    if (!input.value) {
      this.updateSearch();
    }
  }

  /**
   * Makes a query to the exchange server for more data.
   * It uses current `queryParams` to generate request.
   */
  queryCurrent() {
    if (this.querying) {
      return;
    }
    this[queryingValue] = true;
    this[notifyQuerying]();
    this.requestUpdate();
    this[ajaxValue].generateRequest();
  }

  /**
   * @param {CustomEvent} e
   */
  [exchangeResponse](e) {
    const data = /** @type ExchangeAsset[] */ (e.detail.response);
    if (!data || !data.length) {
      this.noMoreResults = true;
      this[queryingValue] = false;
      this[notifyQuerying]();
      this.requestUpdate();
      return;
    }
    if (data.length < this.exchangeLimit) {
      this.noMoreResults = true;
    }
    let items = /** @type ExchangeAsset[] */ (this.items || []);
    items = items.concat(data);
    this.exchangeOffset += data.length;
    this.items = items;
    this[queryingValue] = false;
    this[notifyQuerying]();
    this.requestUpdate();
  }

  /**
   * @param {CustomEvent} e
   */
  [exchangeResponseError](e) {
    this[queryingValue] = false;
    this[notifyQuerying]();
    if (e.detail.request.status === 401 && this.signedIn) {
      // token expired
      this.accessToken = undefined;
      this.signedIn = false;
      this[notifyTokenExpired]();
    }
    this.requestUpdate();
    // const toast = this.shadowRoot.querySelector('#errorToast');
    // toast.text = 'Unable to get data from Exchange.';
    // toast.opened = true;
  }

  /**
   * Dispatches the `tokenexpired` event
   */
  [notifyTokenExpired]() {
    this.dispatchEvent(new Event('tokenexpired'));
  }

  /**
   * Reacts to `scrollTarget` scroll event. If the scroll Y position to the
   * bottom of the list is less than `listOffsetTrigger` then it triggers
   * query function.
   *
   * Note, if `noMoreResults` flag is set it will never query for more data.
   * You have to manually clear the property.
   *
   * @param {Event} e
   */
  [scrollHandler](e) {
    if (this.querying || this.noMoreResults) {
      return;
    }
    const node = /** @type HTMLDivElement */ (e.target);
    const padding = node.scrollHeight - (node.clientHeight + node.scrollTop);
    if (padding <= this.listOffsetTrigger) {
      this.queryCurrent();
    }
  }

  /**
   * Dispatches non-bubbling `selected` event with the selected item on the detail.
   *
   * @param {CustomEvent} e
   */
  [itemActionHandler](e) {
    const node = /** @type HTMLElement */ (e.target);
    const index = Number(node.dataset.index);
    const item = this.items[index];
    this.dispatchEvent(new CustomEvent('selected', {
      detail: item
    }));
  }

  /**
   * @param {boolean} state
   */
  [anypointAuthChanged](state) {
    if (state) {
      this[listenOauth]();
    } else {
      this[unlistenOauth]();
    }
  }

  [listenOauth]() {
    this.addEventListener(AnypointSignedInErrorType, this[oauthCallback]);
    this.addEventListener(AnypointSignedOutType, this[oauthCallback]);
    this.addEventListener(AnypointSignedInType, this[oauthCallback]);
  }

  [unlistenOauth]() {
    this.removeEventListener(AnypointSignedInErrorType, this[oauthCallback]);
    this.removeEventListener(AnypointSignedOutType, this[oauthCallback]);
    this.removeEventListener(AnypointSignedInType, this[oauthCallback]);
  }

  [oauthCallback]() {
    if (!this.authInitialized) {
      this.authInitialized = true;
    }
    if (!this.noAuto) {
      this.updateSearch();
    }
  }

  /**
   * Calls `[setupAuthHeaders]()` function when token value change.
   *
   * @param {string=} token
   * @param {string=} old
   */
  [accessTokenChanged](token, old) {
    if (token && !this.authInitialized) {
      this.authInitialized = true;
      this.queryCurrent();
    }
    if (!old && !token) {
      return;
    }
    this[setupAuthHeaders](token);
  }

  /**
   * Sets up authorization headers on `iron-request` element if the token
   * is available or clears headers if not.
   *
   * @param {string=} token Oauth 2 token value for Anypoint.
   */
  [setupAuthHeaders](token) {
    const headers = {};
    if (token) {
      headers.authorization = `Bearer ${  token}`;
    }
    this[ajaxValue].headers = headers;
  }

  /**
   * @param {string=} old 
   */
  [typeChanged](old) {
    if (old === undefined) {
      // Initialization.
      return;
    }
    this.updateSearch();
  }

  /**
   * Computes an effective value of `columns` property.
   * If first argument is a number this will be used as a number of columns.
   * Otherwise it uses media queries to determine the sate.
   */
  [computeColumns]() {
    const { columns } = this;
    const typedColumns = Number(columns);
    if (!Number.isNaN(typedColumns)) {
      this[columnsValue] = typedColumns;
      this.requestUpdate();
    } else {
      const result = mediaResult();
      this[processMediaResult](result);
    }
  }

  /**
   * @param {Event} e
   */
  [signedInHandler](e) {
    const button = /** @type AnypointSigninElement */ (e.target);
    this.signedIn = button.signedIn;
    if (!button.signedIn && !this.authInitialized) {
      this.authInitialized = true;
      this.queryCurrent();
    }
  }

  /**
   * @param {Event} e
   */
  [accessTokenHandler](e) {
    const button = /** @type AnypointSigninElement */ (e.target);
    this.accessToken = button.accessToken;
  }

  /**
   * @param {Event} e
   */
  [queryInputHandler](e) {
    const input = /** @type HTMLInputElement */ (e.target);
    this.query = input.value;
  }

  /**
   * @returns {TemplateResult} 
   */
  render() {
    const { dataUnavailable, queryParams } = this;
    const handleAs = 'json';
    const debounce = 300;
    return html`
    ${this[headerTemplate]()}
    ${this[searchTemplate]()}
    ${this[busyTemplate]()}
    ${dataUnavailable ? this[emptyTemplate]() : this[listTemplate]()}

    <iron-ajax
      id="query"
      .url="${assetsUri}"
      .handleAs="${handleAs}"
      .debounceDuration="${debounce}"
      .params="${queryParams}"
      @response="${this[exchangeResponse]}"
      @error="${this[exchangeResponseError]}"></iron-ajax>
    `;
  }

  /**
   * @returns {TemplateResult} The template for the element's header 
   */
  [headerTemplate]() {
    const {
      effectivePanelTitle,
      anypointAuth
    } = this;
    return html`<div class="header">
      <h2>${effectivePanelTitle}</h2>
      <div class="header-actions">
        ${anypointAuth ? this[authButtonTemplate]() : ''}
        <anypoint-icon-button
          data-action="grid-enable"
          toggles
          @click="${this[enableGrid]}"
          class="toggle-view"
        >
          <span class="icon">${viewColumn}</span>
        </anypoint-icon-button>
        <anypoint-icon-button
          data-action="list-enable"
          toggles
          @click="${this[enableList]}"
          class="toggle-view"
        >
          <span class="icon">${viewList}</span>
        </anypoint-icon-button>
      </div>
    </div>`;
  }

  /**
   * @returns {TemplateResult} The template for authorization button
   */
  [authButtonTemplate]() {
    const {
      compatibility,
      authInitialized,
      exchangeRedirectUri,
      exchangeClientId,
      forceOauthEvents
    } = this;
    const material = !compatibility;
    return html`
    <anypoint-signin
      ?material="${material}"
      ?disabled="${!authInitialized}"
      class="auth-button"
      .redirectUri="${exchangeRedirectUri}"
      .clientId="${exchangeClientId}"
      scopes="read:exchange"
      @signedinchange="${this[signedInHandler]}"
      @accesstokenchange="${this[accessTokenHandler]}"
      ?forceOauthEvents="${forceOauthEvents}"
      width="wide"
    ></anypoint-signin>`;
  }

  /**
   * @returns {TemplateResult} The template for the search input
   */
  [searchTemplate]() {
    const {
      compatibility,
      outlined,
      query
    } = this;
    return html`
    <div class="search-bar">
      <anypoint-input
        nolabelfloat
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
        type="search"
        .value="${query}"
        aria-label="Search Anypoint Exchange"
        @input="${this[queryInputHandler]}"
        @keydown="${this[queryKeydownHandler]}"
        @search="${this[querySearchHandler]}"
      >
        <label slot="label">Search Anypoint Exchange</label>
        <anypoint-icon-button
          title="Search"
          slot="suffix"
          @click="${this.updateSearch}"
        >
          <span class="icon">${search}</span>
        </anypoint-icon-button>
      </anypoint-input>
    </div>
    `;
  }

  /**
   * @returns {TemplateResult|string} The template for the loader
   */
  [busyTemplate]() {
    const { querying, authInitialized } = this;
    if (!authInitialized) {
      return html`<div class="connecting-info">
        <p>Connecting to Anypoint Exchange</p>
        <progress></progress>
      </div>`;
    }
    if (querying) {
      return html`<progress></progress>`;
    }
    return '';
  }

  /**
   * @returns {TemplateResult} The template for the empty search result
   */
  [emptyTemplate]() {
    return html`<p class="empty-info">Couldn't find requested API.</p>`;
  }

  /**
   * @returns {TemplateResult} The template for the results list
   */
  [listTemplate]() {
    const { listView, renderLoadMore, items = [] } = this;
    const listStyles = /** @type StyleInfo */ ({
      gridTemplateColumns: listView ? '' : `repeat(${this[columnsValue]}, 1fr)`,
    });
    const classes = {
      list: true,
      grid: !listView,
    }
    return html`
    <div class="list-wrapper" @scroll="${this[scrollHandler]}">
      <section class="${classMap(classes)}" style="${styleMap(listStyles)}">
      ${items.map((item, index) => this[renderItem](listView, item, index))}
      </section>
      ${renderLoadMore ? html`<div class="load-more">
        <anypoint-button
          emphasis="medium"
          class="action-button"
          @click="${this.queryCurrent}"
        >Load more</anypoint-button>
      </div>` : ''}
    </div>
    `;
  }

  /**
   * @param {boolean} listView
   * @param {ExchangeAsset} item
   * @param {number} index
   * @returns {TemplateResult} 
   */
  [renderItem](listView, item, index) {
    return listView ? this[renderListItem](item, index) : this[renderGridItem](item, index);
  }

  /**
   * @param {ExchangeAsset} item
   * @param {number} index
   * @returns {TemplateResult} 
   */
  [renderListItem](item, index) {
    return html`<anypoint-icon-item class="list-item">
      ${this[itemIconTemplate](item)}
      <anypoint-item-body twoline>
        <div class="top-line">
          <div class="name">${item.name}</div>
          ${this[ratingTemplate](item)}
        </div>
        <div secondary class="details">
          <p class="meta creator">by ${item.organization.name}</p>
        </div>
      </anypoint-item-body>
      ${this[actionButtonTemplate](index)}
    </anypoint-icon-item>`;
  }

  /**
   * @param {ExchangeAsset} item
   * @param {number} index
   * @returns {TemplateResult} 
   */
  [renderGridItem](item, index) {
    const { organization={} } = item;
    return html`
    <div class="card grid-item">
      <section class="content">
        <div class="title">
          ${this[itemIconTemplate](item)}
          <div class="name">${item.name}</div>
        </div>
        <p class="creator">by ${organization.name}</p>
        <div class="rating">
          ${this[ratingTemplate](item)}
        </div>
      </section>
      <div class="actions">
        ${this[actionButtonTemplate](index)}
      </div>
    </div>`;
  }

  /**
   * @param {ExchangeAsset} item
   * @returns {TemplateResult} Template for the rating element
   */
  [ratingTemplate](item) {
    const value = item.rating || 0;
    return html`<star-rating
      .value="${item.rating}"
      readonly
      title="Api rating: ${value}/5"
      tabindex="-1"
    ></star-rating>`;
  }

  /**
   * @param {ExchangeAsset} item
   * @returns {TemplateResult} The template for the asset's icon
   */
  [itemIconTemplate](item) {
    if (!item.icon) {
      return html`<span class="default-icon thumb" slot="item-icon">${exchange}</span>`; 
    }
    const map = {
      backgroundImage: `url('${item.icon}')`,
    };
    return html`<span
      class="thumb"
      slot="item-icon"
      style="${styleMap(map)}"
    ></span>`;
  }

  /**
   * @param {number} index
   * @returns {TemplateResult} Template for the action button
   */
  [actionButtonTemplate](index) {
    const {
      compatibility,
      actionLabel
    } = this;
    return html`
    <anypoint-button
      ?compatibility="${compatibility}"
      data-index="${index}"
      @click="${this[itemActionHandler]}"
      class="open-button"
    >${actionLabel}</anypoint-button>`;
  }
}
