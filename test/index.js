'use strict';

var lab = require('lab');
var describe = lab.experiment;
var it = lab.test;
var expect = lab.expect;
var before = lab.before;
var after = lab.after;
var expect = lab.expect;

var Orchestrator = require('../');

var fs = require('fs');
var through = require('through2');

describe('description', function(){

  var o = new Orchestrator();
  o.task('task1', function(cb){
    cb(null, 1);
  });

  o.task('task2', function(){
    return fs.createReadStream('./index.js')
      .pipe(through(function(buf, enc, done){
        this.push(buf);
        done();
      }, function(){
        this.emit('end', 2);
      }));
  });
});
