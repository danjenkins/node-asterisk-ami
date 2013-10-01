var CRLF = '\r\n';

var lineAction = function(key, value){
  return (key + ': ' + value + CRLF);
};

var loopActionObject = function(obj){
  var str = '';
  if(obj instanceof Object){
    Object.keys(obj).forEach(function(i){
      if(obj.hasOwnProperty(i)){
        if(obj[i] instanceof Object){
          Object.keys(obj[i]).forEach(function(j){
            if(isNaN(j/1)){
              str += lineAction(i, j + '=' + obj[i][j]);
            }else{
              str += lineAction(i, obj[i][j]);
            }
          });
        }else{
          str += lineAction(i, obj[i]);
        }
      }
    });
    str += CRLF;
  }
  return str;
};

var stringify = function(obj){
  var str = '';
  str += loopActionObject(obj);
  return str;
};

module.exports = stringify;