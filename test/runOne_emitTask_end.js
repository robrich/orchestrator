/*global describe:false, it:false */

'use strict';

var emitTask = require('../lib/runOne/emitTask');
var makeArgs = require('../lib/runOne/args');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('emitTask.end()', function() {
		var fakeOrchestrator = {
			emit: function () {}
		};

		it('runs task successfully', function(done) {

			// arrange
			var task = {};
			var args = makeArgs(task, fakeOrchestrator);

			// act
			emitTask.end(args, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('emits taskEnd event', function (done) {

			// arrange
			var a = 0;
			var task = {};
			var emit = function (name/*, emitArgs*/) {
				a++;
				name.should.equal('taskEnd');
			};
			var orchestrator = {
				emit: emit
			};
			var args = makeArgs(task, orchestrator);

			// act
			emitTask.end(args, function (/*err*/) {

				// assert
				a.should.equal(1);

				done();
			});
		});

		it('emits taskError and taskEnd event', function (done) {

			// arrange
			var a = 0;
			var expectedErr = 'errored task event';
			var task = {
				err: expectedErr
			};
			var emit = function (name/*, emitArgs*/) {
				a++;
				switch(name) {
					case 'taskError':
						// great
						break;
					case 'taskEnd':
						// great
						break;
					default:
						// fail
						name.should.equal('taskError');
						break;
				}
			};
			var orchestrator = {
				emit: emit
			};
			var args = makeArgs(task, orchestrator);

			// act
			emitTask.end(args, function (/*err*/) {

				// assert
				a.should.equal(2); // both taskErorr and taskEnd

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
			var orchestrator = {
				emit: emit
			};
			var args = makeArgs(task, orchestrator);

			// act
			emitTask.end(args, function (/*err*/) {

				// assert
				a.should.equal(1);

				done();
			});
		});

		it('sets taskMessage', function (done) {

			// arrange
			var a = 0;
			var task = {
				name: 'the task name',
				runMethod: 'the run method'
			};
			var emit = function (/*name, emitArgs*/) {
				a++;

				// assert
				task.message.should.equal(task.name+' '+task.runMethod);
			};
			var orchestrator = {
				emit: emit
			};
			var args = makeArgs(task, orchestrator);

			// act
			emitTask.end(args, function (/*err*/) {

				// assert
				a.should.equal(1);

				done();
			});
		});

	});
});
