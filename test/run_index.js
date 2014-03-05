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
			var builder = orchestrator.parallel(); // zero tasks

			// act
			orchestrator.run(builder, function (err) {

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
				a++; // taskStart, taskEnd
			});

			// act
			var builder = orchestrator.parallel(taskName);
			orchestrator.run(builder, function (err, args) {

				// assert
				a.should.equal(12);
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
				orchestrator.runParallel(task2Name, function (err) {
					a += 100;
					cb(err);
				});
			});
			var task2Name = 'runTwo';
			orchestrator.task(task2Name, function (cb) {
				a += 10;
				cb(null);
			});
			orchestrator.onAny(function (args) {
				a++; // taskStart, taskEnd
			});

			// act
			var builder = orchestrator.parallel(task1Name);
			orchestrator.run(builder, function (err, args) {

				// assert
				a.should.equal(214);
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
				a++; // taskStart, taskError, taskEnd
			});

			// act
			var builder = orchestrator.parallel(taskName);
			orchestrator.run(builder, function (err, args) {

				// assert
				a.should.equal(13);
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
				a++;
			});

			// act
			var builder = orchestrator.parallel(taskName);
			orchestrator.run(builder, function (err, args) {

				// assert
				a.should.equal(0); // never starts anything
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
				a++;
			});

			// act
			var builder = orchestrator.parallel(taskName);
			orchestrator.run(builder, function (err, args) {

				// assert
				a.should.equal(0); // never starts anything
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
				a++;
			});

			// act
			var builder = orchestrator.parallel(task1Name);
			orchestrator.run(builder, function (err, args) {

				// assert
				a.should.equal(0); // never starts anything
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
