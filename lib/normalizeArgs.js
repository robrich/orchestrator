'use strict';

function normalizeArgs(registry, args){
  return Array.prototype.slice.call(args).map(registry.time, registry);
}

module.exports = normalizeArgs;
