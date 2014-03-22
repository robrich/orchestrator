'use strict';

var _ = require('lodash');

function normalizeArgs(registry, args){
  return _.map(args, function(arg){
    if(typeof arg === 'string'){
      return registry.get(arg);
    }

    return arg;
  });
}

module.exports = normalizeArgs;
