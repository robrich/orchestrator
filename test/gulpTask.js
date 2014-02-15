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
	describe('run() integration tests', function() {
		it('should run multiple tasks', function(done) {
			var a, fn, fn2;
			a = 0;
			fn = function() {
				++a;
			};
			fn2 = function() {
				++a;
			};
			gulp.task('test', fn);
			gulp.task('test2', fn2);
			gulp.run('test', 'test2', function (err) {
				a.should.equal(2);
				should.not.exist(err);
				gulp.reset();
				done();
			});
		});
		it('should run all tasks when call run() multiple times', function(done) {
			var a, fn, fn2;
			a = 0;
			fn = function() {
				++a;
			};
			fn2 = function() {
				++a;
			};
			gulp.task('test', fn);
			gulp.task('test2', fn2);
			gulp.run('test');
			gulp.run('test2');
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
			gulp.run('test');
			gulp.run('test2', function () {
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
			gulp.run('test');
			gulp.run('test2', function () {
				a.should.equal(2);
				gulp.reset();
				done();
			});
		});
		it('should emit error and when task is not defined', function(done) {
			gulp.on('error', function(e){
				var err = e.err;
				should.exist(err);
				should.exist(err.missingTask);
				err.missingTask.should.equal('test');
			});
			gulp.run('test', function (err) {
				should.exist(err);
				gulp.reset();
				done();
			});
		});
	});
});
