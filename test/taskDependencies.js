/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var Orchestrator = require('../');
var Q = require('q');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('run() task dependencies', function() {
		// Technically these are duplicated from require('sequencify'),
		// but those are unit tests and these are integration tests
		it('should run tasks in specified order if no dependencies', function(done) {
			var orchestrator, a, fn, fn2;

			// Arrange
			a = 0;
			fn = function() {
				a.should.equal(1);
				++a;
			};
			fn2 = function() {
				a.should.equal(2);
				++a;
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator.on('start', function (e) {
				should.exist(e);
				a.should.equal(0);
				++a;
				e.message.should.startWith('seq: '); // Order is not deterministic, but event should still happen
			});
			orchestrator.add('test1', fn);
			orchestrator.add('test2', fn2);
			orchestrator.start('test1', 'test2', function (err) {
				// Assert
				a.should.equal(3);
				should.not.exist(err);
				done();
			});
		});

		it('should run dependency then specified task', function(done) {
			var orchestrator, a, fn, fn2;

			// Arrange
			a = 0;
			fn = function() {
				a.should.equal(1);
				++a;
			};
			fn2 = function() {
				a.should.equal(2);
				++a;
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator.on('start', function (e) {
				should.exist(e);
				a.should.equal(0);
				++a;
				e.message.should.equal('seq: dep,test');
			});
			orchestrator.add('dep', fn);
			orchestrator.add('test', ['dep'], fn2);
			orchestrator.start('test');

			// Assert
			a.should.equal(3);
			done();
		});

		it('should run asynchronous dependency then specified task', function(done) {
			var orchestrator, a, fn, fn2;

			// Arrange
			a = 0;
			fn = function() {
				var deferred = Q.defer();
				setTimeout(function () {
					a.should.equal(1);
					++a;
					deferred.resolve();
				},1);
				return deferred.promise;
			};
			fn2 = function() {
				var deferred = Q.defer();
				setTimeout(function () {
					a.should.equal(2);
					++a;
					deferred.resolve();
				},1);
				return deferred.promise;
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator.on('start', function (e) {
				should.exist(e);
				a.should.equal(0);
				++a;
				e.message.should.equal('seq: dep,test');
			});
			orchestrator.add('dep', fn);
			orchestrator.add('test', ['dep'], fn2);
			orchestrator.start('test', function () {
				// Assert
				orchestrator.isRunning.should.equal(false);
				a.should.equal(3);
				done();
			});
			orchestrator.isRunning.should.equal(true);
		});

		it('should run all tasks of complex dependency chain', function(done) {
			var orchestrator, a, fn1, fn2, fn3, fn4, timeout = 2;

			// Arrange
			a = 0;
			// fn1 is a long-running task, fn2 and 3 run quickly, fn4 is synchronous
			// If shorter tasks mark it done before the longer task finishes that's wrong
			fn1 = function() {
				var deferred = Q.defer();
				setTimeout(function () {
					++a;
					deferred.resolve();
				}, timeout*5);
				return deferred.promise;
			};
			fn2 = function() {
				var deferred = Q.defer();
				setTimeout(function () {
					++a;
					deferred.resolve();
				}, timeout);
				return deferred.promise;
			};
			fn3 = function() {
				var deferred = Q.defer();
				setTimeout(function () {
					++a;
					deferred.resolve();
				}, timeout);
				return deferred.promise;
			};
			fn4 = function() {
				++a;
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator.on('start', function (e) {
				should.exist(e);
				a.should.equal(0);
				++a;
				e.message.should.equal('seq: fn1,fn2,fn3,fn4');
			});
			orchestrator.add('fn1', fn1);
			orchestrator.add('fn2', fn2);
			orchestrator.add('fn3', ['fn1', 'fn2'], fn3);
			orchestrator.add('fn4', ['fn3'], fn4);
			orchestrator.start('fn4', function () {
				// Assert
				orchestrator.isRunning.should.equal(false);
				a.should.equal(5);
				done();
			});
			orchestrator.isRunning.should.equal(true);
		});

	});
});
