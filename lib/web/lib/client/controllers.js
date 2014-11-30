/**
 * Module dependencies.
 */
var sse = require('sse');
var drawer = require('ember-drawer');

// Application controller

App.ApplicationController = Em.Controller.extend({
  
  config: window.CONFIG,

  setup: function(){

  },

  actions: {  

  },

});

// Index controller

App.IndexController = Em.Controller.extend(drawer, {

  needs: ['application'],

  setup: function(){

    this.setProperties({
      tweets: [],
      feeds: [],
      tweetsUpdate: [],
      feedsUpdate: [],
      tweetsPage: 0,
      feedsPage: 0,
    });

    ['tweets', 'feeds'].forEach(this.send.bind(this, 'paginate'));
    sse('/updates', this.send.bind(this, 'consumeUpdate'));

  },

  actions: {

    consumeUpdate: function(data){
      var data = JSON.parse(data);
        
      var type = data.tweet ? 'tweet' : 'feed';

      console.log('got %s', type);

      var updates;
      var update;
      if (data.tweet){
        update = data.tweet;
        updates = this.get('tweetsUpdate');
      } else {
        update = data.feed;
        updates = this.get('feedsUpdate');
      }
      updates.reverseObjects();
      updates.pushObject(update);
      updates.reverseObjects();
    },

    loadUpdates: function(type){

      analytics.track('Load '+type+'s');

      var updates = this.get(type + 'Update');
      
      var list = this.get(type);
      list.reverseObjects();
      list.pushObjects(updates);
      list.reverseObjects();

      updates.removeObjects(updates);
    },

    paginate: function(type){

      var page = this.get(type+'Page');

      analytics.track('Page '+type, {
        page: page
      });

      Em.$.getJSON('/'+type+'/'+page).then(this.send.bind(this, 'onPaginate', type));

    },

    onPaginate: function(type, updates){
      var key = type+'Page';
      this.set(key, this.get(key) + 1);
      var list = this.get(type);
      list.pushObjects(updates);
    },

    readMore: function(feed){
      this.set('selectedFeed', feed);
      this.send('showLeftDrawer');
    },

    showLeftDrawer: function(){ // override

      analytics.track('Read article', {
        article: this.get('selectedFeed.id')
      });

      this.set('_showingLeftDrawer', true);
      Em.$('.component-drawer-left').css({
        left: 0
      });

    },

    hideLeftDrawer: function(e){

      analytics.track('Close article', {
        article: this.get('selectedFeed.id')
      });

      this.set('_showingLeftDrawer', false);
      Em.$('.component-drawer-left').css({
        left: -840
      });
    },

  },

});
