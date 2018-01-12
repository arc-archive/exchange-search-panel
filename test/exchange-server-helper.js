/* global sinon, chance */

var ExchangeServer = {
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
    var url = /^https:\/\/anypoint\.mulesoft\.com\/exchange\/api\/v1\/assets\?*/;
    this.srv.respondWith('GET', url, function(request) {
      var result = [];
      for (var i = 0; i < 20; i++) {
        result.push(ExchangeServer.createListObject());
      }
      request.respond(200, {}, JSON.stringify(result));
    });
  },

  mockAssetDownload: function() {
    var url = 'http://fake-download-asset.com';
    this.srv.respondWith('GET', url, function(xhr) {
      xhr.respond(200, {
        'Content-Type': 'application/xip'
      }, 'test');
    });
  },

  createListObject: function() {
    var obj = {
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
    for (var i = 0; i < chance.integer({min: 0, max: 10}); i++) {
      obj.tags.push({
        value: chance.string()
      });
    }
    return obj;
  },

  restore: function() {
    this.srv.restore();
  }
};
