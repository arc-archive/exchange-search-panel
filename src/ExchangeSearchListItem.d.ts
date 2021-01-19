import {CSSResult, TemplateResult} from 'lit-element';
import {ExchangeListItemBase} from './ExchangeListItemBase.js';

/**
 * `<exchange-search-list-item>` Displays a single list item for Exchange
 * search rersults panel.
 *
 * ### Example
 *
 * ```html
 * <exchange-search-list-item item="{...}" @download="..."></exchange-search-list-item>
 * ```
 */
export declare class ExchangeSearchListItem extends ExchangeListItemBase {
  static get styles(): CSSResult;
  render(): TemplateResult;
}