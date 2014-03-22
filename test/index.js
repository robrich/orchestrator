'use strict';

var chai = require('chai');

var expect = chai.expect;

var Orchestrator = require('../');

var prettyTime = require('pretty-hrtime');

describe('description', function(){

  var o = new Orchestrator();

  o.task('task1', function(cb){
    console.log('task1');

    cb(null, 1);
  });

  o.task('task2', function(cb){
    console.log('task2');

    cb(null, 2);
  });

  it('description', function(){
    function logTime(time){
      console.log(prettyTime(time));
    }
    o.registry.on('start', logTime);
    o.registry.on('end', logTime);
    o.series('task1', 'task2')(console.log);
    // expect(target);
  });
});
