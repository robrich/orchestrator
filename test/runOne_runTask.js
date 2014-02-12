/*global describe:false, it:false */

'use strict';

var runTask = require('../lib/runOne/runTask');
var makeArgs = require('../lib/runOne/args');
var Q = require('q');
var map = require('map-stream');
var es = require('event-stream');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('runTask()', function() {
		var fakeOrchestrator = {};

		it('passes args to callback', function(done) {
			var a, task, args;

			// arrange
			a = 0;
			task = {
				fn: function(cb) {
					a++;
					cb();
				}
			};
			args = makeArgs(task, fakeOrchestrator);

			// act
			runTask(function (err, outArgs) {

				// assert
				a.should.equal(1);
				outArgs.should.equal(args);

				done();
			}, args);
		});

		it('runs fn scoped to task', function(done) {
			var a, name, task, args;

			// arrange
			a = 0;
			name = 'scoped to task';
			task = {
				name: name,
				fn: function(cb) {
					a++;

					// assert
					this.should.equal(task);

					cb();
				}
			};
			args = makeArgs(task, fakeOrchestrator);

			// act
			runTask(function (/*err, args*/) {

				// assert
				a.should.equal(1);

				done();
			}, args);
		});

		it('overwrites task.err on error', function (done) {
			var a, err, newErr, task, args;

			// arrange
			a = 0;
			err = 'original error';
			newErr = 'new error';
			task = {
				err: err,
				fn: function(cb) {
					a++;
					cb(newErr);
				}
			};
			args = makeArgs(task, fakeOrchestrator);

			// act
			runTask(function (/*err, args*/) {

				// assert
				task.err.should.equal(newErr);
				a.should.equal(1);

				done();
			}, args);
		});

		it('keeps task.err on success', function (done) {
			var a, err, task, args;

			// arrange
			a = 0;
			err = 'original error';
			task = {
				err: err,
				fn: function(cb) {
					a++;
					cb();
				},
			};
			args = makeArgs(task, fakeOrchestrator);

			// act
			runTask(function (/*err, args*/) {

				// assert
				task.err.should.equal(err);
				a.should.equal(1);

				done();
			}, args);
		});


		it('sync task succeeds', function(done) {
			var a, task, args;

			// arrange
			a = 0;
			task = {
				fn: function() {
					a++;
				}
			};
			args = makeArgs(task, fakeOrchestrator);

			// act
			runTask(function (/*err, args*/) {

				// assert
				should.not.exist(task.err);
				task.runMethod.should.equal('sync');
				a.should.equal(1);

				done();
			}, args);
		});

		it('sync task throws', function(done) {
			var a, task, message, args;

			// arrange
			a = 0;
			message = 'testing';
			task = {
				fn: function() {
					a++;
					throw new Error(message);
				}
			};
			args = makeArgs(task, fakeOrchestrator);

			// act
			runTask(function (/*err, args*/) {

				// assert
				should.exist(task.err);
				task.err.message.should.equal(message);
				task.runMethod.should.equal('catch');
				a.should.equal(1);

				done();
			}, args);
		});

		it('async promise task succeeds', function(done) {
			var a, task, args;

			// arrange
			a = 0;
			task = {
				fn: function() {
					a++;
					var deferred = Q.defer();
					process.nextTick(function () {
						a++;
						deferred.resolve();
					});
					return deferred.promise;
				}
			};
			args = makeArgs(task, fakeOrchestrator);

			// act
			runTask(function (/*err, args*/) {

				// assert
				should.not.exist(task.err);
				task.runMethod.should.equal('promise');
				a.should.equal(2);

				done();
			}, args);
		});

		it('async promise task fails', function(done) {
			var a, task, message, args;

			// arrange
			a = 0;
			message = 'testing';
			task = {
				fn: function() {
					a++;
					var deferred = Q.defer();
					process.nextTick(function () {
						a++;
						deferred.reject(new Error(message));
					});
					return deferred.promise;
				}
			};
			args = makeArgs(task, fakeOrchestrator);

			// act
			runTask(function (/*err, args*/) {

				// assert
				should.exist(task.err);
				task.err.message.should.equal(message);
				task.runMethod.should.equal('promise');
				a.should.equal(2);

				done();
			}, args);
		});

		it('async callback task succeeds', function(done) {
			var a, task, args;

			// arrange
			a = 0;
			task = {
				fn: function(cb) {
					a++;
					process.nextTick(function () {
						a++;
						cb();
					});
				}
			};
			args = makeArgs(task, fakeOrchestrator);

			// act
			runTask(function (/*err, args*/) {

				// assert
				should.not.exist(task.err);
				task.runMethod.should.equal('callback');
				a.should.equal(2);

				done();
			}, args);
		});

		it('async callback task fails', function(done) {
			var a, task, message, args;

			// arrange
			a = 0;
			message = 'testing';
			task = {
				fn: function(cb) {
					a++;
					process.nextTick(function () {
						a++;
						cb(new Error(message));
					});
				}
			};
			args = makeArgs(task, fakeOrchestrator);

			// act
			runTask(function (/*err, args*/) {

				// assert
				should.exist(task.err);
				task.err.message.should.equal(message);
				task.runMethod.should.equal('callback');
				a.should.equal(2);

				done();
			}, args);
		});

		it('async stream task succeeds', function(done) {
			var a, task, args;

			// arrange
			a = 0;
			task = {
				fn: function() {
					return es.readable(function(/*count, callback*/) {
						a++;
						this.emit('data', {a:'rgs'});
						this.emit('end');
					}).pipe(map(function (f, cb) {
						process.nextTick(function () {
							a++;
							cb(null, f);
						});
					}));
				}
			};
			args = makeArgs(task, fakeOrchestrator);

			// act
			runTask(function (/*err, args*/) {

				// assert
				should.not.exist(task.err);
				task.runMethod.should.equal('stream');
				a.should.equal(2);

				done();
			}, args);
		});

		/*
		it('async stream task fails', function(done) {
			var a, task, message, args;

			// arrange
			a = 0;
			message = 'testing';
			task = {
				fn: function() {
					return es.readable(function() {
						a++;
						this.emit('data', {a:'rgs'});
						this.emit('end');
					}).pipe(es.map(function (f, cb) {
						process.nextTick(function () {
							a++;
							cb(new Error(message));
						});
					}));
				}
			};
			args = makeArgs(task, fakeOrchestrator);

			// act
			runTask(function (/ *err, args* /) {

				// assert
				should.exist(task.err);
				task.err.message.should.equal(message);
				task.runMethod.should.equal('stream');
				a.should.equal(2);

				done();
			}, args);
		});
		*/

	});
});
