'use strict';

var chai = require('chai');

var expect = chai.expect;

var Orchestrator = require('../');

describe('description', function(){

  var o = new Orchestrator();

  o.task('task1', function(){
    console.log('task1');

    return 1;
  });

  o.task('task2', function(){
    console.log('task2');

    return 2;
  });

  it('description', function(){
    o.series('task1', 'task2')(console.log);
    // expect(target);
  });
});
