/**
  * Module dependencies.
  */
var redis = require('util/redis')(require('redis'));
var Twit = require('twit');
var Batch = require('batch');
var config = require('config');
var debug = require('debug')('app:tweets');

/**
 * Expose.
 */
module.exports = Worker;


/**
 * Worker.
 */
function Worker(){
  this.publisher = redis();
}


/**
 * Connect to twitter stream.
 */
Worker.prototype.work = function(){

  debug('getting tweets');

  var self  = this;
  var T = new Twit(config.twitterAppConfig);
  var track = config.feeds.map(function(feed){
    return feed.twitter;
  });
  var stream = T.stream('statuses/filter', {track: track, language: 'en'});
  stream.on('tweet', function (tweet) {
    debug('publishing tweet %s', tweet.text);
    self.publish({
      tweet: {
        id: tweet.id_str,
        text: tweet.text,
        date: tweet.created_at,
        user: tweet.user.name,
        user_handle: tweet.user.screen_name,
        user_avatar: tweet.user.profile_image_url
      }
    }, function(err){
      if (err) debug(err.message);
    });
  });

};


/**
 * Publish `data`.
 */
Worker.prototype.publish = function(data, done){

  var self = this;
  var body = data.tweet;
  var id = body.id;
  var key = 'tweet:'+id;

  var batch = new Batch();
  batch.push(function(cb){
    self.publisher.hget(key, 'id', function(err, _id){
      if (_id) err = new Error('update in cache');
      if (err) return cb(err);
      cb(err);
    });
  });
  batch.push(this.publisher.hmset.bind(this.publisher, key, body));
  batch.push(this.publisher.lpush.bind(this.publisher, 'tweet', id));
  // batch.push(this.publisher.ltrim.bind(this.publisher, 'tweet', 0, config.updatesCacheLimit)); // lru
  batch.push(this.publisher.publish.bind(this.publisher, config.redisPubKey, JSON.stringify(data)));
  batch.end(done);

};
