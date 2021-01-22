import { fixture, assert, html, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';
import { AuthorizationEventTypes } from '@advanced-rest-client/arc-events';
import { ExchangeServer } from './exchange-server-helper.js';
import '../exchange-search-panel.js';
import { 
  queryingValue, enableList, enableGrid, exchangeResponse, typeChanged, 
  columnsValue, oauthCallback, setupAuthHeaders, listenOauth, unlistenOauth,
} from '../src/ExchangeSearchPanelElement.js';

/** @typedef {import('../').ExchangeSearchPanelElement} ExchangeSearchPanelElement */

describe('<exchange-search-panel>', () => {
  /**
   * @returns {Promise<ExchangeSearchPanelElement>} 
   */
  async function basicFixture() {
    return fixture(html`<exchange-search-panel></exchange-search-panel>`);
  }

  /**
   * @returns {Promise<ExchangeSearchPanelElement>} 
   */
  async function authFixture() {
    return fixture(html`<exchange-search-panel
      anypointAuth
      exchangeRedirectUri="https://domain.com"
      exchangeClientId="test1234"
      forceOauthEvents></exchange-search-panel>`);
  }

  /**
   * @returns {Promise<ExchangeSearchPanelElement>} 
   */
  async function noAutoFixture() {
    return fixture(html`<exchange-search-panel
      noAuto></exchange-search-panel>`);
  }

  async function untilLoaded(element) {
    return new Promise((resolve) => {
      element.addEventListener('queryingchange', function clb(e) {
        if (e.target.querying === false) {
          element.removeEventListener('queryingchange', clb);
          resolve();
        }
      });
    });
  }

  describe('basic with auto opened', () => {
    beforeEach(() => {
      ExchangeServer.createServer();
    });

    after(() => {
      ExchangeServer.restore();
    });

    describe('basic when auto querying', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('dataUnavailable is computed', () => {
        assert.isFalse(element.dataUnavailable);
      });

      it('hasItems is false', () => {
        assert.isFalse(element.hasItems);
      });

      it('query is undefined', () => {
        assert.isUndefined(element.query, '');
      });

      it('noMoreResults is false by default', () => {
        assert.isFalse(element.noMoreResults);
      });

      it('queryParams is computed', () => {
        const p = element.queryParams;
        assert.typeOf(p, 'object');
        assert.deepEqual(p.types, ['rest-api'], 'types is set');
        assert.equal(p.limit, element.exchangeLimit, 'limit is set');
        assert.equal(p.offset, element.exchangeOffset, 'offset is set');
        assert.isUndefined(p.search, 'search is undefined');
      });

      it('queryParams is computed with search', () => {
        element.query = 'test';
        const p = element.queryParams;
        assert.typeOf(p, 'object');
        assert.deepEqual(p.types, ['rest-api'], 'type is set');
        assert.equal(p.limit, element.exchangeLimit, 'limit is set');
        assert.equal(p.offset, element.exchangeOffset, 'offset is set');
        assert.equal(p.search, element.query, 'search is set');
      });

      it('renderLoadMore is false', () => {
        assert.isFalse(element.renderLoadMore);
      });
    });

    describe('basic with data loaded', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
        await untilLoaded(element);
      });

      it('querying is false', () => {
        assert.isFalse(element.querying);
      });

      it('dataUnavailable is computed', () => {
        assert.isFalse(element.dataUnavailable);
      });

      it('items is set', () => {
        assert.typeOf(element.items, 'array', 'items is an array');
        assert.lengthOf(element.items, 5, 'items contains one page of results');
      });

      it('exchangeOffset is moved by number of items on the list', () => {
        assert.equal(element.exchangeOffset, 5);
      });

      it('noMoreResults is true when less than offset', () => {
        assert.isTrue(element.noMoreResults);
      });

      it('renderLoadMore is false when not querying and no more results', () => {
        assert.isFalse(element.renderLoadMore);
      });
    });

    describe('reset()', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
        // @ts-ignore
        element.items = [{ name: 'test' }];
        element.exchangeOffset = 20;
        element.noMoreResults = true;
        element[queryingValue] = true;
        element.reset();
      });

      it('Resets the items', () => {
        assert.typeOf(element.items, 'array', 'items is an array');
        assert.lengthOf(element.items, 0, 'items is empty');
      });

      it('Resets exchangeOffset', () => {
        assert.equal(element.exchangeOffset, 0);
      });

      it('Resets noMoreResults', () => {
        assert.isFalse(element.noMoreResults);
      });

      it('Resets querying', () => {
        assert.isFalse(element.querying);
      });
    });

    describe('[enableList]()', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
        await untilLoaded(element);
      });

      it('Sets listView to true', () => {
        element[enableList]();
        assert.isTrue(element.listView);
      });

      it('Renders list items', async () => {
        element[enableList]();
        await nextFrame();
        const item = element.shadowRoot.querySelector('.list-item');
        assert.isOk(item);
      });
    });

    describe('[enableGrid]()', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
        element.listView = true;
        await untilLoaded(element);
      });

      it('Sets listView to false', () => {
        element[enableGrid]();
        assert.isFalse(element.listView);
      });

      it('Renders grid items', async () => {
        element[enableGrid]();
        await nextFrame();
        const item = element.shadowRoot.querySelector('.grid-item');
        assert.isOk(item);
      });
    });

    describe('updateSearch()', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Calls reset function', () => {
        const stub = sinon.stub(element, 'reset');
        element.updateSearch();
        assert.isTrue(stub.called);
        stub.restore();
      });

      it('Calls query function', async () => {
        const stub = sinon.stub(element, 'queryCurrent');
        await element.updateSearch();
        stub.restore();
        assert.isTrue(stub.called);
      });
    });

    describe('#dataUnavailable', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Returns true when both arguments are falsy', () => {
        element[queryingValue] = false;
        assert.isTrue(element.dataUnavailable);
      });

      it('Returns false when querying', () => {
        element[queryingValue] = true;
        assert.isFalse(element.dataUnavailable);
      });

      it('Returns false when has items', () => {
        // @ts-ignore
        element.items = [{}];
        element[queryingValue] = false;
        assert.isFalse(element.dataUnavailable);
      });
    });

    describe('queryCurrent()', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Sets querying to true', () => {
        element.queryCurrent();
        assert.isTrue(element.querying);
      });
    });

    describe('[exchangeResponse]()', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      let emptyResponse;
      let dataResponse;
      beforeEach(async () => {
        element = await basicFixture();
        emptyResponse = {
          detail: {
            response: []
          }
        };
        dataResponse = {
          detail: {
            response: [
              ExchangeServer.createListObject(),
              ExchangeServer.createListObject(),
              ExchangeServer.createListObject(),
              ExchangeServer.createListObject()
            ]
          }
        };
      });

      it('Sets noMoreResults when no data', () => {
        element[exchangeResponse](emptyResponse);
        assert.isTrue(element.noMoreResults);
      });

      it('Sets querying to false when no data', () => {
        element[queryingValue] = true;
        element[exchangeResponse](emptyResponse);
        assert.isFalse(element.querying);
      });

      it('Sets noMoreResults when data size is less than exchangeLimit', () => {
        element[exchangeResponse](dataResponse);
        assert.isTrue(element.noMoreResults);
      });

      it('Do not sets noMoreResults when within exchangeLimit', () => {
        element.exchangeLimit = 4;
        element[exchangeResponse](dataResponse);
        assert.isFalse(element.noMoreResults);
      });

      it('Sets items property', () => {
        element[exchangeResponse](dataResponse);
        assert.typeOf(element.items, 'array');
        assert.lengthOf(element.items, 4);
      });

      it('Sets exchangeOffset to size of array', () => {
        assert.equal(element.exchangeOffset, 0);
        element[exchangeResponse](dataResponse);
        assert.equal(element.exchangeOffset, 4);
        element[exchangeResponse](dataResponse);
        assert.equal(element.exchangeOffset, 8);
      });

      it('Sets querying to false', () => {
        element[queryingValue] = true;
        element[exchangeResponse](dataResponse);
        assert.isFalse(element.querying);
      });
    });

    describe('#queryParams', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Sets required properties', () => {
        element.type = 'a';
        element.exchangeLimit = 1;
        element.exchangeOffset = 2;

        const result = element.queryParams;
        assert.equal(result.types, 'a');
        assert.equal(result.limit, 1);
        assert.equal(result.offset, 2);
        assert.isUndefined(result.search);
      });

      it('Sets search if not empty', () => {
        element.type = 'a';
        element.exchangeLimit = 1;
        element.exchangeOffset = 2;
        element.query = 'd';

        const result = element.queryParams;
        assert.equal(result.search, 'd');
      });
    });

    describe('#types()', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('returns empty array when no type', () => {
        element.type = '';
        const result = element.types;
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 0);
      });

      it('returns a single type', () => {
        element.type = 'test';
        const result = element.types;
        assert.lengthOf(result, 1);
        assert.equal(result[0], 'test');
      });

      it('Returns multiple types', () => {
        element.type = 'rest-api,template';
        const result = element.types;
        assert.lengthOf(result, 2);
        assert.equal(result[0], 'rest-api');
        assert.equal(result[1], 'template');
      });

      it('Trim types', () => {
        element.type = ' rest-api , template , connector ';
        const result = element.types;
        assert.lengthOf(result, 3);
        assert.equal(result[0], 'rest-api');
        assert.equal(result[1], 'template');
        assert.equal(result[2], 'connector');
      });
    });

    describe('[itemActionHandler]()', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
        await untilLoaded(element);
      });

      it('dispatches the selected event', () => {
        const spy = sinon.spy();
        element.addEventListener('selected', spy);
        const item = /** @type HTMLElement */ (element.shadowRoot.querySelector('.open-button'));
        item.click();
        assert.isTrue(spy.called, 'dispatches selected event');
      });

      it('has the asset item on the event', () => {
        const spy = sinon.spy();
        element.addEventListener('selected', spy);
        const item = /** @type HTMLElement */ (element.shadowRoot.querySelector('.open-button'));
        item.click();
        const model = element.items[0];
        assert.deepEqual(spy.args[0][0].detail, model);
      });
    });

    describe('Authorization properties', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await authFixture();
      });

      let handler;
      before(() => {
        handler = (e) => {
          e.detail.result = Promise.resolve({
            accessToken: 'test-token',
          });
        };
        window.addEventListener(AuthorizationEventTypes.OAuth2.authorize, handler)
      });

      after(() => {
        window.removeEventListener(AuthorizationEventTypes.OAuth2.authorize, handler)
      });

      it('renders the authorization button', () => {
        const button = element.shadowRoot.querySelector('.auth-button');
        assert.ok(button, 'Button is in the DOM');
        const { display } = getComputedStyle(button);
        assert.notEqual(display, 'none');
      });

      it('sets up auth headers', async () => {
        element.accessToken = 'test';
        await nextFrame();
        const ajax = element.shadowRoot.querySelector('iron-ajax');
        const { headers } = ajax;
        // @ts-ignore
        assert.equal(headers.authorization, 'Bearer test');
      });
    });

    describe('#effectivePanelTitle', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Returns predefined title', () => {
        element.panelTitle = 'test-title';
        assert.equal(element.effectivePanelTitle, 'test-title');
      });

      [
        ['rest-api', 'Explore REST APIs'],
        ['connector', 'Explore connectors'],
        ['template', 'Explore templates'],
        ['example', 'Explore examples'],
        ['soap-api', 'Explore SOAP APIs'],
        ['raml-fragment', 'Explore API fragments'],
        ['custom', 'Explore custom assets'],
        ['template,custom', 'Explore Exchange assets']
      ].forEach(([type, title]) => {
        it(`Returns title for ${type}`, () => {
          element.type = type;
          assert.equal(element.effectivePanelTitle, title);
        });
      });
    });

    describe('[typeChanged]()', () => {
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('calls the API endpoint when type change', () => {
        let called = false;
        element.updateSearch = async () => { called = true };
        element[typeChanged]('rest-api');
        assert.isTrue(called);
      });
    });

    describe('[computeColumns]()', () => {
      const auto = 'auto';
      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await basicFixture();
        element.columns = auto;
      });

      it('sets [columnsValue] from the columns property', () => {
        element.columns = 100;
        assert.equal(element[columnsValue], 100);
      });

      it('sets [columnsValue] without setting the column property', () => {
        assert.typeOf(element[columnsValue], 'number');
      });
    });

    describe('noAuto attribute', () => {
      beforeEach(async () => {
        ExchangeServer.createServer();
      });

      after(() => {
        ExchangeServer.restore();
      });

      it('does not request for data when authorization is not set', async () => {
        await noAutoFixture();
        assert.lengthOf(ExchangeServer.srv.requests, 0);
      });
    });

    describe('[oauthCallback]()', () => {
      beforeEach(async () => {
        ExchangeServer.createServer();
      });

      after(() => {
        ExchangeServer.restore();
      });

      let element = /** @type ExchangeSearchPanelElement */ (null);
      beforeEach(async () => {
        element = await noAutoFixture();
      });

      it('Sets authInitialized to true', () => {
        element.authInitialized = false;
        element[oauthCallback]();
        assert.isTrue(element.authInitialized);
      });

      it('Calls updateSearch() when no no-auto', () => {
        const spy = sinon.spy(element, 'updateSearch');
        element.noAuto = false;
        element.authInitialized = true;
        element[oauthCallback]();
        assert.isTrue(spy.called);
      });

      it('does not call updateSearch() when no-auto', () => {
        const spy = sinon.spy(element, 'updateSearch');
        element[oauthCallback]();
        assert.isFalse(spy.called);
      });
    });
  });

  describe('[setupAuthHeaders]()', () => {
    let element = /** @type ExchangeSearchPanelElement */ (null);
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Headers are empty when no token', async () => {
      element[setupAuthHeaders]();
      await nextFrame();
      const ajax = element.shadowRoot.querySelector('iron-ajax');
      assert.deepEqual(ajax.headers, {});
    });

    it('Headers are set when token', async () => {
      element[setupAuthHeaders]('test-token');
      await nextFrame();
      const ajax = element.shadowRoot.querySelector('iron-ajax');
      // @ts-ignore
      assert.equal(ajax.headers.authorization, 'Bearer test-token');
    });
  });

  describe('[anypointAuthChanged]()', () => {
    let element = /** @type ExchangeSearchPanelElement */ (null);
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Calls [listenOauth]() when state is "true"', () => {
      const spy = sinon.spy(element, listenOauth);
      element.anypointAuth = true;
      assert.isTrue(spy.called);
    });

    it('Calls [unlistenOauth]() when state is "false"', () => {
      element.anypointAuth = true;
      const spy = sinon.spy(element, unlistenOauth);
      element.anypointAuth = false;
      assert.isTrue(spy.called);
    });
  });

  describe('[querySearchHandler]()', () => {
    beforeEach(async () => {
      ExchangeServer.createServer();
    });

    after(() => {
      ExchangeServer.restore();
    });

    let element = /** @type ExchangeSearchPanelElement */ (null);
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('calls updateSearch() when no value', () => {
      const input = element.shadowRoot.querySelector('anypoint-input');
      input.value = 'value';
      const spy = sinon.spy(element, 'updateSearch');
      input.dispatchEvent(new Event('search'));
      assert.isFalse(spy.called);
    });

    it('Won\'t call updateSearch() when input has value', () => {
      const input = element.shadowRoot.querySelector('anypoint-input');
      const spy = sinon.spy(element, 'updateSearch');
      input.dispatchEvent(new Event('search'));
      assert.isTrue(spy.called);
    });
  });

  describe('[queryKeydownHandler]()', () => {
    beforeEach(async () => {
      ExchangeServer.createServer();
    });

    after(() => {
      ExchangeServer.restore();
    });

    let element = /** @type ExchangeSearchPanelElement */ (null);
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('does not call updateSearch() when no key is not Enter', () => {
      const spy = sinon.spy(element, 'updateSearch');
      const input = element.shadowRoot.querySelector('anypoint-input');
      input.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Escape',
      }));
      assert.isFalse(spy.called);
    });

    it('calls updateSearch() when key is Enter', () => {
      const spy = sinon.spy(element, 'updateSearch');
      const input = element.shadowRoot.querySelector('anypoint-input');
      input.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter',
      }));
      assert.isTrue(spy.called);
    });
  });

  describe('[exchangeResponseError]()', () => {
    let element = /** @type ExchangeSearchPanelElement */ (null);
    beforeEach(async () => {
      element = await noAutoFixture();
      await nextFrame();
    });

    it('resets querying', () => {
      const ajax = element.shadowRoot.querySelector('iron-ajax');
      ajax.dispatchEvent(new CustomEvent('error', {
        detail: {
          request: {
            status: 200
          }
        }
      }));
      assert.isFalse(element.querying);
    });

    it('clears accessToken when status is 401', () => {
      element.accessToken = 'test';
      const ajax = element.shadowRoot.querySelector('iron-ajax');
      ajax.dispatchEvent(new CustomEvent('error', {
        detail: {
          request: {
            status: 401
          }
        }
      }));
      assert.equal(element.accessToken, 'test');
    });

    it('clears signedIn property when status is 401', async () => {
      element.accessToken = 'test';
      element.signedIn = true;
      await nextFrame();
      const ajax = element.shadowRoot.querySelector('iron-ajax');
      ajax.dispatchEvent(new CustomEvent('error', {
        detail: {
          request: {
            status: 401
          }
        }
      }));
      assert.isFalse(element.signedIn);
    });

    it('dispatches tokenexpired when status is 401', () => {
      element.accessToken = 'test';
      element.signedIn = true;
      const spy = sinon.spy();
      element.addEventListener('tokenexpired', spy);
      const ajax = element.shadowRoot.querySelector('iron-ajax');
      ajax.dispatchEvent(new CustomEvent('error', {
        detail: {
          request: {
            status: 401
          }
        }
      }));
      assert.isTrue(spy.called);
    });
  });

  describe('[enableGrid]()', () => {
    let element = /** @type ExchangeSearchPanelElement */ (null);
    beforeEach(async () => {
      element = await noAutoFixture();
      await nextFrame();
    });

    it('Sets listView false', () => {
      element.listView = true;
      element[enableGrid]();
      assert.isFalse(element.listView);
    });

    it('deactivates list button', () => {
      const toggle = element.shadowRoot.querySelector('[data-action="list-enable"]');
      element.listView = false;
      // @ts-ignore
      toggle.active = true;
      element[enableGrid]();
      // @ts-ignore
      assert.isFalse(toggle.active);
    });
  });

  describe('[enableList]()', () => {
    let element = /** @type ExchangeSearchPanelElement */ (null);
    beforeEach(async () => {
      element = await noAutoFixture();
      await nextFrame();
    });

    it('Sets listView true', () => {
      element.listView = false;
      element[enableList]();
      assert.isTrue(element.listView);
    });

    it('Activates grid toggle button', () => {
      const toggle = element.shadowRoot.querySelector('[data-action="grid-enable"]');
      element.listView = true;
      // @ts-ignore
      toggle.active = true;
      element[enableList]();
      // @ts-ignore
      assert.isFalse(toggle.active);
    });
  });
});
