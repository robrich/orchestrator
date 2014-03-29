'use strict';

var chai = require('chai');

var expect = chai.expect;

var Orchestrator = require('../');

var fs = require('fs');
var through = require('through2');

describe.skip('description', function(){

  var o = new Orchestrator();

  o.task('task1', function(cb){
    console.log('task1');

    cb(null, 1);
  });

  o.task('task2', function(){
    console.log('task2');

    return fs.createReadStream('./index.js')
      .pipe(through(function(buf, enc, done){
        this.push(buf);
        done();
      }, function(){
        this.emit('end', 2);
      }));
  });

  it('description', function(done){
    function logTime(name, evt){
      console.log(name, evt.duration);
    }
    o.registry.on('start', logTime.bind(null, 'start'));
    o.registry.on('stop', logTime.bind(null, 'stop'));
    o.series('task1', 'task2')(function(err, res){
      console.log(err, res);
      done();
    });
    // expect(target);
  });

  it('should return all tasks', function(){
    console.log(o.registry.all());
  });
});
