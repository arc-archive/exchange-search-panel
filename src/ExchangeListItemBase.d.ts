import {LitElement, TemplateResult} from 'lit-element';

export {ExchangeListItemBase};

/**
 * @fires action
 */
declare class ExchangeListItemBase extends LitElement {
  constructor();
  /**
   * REST API index datastore object
   */
  item: any;
  /**
   * Main action button of an item.
   * @attribute
   */
  actionLabel: string;
  /**
   * Enables compatibility with Anypoint platform
   * @attribute
   */
  compatibility: boolean;

  /**
   * Dispatches the `download` custom event to inform the panel
   * about user action.
   */
  requestAction(): void;
  _ratingTemplate(): TemplateResult;
  _itemIconTemplate(): TemplateResult;
  _actionButtonTemplate(): TemplateResult;
}
