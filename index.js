'use strict';

var _ = require('lodash');
var bach = require('bach');

var normalizeArgs = require('./lib/normalizeArgs');
var validateRegistry = require('./lib/validateRegistry');

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

Orchestrator.prototype.setRegistry = function(newRegistry){
  validateRegistry(newRegistry);
  var tasks = this.registry.all();
  _.forEach(tasks, function(task){
    newRegistry.set(task.name, task.fn);
  });
  this.registry = newRegistry;
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
