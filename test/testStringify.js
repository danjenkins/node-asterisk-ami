var stringify = require('../lib/stringify');
var assert = require('assert');

describe('stringify', function(){
  describe('check generation of action data', function(){
    it('should output fields separated properly', function(){
      assert.equal(stringify({
        foo: 'bar'
      }), 'foo: bar\r\n\r\n');
    });
    it('should output multiple fields separated properly', function(){
      assert.equal(stringify({
        foo: {
          0: 'foo',
          1: 'bar'
        },
        bar: {
          'FOO': 'BAR',
          'BAR': 'FOO'
        }
      }), [
        'foo: foo',
        'foo: bar',
        'bar: FOO=BAR',
        'bar: BAR=FOO'
      ].join('\r\n') + '\r\n\r\n');
    });
  });
});