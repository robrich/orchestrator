'use strict';

var EE = require('events').EventEmitter;
var util = require('util');

var asyncDone = require('async-done');

function DefaultRegistry(){
  if(!(this instanceof DefaultRegistry)){
    return new DefaultRegistry();
  }

  EE.call(this);

  this.tasks = {};
}

util.inherits(DefaultRegistry, EE);

DefaultRegistry.prototype.get = function(name){
  return this.tasks[name];
};

DefaultRegistry.prototype.set = function(name, fn){
  var evt = this.normalize(name, fn);

  if(this.tasks[name]){
    evt.oldFn = this.tasks[name];
    this.emit('update', evt);
  } else {
    this.emit('new', evt);
  }

  this.tasks[name] = fn;
};

DefaultRegistry.prototype.all = function(){
  var tasks = this.tasks;
  var taskNames = Object.keys(tasks);
  return taskNames.map(this.normalize, this);
};

DefaultRegistry.prototype.time = function(task){
  var evt = this.normalize(task);

  var self = this;

  function timeTask(cb){
    var startTime = process.hrtime();
    evt.startTime = startTime;
    self.emit('start', evt);

    asyncDone(evt.fn, function(err, res){
      var duration = process.hrtime(startTime);
      evt.duration = duration;
      self.emit('stop', evt);

      cb(err, res);
    });
  }

  return timeTask;
};

DefaultRegistry.prototype.normalize = function(name, fn){
  if(typeof name === 'function'){
    fn = name;
    name = fn.name || null;
  }

  if(typeof name === 'string'){
    name = name;
  }

  if(typeof fn === 'function'){
    fn = fn;
  } else {
    fn = this.tasks[name];
  }

  return {
    name: name,
    fn: fn
  };
};

module.exports = DefaultRegistry;
