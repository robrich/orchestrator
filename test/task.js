'use strict';

var lab = require('lab');
var describe = lab.experiment;
var it = lab.test;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;
var afterEach = lab.afterEach;
var expect = lab.expect;

var Orchestrator = require('../');

describe('task', function() {

	it('should return task if there is a task', function(done) {
		var orchestrator, name, task1, actual;

		// Arrange
		name = 'task1';
		task1 = function(){};

		// the thing under test
		orchestrator = new Orchestrator();
		orchestrator.registry.tasks[name] = task1;

		// Act
		actual = orchestrator.task(name);

		// Assert
		expect(actual).to.equal(task1);
		done();
	});

	it('should return nothing if there is no such task', function(done) {
		var orchestrator, actual;

		// the thing under test
		orchestrator = new Orchestrator();

		// Act
		actual = orchestrator.task('notexist');

		// Assert
		expect(actual).not.exist;
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
		orchestrator.task(name, fn);

		// Assert
		expect(orchestrator.registry.tasks[name]).to.exist;
		expect(orchestrator.registry.tasks[name]).to.equal(fn);
		done();
	});

});
