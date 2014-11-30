/**
  * Module dependencies.
  */

var config = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 5000,
};

config.minifyWebClient = (process.env.MINIFY == 1)
  ? 'on'
  : 'off';

config.redisPubKey = 'updates';

config.twitterAppConfig = {
  consumer_key:         process.env.TWEED_TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWEED_TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWEED_TWITTER_ACCESS_TOKEN,
  access_token_secret:  process.env.TWEED_TWITTER_ACCESS_TOKEN_SECRET
};

config.feeds = [
  {
    name: 'Mashable',
    rss: 'http://mashable.com/rss/',
    twitter: 'mashable com'
  }, {
    name: 'TechCrunch',
    rss: 'http://techcrunch.com/feed/',
    twitter: 'techcrunch com'
  }, {
    name: 'The Verge',
    rss: 'http://www.theverge.com/rss/group/tech/index.xml',
    twitter: 'theverge com',
  }, {
    name: 'Wired',
    rss: 'http://www.wired.com/rss',
    twitter: 'wired com',
  }, {
    name: 'Engadget',
    rss: 'http://www.engadget.com/rss.xml',
    twitter: 'engadget com'
  }, {
    name: 'VentureBeat',
    rss: 'http://venturebeat.com/feed/',
    twitter: 'venturebeat com',
  }
];

config.updatesCacheLimit = 1000;

config.pageLimit = 10;

config.redis = {
  host: 6379,
  guest: 6379
};

config.feedsPollDelay = 10 * 60 * 1000; // min

config.redisURL = process.env.REDIS_PORT;

module.exports = config;