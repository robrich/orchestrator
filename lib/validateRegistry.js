'use strict';

var assert = require('assert');

var requiredKeys = ['get', 'set', 'all', 'time', 'tasks'];

function validateRegistry(registry){
  requiredKeys.forEach(function(key){
    assert(registry[key], 'registry.' + key + ' must be defined in a registry');
    if(key !== 'tasks'){
      assert(typeof registry[key] === 'function', 'registry.' + key + ' must be a function in a registry');
    }
  });
}

module.exports = validateRegistry;
