/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('index()', function() {

		it('runs zero tasks successfully', function(done) {

			// arrange
			var orchestrator = new Orchestrator();

			// act
			orchestrator.run(function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('runs one task successfully', function(done) {

			// arrange
			var a = 0;
			var taskName = 'runOne';
			var orchestrator = new Orchestrator();
			orchestrator.task(taskName, function (cb) {
				a += 10;
				cb(null);
			});
			orchestrator.onAny(function () {
				a++; // start, taskStart, taskEnd, end
			});

			// act
			orchestrator.run(taskName, function (err, args) {

				// assert
				a.should.equal(14);
				should.not.exist(err);
				should.exist(args.duration[0]);
				args.message.indexOf('succe').should.be.above(-1);

				done();
			});
		});

		it('runs nested tasks successfully', function(done) {

			// arrange
			var a = 0;
			var orchestrator = new Orchestrator();
			var task1Name = 'runOne';
			orchestrator.task(task1Name, function (cb) {
				a += 100;
				orchestrator.run(task2Name, function (err) {
					a += 100;
					cb(err);
				});
			});
			var task2Name = 'runTwo';
			orchestrator.task(task2Name, function (cb) {
				a += 10;
				cb(null);
			});
			orchestrator.onAny(function () {
				a++; // start, taskStart, taskEnd, end
			});

			// act
			orchestrator.run(task1Name, function (err, args) {

				// assert
				a.should.equal(218);
				should.not.exist(err);
				should.exist(args.duration[0]);
				args.message.indexOf('succe').should.be.above(-1);

				done();
			});
		});

		it('fails on run one erroring task', function(done) {

			// arrange
			var a = 0;
			var taskName = 'runFailed';
			var expectedErr = new Error('test to prove failing task');
			var orchestrator = new Orchestrator();
			orchestrator.task(taskName, function (cb) {
				a += 10;
				cb(expectedErr);
			});
			orchestrator.onAny(function () {
				a++; // start, taskStart, taskError, taskEnd, error, end
			});

			// act
			orchestrator.run(taskName, function (err, args) {

				// assert
				a.should.equal(16);
				err.should.equal(expectedErr);
				should.exist(args.duration[0]);
				args.message.indexOf('fail').should.be.above(-1);

				done();
			});
		});

		it('fails on run task with missing dependency', function(done) {

			// arrange
			var a = 0;
			var taskName = 'runFailed';
			var missingTaskName = 'missing';
			var orchestrator = new Orchestrator();
			orchestrator.task(taskName, [missingTaskName], function (cb) {
				a += 10;
				cb(null);
			});
			orchestrator.onAny(function () {
				a++; // error, end (never starts)
			});

			// act
			orchestrator.run(taskName, function (err, args) {

				// assert
				a.should.equal(2);
				err.missingTasks.length.should.equal(1);
				err.missingTasks[0].should.equal(missingTaskName);
				should.exist(args.duration[0]);
				args.message.indexOf('fail').should.be.above(-1);

				done();
			});
		});

		it('fails on run task with missing post-dependency', function(done) {

			// arrange
			var a = 0;
			var taskName = 'runFailed';
			var missingTaskName = 'missing';
			var orchestrator = new Orchestrator();
			orchestrator.task(taskName, {after:[missingTaskName]}, function (cb) {
				a += 10;
				cb(null);
			});
			orchestrator.onAny(function () {
				a++; // error, end (never starts)
			});

			// act
			orchestrator.run(taskName, function (err, args) {

				// assert
				a.should.equal(2);
				err.missingTasks.length.should.equal(1);
				err.missingTasks[0].should.equal(missingTaskName);
				should.exist(args.duration[0]);
				args.message.indexOf('fail').should.be.above(-1);

				done();
			});
		});

		it('fails on run task with recursive dependency', function(done) {

			// arrange
			var a = 0;
			var task1Name = 'runOne';
			var task2Name = 'runTwo';
			var orchestrator = new Orchestrator();
			orchestrator.task(task1Name, [task2Name], function (cb) {
				a += 10;
				cb(null);
			});
			orchestrator.task(task2Name, [task1Name], function (cb) {
				a += 10;
				cb(null);
			});
			orchestrator.onAny(function () {
				a++; // start, end
			});

			// act
			orchestrator.run(task1Name, function (err, args) {

				// assert
				a.should.equal(2);
				err.recursiveTasks.length.should.equal(3);
				err.recursiveTasks[0].should.equal(task1Name);
				err.recursiveTasks[1].should.equal(task2Name);
				err.recursiveTasks[2].should.equal(task1Name);
				args.message.indexOf('fail').should.be.above(-1);

				done();
			});
		});

	});
});
