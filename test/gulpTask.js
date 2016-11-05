/*jshint node:true */
/*global describe:false, it:false */
'use strict';

var Orchestrator = require('../');
var Q = require('q');
var vfs = require('vinyl-fs');
var es = require('event-stream');
var ms = require('merge-stream');
var uglify = require('gulp-uglify');
var should = require('should');
require('mocha');

describe('orchestrator tasks integration tests', function() {
  var gulp = new Orchestrator();
  describe('task()', function() {
    it('should define a task', function(done) {
      var fn;
      fn = function() {};
      gulp.task('test', fn);
      should.exist(gulp.tasks.test);
      gulp.tasks.test.fn.should.equal(fn);
      gulp.reset();
      done();
    });
  });
  describe('start()', function() {
    it('should run multiple tasks', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        this.should.equal(gulp);
        ++a;
      };
      fn2 = function() {
        this.should.equal(gulp);
        ++a;
      };
      gulp.task('test', fn);
      gulp.task('test2', fn2);
      gulp.start('test', 'test2');
      a.should.equal(2);
      gulp.reset();
      done();
    });
    it('should run all tasks when call start() multiple times', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        this.should.equal(gulp);
        ++a;
      };
      fn2 = function() {
        this.should.equal(gulp);
        ++a;
      };
      gulp.task('test', fn);
      gulp.task('test2', fn2);
      gulp.start('test');
      gulp.start('test2');
      a.should.equal(2);
      gulp.reset();
      done();
    });
    it('should run all async promise tasks', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        var deferred = Q.defer();
        setTimeout(function () {
          ++a;
          deferred.resolve();
        },1);
        return deferred.promise;
      };
      fn2 = function() {
        var deferred = Q.defer();
        setTimeout(function () {
          ++a;
          deferred.resolve();
        },1);
        return deferred.promise;
      };
      gulp.task('test', fn);
      gulp.task('test2', fn2);
      gulp.start('test');
      gulp.start('test2', function () {
        gulp.isRunning.should.equal(false);
        a.should.equal(2);
        gulp.reset();
        done();
      });
      gulp.isRunning.should.equal(true);
    });
    it('should run all async callback tasks', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function(cb) {
        setTimeout(function () {
          ++a;
          cb(null);
        },1);
      };
      fn2 = function(cb) {
        setTimeout(function () {
          ++a;
          cb(null);
        },1);
      };
      gulp.task('test', fn);
      gulp.task('test2', fn2);
      gulp.start('test');
      gulp.start('test2', function () {
        gulp.isRunning.should.equal(false);
        a.should.equal(2);
        gulp.reset();
        done();
      });
      gulp.isRunning.should.equal(true);
    });
    it('should run all async stream tasks', function(done){
      var a, fn, fn2, fn3, fn4;
      a = 0;
      fn = function(cb) {
        return vfs.src('./index.js')
          .pipe(uglify());
      };
      fn2 = function(cb) {
        var stream1 = vfs.src('./index.js')
          .pipe(vfs.dest('./test/.tmp'));
        var stream2 = vfs.src('./index.js')
          .pipe(vfs.dest('./test/.tmp'));
        return es.concat(stream1, stream2);
      };
      fn3 = function(cb) {
        var stream1 = vfs.src('./index.js')
          .pipe(vfs.dest('./test/.tmp'));
        var stream2 = vfs.src('./index.js')
          .pipe(vfs.dest('./test/.tmp'));
        return ms(stream1, stream2);
      };
      fn4 = function(cb) {
        return vfs.src('./index.js')
          .pipe(vfs.dest('./test/.tmp'));
      };
      gulp.task('test', fn);
      gulp.task('test2', fn2);
      gulp.task('test3', fn3);
      gulp.task('test4', fn4);
      gulp.on('task_stop', function(){
        ++a;
      });
      gulp.start('test');
      gulp.start('test2');
      gulp.start('test3');
      gulp.start('test4', function () {
        gulp.isRunning.should.equal(false);
        a.should.equal(4);
        done();
      });
    });
    it('should emit task_not_found and throw an error when task is not defined', function(done) {
      gulp.reset();
      var aErr;
      gulp.on('task_not_found', function(err){
        should.exist(err);
        should.exist(err.task);
        err.task.should.equal('test');
        gulp.reset();
        done();
      });
      try {
        gulp.start('test');
      } catch (err) {
        aErr = err;
      }
      should.exist(aErr);
    });
  });
});
