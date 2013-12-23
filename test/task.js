/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('task()', function() {

		it('should return task if there is a task', function(done) {
			var orchestrator, name, task1, actual;

			// Arrange
			name = 'task1';
			task1 = {
				name: name,
				fn: function() {}
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.tasks[name] = task1;

			// Act
			actual = orchestrator.task(name);

			// Assert
			actual.should.equal(task1);
			done();
		});

		it('should return false if there is no such task', function(done) {
			var orchestrator, name, task1, actual;

			// Arrange
			name = 'task1';
			task1 = {
				name: name,
				fn: function() {}
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.tasks[name] = task1;

			// Act
			actual = orchestrator.task('not'+name);

			// Assert
			should.not.exist(actual);
			done();
		});

		it('should create a task if passed a second arg', function(done) {
			var orchestrator, name, fn, actual;

			// Arrange
			name = 'task1';
			fn = function () {};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			actual = orchestrator.task(name, fn);

			// Assert
			should.not.exist(actual);
			should.exist(orchestrator.tasks[name]);
			orchestrator.tasks[name].name.should.equal(name);
			done();
		});

	});
});
