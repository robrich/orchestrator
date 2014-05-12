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
var through = require('through2');

function transform(buf, enc, done){
  this.push(buf);
  done();
}

function end(){
  this.emit('end', 'ended');
}

function close(){
  this.emit('close', 'closed');
}

function exit(){
  this.emit('exit', 'exited');
}

describe('Returning a stream', function(){

  var orchestrator;
  var error = new Error('rejected');

  beforeEach(function(done){
    orchestrator = new Orchestrator();

    orchestrator.task('end', function(){
      return fs.createReadStream('./index.js')
        .pipe(through(transform, end));
    });

    orchestrator.task('close', function(){
      return fs.createReadStream('./index.js')
        .pipe(through(transform, close));
    });

    orchestrator.task('exit', function(){
      return fs.createReadStream('./index.js')
        .pipe(through(transform, exit));
    });

    done();
  });

  afterEach(function(done){
    orchestrator = null;
    done();
  });

  it('should complete the task when the stream emits "end"', function(done){
    orchestrator.parallel('end')(function(err, res){
      expect(err).to.not.exist;

      expect(res).to.be.an.instanceof(Array);
      expect(res).to.contain('ended');

      done(err);
    });
  });

  it('should complete the task when the stream emits "close"', function(done){
    orchestrator.parallel('close')(function(err, res){
      expect(err).to.not.exist;

      expect(res).to.be.an.instanceof(Array);
      expect(res).to.contain('closed');

      done(err);
    });
  });

  it('should complete the task when the stream emits "exit"', function(done){
    orchestrator.parallel('exit')(function(err, res){
      expect(err).to.not.exist;

      expect(res).to.be.an.instanceof(Array);
      expect(res).to.contain('exited');

      done(err);
    });
  });
});
