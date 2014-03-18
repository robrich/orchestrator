/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
var Q = require('q');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('run(parallel())', function() {

		it('should run multiple tasks', function(done) {
			var orchestrator, a, fn, fn2;

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function(cb) {
				++a;
				cb(null);
			};
			fn2 = function(cb) {
				++a;
				cb(null);
			};
			orchestrator.task('test', fn);
			orchestrator.task('test2', fn2);

			// act
			orchestrator.run(orchestrator.parallel('test', 'test2'), function (err/*, meta*/) {

				// assert
				a.should.equal(2);
				should.not.exist(err);
				done();
			});
		});

		it('should run all tasks when call run(parallel()) multiple times', function(done) {
			var orchestrator, a, fn, fn2, timeout = 20;

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function(cb) {
				++a;
				cb(null);
			};
			fn2 = function(cb) {
				++a;
				cb(null);
			};
			orchestrator.task('test', fn);
			orchestrator.task('test2', fn2);

			// act
			orchestrator.run(orchestrator.parallel('test'));
			orchestrator.run(orchestrator.parallel('test2'));

			setTimeout(function () {

				// assert
				a.should.equal(2);

				done();
			}, timeout);
		});

		it('should add new tasks at the front of the queue', function(done) {
			var orchestrator, a, fn, fn2, fn3, aAtFn2, aAtFn3;

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function(cb) {
				++a;
				orchestrator.run(orchestrator.parallel('test3'), cb);
			};
			fn2 = function(cb) {
				++a;
				aAtFn2 = a;
				cb(null);
			};
			fn3 = function(cb) {
				++a;
				aAtFn3 = a;
				cb(null);
			};
			orchestrator.task('test', fn);
			orchestrator.task('test2', ['test'], fn2);
			orchestrator.task('test3', fn3);

			// act
			orchestrator.run(orchestrator.parallel('test', 'test2'), function (err/*, stats*/) {

				// assert
				aAtFn3.should.equal(2); // 1 and 3 ran
				aAtFn2.should.equal(3); // 1, 3, and 2 ran
				a.should.equal(3);
				should.not.exist(err);

				done();
			});
		});

		it('should run all tasks when call run(parallel()) multiple times', function(done) {
			var orchestrator, a, fn, fn2, timeout = 20;

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function(cb) {
				++a;
				cb(null);
			};
			fn2 = function(cb) {
				++a;
				cb(null);
			};
			orchestrator.task('test', fn);
			orchestrator.task('test2', fn2);

			// act
			orchestrator.run(orchestrator.parallel('test'));
			orchestrator.run(orchestrator.parallel('test2'));

			setTimeout(function () {

				// assert
				a.should.equal(2);
				done();
			}, timeout);
		});

		it('should run no tasks when call run(parallel()) with no arguments', function(done) {
			var orchestrator, a, fn, fn2;

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function(cb) {
				++a;
				cb(null);
			};
			fn2 = function(cb) {
				++a;
				cb(null);
			};
			orchestrator.task('test', fn);
			orchestrator.task('test2', fn2);

			// act
			orchestrator.run(orchestrator.parallel(), function () {

				// assert
				a.should.equal(0);
				done();
			});
		});

		it('should run all async promise tasks', function(done) {
			var orchestrator, a, fn, fn2;

			// arrange
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
			orchestrator.task('test', fn);
			orchestrator.task('test2', fn2);

			// act
			orchestrator.run(orchestrator.parallel('test')); // FRAGILE: ASSUME: test finishes before test2
			orchestrator.run(orchestrator.parallel('test2'), function () {
				// assert
				a.should.equal(2);
				done();
			});
		});

		it('should run all async callback tasks', function(done) {
			var orchestrator, a, fn, fn2;

			// arrange
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
			orchestrator.task('test', fn);
			orchestrator.task('test2', fn2);

			// act
			orchestrator.run(orchestrator.parallel('test')); // FRAGILE: ASSUME: test finishes before test2
			orchestrator.run(orchestrator.parallel('test2'), function () {
				// assert
				a.should.equal(2);
				done();
			});
		});

		it('should run task scoped to task', function(done) {
			var orchestrator, a, fn;

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function(cb) {
				this.name.should.equal('test');
				this.fn.should.equal(fn);
				++a;
				cb(null);
			};
			orchestrator.task('test', fn);

			// act
			orchestrator.run(orchestrator.parallel('test'), function () {

				// assert
				a.should.equal(1);
				done();
			});
		});

		// FRAGILE: It resets task.done at `.run(parallel()` so if task isn't finished when you call `run()` again, it won't run again

		it('should run task multiple times when call run(parallel(task)) multiple times', function(done) {
			var orchestrator, a, fn;

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function(cb) {
				++a;
				cb(null);
			};
			orchestrator.task('test', fn);

			// act
			orchestrator.run(orchestrator.parallel('test'));
			orchestrator.run(orchestrator.parallel('test'));

			setTimeout(function () {
				// assert
				a.should.equal(2);
				done();
			}, 30);
		});

		it('should run task dependencies multiple times when call run(parallel(task)) multiple times', function(done) {
			var orchestrator, a, fn, dep;

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			dep = function(cb) {
				++a;
				cb(null);
			};
			fn = function(cb) {
				cb(null);
			};
			orchestrator.task('dep', dep);
			orchestrator.task('test', ['dep'], fn);

			// act
			orchestrator.run(orchestrator.parallel('test'));
			orchestrator.run(orchestrator.parallel('test'));

			setTimeout(function () {
				// assert
				a.should.equal(2);
				done();
			}, 30);
		});

		it('should run task multiple times when call run(parallel()) (default) multiple times', function(done) {
			var orchestrator, a, fn;

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			fn = function(cb) {
				++a;
				cb(null);
			};
			orchestrator.task('test', fn);
			orchestrator.task('default', ['test'], function () {});

			// act
			orchestrator.run(orchestrator.parallel('default'), function () {
				// Finished first run, now run a second time
				orchestrator.run(orchestrator.parallel('default'), function () {

					// assert
					a.should.equal(2);
					done();
				});
			});
		});

	});
});
