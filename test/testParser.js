var parse = require('../lib/parse');
var assert = require('assert');

var rawEvent = [
  'Event: Newchannel',
  'Privilege: call,all',
  'Channel: SIP/misspiggy-00000001',
  'Uniqueid: 1368479157.3',
  'ChannelState: 3',
  'ChannelStateDesc: Up',
  'CallerIDNum: 657-5309',
  'CallerIDName: Miss Piggy',
  'ConnectedLineName:',
  'ConnectedLineNum:',
  'AccountCode: Pork',
  'Priority:',
  'Exten: 31337',
  'Context: inbound',
  'Variable: MY_VAR=frogs',
  'Variable: HIDE_FROM_CHEF=true',
  'foo: var1',
  'foo: var2'
].join('\r\n');


describe('AsteriskAmi', function(){
  describe('actionEvent', function(){
    it('should return with one object', function(){
      assert.deepEqual(parse(rawEvent), {
        'event': 'Newchannel',
        'privilege': 'call,all',
        'channel': 'SIP/misspiggy-00000001',
        'uniqueid': '1368479157.3',
        'channelstate': '3',
        'channelstatedesc': 'Up',
        'calleridnum': '657-5309',
        'calleridname': 'Miss Piggy',
        'connectedlinename': null,
        'connectedlinenum': null,
        'accountcode': 'Pork',
        'priority': null,
        'exten': '31337',
        'context': 'inbound',
        'variable': {
          'MY_VAR': 'frogs',
          'HIDE_FROM_CHEF': 'true'
        },
        'foo': {
          0: 'var1',
          1: 'var2'
        }
      });
    });
  });
});