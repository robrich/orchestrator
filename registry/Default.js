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
  var evt = {
    name: name,
    fn: fn
  };

  if(this.tasks[name]){
    evt.oldFn = this.tasks[name];
    this.emit('update', evt);
  } else {
    this.emit('new', evt);
  }

  this.tasks[name] = fn;
};

DefaultRegistry.prototype.normalize = function(task){
  var name = null;
  var fn = task;

  if(typeof task === 'string'){
    name = task;
    fn = this.get(task);
  }

  if(typeof task === 'function' && task.name){
    name = task.name;
    fn = task;
  }

  return {
    name: name,
    fn: fn
  };
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

module.exports = DefaultRegistry;
