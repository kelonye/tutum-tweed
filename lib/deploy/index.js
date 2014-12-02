#!/usr/bin/env node

var Batch =  require('batch');
var request = require('superagent');
var debug = require('debug')('app:deploy');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var fs = require('fs');
var read = fs.readFileSync;
var join = require('path').join;
var yaml = require('js-yaml');


function Program(){

  this.cwd = join(__dirname, '/../../');
  this.apiVersion = 1;
  this.apiBaseURL = 'https://dashboard.tutum.co/api/v'+this.apiVersion;
  this.parseConf();
  this.deploy();

};


Program.prototype.parseConf = function(){

  var conf;

  try {
    var conf = read(join(this.cwd, 'tutum.yaml'), 'utf8');
  } catch (e) {
    return debug('tutum conf read error: '+e.message);
  }

  for (var setting in process.env){
    var match = setting.match(/^TUTUM_(\w+)/);
    if (match){
      console.log(match)
      var rgx = new RegExp('{{'+match[1]+'}}', 'g');
      conf = conf.replace(rgx, process.env[setting]);
    }
  }

  try {
    var doc = yaml.safeLoad(conf);
  } catch (e) {
    return debug('tutum conf parse error: '+e.message);
  }

  if (!doc.cluster) return debug('tutum conf parse error: cluster info required');
  if (!doc.services) return debug('tutum conf parse error: services info required;');

  this.cluster = doc.cluster;
  this.services = doc.services;

};


Program.prototype.deploy = function(){

  var self = this;

  var batch = new Batch;
  
  batch.concurrency(1);
    
  batch.push(this.parseConf.bind(this));

  batch.push(this.getCluster.bind(this));
  
  batch.push(this.createCluster.bind(this));

  this.services.forEach(function(service){
    
    batch.push(self.buildImage.bind(self, service));
    batch.push(self.pushImage.bind(self, service));
    batch.push(self.getService.bind(self, service));
    batch.push(self.createService.bind(self, service));
    batch.push(self.startService.bind(self, service));
    batch.push(self.updateService.bind(self, service));
    batch.push(self.redeployService.bind(self, service));

  });
  
  batch.push(function(cb){
    fs.unlink(join(homePath, 'Dockerfile'), function(err){
      cb();
    });
  });

  batch.end(function(err){
    if (err) return debug('deployment failed: %s', err.message);
    debug('deployment successful');
  });

};


Program.prototype.getCluster = function(done) {

  debug('getting cluster: %s', this.cluster.name);

  var self = this;
  self
    .get('/nodecluster/?name='+this.cluster.name)
    .end(function(err, response){
      if (err) return done(err);
      if (response.status !== 200) return done(new Error('error getting '+self.cluster.name+' cluster: '+response.text));
      self.cluster.tutum = response.body.objects[0];
      done();
    });

};


Program.prototype.createCluster = function(done) {

  if (this.cluster.tutum){
    debug('%s cluster already created, skipping', this.cluster.name);
    return done();
  };

  debug('creating cluster: %s', this.cluster.name);

  self
    .post('/nodecluster/')
    .send(this.cluster)
    .end(function(err, response){
      if (err) return done(err);
      if (response.status !== 201) return done(new Error('error creating '+self.cluster.name+' cluster: '+response.text));
      self.cluster.tutum = response.body;
      done();
    });

};


Program.prototype.buildImage = function(service, done) {

  var script = 'docker build '+service.image+' '+service.path;

  debug('building %s', service.image);

  var cmd = spawn('bash', ['-c', script]);
  cmd.stdout.setEncoding('utf8');
  cmd.stdout.on('data', function (data) {
    debug(data);
  });
  cmd.stderr.on('data', function (data) {
    debug('stderr: ' + data);
  });
  cmd.on('close', function (code) {
    done();
  });

};


Program.prototype.pushImage = function(service, done) {

  debug('pushing %s', service.image);

  var cmd = spawn('bash', ['-c', 'docker push '+ service.image]);
  cmd.stdout.setEncoding('utf8');
  cmd.stdout.on('data', function (data) {
    debug(data);
  });
  cmd.stderr.on('data', function (data) {
    debug('stderr: ' + data);
  });
  cmd.on('close', function (code) {
    done();
  });

};


Program.prototype.getService = function(service, done) {

  var self = this;
  
  debug('getting service %s', service.name);

  self
    .get('/service/?name='+service.name)
    .end(function(err, response){
      if (err) return done(err);
      if (response.status !== 200) return done(new Error('error fetching services: '+ response.text));
      service.tutum = response.body.objects.filter(function(s){
        return !(s.state == 'Terminated' || s.state == 'Terminating');
      })[0];
      done();
    });

};


Program.prototype.createService = function(service, done) {

  var self = this;

  if (service.tutum){
    debug('create service: service %s is already created, skipping', service.name);
    return done();
  }

  debug('creating service: %s', service.name);

  if (services.require){
    service.linked_to_service = services.require.map(function(link){
      return self
        .services
        .filter(function(s){
          return s.name == link;
        })
        .map(function(s){
          return {
            to_service: '/api/v'+self.apiVersion+'/service/'+s.tutum.uuid+'/',
            name: link
          };
        });
    });
  }

  self
    .post('/service/')
    .send(service)
    .end(function(err, response){
      if (err) return done(err);
      if (response.status !== 201) return done(new Error('error creating '+service.name+' service: '+response.text));
      service.tutum = response.body;
      done(err);
    });

};


Program.prototype.startService = function(service, done){

  debug('starting service: %s(%s)', service.name, service.tutum.uuid);

  var self = this;

  self
    .post('/service/'+service.tutum.uuid+'/start/')
    .send(service)
    .end(function(err, response){
      if (err) return done(err);
      // if (response.status !== 202) return done(new Error('error starting '+service.name+' service: '+response.text));
      done(err);
    });

};


Program.prototype.updateService = function(service, done){

  debug('update service: updating service: %s(%s)', service.name, service.tutum.uuid);

  var self = this;

  var uuid = service.tutum.uuid;
  delete service.tutum;

  self
    .patch('/service/'+uuid)
    .send(service)
    .end(function(err, response){
      if (err) return done(err);
      if (response.status !== 200) return done(new Error('error updating '+service.name+' service: '+response.text));
      service.tutum = response.body;
      done(err);
    });

};


Program.prototype.redeployService = function(service, done){

  debug('redeploying service: %s(%s)', service.name, service.tutum.uuid);

  var self = this;

  self
    .post('/service/'+service.tutum.uuid+'/redeploy/')
    .send(service)
    .end(function(err, response){
      if (err) return done(err);
      // if (response.status !== 202) return done(new Error('error redeploying '+service.name+' service: '+response.text));
      done(err);
    });

};


Program.prototype.get = function(url){

  return request
    .patch(this.url(url))
    .set(this.headers());

};


Program.prototype.post = function(url){

  return request
    .patch(this.url(url))
    .set(this.headers());

};


Program.prototype.patch = function(url){

  return request
    .patch(this.url(url))
    .set(this.headers());

};


Program.prototype.headers= function(){
  return {
    'Content-Type': 'application/json',
    Authorization: 'ApiKey '+process.env.TUTUM_USER+':'+process.env.TUTUM_APIKEY,
    Accept: 'application/json'
  };
};


Program.prototype.url = function(url){
  return this.apiBaseURL+url;
};


new Program;
