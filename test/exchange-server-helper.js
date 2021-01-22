import sinon from 'sinon';
import 'chance/dist/chance.min.js';

/* global chance */
export const ExchangeServer = {
  createServer: () => {
    ExchangeServer.srv = sinon.fakeServer.create({
      autoRespond: true
    });
    ExchangeServer.mock();
  },

  mock: () => {
    ExchangeServer.mockList();
    ExchangeServer.mockAssetDownload();
  },

  mockList: () => {
    const url = /^https:\/\/anypoint\.mulesoft\.com\/exchange\/api\/v2\/assets\?*/;
    ExchangeServer.srv.respondWith('GET', url, (request) => {
      const result = [];
      for (let i = 0; i < 5; i++) {
        result.push(ExchangeServer.createListObject());
      }
      request.respond(200, {}, JSON.stringify(result));
    });
  },

  mockAssetDownload: () => {
    const url = 'http://fake-download-asset.com';
    ExchangeServer.srv.respondWith('GET', url, (xhr) => {
      xhr.respond(200, {
        'Content-Type': 'application/zip'
      }, 'test');
    });
  },

  createListObject: () => {
    const obj = {
      // @ts-ignore
      name: chance.string(),
      tags: [],
      // @ts-ignore
      rating: chance.integer({ min: 0, max: 5 }),
      organization: {
        // @ts-ignore
        name: chance.string()
      },
      files: [{
        classifier: 'raml',
        externalLink: 'http://fake-download-asset.com'
      }]
    };
    return obj;
  },

  restore: () => {
    ExchangeServer.srv.restore();
  }
};
