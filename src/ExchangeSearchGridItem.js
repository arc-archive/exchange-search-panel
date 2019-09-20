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
import { ExchangeListItemBase } from './ExchangeListItemBase.js';

export class ExchangeSearchGridItem extends ExchangeListItemBase {
  static get styles() {
    return css`
    :host {
      display: block;
      color: var(--exchange-search-panel-item-card-color, inherit);
      background-color: var(--exchange-search-panel-item-background-color, inherit);
    }

    .name {
      font-size: var(--arc-font-subhead-font-size);
      font-weight: var(--arc-font-subhead-font-weight);
      line-height: var(--arc-font-subhead-line-height);
      padding: 0;
      margin: 0;
    }

    .title {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
    }

    .card {
      min-width: 140px;
      padding: 12px;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      border: 1px #e5e5e5 solid;
      border-radius: 3px;
    }

    .content {
      flex: 1;
    }

    .creator {
      color: var(--exchange-search-list-item-author-color, rgba(0, 0, 0, 0.64));
    }

    star-rating {
      display: inline-block;
    }

    .thumb {
      display: block;
      min-width: 40px;
      width: 40px;
      height: 40px;
      margin-right: 8px;
      background-size: cover;
    }

    .default-icon {
      display: block;
      min-width: 40px;
      width: 40px;
      height: 40px;
      fill: currentColor;
    }
    `;
  }

  render() {
    const item = this.item || {};
    return html`
    <div class="card">
      <section class="content">
        <div class="title">
          ${this._itemIconTemplate()}
          <div class="name">${item.name}</div>
        </div>
        <p class="creator">by ${item.organization.name}</p>
        <div class="rating">
          ${this._ratingTemplate()}
        </div>
      </section>
      <div class="actions">
        ${this._actionButtonTemplate()}
      </div>
    </div>`;
  }
}
