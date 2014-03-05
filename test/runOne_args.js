/*global describe:false, it:false */

'use strict';

var args = require('../lib/runOne/args');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('args()', function() {

		it('creates the object', function(done) {

			// arrange
			var task = {};
			var runOptions = {};
			var orchestrator = {};

			// act
			var actual = args(task, runOptions, orchestrator);

			// assert
			should.exist(actual);

			done();
		});

		it('creates the object with all properties', function(done) {

			// arrange
			var task = {t:'ask'};
			var runOptions = {opt:'ions'};
			var orchestrator = {orch:'estrator'};

			// act
			var actual = args(task, runOptions, orchestrator);

			// assert
			actual.task.should.equal(task);
			actual.orchestrator.should.equal(orchestrator);
			actual.runOptions.should.equal(runOptions);

			done();
		});

		it('should throw when task is null', function(done) {

			// arrange
			var task = null;
			var runOptions = {};
			var orchestrator = {};
			var actualErr;

			// act
			try {
				args(task, runOptions, orchestrator);
			} catch (err) {
				actualErr = err;
			}

			// assert
			should.exist(actualErr);

			done();
		});

		it('should throw when orchestrator is null', function(done) {

			// arrange
			var task = {};
			var runOptions = {};
			var orchestrator = null;
			var actualErr;

			// act
			try {
				args(task, runOptions, orchestrator);
			} catch (err) {
				actualErr = err;
			}

			// assert
			should.exist(actualErr);

			done();
		});

		it('should throw when runOptions is null', function(done) {

			// arrange
			var task = {};
			var runOptions = null;
			var orchestrator = {};
			var actualErr;

			// act
			try {
				args(task, runOptions, orchestrator);
			} catch (err) {
				actualErr = err;
			}

			// assert
			should.exist(actualErr);

			done();
		});

	});
});
