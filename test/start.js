/*jshint node:true */
/*global describe:false, it:false */
"use strict";

var Orchestrator = require('../');
var Q = require('q');
require('should');
require('mocha');

describe('orchestrator', function() {
	describe('run() tasks', function() {

		it('should run multiple tasks', function(done) {
			var orchestrator, a, fn, fn2;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function() {
				++a;
			};
			fn2 = function() {
				++a;
			};
			orchestrator.add('test', fn);
			orchestrator.add('test2', fn2);

			// Act
			orchestrator.start('test', 'test2');

			// Assert
			a.should.equal(2);
			done();
		});

		it('should run multiple tasks as array', function(done) {
			var orchestrator, a, fn, fn2, fn3;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function() {
				++a;
			};
			fn2 = function() {
				++a;
			};
			fn3 = function() {
				throw new Error('run wrong task');
			};
			orchestrator.add('test', fn);
			orchestrator.add('test2', fn2);
			orchestrator.add('test3', fn3);

			// Act
			orchestrator.start(['test', 'test2']);

			// Assert
			a.should.equal(2);
			done();
		});

		it('should run all tasks when call run() multiple times', function(done) {
			var orchestrator, a, fn, fn2;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function() {
				++a;
			};
			fn2 = function() {
				++a;
			};
			orchestrator.add('test', fn);
			orchestrator.add('test2', fn2);

			// Act
			orchestrator.start('test');
			orchestrator.start('test2');

			// Assert
			a.should.equal(2);
			done();
		});

		it('should add new tasks at the front of the queue', function(done) {
			var orchestrator, a, fn, fn2, fn3, aAtFn2, aAtFn3, test2pos, test3pos;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function() {
				++a;
				orchestrator.start('test3');
			};
			fn2 = function() {
				++a;
				aAtFn2 = a;
			};
			fn3 = function() {
				++a;
				aAtFn3 = a;
			};
			orchestrator.add('test', fn);
			orchestrator.add('test2', fn2);
			orchestrator.add('test3', fn3);

			// Act
			orchestrator.start('test', 'test2');

			// Assert
			aAtFn3.should.equal(2); // 1 and 3 ran
			aAtFn2.should.equal(3); // 1, 3, and 2 ran
			a.should.equal(3);
			test2pos = orchestrator.seq.indexOf('test2');
			test3pos = orchestrator.seq.indexOf('test3');
			test2pos.should.be.above(-1);
			test3pos.should.be.above(-1);
			test2pos.should.be.above(test3pos);
			done();
		});

		it('should run all tasks when call run() multiple times', function(done) {
			var orchestrator, a, fn, fn2;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function() {
				++a;
			};
			fn2 = function() {
				++a;
			};
			orchestrator.add('test', fn);
			orchestrator.add('test2', fn2);

			// Act
			orchestrator.start('test');
			orchestrator.start('test2');

			// Assert
			a.should.equal(2);
			done();
		});

		it('should run all tasks when call run() with no arguments', function(done) {
			var orchestrator, a, fn, fn2;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function() {
				++a;
			};
			fn2 = function() {
				++a;
			};
			orchestrator.add('test', fn);
			orchestrator.add('test2', fn2);

			// Act
			orchestrator.start();

			// Assert
			a.should.equal(2);
			done();
		});

		it('should run all async promise tasks', function(done) {
			var orchestrator, a, fn, fn2;

			// Arrange
			orchestrator = new Orchestrator();
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
			orchestrator.add('test', fn);
			orchestrator.add('test2', fn2);

			// Act
			orchestrator.start('test');
			orchestrator.start('test2', function () {
				// Assert
				orchestrator.isRunning.should.equal(false);
				a.should.equal(2);
				done();
			});
			orchestrator.isRunning.should.equal(true);
		});

		it('should run all async callback tasks', function(done) {
			var orchestrator, a, fn, fn2;

			// Arrange
			orchestrator = new Orchestrator();
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
			orchestrator.add('test', fn);
			orchestrator.add('test2', fn2);

			// Act
			orchestrator.start('test');
			orchestrator.start('test2', function () {
				// Assert
				orchestrator.isRunning.should.equal(false);
				a.should.equal(2);
				done();
			});
			orchestrator.isRunning.should.equal(true);
		});

		it('should run task scoped to orchestrator', function(done) {
			var orchestrator, a, fn;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function() {
				this.should.equal(orchestrator);
				++a;
			};
			orchestrator.add('test', fn);

			// Act
			orchestrator.start('test');

			// Assert
			a.should.equal(1);
			orchestrator.isRunning.should.equal(false);
			done();
		});

		// FRAGILE: It resets task.done at `.start()` so if task isn't finished when you call `start()` again, it won't run again

		it('should run task multiple times when call run(task) multiple times', function(done) {
			var orchestrator, a, fn;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function() {
				++a;
			};
			orchestrator.add('test', fn);

			// Act
			orchestrator.start('test');
			orchestrator.start('test');

			// Assert
			a.should.equal(2);
			done();
		});

		it('should run task dependencies multiple times when call run(task) multiple times', function(done) {
			var orchestrator, a, fn, dep;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			dep = function() {
				++a;
			};
			fn = function() {
			};
			orchestrator.add('dep', dep);
			orchestrator.add('test', ['dep'], fn);

			// Act
			orchestrator.start('test');
			orchestrator.start('test');

			// Assert
			a.should.equal(2);
			done();
		});

		it('should run task multiple times when call run() (default) multiple times', function(done) {
			var orchestrator, a, fn;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function() {
				++a;
			};
			orchestrator.add('test', fn);
			orchestrator.add('default', ['test'], function () {});

			// Act
			orchestrator.start(function () {
				// Finished first run, now run a second time
				orchestrator.start(function () {

					// Assert
					a.should.equal(2);
					done();
				});
			});
		});

		it('should run no-op task', function(done) {
			var orchestrator;

			// Arrange
			orchestrator = new Orchestrator();
			orchestrator.add('test');

			// Act
			orchestrator.start(function () {
				// Assert
				done();
			});
		});

	});
});
