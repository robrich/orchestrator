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

var promiseShimmed = false;
if(!global.Promise){
  promiseShimmed = true;
  require('when/es6-shim/Promise'); // Shim Promise global if we don't have it
}

describe('Returning a promise', function(){

  var orchestrator;
  var error = new Error('rejected');

  beforeEach(function(done){
    orchestrator = new Orchestrator();

    orchestrator.task('fulfilled', function(){
      return Promise.resolve('resolved');
    });

    orchestrator.task('rejected', function(){
      return Promise.reject(error);
    });

    done();
  });

  after(function(done){
    if(promiseShimmed){
      delete global.Promise;
    }
    done();
  });

  afterEach(function(done){
    orchestrator = null;
    done();
  });

  it('should complete when a sinle task is fulfilled', function(done){
    orchestrator.parallel('fulfilled')(function(err, res){
      expect(err).to.not.exist;

      expect(res).to.be.an.instanceof(Array);
      expect(res).to.contain('resolved');

      done(err);
    });
  });

  it('should complete when multiple tasks are fulfilled', function(done){
    orchestrator.parallel('fulfilled', 'fulfilled')(function(err, res){
      expect(err).to.not.exist;

      expect(res).to.be.an.instanceof(Array);
      expect(res).to.deep.include.members(['resolved', 'resolved']);

      done(err);
    });
  });

  it('should error when a single task is rejected', function(done){
    orchestrator.parallel('rejected')(function(err, res){
      expect(err).to.be.an.instanceof(Error);
      expect(err).to.equal(error);

      expect(res).to.be.an.instanceof(Array);
      expect(res).to.contain(undefined);

      done();
    });
  });

  it('should error when one of multiple tasks is rejected', function(done){
    orchestrator.parallel('fulfilled', 'rejected')(function(err, res){
      expect(err).to.be.an.instanceof(Error);
      expect(err).to.equal(error);

      expect(res).to.be.an.instanceof(Array);
      expect(res).to.deep.equal(['resolved', undefined]);

      done();
    });
  });
});
