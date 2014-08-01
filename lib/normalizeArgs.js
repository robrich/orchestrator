'use strict';

function normalizeArgs(registry, args){
  return Array.prototype.slice.call(args).map(function(taskOrFn) {
    return typeof taskOrFn === 'function' ? taskOrFn : registry.get(taskOrFn);
  }, registry);
}

module.exports = normalizeArgs;
