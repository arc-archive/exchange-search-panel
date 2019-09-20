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
import '@advanced-rest-client/star-rating/star-rating.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import { exchange } from './icons.js';

export class ExchangeListItemBase extends LitElement {
  static get properties() {
    return {
      /**
       * REST API index datastore object
       */
      item: { type: Object },
      /**
       * If true, the element will not produce a ripple effect when interacted
       * with via the pointer.
       */
      noink: { type: Boolean },
      /**
       * Main action button of an item.
       */
      actionLabel: { type: String },
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.actionLabel = 'Download';
  }

  /**
   * Dispatches the `download` custom event to inform the panel
   * about user action.
   */
  requestAction() {
    this.dispatchEvent(new CustomEvent('action-requested'));
  }

  _ratingTemplate() {
    const item = this.item || {};
    const value = item.rating || 0;
    return html`<star-rating
      .rating="${item.rating}"
      readonly
      title="Api raiting: ${value}/5"
      tabindex="-1"
    ></star-rating>`;
  }

  _itemIconTemplate() {
    const map = {};
    const item = this.item || {};
    if (item.icon) {
      map.backgroundImage = `url('${item.icon}')`;
    } else {
      return html`<span class="default-icon thumb" slot="item-icon">${exchange}</span>`;
    }
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
  /**
   * Dispatched when the user requested to download the API.
   *
   * The event does not bubble.
   *
   * @event action-requested
   */
}
