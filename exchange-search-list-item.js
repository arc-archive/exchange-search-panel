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
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@polymer/paper-styles/shadow.js';
import '../../@polymer/paper-button/paper-button.js';
import '../../@polymer/iron-icon/iron-icon.js';
import '../../@polymer/paper-item/paper-item.js';
import '../../@polymer/paper-item/paper-icon-item.js';
import '../../@polymer/paper-item/paper-item-body.js';
import '../../@advanced-rest-client/star-rating/star-rating.js';
import {ExchangeSearchItemMixin} from './exchange-search-item-mixin.js';
/**
 * `<exchange-search-list-item>` Displays a single list item for Exchange
 * search rersults panel.
 *
 * ### Example
 *
 * ```html
 * <exchange-search-list-item item="{...}" on-download="..."></exchange-search-list-item>
 * ```
 *
 * ### Styling
 *
 * `<exchange-search-list-item>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--exchange-search-list-item` | Mixin applied to the element | `{}`
 * `--exchange-search-list-item-action-button` | Mixin applied to the visible accrion button | `{}`
 * `--exchange-search-list-item-card-background-color` | Background color of the card item | `#fff`
 * `--rating-icon-color` | Color of the rating icons when highlighted | `--primary-text-color`
 * `--rating-unselected-opacity` | Color of the rating icons when not highlighted | `0.4`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @appliesMixin ExchangeSearchItemMixin
 * @memberof UiElements
 */
class ExchangeSearchListItem extends ExchangeSearchItemMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      @apply --arc-font-body1;
      display: block;
      color: var(--exchange-search-panel-item-card-color, inherit);
      background-color: var(--exchange-search-panel-item-background-color, #fff);
      @apply --exchange-search-list-item;
    }

    h3 {
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

    .api-icon {
      color: var(--raml-icon-color, #73cfee);
    }

    .open-button {
      @apply --exchange-search-list-item-action-button;
    }

    .open-button:hover {
      @apply --exchange-search-list-item-action-button-hover;
    }

    .details {
      @apply --layout-horizontal;
    }

    .top-line {
      @apply --layout-horizontal;
      @apply --layout-center;
    }

    .creator {
      color: var(--exchange-search-list-item-author-color, rgba(0, 0, 0, 0.64));
    }

    .tags-line {
      overflow: hidden;
      @apply --layout-horizontal;
      @apply --layout-center;
    }

    .tag-label,
    .tag-value {
      display: block;
    }

    .tag-value {
      text-overflow: ellipsis;
      overflow: hidden;
      margin-left: 8px;
    }

    star-rating {
      --iron-icon-height: 20px;
      --iron-icon-width: 20px;
      display: inline-block;
    }
    </style>
    <paper-icon-item>
      <iron-icon
        icon="[[_computeIconIcon(item)]]"
        slot="item-icon"
        class="api-icon"
        src="[[_computeIconSrc(item)]]"></iron-icon>
      <paper-item-body two-line="">
        <div class="top-line">
          <h3>[[item.name]]</h3>
          <star-rating rating="[[item.rating]]" read-only="" title\$="Api raiting: [[item.rating]]/5"></star-rating>
        </div>
        <div secondary="" class="details">
          <p class="meta creator">by [[item.organization.name]]</p>
          <template is="dom-if" if="[[hasTags]]">
            <p class="meta tags-line">
              <span class="tag-label">Tags:</span>
              <span class="tag-value">[[tags]]</span>
            </p>
          </template>
        </div>
      </paper-item-body>
      <paper-button noink="[[noink]]" on-tap="requestAction" class="open-button">[[actionLabel]]</paper-button>
    </paper-icon-item>
`;
  }
}
window.customElements.define('exchange-search-list-item', ExchangeSearchListItem);
