'use strict';

var bach = require('bach');

var normalizeArgs = require('./lib/normalizeArgs');

var DefaultRegistry = require('./registry/Default');

function Orchestrator(registry){
  this.registry = registry || new DefaultRegistry();
}

Orchestrator.prototype.task = function(taskName, fn){
  var registry = this.registry;

  if(fn){
    return registry.set.apply(registry, arguments);
  }

  return registry.get(taskName);
};

Orchestrator.prototype.series = function(){
  var args = normalizeArgs(this.registry, arguments);
  return bach.series(args);
};

Orchestrator.prototype.parallel = function(){
  var args = normalizeArgs(this.registry, arguments);
  return bach.parallel(args);
};

module.exports = Orchestrator;
