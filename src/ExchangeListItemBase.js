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
import '@advanced-rest-client/star-rating/star-rating.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import { exchange } from './icons.js';

export class ExchangeListItemBase extends LitElement {
  static get properties() {
    return {
      /**
       * REST API index datastore object
       */
      item: { type: Object },
      /**
       * Main action button of an item.
       */
      actionLabel: { type: String },
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.actionLabel = 'Download';
    this.compatibility = false;
    this.item = undefined;
  }

  /**
   * Dispatches the `download` custom event to inform the panel
   * about user action.
   */
  requestAction() {
    this.dispatchEvent(new CustomEvent('action'));
  }

  _ratingTemplate() {
    const item = this.item || {};
    const value = item.rating || 0;
    return html`<star-rating
      .value="${item.rating}"
      readonly
      title="Api rating: ${value}/5"
      tabindex="-1"
    ></star-rating>`;
  }

  _itemIconTemplate() {
    const { item = {} } = this;
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

  _actionButtonTemplate() {
    const {
      compatibility,
      actionLabel
    } = this;
    return html`
    <anypoint-button
      ?compatibility="${compatibility}"
      @click="${this.requestAction}"
      class="open-button"
    >${actionLabel}</anypoint-button>`;
  }
}
