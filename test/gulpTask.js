/*global describe:false, it:false */
'use strict';

var Orchestrator = require('../');
var Q = require('q');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	var gulp = new Orchestrator();
	describe('gulp tests', function() {
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
	describe('runParallel() integration tests', function() {
		it('should run multiple tasks', function(done) {
			var a, fn, fn2;
			a = 0;
			fn = function(cb) {
				++a;
				cb(null);
			};
			fn2 = function(cb) {
				++a;
				cb(null);
			};
			gulp.task('test', fn);
			gulp.task('test2', fn2);
			gulp.runParallel('test', 'test2', function (err) {
				a.should.equal(2);
				should.not.exist(err);
				gulp.reset();
				done();
			});
		});
		it('should run all tasks when call runParallel() multiple times', function(done) {
			var a, fn, fn2;
			a = 0;
			fn = function(cb) {
				++a;
				cb(null);
			};
			fn2 = function(cb) {
				++a;
				cb(null);
			};
			gulp.task('test', fn);
			gulp.task('test2', fn2);
			gulp.runParallel('test');
			gulp.runParallel('test2');
			setTimeout(function () {
				a.should.equal(2);
				gulp.reset();
				done();
			}, 30);
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
			gulp.runParallel('test');
			gulp.runParallel('test2', function () {
				a.should.equal(2);
				gulp.reset();
				done();
			});
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
			gulp.runParallel('test');
			gulp.runParallel('test2', function () {
				a.should.equal(2);
				gulp.reset();
				done();
			});
		});
		it('should emit error and when task is not defined', function(done) {
			gulp.on('error', function(e){
				var err = e.err;
				should.exist(err);
				should.exist(err.missingTasks);
				err.missingTasks.length.should.equal(1);
				err.missingTasks[0].should.equal('test');
			});
			gulp.runParallel('test', function (err) {
				should.exist(err);
				gulp.reset();
				done();
			});
		});
	});
});
