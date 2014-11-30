/**
  * Module dependencies.
  */
var config = require('config');
var debug = require('debug')('app:feeds');
var FeedParser = require('feedparser');
var request = require('superagent');
var Queue = require('util/queue');
var Batch = require('batch');
var redis = require('util/redis')(require('redis'));


/**
 * Expose.
 */
module.exports = Worker;


/**
 * Worker.
 */
function Worker(){
  this.publisher = redis();
  this.queue = new Queue({ concurrency: 3, timeout: 3000 });
}


/**
 * Poll feeds.
 */
Worker.prototype.work = function(){

  debug('getting feeds');

  var self  = this;

  config.feeds.forEach(function(feed){
    self.queue.push(self.fetch.bind(self, feed));
  });

};


/**
 * Get feeds at `feed` url and invoke `done(err, feeds)`.
 *
 * @param {Object} feed - feed
 * @param {Function} done - callback
 */
Worker.prototype.fetch = function(feed, done) {

  var self = this;
  var feedparser = new FeedParser();
  var req = request.get(feed.rss);

  req.on('error', function (err) {
    debug(feed.name + ':' + err.message);
    done(err);
  });

  req.pipe(feedparser);

  feedparser.on('error', function(err) {
    debug(feed.name + ':' + err.message);
    done(err);
  });

  feedparser.on('readable', function() {

    var batch = new Batch;

    while (item = this.read()) {

      (function(feed, item){

        batch.push(function(cb){

          debug('publishing ' +item.title);

          self.publish({
            feed: {
              id: item.guid,
              title: item.title,
              summary: item.summary,
              description: item.description,
              link: item.link,
              date: item.pubdate || (new Date()).toUTCString(),
              author: item.author,
              image: item.image.url,
              feed: feed.name
            }
          }, function(err){
            if (err) debug(err.message);
            cb();
          });
          
        });

      }(feed, item));

    };

    batch.end(function(err){
      if (err) debug(err);
      var id = setTimeout(function(){
        clearTimeout(id);
        self.queue.push(self.fetch.bind(self, feed));
      }, config.feedsPollDelay);
      done();
    });
    
  });

};


/**
 * Publish `data`.
 */
Worker.prototype.publish = function(data, done){

  var self = this;
  var body = data.feed;
  var id = body.id;
  var score = Date.parse(body.date)/1000;
  var key = 'feed:'+id;

  var batch = new Batch();
  batch.push(function(cb){
    self.publisher.hget(key, 'id', function(err, _id){
      if (_id) err = new Error('update in cache');
      if (err) return cb(err);
      cb(err);
    });
  });
  batch.push(this.publisher.hmset.bind(this.publisher, key, body));
  batch.push(this.publisher.zadd.bind(this.publisher, 'feed', score, id));
  // batch.push(this.publisher.zrange.bind(this.publisher, 'feed', 0, config.updatesCacheLimit));
  batch.push(this.publisher.publish.bind(this.publisher, config.redisPubKey, JSON.stringify(data)));
  batch.end(done);

};