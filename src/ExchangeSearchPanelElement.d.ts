import { LitElement, TemplateResult, CSSResult } from 'lit-element';
import { AnypointSignedInErrorType, AnypointSignedOutType, AnypointSignedInType } from '@anypoint-web-components/anypoint-signin';
import { IronAjaxElement } from '@polymer/iron-ajax';
import { ExchangeAsset } from './types';

/** @typedef {import('@anypoint-web-components/anypoint-signin').AnypointSigninElement} AnypointSigninElement */
/** @typedef {import('./types').MediaQueryResult} MediaQueryResult */

export declare const assetsUri: string;
export declare const columnsValue: unique symbol;
export declare const attachMediaQueries: unique symbol;
export declare const detachMediaQueries: unique symbol;
export declare const mediaQueryHandler: unique symbol;
export declare const processMediaResult: unique symbol;
export declare const oauthCallback: unique symbol;
export declare const queryingValue: unique symbol;
export declare const notifyQuerying: unique symbol;
export declare const documentValue: unique symbol;
export declare const ajaxValue: unique symbol;
export declare const scrollHandler: unique symbol;
export declare const queryInputHandler: unique symbol;
export declare const queryKeydownHandler: unique symbol;
export declare const querySearchHandler: unique symbol;
export declare const computeColumns: unique symbol;
export declare const columnsValueLocal: unique symbol;
export declare const accessTokenValue: unique symbol;
export declare const typeValue: unique symbol;
export declare const typeChanged: unique symbol;
export declare const anypointAuthValue: unique symbol;
export declare const anypointAuthChanged: unique symbol;
export declare const listenOauth: unique symbol;
export declare const unlistenOauth: unique symbol;
export declare const itemActionHandler: unique symbol;
export declare const accessTokenChanged: unique symbol;
export declare const setupAuthHeaders: unique symbol;
export declare const notifyTokenExpired: unique symbol;
export declare const exchangeResponseError: unique symbol;
export declare const exchangeResponse: unique symbol;
export declare const enableGrid: unique symbol;
export declare const enableList: unique symbol;
export declare const signedInHandler: unique symbol;
export declare const accessTokenHandler: unique symbol;
export declare const authButtonTemplate: unique symbol;
export declare const headerTemplate: unique symbol;
export declare const searchTemplate: unique symbol;
export declare const busyTemplate: unique symbol;
export declare const listTemplate: unique symbol;
export declare const emptyTemplate: unique symbol;
export declare const renderItem: unique symbol;
export declare const renderGridItem: unique symbol;
export declare const renderListItem: unique symbol;
export declare const ratingTemplate: unique symbol;
export declare const itemIconTemplate: unique symbol;
export declare const actionButtonTemplate: unique symbol;

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
 * 
 * @fires queryingchange
 * @fires selected
 */
export class ExchangeSearchPanelElement extends LitElement {
  static get styles(): CSSResult;

  [columnsValue]: number;
  [columnsValueLocal]: number;
  [queryingValue]: boolean;

  /**
   * `true` when the element is querying the API for the data.
   */
  get querying(): boolean;

  /**
   * `true` if the `items` property has values.
   */
  get hasItems(): boolean;

  /**
   * `true` if query ended and there's no results.
   */
  get dataUnavailable(): boolean;

  get queryParams(): Record<string, any>;

  /**
   * Parses list of types to an array of types.
   * If the argument is array then it returns the same array.
   *
   * Note, this always returns array, even if the argument is empty.
   */
  get types(): string[];

  get effectivePanelTitle(): string;

  /**
   * When true then it renders "load more" button below the list
   */
  get renderLoadMore(): boolean;

  /**
   * Shortcut for the document element
   */
  get [documentValue](): HTMLElement;

  get [ajaxValue](): IronAjaxElement;

  /**
   * Saved items restored from the datastore.
   */
  items: ExchangeAsset[];
  /**
   * Search query for the list.
   * @attribute
   */
  query: string;
  /**
   * True if the Grid view is active
   * @attribute
   */
  listView: boolean;
  /**
   * Enables compatibility with Anypoint platform
   * @attribute
   */
  compatibility: boolean;
  /**
   * Enables material's outlined theme for inputs.
   * @attribute
   */
  outlined: boolean;
  /**
   * Rows offset in the Exchange's query.
   * @attribute
   */
  exchangeOffset: number;
  /**
   * Limit of the results in single query to the Exchange's API.
   * @attribute
   */
  exchangeLimit: number;
  /**
   * Exchange's asset type to search.
   * Note that this also determines the title of panel unless you set
   * `panelTitle` property.
   * @attribute
   */
  type: string;
  /**
   * Use this to set panel title value. By default is uses `type`
   * property to determine the title. When this property is set the title
   * will always be as the value defined in this property regardless the value
   * of `type`.
   * @attribute
   */
  panelTitle: string;
  /**
   * Padding in pixels that will trigger query to the Exchange server
   * when the user scrolls the list.
   * @attribute
   */
  listOffsetTrigger: number;
  /**
   * Set when no more results are available for current offset - limit
   * values.
   * @attribute
   */
  noMoreResults: boolean;
  /**
   * If true it renders the authorize button.
   * See `@anypoint-web-components/anypoint-signin` element for
   * more info.
   * @attribute
   */
  anypointAuth: boolean;
  /**
   * The `redirect_uri` parameter of the OAuth2 request.
   * It must be set when `anypointAuth` is true or otherwise it will throw an
   * error when trying to request the token.
   * @attribute
   */
  exchangeRedirectUri: string;
  /**
   * Registered within the exchange client id for OAuth2 calls.
   * It must be set when `anypointAuth` is true or otherwise it will throw an
   * error when trying to request the token.
   * @attribute
   */
  exchangeClientId: string;
  /**
   * User access token to authorize the requests in the exchange
   * @attribute
   */
  accessToken: string;
  /**
   * Computed value, true when access token is set.
   * @attribute
   */
  signedIn: boolean;
  /**
   * Forces `anypoint-signin` element to use ARC's OAuth events.
   * @attribute
   */
  forceOauthEvents: boolean;
  /**
   * Flag indicating the authorization process has been initialized
   * @attribute
   */
  authInitialized: boolean;
  /**
   * Label to display in main action button of a list item.
   * Default is `Download`.
   * @attribute
   */
  actionLabel: string;
  /**
   * When set the component will not query the Exchange for assets when
   * attached to DOM or when authentication state change.
   * @attribute
   */
  noAuto: boolean;
  /**
   * Number of columns to render in "grid" view.
   * Set to `auto` to use media queries to determine pre set number of colum
   * depending on the screen size. It won't checks for element size so
   * do not use `auto` when embedding the element not as whole width
   * view.
   * @attribute
   */
  columns: number|string;

  constructor();

  firstUpdated(args: Map<string | number | symbol, unknown>): void;

  connectedCallback(): void;

  disconnectedCallback(): void;

  [attachMediaQueries](): void;

  [detachMediaQueries](): void;

  /**
   * @param {MediaQueryResult[]} result 
   */
  [mediaQueryHandler](result): void;

  /**
   * @param {MediaQueryResult[]} result 
   */
  [processMediaResult](result): void;

  [notifyQuerying](): void;

  /**
   * Resets element state so it re-enables querying.
   */
  reset(): void;

  /**
   * Handler for grid view button click
   */
  [enableGrid](): void;

  /**
   * Handler for list view button click
   */
  [enableList](): void;

  /**
   * Resets current list of results and makes a query to the Exchange server.
   * It will use current value of search query (which might be empty) to
   * search for an asset.
   */
  updateSearch(): Promise<void>;

  [queryKeydownHandler](e: KeyboardEvent): void;

  [querySearchHandler](e: Event): void;

  /**
   * Makes a query to the exchange server for more data.
   * It uses current `queryParams` to generate request.
   */
  queryCurrent(): void;

  [exchangeResponse](e: CustomEvent): void;

  [exchangeResponseError](e: CustomEvent): void;

  /**
   * Dispatches the `tokenexpired` event
   */
  [notifyTokenExpired](): void;

  /**
   * Reacts to `scrollTarget` scroll event. If the scroll Y position to the
   * bottom of the list is less than `listOffsetTrigger` then it triggers
   * query function.
   *
   * Note, if `noMoreResults` flag is set it will never query for more data.
   * You have to manually clear the property.
   */
  [scrollHandler](e: Event): void;

  /**
   * Dispatches non-bubbling `selected` event with the selected item on the detail.
   */
  [itemActionHandler](e: CustomEvent): void;

  [anypointAuthChanged](state: boolean): void;

  [listenOauth](): void;

  [unlistenOauth](): void;

  [oauthCallback](): void;

  /**
   * Calls `[setupAuthHeaders]()` function when token value change.
   */
  [accessTokenChanged](token?: string, old?: string): void;

  /**
   * Sets up authorization headers on `iron-request` element if the token
   * is available or clears headers if not.
   *
   * @param token Oauth 2 token value for Anypoint.
   */
  [setupAuthHeaders](token?: string): void;

  [typeChanged](old?: string): void;

  /**
   * Computes an effective value of `columns` property.
   * If first argument is a number this will be used as a number of columns.
   * Otherwise it uses media queries to determine the sate.
   */
  [computeColumns](): void;

  [signedInHandler](e: Event): void;

  [accessTokenHandler](e: Event): void;

  [queryInputHandler](e: Event): void;

  render(): TemplateResult;

  /**
   * @returns The template for the element's header 
   */
  [headerTemplate](): TemplateResult;

  /**
   * @returns The template for authorization button
   */
  [authButtonTemplate](): TemplateResult;

  /**
   * @returns The template for the search input
   */
  [searchTemplate](): TemplateResult;

  /**
   * @returns The template for the loader
   */
  [busyTemplate](): TemplateResult|string;

  /**
   * @returns The template for the empty search result
   */
  [emptyTemplate](): TemplateResult;

  /**
   * @returns The template for the results list
   */
  [listTemplate](): TemplateResult;

  [renderItem](listView: boolean, item: ExchangeAsset, index: number): TemplateResult;

  [renderListItem](item: ExchangeAsset, index: number): TemplateResult;

  [renderGridItem](item: ExchangeAsset, index: number): TemplateResult;

  /**
   * @returns Template for the rating element
   */
  [ratingTemplate](item: ExchangeAsset): TemplateResult;

  /**
   * @returns The template for the asset's icon
   */
  [itemIconTemplate](item: ExchangeAsset): TemplateResult;

  /**
   * @returns Template for the action button
   */
  [actionButtonTemplate](index: number): TemplateResult;
}
