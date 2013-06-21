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
  this.enable_debug = params.debug || false;
  this.reconnect = params.reconnect || false;
  this.reconnect_after = params.reconnect_after || 3000;
  this.events = (params.events != undefined ? params.events : true);
  this.identifier = params.identifier || false;
  this.ami_encoding = params.ami_encoding || 'ascii';
}

util.inherits(AsteriskAmi, events);

AsteriskAmi.prototype.connect = function(connect_cb, data_cb){
  var self = this;
  self.debug('running ami connect');
  self.socket = null;
  self.socket = this.net.createConnection(this.port, this.host);//reopen it
  self.socket.setEncoding(this.ami_encoding);
  self.socket.setKeepAlive(true, 500);

  self.socket.on('connect', function(){ 
    self.debug('connected to Asterisk AMI');
    //login to the manager interface
    self.send({Action: 'login', Username : self.username, Secret : self.password, Events: (self.events ? 'on' : 'off')});
    if(connect_cb && typeof connect_cb == 'function'){
      connect_cb();
    }
  }).on('data', function(data){
    if(data_cb && typeof data_cb == 'function'){
      data_cb(data);
    }
    var all_events = self.processData(data);
    for(var i in all_events){
      var result = all_events[i];
      if(result.response && result.message && /Authentication/gi.exec(result.message) == 'Authentication'){
        self.emit('ami_login', ((result.response == 'Success') ? true : false) ,result);       
      }
      self.emit('ami_data', result);
    } 
  }).on('drain', function(){
    self.debug('Asterisk Socket connection drained');
    self.emit('ami_socket_drain');
  }).on('error', function(error){
    if(error){
      self.debug('Asterisk Socket connection error, error was: ' + error);//prob lost connection to ami due to asterisk restarting so restart the connection
    }
    self.emit('ami_socket_error', error);
  }).on('timeout',function(){
    self.debug('Asterisk Socket connection has timed out');
    self.emit('ami_socket_timeout');
  }).on('end', function() {
    self.debug('Asterisk Socket connection ran end event');
    self.emit('ami_socket_end');
  }).on('close', function(had_error){
    self.debug('Asterisk Socket connection closed, error status - ' + had_error);
    self.emit('ami_socket_close', had_error);
    if(self.reconnect){
      self.debug('Reconnecting to AMI in ' + self.reconnect_after);
      setTimeout(function() { 
        self.connect(connect_cb, data_cb);
      }, self.reconnect_after); 
    }
  });
}

AsteriskAmi.prototype.disconnect = function(){
  this.reconnect = false;//just in case we wanted it to reconnect before, we've asked for it to be closed this time so make sure it doesnt reconnect
  this.socket.end(this.generateSocketData({Action: 'Logoff'}));
}

AsteriskAmi.prototype.destroy = function(){
  this.socket.destroy();
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
    if(this.identifier){
      result.identifier = this.identifier;
    }
    all_events.push(result);
  }
  return all_events;
}

AsteriskAmi.prototype.debug = function(data){
  if(this.enable_debug){
    console.log(data);
  }
}
  
AsteriskAmi.prototype.generateRandom = function(){
  return Math.floor(Math.random()*100000000000000000);
}

AsteriskAmi.prototype.generateSocketData = function(obj){
  var str = '';
  for(var i in obj){
    str += (i + ': ' + obj[i] + this.CRLF);
  }
  return str + this.CRLF;
}

AsteriskAmi.prototype.send = function(obj, cb) {
  //check state of connection here, if not up then bail out
  if(!obj.ActionID){
      obj.ActionID = this.generateRandom();
  }

  //maybe i should be checking if this socket is writeable
  if(this.socket != null && this.socket.writable){
    this.debug(obj);
    this.socket.write(this.generateSocketData(obj), this.ami_encoding, cb);
  }else{
    this.debug('cannot write to Asterisk Socket');
    this.emit('ami_socket_unwritable');
  }
}
