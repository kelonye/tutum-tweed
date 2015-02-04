/**
  * Module dependencies.
  */
var express = require('express');
var path = require('path');
var join = path.join;
var favicon = require('serve-favicon');
var config = require('config');
var jade = require('component-hooks/node_modules/jade');
var Batch = require('batch');
var fs = require('fs');
var exec = require('child_process').exec;
var debug = require('debug')('app:web');
var redis = require('util/redis')(require('redis'));
var morgan = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');


// app

var app = module.exports = express();

// settings

app.use(morgan('dev'));
app.engine('jade', jade.__express);
app.set('view engine', 'jade');
app.set('views', __dirname+'/views');

// middleware

app.use(favicon(join(__dirname, '/../client/images/favicon.ico'), {maxAge: 0}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(join(__dirname, '/../public')));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});

// GET /

app.get('/', function(req, res, next){
  res.render('index', {
    ip: req.ip
  });
});


// GET /updates

app.get('/updates', function (req, res, next) {
  
  req.socket.setTimeout(Infinity);

  var subscriber = redis();
  subscriber.subscribe(config.redisPubKey);

  subscriber.on('error', function(err) {
    debug('redis error: ' + err.message);
  });

  subscriber.on('message', function(channel, data) {
    debug('relaying %s', data.tweet ? 'tweet' : 'feed');
    res.write('data: '+data+'\n\n');
  });

  // pipe cache

  req.on('close', function() {
  });

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  res.write('\n');

});


// GET /tweets/:page

app.get('/tweets/:page', function(req, res, next){
  var page = req.params.page;
  var from = page * config.pageLimit;
  var to = from + config.pageLimit - 1;
  var client = redis();
  client.lrange('tweet', from, to, function(err, ids){
    if (err) return next(err);
    var batch = new Batch;
    ids.forEach(function(id){
      batch.push(client.hgetall.bind(client, 'tweet:'+id));
    });
    batch.end(function(err, items){
      if (err) return next(err);
      res.json(items);
    });
  });
});


// GET /feeds

app.get('/feeds/:page', function(req, res, next){
  var page = req.params.page;
  var from = page * config.pageLimit;
  var to = from + config.pageLimit - 1;
  var client = redis();
  client.zrevrange('feed', from, to, function(err, ids){
    if (err) return next(err);
    var batch = new Batch;
    ids.forEach(function(id){
      batch.push(client.hgetall.bind(client, 'feed'+':'+id));
    });
    batch.end(function(err, items){
      if (err) return next(err);
      res.json(items);
    });
  });
});


// 404

app.use(function(req, res, next){
  var err = new Error('404');
  err.status = 404;
  next(err);
});

// error

app.use(function(err, req, res, next){
  // debug(err.stack);
  // res.send(err.status || 500, err.stack);
  
  debug(err.message);
  res.send(err.status || 500, err.message);
});
