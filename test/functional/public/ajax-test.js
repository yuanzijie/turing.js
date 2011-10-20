require.paths.unshift('./turing-test/lib');

var test = require('test'),
    assert = require('assert');

exports.testAjax = {
  'test ajax get': function() {
    $t.get('/get-test')
      .set('Accept', 'text/html')
      .end(function(res) {
        assert.equal('Sample text', res.responseText);
      });
  },

  'test ajax post': function() {
    $t.post('/post-test')
      .data('key=value&anotherKey=anotherValue')
      .end(function(res) {
        assert.equal('value', res.responseText);
      });
  },

  'test send with data': function() {
    $t.post('/post-test')
      .send('key=value&anotherKey=anotherValue', function(res) {
        assert.equal('value', res.responseText);
      });
  },

  'test json post object': function() {
    $t.post('/post-test')
      .data({ key: 'value' })
      .end(function(res) {
        assert.equal('value', res.responseText);
      });
  },

  'test error handling': function() {
    $t.get('/error')
      .end(function(res) {
        assert.equal(500, res.status);
        assert.equal(false, res.success);
      });
  },

  'test json post object with application/json': function() {
    $t.post('/post-test')
      .data({ 'key': 'value' })
      .set('Content-Type', 'application/json')
      .end(function(res) {
        assert.equal('value', res.responseText);
      });
  },

  'test json post array with application/json': function() {
    $t.post('/post-array')
      .data(['value'])
      .set('Content-Type', 'application/json')
      .end(function(res) {
        assert.equal('value', res.responseText);
      });
  },

  'test promises': function() {
    $t.get('/get-test').then(
      function(r) { assert.equal('Sample text', r.responseText); },
      function(r) { assert.ok(false); }
    );
  },

  'test json parsing': function() {
    $t.post('/give-me-json')
      .set('Content-Type', 'application/json')
      .end(function(res) {
        assert.equal('value', res.responseJSON.key);
      });
  },

  'test xml parsing': function() {
    $t.post('/give-me-xml')
      .set('Content-Type', 'application/xml')
      .end(function(res) {
        assert.equal('key', res.responseXML.documentElement.nodeName);
      });
  }
};

exports.testRequire = {
  'test require': function() {
    $t.require('/load-me.js?test0=0', { transport: 'scriptInsertion' }, function() {
      assert.equal(window.test0, 0);
    });
  },

  'test require execution': function() {
    $t.require('/load-me.js?test1=1', { async: true, defer: true, transport: 'scriptInsertion' }, function() {
      assert.equal(window.test1, 1);
    });

    $t.require('/load-me.js?test2=2', { transport: 'scriptInsertion' }, function() {
      assert.equal(window.test2, 2);
    });
  },

  'test require with XMLHttpRequest': function() {
    $t.require('/load-me.js?test3=3', { transport: 'XMLHttpRequest' }, function() {
      assert.equal(window.test3, 3);
    });
  },

  'test turing.require.isSameOrigin': function() {
    assert.ok(turing.require.isSameOrigin('/example.js'));
    assert.ok(turing.require.isSameOrigin(location.protocol + '//' + location.host + '/example.js'));
    assert.ok(!turing.require.isSameOrigin('https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js'));
  }
};

test.run(exports);
