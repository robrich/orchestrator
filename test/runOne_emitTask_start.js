/*global describe:false, it:false */

'use strict';

var emitTask = require('../lib/runOne/emitTask');
var makeArgs = require('../lib/runOne/args');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('emitTask.start()', function() {
		var fakeOrchestrator = {
			emit: function () {}
		};

		it('runs task successfully', function(done) {

			// arrange
			var task = {};
			var runOptions = {};
			var args = makeArgs(task, runOptions, fakeOrchestrator);

			// act
			emitTask.start(args, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('emits taskStart event', function (done) {

			// arrange
			var a = 0;
			var task = {};
			var emit = function (name/*, emitArgs*/) {
				a++;
				name.should.equal('taskStart');
			};
			var runOptions = {};
			var orchestrator = {
				emit: emit
			};
			var args = makeArgs(task, runOptions, orchestrator);

			// act
			emitTask.start(args, function (/*err*/) {

				// assert
				a.should.equal(1);

				done();
			});
		});

		it('emits task as args', function (done) {

			// arrange
			var a = 0;
			var task = {};
			var emit = function (name, emitArgs) {
				a++;
				emitArgs.should.equal(task);
			};
			var runOptions = {};
			var orchestrator = {
				emit: emit
			};
			var args = makeArgs(task, runOptions, orchestrator);

			// act
			emitTask.start(args, function (/*err*/) {

				// assert
				a.should.equal(1);

				done();
			});
		});

		it('sets taskMessage', function (done) {

			// arrange
			var a = 0;
			var task = {};
			var emit = function (/*name, emitArgs*/) {
				a++;

				// assert
				task.message.should.equal(task.name+' started');
			};
			var runOptions = {};
			var orchestrator = {
				emit: emit
			};
			var args = makeArgs(task, runOptions, orchestrator);

			// act
			emitTask.start(args, function (/*err*/) {

				// assert
				a.should.equal(1);

				done();
			});
		});

	});
});
