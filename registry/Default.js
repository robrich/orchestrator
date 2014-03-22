'use strict';

function DefaultRegistry(){
  if(!(this instanceof DefaultRegistry)){
    return new DefaultRegistry();
  }

  this.tasks = {};
}

DefaultRegistry.prototype.get = function(key){
  return this.tasks[key];
};

DefaultRegistry.prototype.set = function(key, value){
  this.tasks[key] = value;
};

module.exports = DefaultRegistry;
