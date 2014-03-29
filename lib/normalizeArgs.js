'use strict';

var _ = require('lodash');

function normalizeArgs(registry, args){
  return _.map(_.flatten(args), registry.time, registry);
}

module.exports = normalizeArgs;
