/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   exchange-search-panel.html
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../paper-toast/paper-toast.d.ts" />
/// <reference path="../paper-progress/paper-progress.d.ts" />
/// <reference path="../paper-button/paper-button.d.ts" />
/// <reference path="../arc-icons/arc-icons.d.ts" />
/// <reference path="../paper-icon-button/paper-icon-button.d.ts" />
/// <reference path="../paper-input/paper-input-container.d.ts" />
/// <reference path="../iron-input/iron-input.d.ts" />
/// <reference path="../iron-flex-layout/iron-flex-layout.d.ts" />
/// <reference path="../iron-ajax/iron-ajax.d.ts" />
/// <reference path="../anypoint-signin/anypoint-signin.d.ts" />
/// <reference path="../iron-media-query/iron-media-query.d.ts" />
/// <reference path="exchange-search-grid-item.d.ts" />
/// <reference path="exchange-search-list-item.d.ts" />

declare namespace UiElements {

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
   */
  class ExchangeSearchPanel extends Polymer.Element {

    /**
     * The default scroll target.
     */
    readonly _defaultScrollTarget: any;

    /**
     * Shortcut for the document element
     */
    readonly _doc: any;

    /**
     * Saved items restored from the datastore.
     */
    items: any[]|null|undefined;

    /**
     * True when the element is querying the database for the data.
     */
    readonly querying: boolean|null|undefined;

    /**
     * Computed value, true if the `items` property has values.
     */
    readonly hasItems: boolean|null|undefined;

    /**
     * Computed value. True if query ended and there's no results.
     */
    readonly dataUnavailable: boolean|null|undefined;

    /**
     * Search query for the list.
     */
    query: string|null|undefined;

    /**
     * True if the Grid view is active
     */
    listView: boolean|null|undefined;

    /**
     * If true, the element will not produce a ripple effect when interacted
     * with via the pointer.
     */
    noink: boolean|null|undefined;

    /**
     * Rows offset in the Exchange's query.
     */
    exchangeOffset: number|null|undefined;

    /**
     * Limit of the results in single query to the Exchange's API.
     */
    exchangeLimit: number|null|undefined;

    /**
     * Exchange's asset type to search.
     * Note that this also determines the title of panel unless you set
     * `panelTitle` property.
     */
    type: string|null|undefined;

    /**
     * An URI to the endpoint with the search API.
     */
    exchangeSearchUri: string|null|undefined;

    /**
     * Computed value of query parameters to be sent to Exchange's API
     */
    readonly queryParams: string|null|undefined;

    /**
     * Use this to set panel title value. By default is uses `type`
     * property to determine the title. When this property is set the title
     * will always be as the value defined in this property regardless the value
     * of `type`.
     */
    panelTitle: string|null|undefined;

    /**
     * Computed value for the panel title.
     */
    readonly _effectivePanelTitle: string|null|undefined;

    /**
     * Scrolling target used to determine when authomatically download
     * next results.
     *
     * By default it is `document.documentElement`
     */
    scrollTarget: object|null|undefined;

    /**
     * Padding in pixels that will trigget query to the Exchange server
     * when the user scrolls the list.
     */
    listOffsetTrigger: number|null|undefined;

    /**
     * Set when no more results are available for current offset - limit
     * values.
     */
    noMoreResults: boolean|null|undefined;

    /**
     * Computed value, if true then it renders "load more" button below the list
     */
    readonly renderLoadMore: boolean|null|undefined;

    /**
     * If true it renders authorize button.
     * Note that the hosting application has to handle `oauth2-token-requested`
     * custom event.
     * See `oauth-authorization/oauth2-authorization.html` element for
     * more info.
     */
    anypointAuth: boolean|null|undefined;

    /**
     * The `redirect_uri` parameter of the OAuth2 request.
     * It must be set when `anypointAuth` is true or otherwise it will throw an
     * error when trying to request the toekn.
     */
    exchangeRedirectUri: string|null|undefined;

    /**
     * Registered within the exchange client id for OAuth2 calls.
     * It must be set when `anypointAuth` is true or otherwise it will throw an
     * error when trying to request the toekn.
     */
    exchangeClientId: string|null|undefined;

    /**
     * User access token to authorize the requests in the exchange
     */
    accessToken: string|null|undefined;

    /**
     * Computed value, true when access token is set.
     */
    signedIn: boolean|null|undefined;

    /**
     * Forces `anypoint-signin` element to use ARC's OAuth events.
     */
    forceOauthEvents: boolean|null|undefined;

    /**
     * Flag indicating the authorization process has been initialized
     */
    authInitialized: boolean|null|undefined;

    /**
     * Label to display in main action button of a list item.
     * Default is `Download`.
     */
    actionLabel: string|null|undefined;

    /**
     * When set the component will not query the Exchange for assets when
     * attached to DOM or when authentication state change.
     */
    noAuto: boolean|null|undefined;

    /**
     * Number of columns to render in "grid" view.
     * Set to `auto` to use media queries to determine pre set number of colum
     * depending on the screen size. It won't checks for element size so
     * do not use `auto` when embedding the element not as whole width
     * view.
     */
    columns: number|null|undefined;
    _mq2200: boolean|null|undefined;
    _mq1900: boolean|null|undefined;
    _mq2000: boolean|null|undefined;
    _mq1700: boolean|null|undefined;
    _mq1400: boolean|null|undefined;
    _mq756: boolean|null|undefined;
    _mq450: boolean|null|undefined;
    readonly _effectiveColumns: number|null|undefined;
    _isAttached: boolean|null|undefined;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _scrollTargetChanged(scrollTarget: any, isAttached: any): void;

    /**
     * @returns First in path element that has shadow root or
     * ownerDocument of this component.
     */
    _findRootTarget(): Element|null;

    /**
     * Computes value for the `hasItems` property.
     */
    _computeHasItems(length: Number|null): Boolean|null;
    _computeRenderLoadMore(querying: any, noMoreResults: any): any;

    /**
     * Resets element state so it re-enables querying.
     */
    reset(): void;

    /**
     * Handler for grid view button click
     */
    _enableGrid(): void;

    /**
     * Handler for list view button click
     */
    _enableList(): void;

    /**
     * Resets current list of results and makes a query to the Exchange server.
     * It will use current value of search query (which might be empty) to
     * search for an asset.
     */
    updateSearch(): void;
    _searchKeydown(e: any): void;
    _searchHandler(e: any): void;

    /**
     * Computes value for the `dataUnavailable` property.
     */
    _computeDataUnavailable(hasItems: any, querying: any): any;

    /**
     * Makes a query to the exchange server for more data.
     * It uses current `queryParams` to generate request.
     */
    queryCurrent(): void;
    _exchangeResponse(e: any): void;
    _exchangeResponseError(e: any): void;
    _computeQueryParams(type: any, limit: any, offset: any, query: any): any;

    /**
     * Parses list of types to an array of types.
     * If the argument is array then it returns the same array.
     *
     * Note, this always returns array, even if the argument is empty.
     *
     * @param type Coma separated list of asset types.
     * Whitespaces are trimmed.
     * @returns List of asset types.
     */
    _getTypes(type: String|any[]|null): Array<String|null>|null;

    /**
     * Reacts to `scrollTarget` scroll event. If the scroll Y position to the
     * bottom of the list is less than `listOffsetTrigger` then it triggers
     * query function.
     *
     * Note, if `noMoreResults` flag is set it will never query for more data.
     * You have to manually clear the property.
     */
    _onScroll(): void;

    /**
     * Dispatches `process-exchange-asset-data` when list item's
     * `on-main-action-requested` custom event is handled.
     */
    _processItem(e: CustomEvent|null): void;
    _anypointAuthChanged(state: any): void;
    _listenOauth(): void;
    _unlistenOauth(): void;
    _oauth2ErrorHandler(e: any): void;

    /**
     * Handles `anypoint-signin-aware-signed-out` custom event.
     * Handled when the user is signed out.
     */
    _oauth2SignedOut(): void;

    /**
     * Handles `anypoint-signin-aware-success` - the success - Anypoint
     * sign in custom event. Updates search items for logged in user.
     */
    _oauth2SignedIn(): void;

    /**
     * Calls `_setupAuthHeaders()` function when token value change.
     */
    _accessTokenChenged(token: String|null|undefined, old: String|null|undefined): void;

    /**
     * Sets up authorization headers on `iron-request` element if the token
     * is available or clears headers if not.
     *
     * @param token Oauth 2 token value for Anypoint.
     */
    _setupAuthHeaders(token: String|null): void;

    /**
     * Updates width of the grid items when number of columens change
     *
     * @param value Current value of `columens` propert.
     */
    _columnsChanged(value: Number|null): void;

    /**
     * Computes value for the panel title.
     *
     * @param pageTitle Value of `pageTitle` property
     * @param type Current asset type
     * @returns Value for panel title.
     */
    _computePanelTitle(pageTitle: String|null, type: String|null): String|null;
    _typeChanged(value: any, old: any): void;

    /**
     * Computes an effective value of `columns` property.
     * If first argument is a number this will be used as a number of columns.
     * Otherwise it uses media queries to determine the sate.
     *
     * @param columns Number of columens to use or auto to compute the value.
     */
    _computeColumns(columns: String|Number|null, m2200: Boolean|null, m2000: Boolean|null, m1900: Boolean|null, m1700: Boolean|null, m1400: Boolean|null, m756: Boolean|null, m450: Boolean|null): Number|null;
  }
}

interface HTMLElementTagNameMap {
  "exchange-search-panel": UiElements.ExchangeSearchPanel;
}
