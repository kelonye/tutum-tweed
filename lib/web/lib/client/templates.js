[
  'application',
  'index',
  'components/date-time',
  'tweet',
  'feed'
].forEach(function(t){
  var mod = './templates/'+t.replace('/', '-');
  Em.TEMPLATES[t] = Em.Handlebars.compile(require(mod));
});
