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
		var fakeRunOptions = {};
		var fakeOrchestrator = {};

		it('runs fn scoped to task', function(done) {

			// arrange
			var a = 0;
			var name = 'scoped to task';
			var task = {
				name: name,
				fn: function(cb) {
					a++;

					// assert
					this.should.equal(task);

					cb();
				}
			};
			var args = makeArgs(task, fakeRunOptions, fakeOrchestrator);

			// act
			runTask(args, function (/*err*/) {

				// assert
				a.should.equal(1);

				done();
			});
		});

		it('overwrites task.err on error', function (done) {

			// arrange
			var a = 0;
			var err = 'original error';
			var newErr = 'new error';
			var task = {
				err: err,
				fn: function(cb) {
					a++;
					cb(newErr);
				}
			};
			var args = makeArgs(task, fakeRunOptions, fakeOrchestrator);

			// act
			runTask(args, function (/*err*/) {

				// assert
				task.err.should.equal(newErr);
				a.should.equal(1);

				done();
			});
		});

		it('keeps task.err on success', function (done) {

			// arrange
			var a = 0;
			var err = 'original error';
			var task = {
				err: err,
				fn: function(cb) {
					a++;
					cb();
				}
			};
			var args = makeArgs(task, fakeRunOptions, fakeOrchestrator);

			// act
			runTask(args, function (/*err*/) {

				// assert
				task.err.should.equal(err);
				a.should.equal(1);

				done();
			});
		});


		it('sync task fails', function(done) {

			// arrange
			var a = 0;
			var task = {
				fn: function() {
					a++;
				}
			};
			var args = makeArgs(task, fakeRunOptions, fakeOrchestrator);

			// act
			runTask(args, function (/*err*/) {

				// assert
				should.exist(task.err);
				task.runMethod.should.equal('sync');
				task.err.syncTaskFail.should.equal(true);
				a.should.equal(1);

				done();
			});
		});

		it('sync task throws', function(done) {

			// arrange
			var a = 0;
			var message = 'testing';
			var task = {
				fn: function() {
					a++;
					throw new Error(message);
				}
			};
			var args = makeArgs(task, fakeRunOptions, fakeOrchestrator);

			// act
			runTask(args, function (/*err*/) {

				// assert
				should.exist(task.err);
				task.err.message.should.equal(message);
				task.runMethod.should.equal('catch');
				a.should.equal(1);

				done();
			});
		});

		it('async promise task succeeds', function(done) {

			// arrange
			var a = 0;
			var task = {
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
			var args = makeArgs(task, fakeRunOptions, fakeOrchestrator);

			// act
			runTask(args, function (/*err*/) {

				// assert
				should.not.exist(task.err);
				task.runMethod.should.equal('promise');
				a.should.equal(2);

				done();
			});
		});

		it('async promise task fails', function(done) {

			// arrange
			var a = 0;
			var message = 'testing';
			var task = {
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
			var args = makeArgs(task, fakeRunOptions, fakeOrchestrator);

			// act
			runTask(args, function (/*err*/) {

				// assert
				should.exist(task.err);
				task.err.message.should.equal(message);
				task.runMethod.should.equal('promise');
				a.should.equal(2);

				done();
			});
		});

		it('async callback task succeeds', function(done) {

			// arrange
			var a = 0;
			var task = {
				fn: function(cb) {
					a++;
					process.nextTick(function () {
						a++;
						cb();
					});
				}
			};
			var args = makeArgs(task, fakeRunOptions, fakeOrchestrator);

			// act
			runTask(args, function (/*err*/) {

				// assert
				should.not.exist(task.err);
				task.runMethod.should.equal('callback');
				a.should.equal(2);

				done();
			});
		});

		it('async callback task fails', function(done) {

			// arrange
			var a = 0;
			var message = 'testing';
			var task = {
				fn: function(cb) {
					a++;
					process.nextTick(function () {
						a++;
						cb(new Error(message));
					});
				}
			};
			var args = makeArgs(task, fakeRunOptions, fakeOrchestrator);

			// act
			runTask(args, function (/*err*/) {

				// assert
				should.exist(task.err);
				task.err.message.should.equal(message);
				task.runMethod.should.equal('callback');
				a.should.equal(2);

				done();
			});
		});

		it('async stream task succeeds', function(done) {

			// arrange
			var a = 0;
			var task = {
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
			var args = makeArgs(task, fakeRunOptions, fakeOrchestrator);

			// act
			runTask(args, function (/*err*/) {

				// assert
				should.not.exist(task.err);
				task.runMethod.should.equal('stream');
				a.should.equal(2);

				done();
			});
		});

		/*
		it('async stream task fails', function(done) {

			// arrange
			var a = 0;
			var message = 'testing';
			var task = {
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
			var args = makeArgs(task, fakeRunOptions, fakeOrchestrator);

			// act
			runTask(args, function (/ *err* /) {

				// assert
				should.exist(task.err);
				task.err.message.should.equal(message);
				task.runMethod.should.equal('stream');
				a.should.equal(2);

				done();
			});
		});
		*/

	});
});
