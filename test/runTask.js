/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var Orchestrator = require('../');
var Q = require('q');
var should = require('should');
require('mocha');

describe('orchestrator tasks execute as expected', function() {
	describe('_runTask()', function() {

		it('calls task function', function(done) {
			var orchestrator, a, task;

			// Arrange
			a = 0;
			task = {
				name: 'test',
				fn: function() {
					++a;
				}
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator._runTask(task);

			// Assert
			a.should.equal(1);
			done();
		});

		it('sets .running correctly', function(done) {
			var orchestrator, task;

			// Arrange
			task = {
				name: 'test',
				fn: function() {
					should.exist(task.running);
					task.running.should.equal(true);
				}
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator._runTask(task);

			// Assert
			should.exist(task.running);
			task.running.should.equal(false);
			done();
		});

		it('sync task sets done after calling function', function(done) {
			var orchestrator, task, a;

			// Arrange
			a = 0;
			task = {
				name: 'test',
				fn: function() {
					should.not.exist(task.done);
				}
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator._runStep = function () {
				a.should.equal(0);
				a++;
			};
			orchestrator._runTask(task);

			// Assert
			should.exist(task.done);
			task.done.should.equal(true);
			a.should.equal(0); // It's done so it need not run more
			done();
		});

		it('async promise task sets done after task resolves', function(done) {
			var orchestrator, task, timeout = 5, a;

			// Arrange
			a = 0;
			task = {
				name: 'test',
				fn: function() {
					var deferred = Q.defer();
					setTimeout(function () {
						should.not.exist(task.done);
						deferred.resolve();
					}, timeout);
					return deferred.promise;
				}
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator._runStep = function () {
				a.should.equal(0);
				a++;
			};
			orchestrator._runTask(task);

			// Assert
			should.not.exist(task.done);
			setTimeout(function () {
				should.exist(task.done);
				task.done.should.equal(true);
				a.should.equal(1);
				done();
			}, timeout*2);
		});

		it('async callback task sets done after task resolves', function(done) {
			var orchestrator, task, timeout = 5, a;

			// Arrange
			a = 0;
			task = {
				name: 'test',
				fn: function(cb) {
					setTimeout(function () {
						should.not.exist(task.done);
						cb(null);
					}, timeout);
				}
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator._runStep = function () {
				a.should.equal(0);
				a++;
			};
			orchestrator._runTask(task);

			// Assert
			should.not.exist(task.done);
			setTimeout(function () {
				should.exist(task.done);
				task.done.should.equal(true);
				a.should.equal(1);
				done();
			}, timeout*2);
		});

	});
});
