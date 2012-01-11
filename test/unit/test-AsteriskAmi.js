var test           = require('utest');
var assert         = require('assert');
var AsteriskAmi = require('../../lib/AsteriskAmi');

test('AsteriskAmi#processData', {
  'converts asterisk ascii to object': function() {
    var ami = new AsteriskAmi();
    var content = 'Event: FullyBooted
Privilege: system,all
Status: Fully Booted

';
    var input = ami.processData(content);

    var expected ={
      Event : 'FullyBooted',
      Priviledge : 'system,all',
      Status : 'Fully Booted'
    };

    assert.deepEqual(input, expected);
  },
});



