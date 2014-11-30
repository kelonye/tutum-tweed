/**
  * Module dependencies.
  */


// Application route

App.ApplicationRoute = Em.Route.extend({

  setupController: function(c, m){
    this._super(c, m);
    c.setup(m);
  },
  
  actions: {

    notify: function(type, msg){
      this.controllerFor('application').set(type, msg);
    },

    unnotify: function(type){
      this.controllerFor('application').set(type, null);
    },

  },

});


// Index route

App.IndexRoute = Em.Route.extend({

  setupController: function(c, m){
    this._super(c, m);
    c.setup(m);
  },
  
});

