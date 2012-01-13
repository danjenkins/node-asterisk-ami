var util = require('util');
var events = require('events').EventEmitter;
var net = require('net');


module.exports = AsteriskAmi;
function AsteriskAmi(params){
  params = params || {};

  this.net = net;
  
  this.CRLF = "\r\n";
  this.END = "\r\n\r\n";
  this.buffer = "";
  
  this.port = params.port || 5038;
  this.host = params.host || 'localhost'; 
  this.username = params.username || 'username';
  this.password = params.password || 'password';

}

util.inherits(AsteriskAmi, events);

AsteriskAmi.prototype.connect = function(connect_cb, data_cb){
  var self = this;
  this.debug('running ami connect');
  this.socket = null;
  this.socket = this.net.createConnection(this.port, this.host);//reopen it
  this.socket.setEncoding('ascii');
  this.socket.setKeepAlive(true, 500);

  this.socket.on('connect', function(){ 
    self.debug('connected to Asterisk');
    //login to the manager interface
    self.send({Action: 'login', Username : self.username, Secret : self.password});
    if(connect_cb && typeof connect_cb == 'function'){
      connect_cb();
    }
  }).on('data', function(data){
    /*
 self.processData(data, function(result){
      if(result.response && result.message && /Authentication/gi.exec(result.message) == 'Authentication'){
        self.emit('ami_login', ((result.response == 'Success') ? true : false) ,result);       
      }
      self.emit('ami_data', result);
    });
    */
    var all_events = self.processData(data);
    for(var i in all_events){
      var result = all_events[i];
      if(result.response && result.message && /Authentication/gi.exec(result.message) == 'Authentication'){
        self.emit('ami_login', ((result.response == 'Success') ? true : false) ,result);       
      }
      self.emit('ami_data', result);
    }
    if(data_cb && typeof data_cb == 'function'){
      data_cb();
    } 
  }).on('drain', function(){
    self.debug('Asterisk Socket connection drained');
  }).on('error', function(error){
    if(error){
      self.debug('Asterisk Socket connection error, error was: ' + error);//prob lost connection to ami due to asterisk restarting so restart the connection
      throw 'error: ' + error;
    }
  }).on('timeout',function(){
    self.debug('Asterisk Socket connection has timed out');
  }).on('end', function() {
    self.debug('Asterisk Socket connection ran end event');
  }).on('close', function(had_error){
    self.debug('Asterisk Socket connection closed, error status - ' + had_error);
  });
}

AsteriskAmi.prototype.processData = function(data, cb){
  /*
  Thanks to mscdex for this bit of code that takes many lots of data and sorts them out into one if needed!
  https://github.com/mscdex/node-asterisk/blob/master/asterisk.js
  */
  data = data.toString();
  if (data.substr(0, 21) == "Asterisk Call Manager"){
    data = data.substr(data.indexOf(this.CRLF)+2); // skip the server greeting when first connecting
  }
  this.buffer += data;
  var iDelim, info, headers, kv, type, all_events = [];
  while ((iDelim = this.buffer.indexOf(this.END)) > -1) {
    info = this.buffer.substring(0, iDelim+2).split(this.CRLF);
    this.buffer = this.buffer.substr(iDelim + 4);
    result = {}; type = ""; kv = [];
    for (var i=0,len=info.length; i<len; i++) {
      if (info[i].indexOf(": ") == -1){
        continue;
      }
      kv = info[i].split(": ", 2);
      kv[0] = kv[0].toLowerCase().replace("-", "");
      if (i==0){
        type = kv[0];
      }
      result[kv[0]] = kv[1];
    }
//    cb(result);
    all_events.push(result);
  }
  return all_events;
}

AsteriskAmi.prototype.debug = function(data){
  util.log(data);
}
  
AsteriskAmi.prototype.generateRandom = function(){
  return Math.floor(Math.random()*100000000000000000);
}

AsteriskAmi.prototype.send = function(obj, cb) {
  //check state of connection here, if not up then bail out
  if(!obj.ActionID){
      obj.ActionID = this.generateRandom();
  }

  var str = '';
  for(var i in obj){
    str += (i + ': ' + obj[i] + this.CRLF);
  }
  //maybe i should be checking if this socket is writeable
  if(this.socket !=  null && this.socket.writable){
    console.log(obj);
    this.socket.write(str + this.CRLF, 'ascii', cb);
  }else{
    this.debug('cannot write to Asterisk Socket');
  }
}
