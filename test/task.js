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

describe('Task()', function(){

  var orchestrator;

  function noop(){}

  beforeEach(function(done){
    orchestrator = new Orchestrator();

    orchestrator.task('task1', noop);
    done();
  });

  it('should return task if there is a task', function(done) {
    var task = orchestrator.task('task1');

    expect(task).to.equal(noop);
    done();
  });

  it('should return nothing if there is no such task', function(done) {
    var task = orchestrator.task('notexist');

    expect(task).not.exist;
    done();
  });

  it('should create a task if passed a second arg', function(done) {
    var name = 'task2';
    orchestrator.task(name, noop);

    expect(orchestrator.registry.tasks[name]).to.exist;
    expect(orchestrator.registry.tasks[name]).to.equal(noop);
    done();
  });

  it('should create a task if passed a named function as first arg', function(done){
    function task3(){}
    orchestrator.task(task3);

    expect(orchestrator.registry.tasks.task3).to.exist;
    expect(orchestrator.registry.tasks.task3).to.equal(task3);
    done();
  });

  it('should error if passed an anonymous function as first arg', function(done){
    var task3 = function(){};

    expect(function(){
      orchestrator.task(task3);
    }).to.throw(Error);

    expect(orchestrator.registry.tasks.task3).to.not.exist;
    done();
  });

});
