# asterisk-ami

An extremely lightweight Asterisk AMI connector

[![Build Status](https://secure.travis-ci.org/holidayextras/node-asterisk-ami.png)](http://travis-ci.org/holidayextras/node-asterisk-ami)

## Install

```
npm install asterisk-ami
```

## Usage

```js
var AsteriskAmi = require('asterisk-ami');
var ami = new AsteriskAmi( { host: 'hostname', username: 'username', password: 'secret' } );

ami.on('ami_data', function(data){
	console.log('AMI DATA', data);
	//decide between Events and non events here and what to do with them, maybe run an event emitter for the ones you care about
});

ami.connect(function(){
	ami.send({action: 'Ping'});//run a callback event when we have connected to the socket
});//connect creates a socket connection and sends the login action

ami.send({action: 'Ping'});
```

##Events

(AMI Data)
These give you AMI specific information

* **ami_login** Called when logging into the ami, no data passed back
* **ami_data** Called for each event we get back from the AMI, with an object being returned

(net socket events)
Use these events to determine the status of the socket connection, as if the socket is disconnected, you would need to add your .on('close') events again, this was a bug in the previous version of asterisk-ami, use these new events instead which will always be called, even if the connection has died and been reconnected.

* **ami_socket_drain**
* **ami_socket_error**
* **ami_socket_timeout**
* **ami_socket_end**
* **ami_socket_close**
* **ami_socket_unwritable**


##methods

```js
.connect(function(){
  console.log('connection to AMI socket successful');
}, function(raw_data){
  console.log('every time data comes back in the socket, this callback is called, useful for recording stats on data', raw_data);
})

.disconnect() //logs out of the AMI and then closes the connection, sets reconnect to false so that it wont try and reconnect

.send({action: 'Ping'}) //send an ami call, pass in a javascript object with the params you want to send the ami

.destroy() //terminates the connection to the ami socket if say disconnect fails, or you've lost connection to the ami and you're not using reconnect: true as a param

```


## Configuration options

AsteriskAmi has preset/configurable options, you can set these via an object passed in to AsteriskAmi

* **port**: Port number for Asterisk AMI, default `5038`
* **host**: Host of Asterisk, default `localhost`
* **username**: Username of Asterisk AMI user, default: `username`
* **password**: Password of Asterisk AMI user, default: `password`
* **debug**: Do you want debugging output to the screen, default: `false`
* **reconnect**: Do you want the ami to reconnect if the connection is dropped, default: `false`
* **reconnect_after** How long to wait to reconnect, in miliseconds, default: `3000`
* **events** Do we want to recieve AMI events, default: `true`

## NPM Maintainers

The npm module for this library is maintained by:

* [Dan Jenkins](http://github.com/danjenkins)

## License

asterisk-ami is licensed under the MIT license.
