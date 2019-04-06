import sinon from '../../../sinon/pkg/sinon-esm.js';
import '../../../chance/dist/chance.min.js';
/* global chance */
export const ExchangeServer = {
  createServer: function() {
    this.srv = sinon.fakeServer.create({
      autoRespond: true
    });
    this.mock();
  },

  mock: function() {
    this.mockList();
    this.mockAssetDownload();
  },

  mockList: function() {
    let url = /^https:\/\/anypoint\.mulesoft\.com\/exchange\/api\/v2\/assets\?*/;
    this.srv.respondWith('GET', url, function(request) {
      let result = [];
      for (let i = 0; i < 5; i++) {
        result.push(ExchangeServer.createListObject());
      }
      request.respond(200, {}, JSON.stringify(result));
    });
  },

  mockAssetDownload: function() {
    let url = 'http://fake-download-asset.com';
    this.srv.respondWith('GET', url, function(xhr) {
      xhr.respond(200, {
        'Content-Type': 'application/zip'
      }, 'test');
    });
  },

  createListObject: function() {
    const obj = {
      name: chance.string(),
      tags: [],
      rating: chance.integer({min: 0, max: 5}),
      organization: {
        name: chance.string()
      },
      files: [{
        classifier: 'raml',
        externalLink: 'http://fake-download-asset.com'
      }]
    };
    return obj;
  },

  restore: function() {
    this.srv.restore();
  }
};
