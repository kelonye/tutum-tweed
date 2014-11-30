/**
  * Module dependencies.
  */
var builder = require('component-hooks');
var join = require('path').join;
var config = require('config');
var debug = require('debug')('app:web:builder');
var Batch = require('batch');


/**
  * Build web client and invoke `done(err)`.
  *
  * @param {Function} done - callback
  */
module.exports = function(done){

  if (!config.dev) return done();

  var out = join(__dirname+'/../public');
  var cwd = join(__dirname, '/../client');
  var build = builder(cwd)
    .copy()
    // .log()
    .out(out);
    
  if (config.minifyWebClient === 'off') build.dev();

  debug('building web client with minification '+config.minifyWebClient);

  build.end(done);

};