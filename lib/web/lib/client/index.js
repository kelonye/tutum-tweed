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

// router

App.Router.map(function(){

});
