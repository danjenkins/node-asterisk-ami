var utils = {};

utils.generateRandomActionID = function(){
  return (this.identifier ? this.identifier + '-' : '') + Math.floor( Math.random() * 100000000000000000 );
};

utils.logoutAction = function(){
  return ((this._version && this._version >= 1.4) ? 'Logout' : 'Logoff');
};

module.exports = utils;