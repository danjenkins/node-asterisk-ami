var test           = require('utest');
var assert         = require('assert');
var AsteriskAmi = require('../../lib/AsteriskAmi');

test('AsteriskAmi#processData', {
  'converts asterisk ascii to object': function() {
    var ami = new AsteriskAmi();
    var content = 'Event: FullyBooted' + ami.CRLF + 'Privilege: system,all' + ami.CRLF + 'Status: Fully Booted' + ami.END;
    var input_arr = ami.processData(content);

    var input = input_arr[0];

    var expected ={
      event : 'FullyBooted',
      privilege : 'system,all',
      status : 'Fully Booted'
    };

    assert.deepEqual(input, expected);
  },
});



