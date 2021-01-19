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
import { css, html } from 'lit-element';
import '@anypoint-web-components/anypoint-item/anypoint-icon-item.js';
import '@anypoint-web-components/anypoint-item/anypoint-item-body.js';
import { ExchangeListItemBase } from './ExchangeListItemBase.js';
/**
 * `<exchange-search-list-item>` Displays a single list item for Exchange search results panel.
 *
 * ### Example
 *
 * ```html
 * <exchange-search-list-item item="{...}" @download="..."></exchange-search-list-item>
 * ```
 */
export class ExchangeSearchListItem extends ExchangeListItemBase {
  static get styles() {
    return css`:host {
      display: block;
      color: var(--exchange-search-panel-item-card-color, inherit);
      background-color: var(--exchange-search-panel-item-background-color, inherit);
    }

    .name {
      font-size: 16px;
      font-weight: 400;
      padding: 0;
      margin: 0;
      display: inline-block;
      margin-right: 16px;
      -webkit-margin-before: 0.35em;
    }

    .meta {
      margin: 0;
      padding: 0;
      margin-right: 12px;
    }

    .details {
      display: flex;
      flex-direction: row;
    }

    .top-line {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .creator {
      color: var(--exchange-search-list-item-author-color, rgba(0, 0, 0, 0.64));
    }

    star-rating {
      display: inline-block;
    }

    .thumb {
      display: block;
      width: 36px;
      height: 36px;
      background-size: cover;
    }

    .default-icon {
      display: block;
      width: 36px;
      height: 36px;
      fill: currentColor;
    }`;
  }

  render() {
    const item = this.item || {};
    return html`<anypoint-icon-item>
      ${this._itemIconTemplate()}
      <anypoint-item-body twoline>
        <div class="top-line">
          <div class="name">${item.name}</div>
          ${this._ratingTemplate()}
        </div>
        <div secondary class="details">
          <p class="meta creator">by ${item.organization.name}</p>
        </div>
      </anypoint-item-body>
      ${this._actionButtonTemplate()}
    </anypoint-icon-item>`;
  }
}
