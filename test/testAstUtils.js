var astUtils = require('../lib/astUtils');
var assert = require('assert');

describe('astUtils', function(){
  describe('create a random actionid', function(){
    it('should return an id starting with foobar', function(){
      assert.ok(astUtils.generateRandomActionID.call({identifier: 'foobar'}).substring(0,7) == 'foobar-');
    });
    it('should return a random id', function(){
      assert.ok(astUtils.generateRandomActionID.call({identifier: null}).length == 17);
    });
  });
  describe('logoutAction', function(){
    it('should return with logoff', function(){
      assert.equal('Logoff', astUtils.logoutAction.call({_version: 1.3}));
    });
    it('should return with logout', function(){
      assert.equal('Logout', astUtils.logoutAction.call({_version: 1.4}));
    });
  });
});