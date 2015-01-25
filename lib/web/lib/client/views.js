/**
  * Module dependencies.
  */
var link = require('ember-link');
// require('./vendor/bootstrap/js/tab.js');
require('./vendor/bootstrap/js/button.js');
// require('./vendor/bootstrap/js/affix.js');
// require('./vendor/bootstrap/js/dropdown.js');
// require('./vendor/bootstrap/js/collapse.js');
// require('./vendor/bootstrap/js/scrollspy.js');
// require('./vendor/bootstrap/js/carousel.js');
require('./vendor/bootstrap/js/alert.js');
require('./vendor/bootstrap/js/transition.js');
// require('./vendor/bootstrap/js/tooltip.js');
// require('./vendor/bootstrap/js/popover.js');
// require('./vendor/bootstrap/js/modal.js');
require('./vendor/moment');
// require('./vendor/ember-list-view');


// application view

App.ApplicationView = Em.View.extend({

  didInsertElement: function(){

    $(document)
      .bind('ajaxSend', function(){
        NProgress.start();
        NProgress.set(0.4);
      }).bind('ajaxComplete', function(){
        NProgress.done();
      });

  },

});


// twitter-profile component

App.TwitterProfileComponent = Em.Component.extend(link, {

  target: '_blank',
  
  href: function(){
    return 'https://twitter.com/'+this.get('handle');
  }.property('handle'),

});


// list views

// App.TweetsListView = Em.ListView.extend({
//   height: 800,
//   rowHeight: 10,
//   itemViewClass: Em.ListItemView.extend({templateName: 'tweet'})
// });

// App.FeedsListView = Em.ListView.extend({
//   height: 800,
//   rowHeight: 200,
//   itemViewClass: Em.ListItemView.extend({templateName: 'feed'})
// });

App.TweetsListView = Em.CollectionView.extend({
  itemViewClass: Em.View.extend({
    context: Em.computed.oneWay('content'),
    templateName: 'tweet'
  })
});

App.FeedsListView = Em.CollectionView.extend({
  itemViewClass: Em.View.extend({
    context: Em.computed.oneWay('content'),
    templateName: 'feed'
  })
});

// date-time

App.DateTimeComponent = Ember.Component.extend({

  tagName: 'span',

  didInsertElement: function(){

    var self = this;

    this._super();

    var id = setInterval(fn, 15000);
    this.set('intervalId', id);
    fn();
    function fn(){
      self.set('formatedDate', moment((new Date(self.get('date')))).utc().fromNow());
    }

  },

  willDestroyElement: function(){
    clearInterval(this.get('intervalId'));
  }

});