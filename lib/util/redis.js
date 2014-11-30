/**
  * Module dependencies.
  */
var config = require('config');
var url = require('url');

// expose

module.exports = function(redis){
  return function(){
    if (!config.redisURL) return redis.createClient();
    var o = url.parse(config.redisURL);
    return redis.createClient(o.port, o.hostname);
  }
};
