/*global describe:false, it:false */

'use strict';

var doneOnce = require('../lib/runOne/doneOnce');
var makeArgs = require('../lib/runOne/args');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('doneOnce()', function() {
		var fakeOrchestrator = {};

		it('runs task successfully', function(done) {

			// arrange
			var task = {};
			var runOptions = {};
			var args = makeArgs(task, runOptions, fakeOrchestrator);

			// act
			doneOnce.run(args, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('sets task.isDone to true', function(done) {

			// arrange
			var task = {};
			var runOptions = {};
			var args = makeArgs(task, runOptions, fakeOrchestrator);

			// act
			doneOnce.run(args, function (/*err*/) {

				// assert
				should.exist(task.isDone);
				task.isDone.should.equal(true);

				done();
			});
		});

		it('sets task.err if task.isDone was true', function(done) {

			// arrange
			var task = {
				isDone: true,
				name: 'set err'
			};
			var runOptions = {};
			var args = makeArgs(task, runOptions, fakeOrchestrator);

			// act
			doneOnce.run(args, function (/*err*/) {

				// assert
				should.exist(task.err);
				task.err.message.indexOf('too many times').should.be.above(-1);
				
				done();
			});
		});

		it('doesn\'t set task.err if task.isDone was true and task.err was set', function(done) {

			// arrange
			var expectedErr = 'a different error set previously';
			var task = {
				isDone: true,
				err: expectedErr
			};
			var runOptions = {};
			var args = makeArgs(task, runOptions, fakeOrchestrator);

			// act
			doneOnce.run(args, function (/*err*/) {

				// assert
				should.exist(task.err);
				task.err.should.equal(expectedErr);
				
				done();
			});
		});

		it('sets task.err if called twice', function(done) {

			// arrange
			var task = {
				name: 'done twice'
			};
			var runOptions = {};
			var args = makeArgs(task, runOptions, fakeOrchestrator);

			// act
			doneOnce.run(args, function (/*err*/) {
				doneOnce.run(args, function (/*err*/) {

					// assert
					task.err.message.indexOf('too many times').should.be.above(-1);

					done();
				});
			});
		});

	});
});
