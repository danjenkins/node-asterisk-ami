# asterisk-ami

An extremely lightweight Asterisk AMI connector

[![Build Status](https://secure.travis-ci.org/holidayextras/node-asterisk-ami.png)](http://travis-ci.org/holidayextras/node-asterisk-ami)

## Install

```
npm install asterisk-ami
```

## Usage

```
var AsteriskAmi = require('asterisk-ami');
var ami = new AsteriskAmi( { host: 'hostname', username: 'username', password: 'secret' } );

ami.connection.on('connect', function(){
	
})

ami.on('login', function(err, event){
	
})

ami.send({action: 'Ping'});

ami.send({action: 'Ping'}, function(err, event){

});

```

##Events 
###(AMI Events on the ami instantiated object)
These give you AMI specific information

* **login** Called when logging into the ami, on both failure to login - gives an error and event data
* **data** Called for each event we get back from the AMI, with an object being returned
* ***ami-event-name*** Each specific event name in lowercase like ```pong```

###(AMI Events on the ami instantiated object)
Use these events to determine the status of the socket connection, as if the socket is disconnected, you would need to add your .on('close') events again, use these new events instead which will always be called, even if the connection has died and been reconnected.

* **connection-drain**
* **connection-error**
* **connection-timeout**
* **connection-end**
* **connection-close**
* **connection-unwritable**
* **connection-connect**

##methods

```
ami.connect() //connect - no data, listen on connection-connect for info

ami.disconnect() //logs out of the AMI and then closes the connection, sets reconnect to false so that it wont try and reconnect

ami.send({action: 'Ping'}, [callback]) //send an ami call, pass in a javascript object with the params you want to send the ami, can pass in a callback - expecting ```error``` and ```event``` as parameters in the callback

ami.destroy() //terminates the connection to the ami socket if say disconnect fails, or you've lost connection to the ami and you're not using reconnect: true as a param

```

## Configuration options

AsteriskAmi has preset/configurable options, you can set these via an object passed in to AsteriskAmi

* **port**: Port number for Asterisk AMI, default `5038`
* **host**: Host of Asterisk, default `localhost`
* **username**: Username of Asterisk AMI user, default: `username`
* **password**: Password of Asterisk AMI user, default: `password`
* **debug**: Do you want debugging output to the screen, default: `false`, set to `true` or a `function` which takes 1 parameter
* **reconnect**: Do you want the ami to reconnect if the connection is dropped, default: `false`, set to `true` or a `number` in milliseconds on how long you want it to be until you reconnect
* **events** Do we want to recieve AMI events, default: `true`
* **identifier** Want to prepend all ActionIDs with an identifier? Then pass in a string identifying things
* **encoding** What type of encoding do you want to use, defaults to `ascii`

## NPM Maintainers

The npm module for this library is maintained by:

* [Dan Jenkins](http://github.com/danjenkins)

## License

asterisk-ami is licensed under the MIT license.
