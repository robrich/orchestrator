/*global describe:false, it:false */

'use strict';

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

		it('should return undefined if there is no such task', function(done) {
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

		it('should create a task with dependencies if passed a third arg', function(done) {
			var orchestrator, name, dep, fn, actual;

			// Arrange
			name = 'task1';
			dep = ['task2'];
			fn = function () {};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			actual = orchestrator.task(name, dep, fn);

			// Assert
			should.not.exist(actual);
			should.exist(orchestrator.tasks[name]);
			orchestrator.tasks[name].name.should.equal(name);
			orchestrator.tasks[name].dep.should.equal(dep);
			done();
		});

		it('should throw if passed an invalid arg', function(done) {
			var orchestrator, name, dep, fn, actual;

			// Arrange
			name = 'task1';
			fn = 42;

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			try {
				orchestrator.task(name, dep, fn);
			} catch (err) {
				actual = err;
			}

			// Assert
			should.exist(actual);
			should.exist(actual.message);
			actual.message.indexOf('function').should.be.above(-1);
			done();
		});

	});
});
