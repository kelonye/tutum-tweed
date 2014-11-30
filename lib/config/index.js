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
  },
  {
    name: 'TechCrunch',
    rss: 'http://techcrunch.com/feed/',
    twitter: 'techcrunch com'
  },
  // {
  //   name: 'The Verge',
  //   rss: 'http://www.theverge.com/rss/index.xml',
  //   twitter: 'theverge com',
  // },
  {
    name: 'Wired',
    rss: 'http://feeds.wired.com/wired/index',
    twitter: 'wired com',
  }, 
  {
    name: 'Engadget',
    rss: 'http://www.engadget.com/rss.xml',
    twitter: 'engadget com'
  },
  // {
  //   name: 'VentureBeat',
  //   rss: 'http://feeds.venturebeat.com/VentureBeat',
  //   twitter: 'venturebeat com',
  // },
  {
    name: 'Gizmodo',
    rss: 'http://feeds.gawker.com/gizmodo/full',
    twitter: 'gizmodo.com com'
  },
  {
    name: 'Lifehacker',
    rss: 'feeds.gawker.com/lifehacker/full',
    twitter: 'lifehacker.com com'
  },
  {
    name: 'i09',
    rss: 'feeds.gawker.com/io9/full',
    twitter: 'io9.com com'
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