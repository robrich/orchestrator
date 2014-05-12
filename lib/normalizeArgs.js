'use strict';

function normalizeArgs(registry, args){
  return Array.prototype.slice.call(args).map(registry.get, registry);
}

module.exports = normalizeArgs;
