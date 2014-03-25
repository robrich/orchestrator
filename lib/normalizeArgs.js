'use strict';

var _ = require('lodash');

function normalizeArgs(registry, args){
  return _.map(_.flatten(args), function(arg){
    return registry.time(arg);
  });
}

module.exports = normalizeArgs;
