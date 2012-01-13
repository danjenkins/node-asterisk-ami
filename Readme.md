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

## Configuration options

AsteriskAmi has preset/configurable options, you can set these via an object passed in to AsteriskAmi

* **port**: Port number for Asterisk AMI, default `5038`
* **host**: Host of Asterisk, default `localhost`
* **username**: Username of Asterisk AMI user, default: `username`
* **password**: Password of Asterisk AMI user, default: `password`

## NPM Maintainers

The npm module for this library is maintained by:

* [Dan Jenkins](http://github.com/danjenkins)

## License

asterisk-ami is licensed under the MIT license.
