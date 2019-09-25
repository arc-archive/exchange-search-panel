import { fixture, assert, html, nextFrame } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { ExchangeServer } from './exchange-server-helper.js';
import '../exchange-search-panel.js';

describe('<exchange-search-panel>', () => {
  async function basicFixture() {
    return await fixture(`<exchange-search-panel></exchange-search-panel>`);
  }

  async function authFixture() {
    return await fixture(html`<exchange-search-panel
      anypointauth
      exchangeredirecturi="https://domain.com"
      exchangeclientid="test1234"
      forceoauthevents></exchange-search-panel>`);
  }

  async function noAutoFixture() {
    return await fixture(html`<exchange-search-panel
      noauto></exchange-search-panel>`);
  }

  async function noAutoAuthFixture() {
    return await fixture(html`<exchange-search-panel
      noauto
      anypointauth
      exchangeredirecturi="https://domain.com"
      exchangeclientid="test1234"></exchange-search-panel>`);
  }

  async function untilLoaded(element) {
    return new Promise((resolve) => {
      element.addEventListener('querying-changed', function clb(e) {
        if (e.detail.value === false) {
          element.removeEventListener('querying-changed', clb);
          resolve();
        }
      });
    });
  }

  describe('basic with auto opened', function() {
    beforeEach(() => {
      ExchangeServer.createServer();
    });

    after(() => {
      ExchangeServer.restore();
    });

    describe('basic when auto querying', function() {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('dataUnavailable is computed', function() {
        assert.isFalse(element.dataUnavailable);
      });

      it('hasItems is false', function() {
        assert.isFalse(element.hasItems);
      });

      it('query is undefined', function() {
        assert.isUndefined(element.query, '');
      });

      it('noMoreResults is false by default', function() {
        assert.isFalse(element.noMoreResults);
      });

      it('queryParams is computed', function() {
        const p = element.queryParams;
        assert.typeOf(p, 'object');
        assert.deepEqual(p.types, ['rest-api'], 'types is set');
        assert.equal(p.limit, element.exchangeLimit, 'limit is set');
        assert.equal(p.offset, element.exchangeOffset, 'offset is set');
        assert.isUndefined(p.search, 'search is undefined');
      });

      it('queryParams is computed with search', function() {
        element.query = 'test';
        const p = element.queryParams;
        assert.typeOf(p, 'object');
        assert.deepEqual(p.types, ['rest-api'], 'type is set');
        assert.equal(p.limit, element.exchangeLimit, 'limit is set');
        assert.equal(p.offset, element.exchangeOffset, 'offset is set');
        assert.equal(p.search, element.query, 'search is set');
      });

      it('renderLoadMore is false', function() {
        assert.isFalse(element.renderLoadMore);
      });
    });

    describe('basic with data loaded', function() {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
        await untilLoaded(element);
      });

      it('querying is false', function() {
        assert.isFalse(element.querying);
      });

      it('dataUnavailable is computed', function() {
        assert.isFalse(element.dataUnavailable);
      });

      it('items is set', function() {
        assert.typeOf(element.items, 'array', 'items is an array');
        assert.lengthOf(element.items, 5, 'items contains one page of results');
      });

      it('exchangeOffset is moved by number of items on the list', function() {
        assert.equal(element.exchangeOffset, 5);
      });

      it('noMoreResults is true when less than offset', function() {
        assert.isTrue(element.noMoreResults);
      });

      it('renderLoadMore is false when not querying and no more results', function() {
        assert.isFalse(element.renderLoadMore);
      });
    });

    describe('reset()', function() {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
        element.items = [{ name: 'test' }];
        element.exchangeOffset = 20;
        element.noMoreResults = true;
        element._querying = true;
        element.reset();
      });

      it('Resets the items', function() {
        assert.typeOf(element.items, 'array', 'items is an array');
        assert.lengthOf(element.items, 0, 'items is empty');
      });

      it('Resets exchangeOffset', function() {
        assert.equal(element.exchangeOffset, 0);
      });

      it('Resets noMoreResults', function() {
        assert.isFalse(element.noMoreResults);
      });

      it('Resets querying', function() {
        assert.isFalse(element.querying);
      });
    });

    describe('_enableList()', function() {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
        await untilLoaded(element);
      });

      it('Sets listView to true', function() {
        element._enableList();
        assert.isTrue(element.listView);
      });

      it('Renders list items', async () => {
        element._enableList();
        await nextFrame();
        const item = element.shadowRoot.querySelector('exchange-search-list-item');
        assert.isOk(item);
      });
    });

    describe('_enableGrid()', function() {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
        element.listView = true;
        await untilLoaded(element);
      });

      it('Sets listView to false', function() {
        element._enableGrid();
        assert.isFalse(element.listView);
      });

      it('Renders grid items', async () => {
        element._enableGrid();
        await nextFrame();
        const item = element.shadowRoot.querySelector('exchange-search-grid-item');
        assert.isOk(item);
      });
    });

    describe('updateSearch()', function() {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Calls reset function', function() {
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

    describe('#dataUnavailable', function() {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Returns true when both arguments are falsy', function() {
        // element._hasItems = false;
        element._querying = false;
        assert.isTrue(element.dataUnavailable);
      });

      it('Returns false when querying', function() {
        // element._hasItems = false;
        element._querying = true;
        assert.isFalse(element.dataUnavailable);
      });

      it('Returns false when has items', function() {
        element.items = [{}];
        element._querying = false;
        assert.isFalse(element.dataUnavailable);
      });
    });

    describe('queryCurrent()', function() {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Sets querying to true', function() {
        element.queryCurrent();
        assert.isTrue(element.querying);
      });
    });

    describe('_exchangeResponse()', function() {
      let element;
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

      it('Sets noMoreResults when no data', function() {
        element._exchangeResponse(emptyResponse);
        assert.isTrue(element.noMoreResults);
      });

      it('Sets querying to false when no data', function() {
        element._querying = (true);
        element._exchangeResponse(emptyResponse);
        assert.isFalse(element.querying);
      });

      it('Sets noMoreResults when data size is less than exchangeLimit', function() {
        element._exchangeResponse(dataResponse);
        assert.isTrue(element.noMoreResults);
      });

      it('Do not sets noMoreResults when within exchangeLimit', function() {
        element.exchangeLimit = 4;
        element._exchangeResponse(dataResponse);
        assert.isFalse(element.noMoreResults);
      });

      it('Sets items property', function() {
        element._exchangeResponse(dataResponse);
        assert.typeOf(element.items, 'array');
        assert.lengthOf(element.items, 4);
      });

      it('Sets exchangeOffset to size of array', function() {
        assert.equal(element.exchangeOffset, 0);
        element._exchangeResponse(dataResponse);
        assert.equal(element.exchangeOffset, 4);
        element._exchangeResponse(dataResponse);
        assert.equal(element.exchangeOffset, 8);
      });

      it('Sets querying to false', function() {
        element._querying = (true);
        element._exchangeResponse(dataResponse);
        assert.isFalse(element.querying);
      });
    });

    describe('#queryParams', function() {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Sets required properties', function() {
        element.type = 'a';
        element.exchangeLimit = 'b';
        element.exchangeOffset = 'c';

        const result = element.queryParams;
        assert.equal(result.types, 'a');
        assert.equal(result.limit, 'b');
        assert.equal(result.offset, 'c');
        assert.isUndefined(result.search);
      });

      it('Sets search if not empty', function() {
        element.type = 'a';
        element.exchangeLimit = 'b';
        element.exchangeOffset = 'c';
        element.query = 'd';

        const result = element.queryParams;
        assert.equal(result.search, 'd');
      });
    });

    describe('_getTypes()', function() {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Returns array if empty argument', function() {
        const result = element._getTypes();
        assert.typeOf(result, 'array');
        assert.lengthOf(result, 0);
      });

      it('Returns the same array as an argument', function() {
        const arg = ['test'];
        const result = element._getTypes(arg);
        assert.isTrue(result === arg);
      });

      it('Returns single type', function() {
        const arg = 'test';
        const result = element._getTypes(arg);
        assert.lengthOf(result, 1);
        assert.equal(result[0], 'test');
      });

      it('Returns multiple types', function() {
        const arg = 'rest-api,template';
        const result = element._getTypes(arg);
        assert.lengthOf(result, 2);
        assert.equal(result[0], 'rest-api');
        assert.equal(result[1], 'template');
      });

      it('Trim types', function() {
        const arg = ' rest-api , template , connector ';
        const result = element._getTypes(arg);
        assert.lengthOf(result, 3);
        assert.equal(result[0], 'rest-api');
        assert.equal(result[1], 'template');
        assert.equal(result[2], 'connector');
      });
    });

    describe('_processItem()', function() {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
        await untilLoaded(element);
      });

      it('Dispatches process-exchange-asset-data event', function(done) {
        const model = element.items[0];
        element.addEventListener('process-exchange-asset-data', function clb(e) {
          element.removeEventListener('process-exchange-asset-data', clb);
          assert.deepEqual(e.detail, model);
          done();
        });
        const item = element.shadowRoot.querySelector('exchange-search-grid-item');
        item.requestAction();
      });
    });

    describe('Authorization properties', function() {
      let element;
      beforeEach(async () => {
        element = await authFixture();
      });

      it('accessToken is not set', function() {
        assert.notOk(element.accessToken);
      });

      it('Renders authorization button', function() {
        const button = element.shadowRoot.querySelector('.auth-button');
        assert.ok(button, 'Button is in the DOM');
        const display = getComputedStyle(button).display;
        assert.notEqual(display, 'none');
      });

      it('Sets up auth headers', function() {
        element.accessToken = 'test';
        const headers = element._query.headers;
        assert.equal(headers.authorization, 'Bearer test');
      });
    });

    describe('#_effectivePanelTitle', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Returns predefined title', () => {
        element.panelTitle = 'test-title';
        assert.equal(element._effectivePanelTitle, 'test-title');
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
        it('Returns title for ' + type, () => {
          element.type = type;
          assert.equal(element._effectivePanelTitle, title);
        });
      });
    });

    describe('_typeChanged()', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('Does nothing when initializing', () => {
        let called = false;
        element.updateSearch = () => called = true;
        element._typeChanged('rest-api');
        assert.isFalse(called);
      });

      it('Calls updateSearch when type chenges', () => {
        let called = false;
        element.updateSearch = () => called = true;
        element._typeChanged('rest-api', 'something');
        assert.isTrue(called);
      });
    });

    describe('_computeColumns()', () => {
      const auto = 'auto';
      let element;
      beforeEach(async () => {
        element = await basicFixture();
        element.columns = auto;
        ['_mq2200', '_mq2000', '_mq1900', '_mq1700', '_mq1400', '_mq756', '_mq450']
        .forEach((prop) => element[prop] = false);
      });

      it('calls _columnsChanged for set columns value', () => {
        element.columns = 100;
        const spy = sinon.spy(element, '_columnsChanged');
        element._computeColumns();
        assert.equal(spy.args[0][0], 100);
      });

      it('calls _columnsChanged with default value', () => {
        const spy = sinon.spy(element, '_columnsChanged');
        element._computeColumns();
        assert.equal(spy.args[0][0], 1);
      });

      ['_mq2200', '_mq2000', '_mq1900', '_mq1700', '_mq1400', '_mq756', '_mq450']
      .forEach((prop, index) => {
        it(`calls _columnsChanged for ${prop}`, () => {
          element[prop] = true;
          const spy = sinon.spy(element, '_columnsChanged');
          element._computeColumns();
          assert.equal(spy.args[0][0], 8 - index);
        });
      });
    });

    describe('no-auto attribute', () => {
      beforeEach(async () => {
        ExchangeServer.createServer();
      });

      after(function() {
        ExchangeServer.restore();
      });

      it('Won\'t request for data when authorization is not set', async () => {
        await noAutoFixture();
        assert.lengthOf(ExchangeServer.srv.requests, 0);
      });

      it('Won\'t request for data when authorization is set', async () => {
        const element = await noAutoAuthFixture();
        element.authInitialized = true;
        assert.lengthOf(ExchangeServer.srv.requests, 0);
      });
    });

    describe('_oauth2SignedIn()', () => {
      beforeEach(async () => {
        ExchangeServer.createServer();
      });

      after(function() {
        ExchangeServer.restore();
      });

      let element;
      beforeEach(async () => {
        element = await noAutoFixture();
      });

      it('Sets authInitialized to true', () => {
        element.authInitialized = false;
        element._oauth2SignedIn();
        assert.isTrue(element.authInitialized);
      });

      it('Calls updateSearch() when no no-auto', () => {
        const spy = sinon.spy(element, 'updateSearch');
        element.noAuto = false;
        element.authInitialized = true;
        element._oauth2SignedIn();
        assert.isTrue(spy.called);
      });

      it('Won\'t call updateSearch() when no-auto', () => {
        const spy = sinon.spy(element, 'updateSearch');
        element._oauth2SignedIn();
        assert.isFalse(spy.called);
      });
    });

    describe('_oauth2SignedOut()', () => {
      beforeEach(async () => {
        ExchangeServer.createServer();
      });

      after(function() {
        ExchangeServer.restore();
      });

      let element;
      beforeEach(async () => {
        element = await noAutoFixture();
      });

      it('Sets authInitialized to true', () => {
        element.authInitialized = false;
        element._oauth2SignedOut();
        assert.isTrue(element.authInitialized);
      });

      it('Calls updateSearch() when no no-auto', () => {
        const spy = sinon.spy(element, 'updateSearch');
        element.noAuto = false;
        element.authInitialized = true;
        element._oauth2SignedOut();
        assert.isTrue(spy.called);
      });

      it('Won\'t call updateSearch() when no-auto', () => {
        const spy = sinon.spy(element, 'updateSearch');
        element._oauth2SignedOut();
        assert.isFalse(spy.called);
      });
    });

    describe('_oauth2ErrorHandler()', () => {
      beforeEach(async () => {
        ExchangeServer.createServer();
      });

      after(function() {
        ExchangeServer.restore();
      });

      let element;
      let ev;
      beforeEach(async () => {
        element = await noAutoFixture();
        ev = {
          detail: {
            message: 'test-message'
          }
        };
      });

      it('Sets error mesage on error toast', () => {
        element._oauth2ErrorHandler(ev);
        const toast = element.shadowRoot.querySelector('#errorToast');
        assert.equal(toast.text, 'test-message');
      });

      it('Opens the toast', () => {
        element._oauth2ErrorHandler(ev);
        const toast = element.shadowRoot.querySelector('#errorToast');
        assert.isTrue(toast.opened);
      });

      it('Sets authInitialized to true', () => {
        element.authInitialized = false;
        element._oauth2ErrorHandler(ev);
        assert.isTrue(element.authInitialized);
      });

      it('Calls updateSearch() when no no-auto', () => {
        const spy = sinon.spy(element, 'updateSearch');
        element.noAuto = false;
        element.authInitialized = false;
        element._oauth2ErrorHandler(ev);
        assert.isTrue(spy.called);
      });

      it('Won\'t call updateSearch() when no-auto', () => {
        const spy = sinon.spy(element, 'updateSearch');
        element._oauth2ErrorHandler(ev);
        assert.isFalse(spy.called);
      });

      it('Won\'t call updateSearch() when already initialized', () => {
        const spy = sinon.spy(element, 'updateSearch');
        element.noAuto = false;
        element.authInitialized = true;
        element._oauth2ErrorHandler(ev);
        assert.isFalse(spy.called);
      });
    });
  });

  describe('_setupAuthHeaders()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Headers are empty when no token', () => {
      element._setupAuthHeaders();
      assert.deepEqual(element._query.headers, {});
    });

    it('Headers are set when token', () => {
      element._setupAuthHeaders('test-token');
      assert.equal(element._query.headers.authorization, 'Bearer test-token');
    });
  });

  describe('_anypointAuthChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Calls _listenOauth() when state is "true"', () => {
      const spy = sinon.spy(element, '_listenOauth');
      element.anypointAuth = true;
      assert.isTrue(spy.called);
    });

    it('Calls _unlistenOauth() when state is "false"', () => {
      element.anypointAuth = true;
      const spy = sinon.spy(element, '_unlistenOauth');
      element.anypointAuth = false;
      assert.isTrue(spy.called);
    });
  });

  describe('_searchHandler()', () => {
    beforeEach(async () => {
      ExchangeServer.createServer();
    });

    after(function() {
      ExchangeServer.restore();
    });

    let element;
    let ev;
    beforeEach(async () => {
      element = await noAutoFixture();
      ev = {
        target: {
          value: ''
        }
      };
    });

    it('Calls updateSearch() when no value', () => {
      ev.target.value = 'value';
      const spy = sinon.spy(element, 'updateSearch');
      element._searchHandler(ev);
      assert.isFalse(spy.called);
    });

    it('Won\'t call updateSearch() when input has value', () => {
      const spy = sinon.spy(element, 'updateSearch');
      element._searchHandler(ev);
      assert.isTrue(spy.called);
    });
  });

  describe('_searchKeydown()', () => {
    beforeEach(async () => {
      ExchangeServer.createServer();
    });

    after(function() {
      ExchangeServer.restore();
    });

    let element;
    let ev;
    beforeEach(async () => {
      element = await noAutoFixture();
      ev = new CustomEvent('keydown', {
        cancelable: true
      });
    });

    it('Won\'t call updateSearch() when no key value/keyCode', () => {
      const spy = sinon.spy(element, 'updateSearch');
      element._searchKeydown(ev);
      assert.isFalse(spy.called);
    });

    it('Calls updateSearch() when key is Enter', () => {
      ev.key = 'Enter';
      const spy = sinon.spy(element, 'updateSearch');
      element._searchKeydown(ev);
      assert.isTrue(spy.called);
    });

    it('Calls updateSearch() when keyCode is 13', () => {
      ev.keyCode = 13;
      const spy = sinon.spy(element, 'updateSearch');
      element._searchKeydown(ev);
      assert.isTrue(spy.called);
    });

    it('Calls updateSearch() when which is 13', () => {
      ev.which = 13;
      const spy = sinon.spy(element, 'updateSearch');
      element._searchKeydown(ev);
      assert.isTrue(spy.called);
    });

    it('Event is cancelled', () => {
      ev.which = 13;
      element._searchKeydown(ev);
      assert.isTrue(ev.defaultPrevented);
    });
  });

  describe('_exchangeResponseError()', () => {
    let element;
    let ev;
    beforeEach(async () => {
      element = await noAutoFixture();
      ev = new CustomEvent('error', {
        cancelable: true,
        detail: {
          request: {
            status: 200
          }
        }
      });
      await nextFrame();
    });

    it('Re-sets querying', () => {
      element._exchangeResponseError(ev);
      assert.isFalse(element.querying);
    });

    it('Query error is opened', () => {
      element._exchangeResponseError(ev);
      const toast = element.shadowRoot.querySelector('#errorToast');
      assert.isTrue(toast.opened);
      assert.equal(toast.text, 'Unable to get data from Exchange.');
    });

    it('Status 401 - not signed in', () => {
      ev.detail.request.status = 401;
      element.accessToken = 'test';
      element._exchangeResponseError(ev);
      assert.equal(element.accessToken, 'test');
    });

    it('Status 401 - signed in', () => {
      ev.detail.request.status = 401;
      element.accessToken = 'test';
      element.signedIn = 'test';
      const spy = sinon.spy();
      element.addEventListener('tokenexpired', spy);
      element._exchangeResponseError(ev);
      assert.isTrue(spy.called);
      assert.isUndefined(element.accessToken);
      assert.isFalse(element.signedIn);
    });
  });

  describe('_enableGrid()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      await nextFrame();
    });

    it('Sets listView false', () => {
      element.listView = true;
      element._enableGrid();
      assert.isFalse(element.listView);
    });

    it('deactivates list button', () => {
      const toggle = element.shadowRoot.querySelector('[data-action="list-enable"]');
      element.listView = false;
      toggle.active = true;
      element._enableGrid();
      assert.isFalse(toggle.active);
    });
  });

  describe('_enableList()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
      await nextFrame();
    });

    it('Sets listView true', () => {
      element.listView = false;
      element._enableList();
      assert.isTrue(element.listView);
    });

    it('Activates grid toggle button', () => {
      const toggle = element.shadowRoot.querySelector('[data-action="grid-enable"]');
      element.listView = true;
      toggle.active = true;
      element._enableList();
      assert.isFalse(toggle.active);
    });
  });
});
