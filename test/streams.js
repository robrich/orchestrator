'use strict';

var lab = require('lab');
var describe = lab.experiment;
var it = lab.test;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;
var afterEach = lab.afterEach;
var expect = lab.expect;

var Orchestrator = require('../');

var fs = require('fs');
var net = require('net');

describe('Returning a stream', function(){

  var orchestrator;
  var server;

  before(function(done){
    server = net.createServer().listen(30000, done);
  });

  beforeEach(function(done){
    orchestrator = new Orchestrator();

    orchestrator.task('read stream', function(){
      var rs = fs.createReadStream(__filename);
      rs.close();
      return rs;
    });

    orchestrator.task('write stream', function(){
      var ws = fs.createWriteStream('/dev/null');
      ws.close();
      return ws;
    });

    orchestrator.task('piped stream', function(){
      return fs.createReadStream('./index.js')
        .pipe(fs.createWriteStream('/dev/null'));
    });

    orchestrator.task('request stream', function(){
      var client = net.connect(30000, function(){
        client.end();
      });

      return client;
    });

    orchestrator.task('error stream', function(){
      return fs.createReadStream('./not/exist');
    });

    done();
  });

  after(function(done){
    server.close();
    server = null;
    done();
  });

  afterEach(function(done){
    orchestrator = null;
    done();
  });

  it('should complete the task when a read stream is done', function(done){
    orchestrator.parallel('read stream')(function(err){
      expect(err).to.not.exist;
      done(err);
    });
  });

  it('should complete the task when a write stream is done', function(done){
    orchestrator.parallel('write stream')(function(err){
      expect(err).to.not.exist;
      done(err);
    });
  });

  it('should complete the task when a piped stream is done', function(done){
    orchestrator.parallel('piped stream')(function(err){
      expect(err).to.not.exist;
      done(err);
    });
  });

  it('should complete the task when a request stream is done', function(done){
    orchestrator.parallel('request stream')(function(err){
      expect(err).to.not.exist;
      done(err);
    });
  });

  it('should error the task when a stream errors', function(done){
    orchestrator.parallel('error stream')(function(err){
      expect(err).to.be.instanceof(Error);
      done();
    });
  });
});
