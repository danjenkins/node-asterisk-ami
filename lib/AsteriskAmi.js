var EventEmitter = require('events').EventEmitter;
var net = require('net');
var util = require('util');
var carrier = require('carrier');
var parse = require('./parse');
var stringify = require('./stringify');
var astUtils = require('./astUtils');

var END = '\r\n\r\n';

function AsteriskAmi(params){
  params = params || {};

  this.connection = new EventEmitter();

  this.port = params.port || 5038;
  this.host = params.host || null;
  this.username = params.username || null;
  this.password = params.password || null;
  this.enableDebug = params.debug || false;
  this.reconnect = params.reconnect || false;
  this.events = (params && params.hasOwnProperty('events') ? params.events : true);
  this.identifier = params.identifier || null;
  this.encoding = params.encoding || 'ascii';
  this._version = null;
  this._callbacks = {};
}

util.inherits(AsteriskAmi, EventEmitter);

module.exports = AsteriskAmi;

AsteriskAmi.prototype.connect = function(){
  var self = this;

  self.debug('Running ami connect');

  self.connection = net.createConnection(this.port, this.host);
  self.connection.setEncoding(self.amiEncoding);
  self.connection.setKeepAlive(true, 500);

  carrier.carry(self.connection, function carrierCb(rawEvent) {

    var event = parse.parse.call(self, rawEvent);

    if(event.actionid && self._callbacks[event.actionid] && self._callbacks[event.actionid] instanceof Function){
      self._callbacks[event.actionid](null, event);
      delete self._callbacks[event.actionid];
    }

    if(event.response && event.message && /Authentication/i.test(event.message)){
      self.emit('login', ((event.response != 'Success') ? new Error(event.response) : null) , event);
    }

    if(event.event && self.listeners(event.event.toLowerCase()).length){
      self.emit(event.event.toLowerCase(), event);
    }

    if(self.listeners('data').length){
      self.emit('data', event);
    }

  }, self.amiEncoding, END);

  var getVersionFromDataAndLogin = function getVersion(data){
    if(parse.parseVersion.call(self, data)){
      self.send({
        Action: 'login',
        Username : self.username,
        Secret : self.password,
        Events: (self.events ? 'on' : 'off')
      });
      self.connection.removeListener('data', getVersionFromDataAndLogin);
    }
  };

  self.connection.on('connect', function connect(){
    self.debug('Connected to Asterisk AMI');
    self.emit('connection-connect');
  })
  .on('data', getVersionFromDataAndLogin)
  .on('drain', function drain(){
    self.emit('connection-drain');
    self.debug('Asterisk Socket connection drained');
  })
  .on('error', function error(error){
    if(error){
      self.debug('Asterisk Socket connection error, error was: ' + error);
    }
    self.emit('connection-error', error);
  })
  .on('timeout',function timeout(){
    self.debug('Asterisk Socket connection has timed out');
    self.emit('connection-timeout');
  })
  .on('end', function end() {
    self.debug('Asterisk Socket connection ran end event');
    self.emit('connection-end');
  })
  .on('close', function close(hadError){
    self.debug('Asterisk Socket connection closed, error status - ' + hadError);
    self.emit('connection-close', hadError);
    if(self.reconnect && self.reconnect !== false){
      var reconnectDelay = 3000;
      if(self.reconnect instanceof Number){
        reconnectDelay = self.reconnect;
      }
      self.debug('Reconnecting to AMI in ' + reconnectDelay);
      setTimeout(function timeoutCb() {
        self.connect();
      }, reconnectDelay);
    }
  });
};

AsteriskAmi.prototype.disconnect = function(){
  var self = this;
  this.reconnect = false;//just in case we wanted it to reconnect before, we've asked for it to be closed this time so make sure it doesnt reconnect
  this.connection.end(
    stringify.call(this, {
      Action: astUtils.logoutAction.call(self),
      ActionID: astUtils.generateRandomActionID.call(this)
    })
  );
};

AsteriskAmi.prototype.destroy = function(){
  this.connection.destroy();
};

AsteriskAmi.prototype.debug = function(data){
  if( this.enableDebug !== false ){
    if( this.enableDebug instanceof Function ){
      this.enableDebug(data);
    }else{
      console.log(data);
    }
  }
};

AsteriskAmi.prototype._send = function(obj, cb){
  var self = this;
  this.debug(obj);
  if(cb && cb instanceof Function){
    this._callbacks[obj.ActionID] = cb;
  }
  this.connection.write(stringify.call(this, obj), this.amiEncoding, cb);
};

AsteriskAmi.prototype.send = function(obj, cb) {
  //check state of connection here, if not up then bail out
  if(!obj.ActionID){
    obj.ActionID = astUtils.generateRandomActionID.call(this);
  }

  if(this.connection != null && this.connection.writable){
    this._send(obj, cb);
  }else{
    this.debug('cannot write to Asterisk Socket');
    this.emit('connection-unwriteable');
  }
};
