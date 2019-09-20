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
import '@polymer/paper-progress/paper-progress.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import { viewColumn, viewList, search } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@anypoint-web-components/anypoint-signin/anypoint-signin.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '../exchange-search-grid-item.js';
import '../exchange-search-list-item.js';
import styles from './Styles.js';

export const assetsUri = 'https://anypoint.mulesoft.com/exchange/api/v2/assets';
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
 *  on-process-exchange-asset-data="_getAssetDetails"
 *  action-label="Details"></exchange-search-panel>
 * ```
 *
 *
 *
 * @customElement
 * @demo demo/index.html
 * @memberof UiElements
 */
export class ExchangeSearchPanel extends LitElement {
  static get styles() {
    return styles;
  }
  /**
   * @return {Boolean} `true` when the element is querying the API for the data.
   */
  get querying() {
    return this._querying;
  }

  get _querying() {
    return this.__querying;
  }

  set _querying(value) {
    const old = this.__querying;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this.__querying = value;
    this.dispatchEvent(new CustomEvent('querying-changed', {
      detail: {
        value
      }
    }));
  }
  /**
   * @return {Boolean} `true` if the `items` property has values.
   */
  get hasItems() {
    const { items } = this;
    return !!(items && items.length);
  }
  /**
   * @return {Boolean} `true` if query ended and there's no results.
   */
  get dataUnavailable() {
    const { hasItems, querying } = this;
    return !hasItems && !querying;
  }

  get queryParams() {
    const { type, exchangeLimit, exchangeOffset, query } = this;
    const params = {
      types: this._getTypes(type),
      limit: exchangeLimit,
      offset: exchangeOffset
    };
    if (query) {
      params.search = query;
    }
    return params;
  }

  get _effectivePanelTitle() {
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
   * @return {Boolean} if true then it renders "load more" button below the list
   */
  get renderLoadMore() {
    const { querying, noMoreResults } = this;
    return !querying && !noMoreResults;
  }
  /**
   * Shortcut for the document element
   *
   * @type {Element}
   */
  get _doc() {
    return this.ownerDocument.documentElement;
  }

  get type() {
    return this._type;
  }

  set type(value) {
    const old = this._type;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._type = value;
    this._typeChanged(value, old);
  }

  get anypointAuth() {
    return this._anypointAuth;
  }

  set anypointAuth(value) {
    const old = this._anypointAuth;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._anypointAuth = value;
    this._anypointAuthChanged(value);
  }

  get accessToken() {
    return this._accessToken;
  }

  set accessToken(value) {
    const old = this._accessToken;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._accessToken = value;
    this._accessTokenChenged(value, old);
  }

  get columns() {
    return this._columns;
  }

  set columns(value) {
    const old = this._columns;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._columns = value;
    this._computeColumns();
  }

  get _query() {
    return this.shadowRoot.querySelector('#query');
  }

  static get properties() {
    return {
      /**
       * Saved items restored from the datastore.
       */
      items: { type: Array },
      // True when the element is querying the database for the data.
      _querying: { type: Boolean },
      // Search query for the list.
      query: { type: String },
      // True if the Grid view is active
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
       *
       * @type {String|Array<String>} Single string type, coma separates types or
       * array of types.
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
       * Padding in pixels that will trigget query to the Exchange server
       * when the user scrolls the list.
       */
      listOffsetTrigger: { type: Number },
      /**
       * Set when no more results are available for current offset - limit
       * values.
       */
      noMoreResults: { type: Boolean },
      /**
       * If true it renders authorize button.
       * Note that the hosting application has to handle `oauth2-token-requested`
       * custom event.
       * See `@anypoint-web-components/anypoint-signin` element for
       * more info.
       */
      anypointAuth: { type: Boolean },
      /**
       * The `redirect_uri` parameter of the OAuth2 request.
       * It must be set when `anypointAuth` is true or otherwise it will throw an
       * error when trying to request the toekn.
       */
      exchangeRedirectUri: { type: String },
      /**
       * Registered within the exchange client id for OAuth2 calls.
       * It must be set when `anypointAuth` is true or otherwise it will throw an
       * error when trying to request the toekn.
       */
      exchangeClientId: { type: String },
      /**
       * User access token to authorize the requests in the exchange
       */
      accessToken: { type: String },
      // Computed value, true when access token is set.
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
      columns: { type: Number }
    };
  }

  constructor() {
    super();
    this.exchangeOffset = 0;
    this.exchangeLimit = 20;
    this.type = 'rest-api';
    this.scrollTarget = this._doc;
    this.listOffsetTrigger = 120;
    this.columns = 4;
    this.actionLabel = 'Download';

    this._oauth2ErrorHandler = this._oauth2ErrorHandler.bind(this);
    this._oauth2SignedOut = this._oauth2SignedOut.bind(this);
    this._oauth2SignedIn = this._oauth2SignedIn.bind(this);
  }

  firstUpdated() {
    const toggle = this.shadowRoot.querySelector('[data-action="grid-enable"]');
    toggle.active = true;

    if (!this.anypointAuth) {
      this.authInitialized = true;
      if (!this.noAuto) {
        this.updateSearch();
      }
    }
  }
  /**
   * Parses list of types to an array of types.
   * If the argument is array then it returns the same array.
   *
   * Note, this always returns array, even if the argument is empty.
   *
   * @param {String|Array} type Coma separated list of asset types.
   * Whitespaces are trimmed.
   * @return {Array<String>} List of asset types.
   */
  _getTypes(type) {
    if (!type) {
      return [];
    }
    if (type instanceof Array) {
      return type;
    }
    if (type.indexOf(',') !== -1) {
      type = type.split(',').map(function(item) {
        return item.trim();
      });
    } else {
      type = [type];
    }
    return type;
  }

  /**
   * Resets element state so it re-enables querying.
   */
  reset() {
    this.items = [];
    this.exchangeOffset = 0;
    this.noMoreResults = false;
    this._querying = false;
  }

  // Handler for grid view button click
  _enableGrid() {
    if (this.listView) {
      this.listView = false;
    }
    const toggle = this.shadowRoot.querySelector('[data-action="list-enable"]');
    toggle.active = false;
  }
  // Handler for list view button click
  _enableList() {
    if (!this.listView) {
      this.listView = true;
    }
    const toggle = this.shadowRoot.querySelector('[data-action="grid-enable"]');
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

  _searchKeydown(e) {
    if (e.key === 'Enter' || e.which === 13 || e.keyCode === 13) {
      e.preventDefault();
      this.updateSearch();
    }
  }

  _searchHandler(e) {
    if (!e.target.value) {
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
    this._querying = true;
    this._query.generateRequest();
  }

  _exchangeResponse(e) {
    const data = e.detail.response;
    if (!data || !data.length) {
      this.noMoreResults = true;
      this._querying = false;
      return;
    }
    if (data.length < this.exchangeLimit) {
      this.noMoreResults = true;
    }
    let items = this.items || [];
    items = items.concat(data);
    this.exchangeOffset += data.length;
    this.items = items;
    this._querying = false;
  }

  _exchangeResponseError(e) {
    this._querying = false;
    if (e.detail.request.status === 401 && this.signedIn) {
      // token expired
      this.accessToken = undefined;
      this.signedIn = false;
      this._notifyTokenExpired();
      return;
    }
    const toast = this.shadowRoot.querySelector('#errorToast');
    toast.text = 'Unable to get data from Exchange.';
    toast.opened = true;
  }

  _notifyTokenExpired() {
    this.dispatchEvent(new CustomEvent('tokenexpired'));
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
  _onScroll(e) {
    if (this.querying || this.noMoreResults) {
      return;
    }
    const st = e.target;
    const padding = st.scrollHeight - (st.clientHeight + st.scrollTop);
    if (padding <= this.listOffsetTrigger) {
      this.queryCurrent();
    }
  }
  /**
   * Dispatches `process-exchange-asset-data` when list item's
   * `on-main-action-requested` custom event is handled.
   *
   * @param {CustomEvent} e
   */
  _processItem(e) {
    const index = Number(e.target.dataset.index);
    const item = this.items[index];
    this.dispatchEvent(new CustomEvent('process-exchange-asset-data', {
      bubbles: true,
      composed: true,
      detail: item
    }));
  }

  _anypointAuthChanged(state) {
    if (state) {
      this._listenOauth();
    } else {
      this._unlistenOauth();
    }
  }

  _listenOauth() {
    this.addEventListener('anypoint-signin-aware-error', this._oauth2ErrorHandler);
    this.addEventListener('anypoint-signin-aware-signed-out', this._oauth2SignedOut);
    this.addEventListener('anypoint-signin-aware-success', this._oauth2SignedIn);
  }

  _unlistenOauth() {
    this.removeEventListener('anypoint-signin-aware-error', this._oauth2ErrorHandler);
    this.removeEventListener('anypoint-signin-aware-signed-out', this._oauth2SignedOut);
    this.removeEventListener('anypoint-signin-aware-success', this._oauth2SignedIn);
  }

  _oauth2ErrorHandler(e) {
    const message = e.detail.message;
    const toast = this.shadowRoot.querySelector('#errorToast');
    toast.text = message;
    toast.opened = true;
    if (!this.authInitialized) {
      this.authInitialized = true;
      if (!this.noAuto) {
        this.updateSearch();
      }
    }
  }
  /**
   * Handles `anypoint-signin-aware-signed-out` custom event.
   * Handled when the user is signed out.
   */
  _oauth2SignedOut() {
    if (!this.authInitialized) {
      this.authInitialized = true;
    }
    if (!this.noAuto) {
      this.updateSearch();
    }
  }
  /**
   * Handles `anypoint-signin-aware-success` - the success - Anypoint
   * sign in custom event. Updates search items for logged in user.
   */
  _oauth2SignedIn() {
    if (!this.authInitialized) {
      this.authInitialized = true;
    }
    if (!this.noAuto) {
      this.updateSearch();
    }
  }
  /**
   * Calls `_setupAuthHeaders()` function when token value change.
   *
   * @param {String|undefined} token
   * @param {String|undefined} old
   */
  _accessTokenChenged(token, old) {
    if (!old && !token) {
      return;
    }
    this._setupAuthHeaders(token);
  }
  /**
   * Sets up authorization headers on `iron-request` element if the token
   * is available or clears headers if not.
   *
   * @param {?String} token Oauth 2 token value for Anypoint.
   */
  _setupAuthHeaders(token) {
    const headers = {};
    if (token) {
      headers.authorization = 'Bearer ' + token;
    }
    this._query.headers = headers;
  }
  /**
   * Updates width of the grid items when number of columens change
   *
   * @param {Number} value Current value of `columens` propert.
   */
  _columnsChanged(value) {
    this.style.setProperty('--exchange-search-grid-item-computed-width', (100/value) + '%');
  }

  _typeChanged(value, old) {
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
   * @param {String|Number} columns Number of columens to use or auto to compute the value.
   * @param {Boolean} m2200
   * @param {Boolean} m2000
   * @param {Boolean} m1900
   * @param {Boolean} m1700
   * @param {Boolean} m1400
   * @param {Boolean} m756
   * @param {Boolean} m450
   */
  _computeColumns() {
    const { columns, _mq2200, _mq2000, _mq1900, _mq1700, _mq1400, _mq756, _mq450 } = this;
    let result;
    if (!isNaN(columns)) {
      result = Number(columns);
    } else {
      // console.log(_mq2200, _m2000, _m1900, _m1700, _m1400, _m756, _m450);
      switch (true) {
        case _mq2200: result = 8; break;
        case _mq2000: result = 7; break;
        case _mq1900: result = 6; break;
        case _mq1700: result = 5; break;
        case _mq1400: result = 4; break;
        case _mq756: result = 3; break;
        case _mq450: result = 2; break;
        default: result = 1; break;
      }
    }
    this._columnsChanged(result);
  }

  _mqHandler(e) {
    const prop = e.target.dataset.prop;
    this[prop] = e.detail.value;
    this._computeColumns();
  }

  render() {
    const { dataUnavailable, queryParams } = this;
    return html`
    ${this._headerTemplate()}
    ${this._searchTemplate()}
    ${this._busyTemplate()}
    ${dataUnavailable ? this._emptyTemplate() : this._listTemplate()}

    <iron-ajax
      id="query"
      .url="${assetsUri}"
      handle-as="json"
      @response="${this._exchangeResponse}"
      debounce-duration="300"
      .params="${queryParams}"
      @error="${this._exchangeResponseError}"></iron-ajax>

    <paper-toast id="errorToast" class="error-toast"></paper-toast>

    <iron-media-query
      query="(min-width: 2200px)" data-prop="_mq2200" @query-matches-changed="${this._mqHandler}"></iron-media-query>
    <iron-media-query
      query="(min-width: 2000px)" data-prop="_mq2000" @query-matches-changed="${this._mqHandler}"></iron-media-query>
    <iron-media-query
      query="(min-width: 1900px)" data-prop="_mq1900" @query-matches-changed="${this._mqHandler}"></iron-media-query>
    <iron-media-query
      query="(min-width: 1700px)" data-prop="_mq1700" @query-matches-changed="${this._mqHandler}"></iron-media-query>
    <iron-media-query
      query="(min-width: 1400px)" data-prop="_mq1400" @query-matches-changed="${this._mqHandler}"></iron-media-query>
    <iron-media-query
      query="(min-width: 756px)" data-prop="_mq756" @query-matches-changed="${this._mqHandler}"></iron-media-query>
    <iron-media-query
      query="(min-width: 450px)" data-prop="_mq450" @query-matches-changed="${this._mqHandler}"></iron-media-query>
    `;
  }

  _headerTemplate() {
    const {
      _effectivePanelTitle,
      anypointAuth
    } = this;
    return html`<div class="header">
      <h2>${_effectivePanelTitle}</h2>
      <div class="header-actions">
        ${anypointAuth ? this._authButtonTemplate() : ''}
        <anypoint-icon-button
          data-action="grid-enable"
          toggles
          @click="${this._enableGrid}"
          class="toggle-view"
        >
          <span class="icon">${viewColumn}</span>
        </anypoint-icon-button>
        <anypoint-icon-button
          data-action="list-enable"
          toggles
          @click="${this._enableList}"
          class="toggle-view"
        >
          <span class="icon">${viewList}</span>
        </anypoint-icon-button>
      </div>
    </div>`;
  }

  _signedInHandler(e) {
    this.signedIn = e.detail.value;
  }

  _atHandler(e) {
    this.signedIn = e.detail.value;
  }

  _queryHandler(e) {
    this.query = e.detail.value;
  }

  _authButtonTemplate() {
    const {
      compatibility,
      authInitialized,
      exchangeRedirectUri,
      exchangeClientId,
      forceOauthEvents
    } = this;
    const material = !compatibility;
    return html`<anypoint-signin
      ?material="${material}"
      ?disabled="${!authInitialized}"
      class="auth-button"
      .redirectUri="${exchangeRedirectUri}"
      .clientId="${exchangeClientId}"
      scopes="read:exchange"
      @signedin-changed="${this._signedInHandler}"
      @accesstoken-changed="${this._atHandler}"
      ?forceOauthEvents="${forceOauthEvents}"
      width="wide"
    ></anypoint-signin>`;
  }

  _searchTemplate() {
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
        @value-changed="${this._queryHandler}"
        aria-label="Search Anypoint Exchange"
        @keydown="${this._searchKeydown}"
        @search="${this._searchHandler}"
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

  _busyTemplate() {
    const { querying, authInitialized } = this;
    if (!authInitialized) {
      return html`<div class="connecting-info">
        <p>Connecting to Anypoint Exchange</p>
        <paper-progress indeterminate></paper-progress>
      </div>`;
    }
    if (querying) {
      return html`<paper-progress indeterminate></paper-progress>`;
    }
  }

  _emptyTemplate() {
    return html`<p class="empty-info">Couldn't find requested API.</p>`;
  }

  _listTemplate() {
    const { listView, compatibility, renderLoadMore } = this;
    const items = this.items || [];
    return html`
    <div class="list-wrapper" @scroll="${this._onScroll}">
    <section class="list" ?data-list="${listView}">
    ${items.map((item, index) => this._renderItem(listView, item, index, compatibility))}
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

  _renderItem(listView, item, index, compatibility) {
    return listView ?
      this._renderListItem(item, index, compatibility) :
      this._renderGridItem(item, index, compatibility);
  }

  _renderListItem(item, index, compatibility) {
    const { actionLabel } = this;
    return html`
    <exchange-search-list-item
      data-index="${index}"
      .item="${item}"
      ?compatibility="${compatibility}"
      @action-requested="${this._processItem}"
      .actionLabel="${actionLabel}"
    ></exchange-search-list-item>`;
  }

  _renderGridItem(item, index, compatibility) {
    const { actionLabel } = this;
    return html`
    <exchange-search-grid-item
      data-index="${index}"
      .item="${item}"
      ?compatibility="${compatibility}"
      @action-requested="${this._processItem}"
      .actionLabel="${actionLabel}"
    ></exchange-search-grid-item>`;
  }
  /**
   * Fired when the user requested to process the item.
   * The `detail` object of the event contains item response from
   * Exchange API.
   *
   * Note, the event can be canceled.
   *
   * @event process-exchange-asset-data
   * @param {String} groupId
   * @param {String} assetId
   * @param {String} version
   * @param {String} versionGroup
   * @param {String} productAPIVersion
   * @param {Boolean} isPublic
   * @param {String} name
   * @param {String} type
   * @param {String} status
   * @param {String} assetLink
   * @param {String} createdAt
   * @param {String} runtimeVersion
   * @param {Number} rating
   * @param {Number} numberOfRates
   * @param {String} id
   * @param {String} icon
   * @param {String} modifiedAt
   * @param {Object} organization
   * @param {Object} createdBy
   * @param {Array} tags
   * @param {Array} files
   */
  /**
   * Dispatched when the element or user request access token from the Exchange
   * server.
   *
   * @event oauth2-token-requested
   * @param {String} state
   * @param {String} clientId
   * @param {String} redirectUrl
   * @param {String} type Always `implicit`
   * @param {String} authorizationUrl
   * @param {String} interactive After loading the element it tries the
   * non-interactive method of authorization. When auth button is clicked
   * then this value is always `true`.
   */
}
