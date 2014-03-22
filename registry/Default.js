'use strict';

var EE = require('events').EventEmitter;
var util = require('util');

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
    this.emit('update', evt);
  } else {
    this.emit('new', evt);
  }

  this.tasks[name] = fn;
};

module.exports = DefaultRegistry;
