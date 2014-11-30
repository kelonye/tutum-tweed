/**
  * Module dependencies.
  */
require('ember');

// app

window.App = Em.Application.create({
  rootElement: '#body'
});

// app scripts

require('./templates');
require('./models');
require('./views');
require('./controllers');
require('./routes');

App.nprogress = {
  show: function(){
    NProgress.start();
    NProgress.set(0.4);
  },
  hide: function(){
    NProgress.done();
  },
};

// router

App.Router.map(function(){

});
