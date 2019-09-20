/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   src/ExchangeSearchPanel.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {LitElement, html} from 'lit-element';

export {ExchangeSearchPanel};

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
   */
  class ExchangeSearchPanel extends LitElement {
    readonly querying: Boolean|null;

    /**
     * True when the element is querying the database for the data.
     */
    _querying: boolean|null|undefined;
    readonly hasItems: Boolean|null;
    readonly dataUnavailable: Boolean|null;
    readonly queryParams: any;
    readonly _effectivePanelTitle: any;
    readonly renderLoadMore: Boolean|null;

    /**
     * Shortcut for the document element
     */
    readonly _doc: any;

    /**
     * Exchange's asset type to search.
     * Note that this also determines the title of panel unless you set
     * `panelTitle` property.
     */
    type: String|Array<String|null>|null;

    /**
     * If true it renders authorize button.
     * Note that the hosting application has to handle `oauth2-token-requested`
     * custom event.
     * See `@anypoint-web-components/anypoint-signin` element for
     * more info.
     */
    anypointAuth: boolean|null|undefined;

    /**
     * User access token to authorize the requests in the exchange
     */
    accessToken: string|null|undefined;

    /**
     * Number of columns to render in "grid" view.
     * Set to `auto` to use media queries to determine pre set number of colum
     * depending on the screen size. It won't checks for element size so
     * do not use `auto` when embedding the element not as whole width
     * view.
     */
    columns: number|null|undefined;
    readonly _query: any;

    /**
     * Saved items restored from the datastore.
     */
    items: any[]|null|undefined;

    /**
     * Search query for the list.
     */
    query: string|null|undefined;

    /**
     * True if the Grid view is active
     */
    listView: boolean|null|undefined;

    /**
     * Enables compatibility with Anypoint platform
     */
    compatibility: boolean|null|undefined;

    /**
     * Enables material's outlined theme for inputs.
     */
    outlined: boolean|null|undefined;

    /**
     * Rows offset in the Exchange's query.
     */
    exchangeOffset: number|null|undefined;

    /**
     * Limit of the results in single query to the Exchange's API.
     */
    exchangeLimit: number|null|undefined;

    /**
     * Use this to set panel title value. By default is uses `type`
     * property to determine the title. When this property is set the title
     * will always be as the value defined in this property regardless the value
     * of `type`.
     */
    panelTitle: string|null|undefined;

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
    constructor();
    firstUpdated(): void;
    render(): any;

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
    updateSearch(): any;
    _searchKeydown(e: any): void;
    _searchHandler(e: any): void;

    /**
     * Makes a query to the exchange server for more data.
     * It uses current `queryParams` to generate request.
     */
    queryCurrent(): void;
    _exchangeResponse(e: any): void;
    _exchangeResponseError(e: any): void;
    _notifyTokenExpired(): void;

    /**
     * Reacts to `scrollTarget` scroll event. If the scroll Y position to the
     * bottom of the list is less than `listOffsetTrigger` then it triggers
     * query function.
     *
     * Note, if `noMoreResults` flag is set it will never query for more data.
     * You have to manually clear the property.
     */
    _onScroll(e: Event|null): void;

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
    _typeChanged(value: any, old: any): void;

    /**
     * Computes an effective value of `columns` property.
     * If first argument is a number this will be used as a number of columns.
     * Otherwise it uses media queries to determine the sate.
     */
    _computeColumns(): void;
    _mqHandler(e: any): void;
    _headerTemplate(): any;
    _signedInHandler(e: any): void;
    _atHandler(e: any): void;
    _queryHandler(e: any): void;
    _authButtonTemplate(): any;
    _searchTemplate(): any;
    _busyTemplate(): any;
    _emptyTemplate(): any;
    _listTemplate(): any;
    _renderItem(listView: any, item: any, index: any, compatibility: any): any;
    _renderListItem(item: any, index: any, compatibility: any): any;
    _renderGridItem(item: any, index: any, compatibility: any): any;
  }
}
