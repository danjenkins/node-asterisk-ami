# asterisk-ami

An Asterisk AMI connector

## Install

```
npm install asterisk-ami
```

## Usage

```js
var AsteriskAmi = require('asterisk-ami');
var ami         = new AsteriskAmi();

//an example of use here

## Configuration options

AsteriskAmi has preset/configurable options, you can set these via an object passed in to AsteriskAmi

* **port**: Port number for Asterisk AMI, defaults to 5038
* **host**: Host of Asterisk, defaults to localhost
* **username**: Username of Asterisk AMI user, defaults to username
* **password**: Password of Asterisk AMI user, defaults to password

## NPM Maintainers

The npm module for this library is maintained by:

* [Dan Jenkins](http://github.com/danjenkins)

## License

asterisk-ami is licensed under the MIT license.
