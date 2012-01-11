# asterisk-ami

An extremely lightweight Asterisk AMI connector

## Install

```
npm install asterisk-ami
```

## Usage

```js
var AsteriskAmi = require('asterisk-ami');
var ami         = new AsteriskAmi();

ami.on('ami_data', function(data){
	console.log(data);
	/*data would look like this
	{
      Event : 'FullyBooted',
      Priviledge : 'system,all',
      Status : 'Fully Booted'
    }
    */
});

ami.send({action: 'login', username : 'username', secret : 'secret'});
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
