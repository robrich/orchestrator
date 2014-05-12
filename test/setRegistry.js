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

describe('setRegistry()', function(){

  var orchestrator;
  var newRegistry;

  function noop(){}

  function missingKey(missingKey){
    return function(){
      delete newRegistry[missingKey];
      orchestrator.setRegistry(newRegistry);
    };
  }
  function notMethod(isntMethod){
    return function(){
      newRegistry[isntMethod] = '';
      orchestrator.setRegistry(newRegistry);
    };
  }

  beforeEach(function(done){
    orchestrator = new Orchestrator();

    newRegistry = {
      get: function(name){
        return this.tasks[name];
      },
      set: function(name, fn){
        this.tasks[name] = fn;
      },
      time: noop,
      all: noop,
      tasks: {}
    };

    orchestrator.task('task1', noop);
    orchestrator.task('task2', noop);
    done();
  });

  afterEach(function(done){
    orchestrator = null;
    newRegistry = null;
    done();
  });

  it('should transfer all tasks to the new registry', function(done){
    orchestrator.setRegistry(newRegistry);

    expect(orchestrator.registry).to.equal(newRegistry);
    expect(orchestrator.registry.tasks.task1).to.equal(noop);
    expect(orchestrator.registry.tasks.task2).to.equal(noop);
    done();
  });

  var requiredMethods = ['get', 'set', 'time', 'all'];

  // generative testing for registry required methods
  requiredMethods.forEach(function(key){
    it('should throw if no ' + key + ' property', function(done){
      var fn = missingKey(key);
      expect(fn).to.throw(Error);
      expect(fn).to.throw(new RegExp(key));
      done();
    });

    it('should throw if ' + key + ' is not a method', function(done){
      var fn = notMethod(key);
      expect(fn).to.throw(Error);
      expect(fn).to.throw(new RegExp(key));
      done();
    });
  });

  it('should throw if no tasks object', function(done){
    var fn = missingKey('tasks');
    expect(fn).to.throw(Error);
    expect(fn).to.throw(/tasks/);
    done();
  });
});
