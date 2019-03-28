/**
@license
Copyright 2016 The Advanced REST client authors <arc@mulesoft.com>
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
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import '../../@polymer/paper-toast/paper-toast.js';
import '../../@polymer/paper-progress/paper-progress.js';
import '../../@polymer/paper-button/paper-button.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../@polymer/paper-input/paper-input-container.js';
import '../../@polymer/iron-input/iron-input.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@polymer/iron-ajax/iron-ajax.js';
import '../../@advanced-rest-client/anypoint-signin/anypoint-signin.js';
import '../../@polymer/iron-media-query/iron-media-query.js';
import './exchange-search-grid-item.js';
import './exchange-search-list-item.js';
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
 * ### New in version 2.0
 *
 * - Renamed `allow-auth` attribute to `anypoint-auth`
 * - Added `columns` property to control grid view
 * - Updraded component to use Polymer 2.0
 *
 * ### Styling
 *
 * `<exchange-search-list-item>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--exchange-search-panel` | Mixin applied to the element | `{}`
 * `--exchange-search-panel-font-color` | Background color for panel's font | `inherit`
 * `--exchange-search-panel-loader` | Mixin applied to the paper-progress element | `{}`
 * `--exchange-search-panel-toggle-view-color` | Color of toggle view icon buttons | ``
 * `--exchange-search-panel-toggle-view-background-color` | Bg color of toggle view icon buttons | ``
 * `--exchange-search-panel-toggle-view-active-color` | Color of toggle view icon buttons when active | `#00A1DF`
 * `--exchange-search-panel-toggle-view-active-background-color` | Bg color of toggle view icon buttons when active | `#00A1DF`
 * `--arc-font-headline` | Mixin applied to the title of the panel | `{}`
 * `--exchange-search-panel-header` | Mixin applied to the header section with title and the list control buttons | `{}`
 * `--warning-primary-color` | Main color of the warning messages | `#FF7043`
 * `--warning-contrast-color` | Contrast color for the warning color | `#fff`
 * `--error-toast` | Mixin applied to the error toast | `{}`
 * `--empty-info` | Mixin applied to the label rendered when no data is available. | `{}`
 * `--action-button` | Mixin applied to the "load more" button | `{}`
 * `--action-button-hover` | Mixin applied to the "load more" button when hovered | `{}`
 * `--exchange-search-panel-list` | Mixin applied to the list element | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html Basic demo
 * @demo demo/scroll-target.html Using scroll target
 * @demo demo/shadow-scroll-target.html Using scroll target in shadow root
 * @memberof UiElements
 */
class ExchangeSearchPanel extends PolymerElement {
  static get template() {
    return html`
    <style include="paper-item-shared-styles"></style>
    <style>
    :host {
      display: block;
      color: var(--exchange-search-panel-font-color, inherit);
      @apply --exchange-search-panel;

      --paper-rating-icon: {
        width: 20px;
        height: 20px;
      };
    }

    .header {
      @apply --layout-horizontal;
      @apply --layout-center;
      @apply --exchange-search-panel-header;
    }

    h2 {
      @apply --arc-font-headline;
      @apply --layout-flex;
    }

    [hidden] {
      display: none !important;
    }

    paper-progress {
      width: 100%;
      @apply --exchange-search-panel-loader;
    }

    paper-icon-button.toggle-view {
      border-radius: 50%;
      min-width: 40px;
      min-height: 40px;
      color: var(--exchange-search-panel-toggle-view-color);
      background-color: var(--exchange-search-panel-toggle-view-background-color);
    }

    paper-icon-button[active].toggle-view {
      color: var(--exchange-search-panel-toggle-view-active-color, #fff);
      background-color: var(--exchange-search-panel-toggle-view-active-background-color, #00A1DF);
    }

    .error-toast {
      background-color: var(--warning-primary-color, #FF7043);
      color: var(--warning-contrast-color, #fff);
      @apply --error-toast;
    }

    .empty-info {
      font-size: 16px;
      @apply --empty-info;
    }

    .header-actions {
      @apply --layout-horizontal;
      @apply --layout-center;
    }

    .search-bar {
      @apply --layout-horizontal;
      @apply --layout-center;
    }

    .search-bar paper-input-container {
      @apply --layout-flex;
    }

    input[type="search"] {
      @apply --paper-input-container-shared-input-style;
    }

    .list {
      color: inherit;
      @apply --layout-horizontal;
      @apply --layout-wrap;
      @apply --exchange-search-panel-list;
    }

    .list[data-list] {
      @apply --layout-vertical;
    }

    exchange-search-grid-item {
      width: calc(var(--exchange-search-grid-item-computed-width, 25%) - 16px);
      margin: 8px;
    }

    .paper-item {
      cursor: pointer;
    }

    .action-button {
      @apply --action-button;
    }

    .action-button:hover {
      @apply --action-button-hover;
    }

    .load-more {
      @apply --layout-vertical;
      @apply --layout-center-center;
      margin-top: 20px;
    }

    .auth-button {
      margin-right: 8px;
    }

    .exchange-icon {
      margin-right: 8px;
    }

    .connecting-info {
      width: 320px;
      margin: 0 auto;
      @apply --arc-font-body1;
      text-align: center;
    }
    </style>
    <div class="header">
      <h2>[[_effectivePanelTitle]]</h2>
      <div class="header-actions">
        <template is="dom-if" if="[[anypointAuth]]">
          <anypoint-signin
            disabled\$="[[!authInitialized]]"
            class="auth-button"
            redirect-uri="[[exchangeRedirectUri]]"
            client-id="[[exchangeClientId]]"
            signed-in="{{signedIn}}"
            access-token="{{accessToken}}"
            force-oauth-events="[[forceOauthEvents]]"
            width="wide"
            theme="dark"></anypoint-signin>
        </template>
        <paper-icon-button
          icon="arc:view-column"
          data-action="grid-enable"
          toggles=""
          active="[[!listView]]"
          on-click="_enableGrid"
          class="toggle-view"></paper-icon-button>
        <paper-icon-button
          icon="arc:view-list"
          data-action="list-enable"
          toggles=""
          active="[[listView]]"
          on-click="_enableList"
          class="toggle-view"></paper-icon-button>
      </div>
    </div>
    <div class="search-bar">
      <paper-input-container no-label-float="">
        <label slot="label">Search Anypoint Exchange</label>
        <iron-input slot="input">
          <input
            type="search"
            value="{{query::input}}"
            aria-label="Search for APIs in Anypoint Exchange"
            on-keydown="_searchKeydown"
            on-search="_searchHandler">
        </iron-input>
        <paper-icon-button title="Search" slot="suffix" icon="arc:search" on-click="updateSearch"></paper-icon-button>
      </paper-input-container>
    </div>
    <template is="dom-if" if="[[!authInitialized]]">
      <div class="connecting-info">
        <p>Connecting to Anypoint Exchange</p>
        <paper-progress indeterminate=""></paper-progress>
      </div>
    </template>
    <template is="dom-if" if="[[querying]]">
      <paper-progress indeterminate=""></paper-progress>
    </template>
    <template is="dom-if" if="[[dataUnavailable]]">
      <p class="empty-info">Couldn't find requested API.</p>
    </template>
    <section class="list" data-list\$="[[listView]]">
      <template is="dom-repeat" items="[[items]]" id="list">
        <template is="dom-if" if="[[!listView]]" restamp="true">
          <exchange-search-grid-item
            item="[[item]]"
            on-action-requested="_processItem"
            noink="[[noink]]"
            action-label="[[actionLabel]]"></exchange-search-grid-item>
        </template>
        <template is="dom-if" if="[[listView]]" restamp="true">
          <exchange-search-list-item
            item="[[item]]"
            on-action-requested="_processItem"
            noink="[[noink]]"
            action-label="[[actionLabel]]"></exchange-search-list-item>
        </template>
      </template>
    </section>
    <template is="dom-if" if="[[renderLoadMore]]">
      <div class="load-more">
        <paper-button raised="" class="action-button" on-click="queryCurrent">Load more</paper-button>
      </div>
    </template>
    <iron-ajax
      id="query"
      url="[[exchangeSearchUri]]"
      handle-as="json"
      on-response="_exchangeResponse"
      debounce-duration="300"
      params="[[queryParams]]"
      on-error="_exchangeResponseError"></iron-ajax>
    <paper-toast
      id="tokenExpired"
      text="You are logged out from the Exchange. Log in and try again."
      class="error-toast"></paper-toast>
    <paper-toast id="errorToast" class="error-toast"></paper-toast>

    <iron-media-query query="(min-width: 2200px)" query-matches="{{_mq2200}}"></iron-media-query>
    <iron-media-query query="(min-width: 2000px)" query-matches="{{_mq2000}}"></iron-media-query>
    <iron-media-query query="(min-width: 1900px)" query-matches="{{_mq1900}}"></iron-media-query>
    <iron-media-query query="(min-width: 1700px)" query-matches="{{_mq1700}}"></iron-media-query>
    <iron-media-query query="(min-width: 1400px)" query-matches="{{_mq1400}}"></iron-media-query>
    <iron-media-query query="(min-width: 756px)" query-matches="{{_mq756}}"></iron-media-query>
    <iron-media-query query="(min-width: 450px)" query-matches="{{_mq450}}"></iron-media-query>
`;
  }

  static get is() {
    return 'exchange-search-panel';
  }
  static get properties() {
    return {
      /**
       * Saved items restored from the datastore.
       */
      items: Array,
      // True when the element is querying the database for the data.
      querying: {
        type: Boolean,
        readOnly: true,
        notify: true
      },
      // Computed value, true if the `items` property has values.
      hasItems: {
        type: Boolean,
        computed: '_computeHasItems(items.length)',
        notify: true
      },
      /**
       * Computed value. True if query ended and there's no results.
       */
      dataUnavailable: {
        type: Boolean,
        computed: '_computeDataUnavailable(hasItems, querying)'
      },
      // Search query for the list.
      query: String,
      // True if the Grid view is active
      listView: {
        type: Boolean,
        value: false
      },
      /**
       * If true, the element will not produce a ripple effect when interacted
       * with via the pointer.
       */
      noink: Boolean,
      /**
       * Rows offset in the Exchange's query.
       */
      exchangeOffset: {
        type: Number,
        value: 0
      },
      /**
       * Limit of the results in single query to the Exchange's API.
       */
      exchangeLimit: {
        type: Number,
        value: 20
      },
      /**
       * Exchange's asset type to search.
       * Note that this also determines the title of panel unless you set
       * `panelTitle` property.
       */
      type: {
        type: String,
        value: 'rest-api',
        notify: true,
        observer: '_typeChanged'
      },
      /**
       * An URI to the endpoint with the search API.
       */
      exchangeSearchUri: {
        type: String,
        value: 'https://anypoint.mulesoft.com/exchange/api/v1/assets'
      },
      /**
       * Computed value of query parameters to be sent to Exchange's API
       */
      queryParams: {
        type: String,
        computed: '_computeQueryParams(type, exchangeLimit, exchangeOffset, query)'
      },
      /**
       * Use this to set panel title value. By default is uses `type`
       * property to determine the title. When this property is set the title
       * will always be as the value defined in this property regardless the value
       * of `type`.
       */
      panelTitle: String,
      /**
       * Computed value for the panel title.
       */
      _effectivePanelTitle: {
        type: String,
        computed: '_computePanelTitle(panelTitle, type)'
      },
      /**
       * Scrolling target used to determine when authomatically download
       * next results.
       *
       * By default it is `document.documentElement`
       */
      scrollTarget: {
        type: Object,
        value: function() {
          return this._defaultScrollTarget;
        }
      },
      /**
       * Padding in pixels that will trigget query to the Exchange server
       * when the user scrolls the list.
       */
      listOffsetTrigger: {
        type: Number,
        value: 120
      },
      /**
       * Set when no more results are available for current offset - limit
       * values.
       */
      noMoreResults: {
        type: Boolean,
        notify: true,
        value: false
      },
      // Computed value, if true then it renders "load more" button below the list
      renderLoadMore: {
        type: Boolean,
        computed: '_computeRenderLoadMore(querying,noMoreResults)'
      },
      /**
       * If true it renders authorize button.
       * Note that the hosting application has to handle `oauth2-token-requested`
       * custom event.
       * See `oauth-authorization/oauth2-authorization.html` element for
       * more info.
       */
      anypointAuth: {
        type: Boolean,
        observer: '_anypointAuthChanged'
      },
      /**
       * The `redirect_uri` parameter of the OAuth2 request.
       * It must be set when `anypointAuth` is true or otherwise it will throw an
       * error when trying to request the toekn.
       */
      exchangeRedirectUri: String,
      /**
       * Registered within the exchange client id for OAuth2 calls.
       * It must be set when `anypointAuth` is true or otherwise it will throw an
       * error when trying to request the toekn.
       */
      exchangeClientId: String,
      /**
       * User access token to authorize the requests in the exchange
       */
      accessToken: {
        type: String,
        observer: '_accessTokenChenged'
      },
      // Computed value, true when access token is set.
      signedIn: Boolean,
      /**
       * Forces `anypoint-signin` element to use ARC's OAuth events.
       */
      forceOauthEvents: Boolean,
      /**
       * Flag indicating the authorization process has been initialized
       */
      authInitialized: {
        type: Boolean,
        notify: true,
        value: false
      },
      /**
       * Label to display in main action button of a list item.
       * Default is `Download`.
       */
      actionLabel: String,
      /**
       * When set the component will not query the Exchange for assets when
       * attached to DOM or when authentication state change.
       */
      noAuto: Boolean,
      /**
       * Number of columns to render in "grid" view.
       * Set to `auto` to use media queries to determine pre set number of colum
       * depending on the screen size. It won't checks for element size so
       * do not use `auto` when embedding the element not as whole width
       * view.
       */
      columns: {
        type: Number,
        value: '4'
      },

      _mq2200: Boolean,
      _mq1900: Boolean,
      _mq2000: Boolean,
      _mq1700: Boolean,
      _mq1400: Boolean,
      _mq756: Boolean,
      _mq450: Boolean,

      _effectiveColumns: {
        type: Number,
        computed: '_computeColumns(columns, _mq2200, _mq2000, _mq1900, _mq1700, _mq1400, _mq756, _mq450)',
        observer: '_columnsChanged'
      },

      _isAttached: Boolean
    };
  }

  static get observers() {
    return [
      '_scrollTargetChanged(scrollTarget, _isAttached)'
    ];
  }

  constructor() {
    super();
    this._oauth2ErrorHandler = this._oauth2ErrorHandler.bind(this);
    this._oauth2SignedOut = this._oauth2SignedOut.bind(this);
    this._oauth2SignedIn = this._oauth2SignedIn.bind(this);
    this._onScroll = this._onScroll.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.anypointAuth) {
      this.authInitialized = true;
      if (!this.noAuto) {
        this.updateSearch();
      }
    }
    this._isAttached = true;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._isAttached = false;
  }

  /**
   * The default scroll target.
   *
   * @type {Element}
   */
  get _defaultScrollTarget() {
    return this._doc;
  }
  /**
   * Shortcut for the document element
   *
   * @type {Element}
   */
  get _doc() {
    return this.ownerDocument.documentElement;
  }

  _scrollTargetChanged(scrollTarget, isAttached) {
    if (this._oldScrollTarget) {
      const eventTarget = scrollTarget === this._doc ? window : scrollTarget;
      if (eventTarget.removeEventListener) {
        eventTarget.removeEventListener('scroll', this._onScroll);
      }
      this._oldScrollTarget = undefined;
    }
    if (!isAttached) {
      return;
    }
    if (scrollTarget === 'document') {
      this.scrollTarget = this._doc;
    } else if (typeof scrollTarget === 'string') {
      let rootNode = this._findRootTarget();
      if (rootNode && rootNode.querySelector) {
        this.scrollTarget = rootNode.querySelector('#' + scrollTarget);
      } else {
        this.scrollTarget = undefined;
      }
    } else {
      this._oldScrollTarget = scrollTarget;
      if (scrollTarget) {
        const eventTarget = scrollTarget === this._doc ? window : scrollTarget;
        eventTarget.addEventListener('scroll', this._onScroll);
      }
    }
  }
  /**
   * @return {Element} First in path element that has shadow root or
   * ownerDocument of this component.
   */
  _findRootTarget() {
    let target = this.parentNode;
    const doc = this.ownerDocument;
    while (true) {
      if (!target) {
        return doc;
      }
      if (target && target.shadowRoot) {
        return target;
      } else if (target && target.host) {
        return target.host.shadowRoot;
      } else if (target === doc) {
        return target;
      }
      target = target.parentNode;
    }
  }

  /**
   * Computes value for the `hasItems` property.
   * @param {Number} length
   * @return {Boolean}
   */
  _computeHasItems(length) {
    return !!(length);
  }

  _computeRenderLoadMore(querying, noMoreResults) {
    return !querying && !noMoreResults;
  }
  /**
   * Resets element state so it re-enables querying.
   */
  reset() {
    this.set('items', []);
    this.set('exchangeOffset', 0);
    this.noMoreResults = false;
    this._setQuerying(false);
  }

  // Handler for grid view button click
  _enableGrid() {
    if (this.listView) {
      this.listView = false;
    }
    const toggle = this.shadowRoot.querySelector('[data-action="grid-enable"]');
    if (!toggle.active) {
      toggle.active = true;
    }
  }
  // Handler for list view button click
  _enableList() {
    if (!this.listView) {
      this.listView = true;
    }
    const toggle = this.shadowRoot.querySelector('[data-action="list-enable"]');
    if (!toggle.active) {
      toggle.active = true;
    }
  }
  /**
   * Resets current list of results and makes a query to the Exchange server.
   * It will use current value of search query (which might be empty) to
   * search for an asset.
   */
  updateSearch() {
    this.reset();
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

  // Computes value for the `dataUnavailable` property.
  _computeDataUnavailable(hasItems, querying) {
    return !hasItems && !querying;
  }
  /**
   * Makes a query to the exchange server for more data.
   * It uses current `queryParams` to generate request.
   */
  queryCurrent() {
    if (this.querying) {
      return;
    }
    this._setQuerying(true);
    this.$.query.generateRequest();
  }

  _exchangeResponse(e) {
    const data = e.detail.response;
    if (!data || !data.length) {
      this.noMoreResults = true;
      this._setQuerying(false);
      return;
    }
    if (data.length < this.exchangeLimit) {
      this.noMoreResults = true;
    }
    let items = this.items || [];
    items = items.concat(data);
    this.exchangeOffset += data.length;
    this.set('items', items);
    this._setQuerying(false);
  }

  _exchangeResponseError(e) {
    this._setQuerying(false);
    if (e.detail.request.status === 401 && this.signedIn) {
      // token expored
      this.accessToken = undefined;
      this.$.tokenExpired.opened = true;
      this.signedIn = false;
      return;
    }
    this.$.errorToast.text = 'Unable to get data from Exchange.';
    this.$.errorToast.opened = true;
  }

  _computeQueryParams(type, limit, offset, query) {
    const params = {
      type: this._getTypes(type),
      limit: limit,
      offset: offset
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
   * Reacts to `scrollTarget` scroll event. If the scroll Y position to the
   * bottom of the list is less than `listOffsetTrigger` then it triggers
   * query function.
   *
   * Note, if `noMoreResults` flag is set it will never query for more data.
   * You have to manually clear the property.
   */
  _onScroll() {
    if (this.querying || this.noMoreResults) {
      return;
    }
    let st = this._oldScrollTarget;
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
    const item = e.model.get('item');
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
    this.$.errorToast.text = message;
    this.$.errorToast.opened = true;
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
    this.$.query.headers = headers;
  }
  /**
   * Updates width of the grid items when number of columens change
   *
   * @param {Number} value Current value of `columens` propert.
   */
  _columnsChanged(value) {
    this.updateStyles({
      '--exchange-search-grid-item-computed-width': (100/value) + '%'
    });
  }
  /**
   * Computes value for the panel title.
   * @param {?String} pageTitle Value of `pageTitle` property
   * @param {?String} type Current asset type
   * @return {String} Value for panel title.
   */
  _computePanelTitle(pageTitle, type) {
    if (pageTitle) {
      return pageTitle;
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
   * @return {Number}
   */
  _computeColumns(columns, m2200, m2000, m1900, m1700, m1400, m756, m450) {
    if (!isNaN(columns)) {
      return Number(columns);
    }
    switch (true) {
      case m2200: return 8;
      case m2000: return 7;
      case m1900: return 6;
      case m1700: return 5;
      case m1400: return 4;
      case m756: return 3;
      case m450: return 2;
      default: return 1;
    }
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
window.customElements.define(ExchangeSearchPanel.is, ExchangeSearchPanel);
