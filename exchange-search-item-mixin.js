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
import {dedupingMixin} from '../../@polymer/polymer/lib/utils/mixin.js';
/**
 * A common properties and methods for exchange view list/grid items
 *
 * @polymer
 * @mixinFunction
 * @memberof ArcMixins
 */
export const ExchangeSearchItemMixin = dedupingMixin((base) => {
  /**
   * @polymer
   * @mixinClass
   */
  class ESImixin extends base {
    static get properties() {
      return {
        /**
         * REST API index datastore object
         */
        item: Object,
        /**
         * If true, the element will not produce a ripple effect when interacted
         * with via the pointer.
         */
        noink: Boolean,
        /**
         * Main action button of an item.
         */
        actionLabel: {
          type: String,
          value: 'Download'
        },
        /**
         * A default icon to render if the asset is missing an icon.
         */
        defaultIcon: String
      };
    }
    // Computes value for `iron-icon` src property from current item.
    _computeIconSrc(item) {
      if (!item || !item.icon) {
        return;
      }
      return item.icon;
    }
    // Computes value for `iron-icon` icon property from current item.
    _computeIconIcon(item) {
      if (item && item.icon) {
        return;
      }
      return this.defaultIcon; // 'arc:raml-r';
    }
    /**
     * Dispatches the `download` custom event to inform the panel
     * about user action.
     */
    requestAction() {
      this.dispatchEvent(new CustomEvent('action-requested'));
    }
    /**
     * Dispatched when the user requested to download the API.
     *
     * The event does not bubble.
     *
     * @event action-requested
     */
  }
  return ESImixin;
});
