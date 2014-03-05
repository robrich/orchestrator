/*global describe:false, it:false */

'use strict';

var runOne = require('../lib/runOne');
var makeArgs = require('../lib/runOne/args');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('index()', function() {

		it('runs a successful task', function (done) {

			// arrange
			var a = 0;
			var task = {
				name: 'successful',
				dep: [],
				fn: function(cb) {
					a++;
					should.exist(this);
					this.should.equal(task);
					cb();
				}
			};
			var runOptions = {};
			var orchestrator = {
				taskTimeout: 2000, // ms
				emit: function (name, emitArgs) {
					a++;

					// assert
					emitArgs.should.equal(task);
					switch(name) {
						case 'taskStart':
							break;
						case 'taskEnd':
							break;
						default:
							// fail
							name.should.equal('taskStart');
							break;
					}
				}
			};
			var args = makeArgs(task, runOptions, orchestrator);

			// act
			runOne(args, function (err) {

				// assert
				task.isDone.should.equal(true);
				task.runMethod.should.equal('callback');
				a.should.equal(3); // fn, taskStart, taskEnd
				should.not.exist(err);

				done();
			});
		});

		it('runs a failing task', function (done) {
			
			// arrange
			var a = 0;
			var expectedErr = 'task fail error';
			var task = {
				name: 'failing',
				dep: [],
				fn: function(cb) {
					a++;
					should.exist(this);
					this.should.equal(task);
					cb(expectedErr);
				}
			};
			var runOptions = {};
			var orchestrator = {
				taskTimeout: 2000, // ms
				emit: function (name, emitArgs) {
					a++;

					// assert
					emitArgs.should.equal(task);
					switch(name) {
						case 'taskStart':
							break;
						case 'taskEnd':
							break;
						case 'taskError':
							break;
						default:
							// fail
							name.should.equal('taskStart');
							break;
					}
				}
			};
			var args = makeArgs(task, runOptions, orchestrator);

			// act
			runOne(args, function (err) {

				// assert
				task.isDone.should.equal(true);
				task.runMethod.should.equal('callback');
				a.should.equal(4); // fn, taskStart, taskError, taskEnd
				should.exist(err);
				err.should.equal(expectedErr);

				done();
			});
		});

		it('runs a timeout task', function (done) {
			
			// arrange
			var a = 0;
			var timeout = 10; // ms
			var task = {
				name: 'failing',
				dep: [],
				fn: function(cb) {
					a++;
					should.exist(this);
					this.should.equal(task);
					setTimeout(function () {
						cb();
					}, timeout * 2);
				}
			};
			var runOptions = {};
			var orchestrator = {
				taskTimeout: timeout, // ms
				emit: function (name, emitArgs) {
					a++;

					// assert
					emitArgs.should.equal(task);
					switch(name) {
						case 'taskStart':
							break;
						case 'taskEnd':
							break;
						case 'taskError':
							break;
						default:
							// fail
							name.should.equal('taskStart');
							break;
					}
				}
			};
			var args = makeArgs(task, runOptions, orchestrator);

			// act
			runOne(args, function (err) {

				// assert
				task.isDone.should.equal(true);
				task.runMethod.should.equal('timeout');
				a.should.equal(4); // fn, taskStart, taskError, taskEnd
				should.exist(err);
				err.message.indexOf('timed out').should.be.above(-1);

				done();
			});
		});

		it('supresses the error callback when option specifies', function (done) {

			// arrange
			var a = 0;
			var expectedErr = 'task fail error';
			var task = {
				name: 'failing',
				dep: [],
				fn: function(cb) {
					a++;
					should.exist(this);
					this.should.equal(task);
					cb(expectedErr);
				}
			};
			var runOptions = {
				continueOnError: true
			};
			var orchestrator = {
				taskTimeout: 2000, // ms
				emit: function (name, emitArgs) {
					a++;

					// assert
					emitArgs.should.equal(task);
					switch(name) {
						case 'taskStart':
							break;
						case 'taskEnd':
							break;
						case 'taskError':
							break;
						default:
							// fail
							name.should.equal('taskStart');
							break;
					}
				}
			};
			var args = makeArgs(task, runOptions, orchestrator);

			// act
			runOne(args, function (err) {

				// assert
				task.isDone.should.equal(true);
				task.runMethod.should.equal('callback');
				a.should.equal(4); // fn, taskStart, taskError, taskEnd
				should.not.exist(err);
				should.exist(task.err);
				task.err.should.equal(expectedErr);

				done();
			});
		});

	});
});
