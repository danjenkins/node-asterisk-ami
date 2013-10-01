var CRLF = '\r\n';

var extractEventInfo = function(key, value, variableValues, event){

  if(variableValues && variableValues[1]){
    if(!event.hasOwnProperty(key)){
      event[key] = {};
    }
    event[key][variableValues[1]] = variableValues[2] || null;
  }else{
    if(event.hasOwnProperty(key)){
      //then make this into an object as one already exists
      if(!( event.key instanceof Object)){
        var tmp = event[key];
        event[key] = {};
        event[key][Object.keys(event[key]).length] = tmp;
      }
      event[key][Object.keys(event[key]).length] = value;
    }else{
      event[key] = value;
    }
  }
};

var parse = function(rawEvent){
  var self = this;
  var event = {};
  var result = rawEvent.split(CRLF);

  var lineRegexp = /^([A-Z0-9]+): ?(.+)?/i;
  var variableRegexp = /^(.+)=(.+)/;
  var versionRegexp = /^Asterisk Call Manager\/(\d\.\d)/;

  result.forEach(function(line){
    var detail = lineRegexp.exec(line);
    if(detail && detail[1]){
      var key = detail[1].toLowerCase();
      var value = detail[2] || null;

      var variableValues;

      if(key === 'variable'){
        variableValues = variableRegexp.exec(value);
      }

      extractEventInfo(key, value, variableValues, event);

    }else{
      var version = versionRegexp.exec(line);
      if(version && version[1]){
        self._version = version[1];
      }
      self.debug('No match on', line);
    }
  });

  return event;
};

module.exports = parse;