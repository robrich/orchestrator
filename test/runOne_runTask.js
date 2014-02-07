/*jshint node:true */
/*global describe:false, it:false */

'use strict';

var runTask = require('../lib/runOne/runTask');
var Q = require('q');
var map = require('map-stream');
var es = require('event-stream');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('runTask()', function() {

		it('sync task succeeds', function(done) {
			var a, task;

			// arrange
			a = 0;
			task = function() {
				a++;
			};

			// act
			runTask(task, function (err) {

				// assert
				should.not.exist(err);
				a.should.equal(1);

				done();
			});
		});

		it('sync task throws', function(done) {
			var a, task, message;

			// arrange
			a = 0;
			message = 'testing';
			task = function() {
				a++;
				throw new Error(message);
			};

			// act
			runTask(task, function (err) {

				// assert
				should.exist(err);
				err.message.should.equal(message);
				a.should.equal(1);

				done();
			});
		});

		it('async promise task succeeds', function(done) {
			var a, task;

			// arrange
			a = 0;
			task = function() {
				a++;
				var deferred = Q.defer();
				process.nextTick(function () {
					a++;
					deferred.resolve();
				});
				return deferred.promise;
			};

			// act
			runTask(task, function (err) {

				// assert
				should.not.exist(err);
				a.should.equal(2);

				done();
			});
		});

		it('async promise task fails', function(done) {
			var a, task, message;

			// arrange
			a = 0;
			message = 'testing';
			task = function() {
				a++;
				var deferred = Q.defer();
				process.nextTick(function () {
					a++;
					deferred.reject(new Error(message));
				});
				return deferred.promise;
			};

			// act
			runTask(task, function (err) {

				// assert
				should.exist(err);
				err.message.should.equal(message);
				a.should.equal(2);

				done();
			});
		});

		it('async callback task succeeds', function(done) {
			var a, task;

			// arrange
			a = 0;
			task = function(cb) {
				a++;
				process.nextTick(function () {
					a++;
					cb();
				});
			};

			// act
			runTask(task, function (err) {

				// assert
				should.not.exist(err);
				a.should.equal(2);

				done();
			});
		});

		it('async callback task fails', function(done) {
			var a, task, message;

			// arrange
			a = 0;
			message = 'testing';
			task = function(cb) {
				a++;
				process.nextTick(function () {
					a++;
					cb(new Error(message));
				});
			};

			// act
			runTask(task, function (err) {

				// assert
				should.exist(err);
				err.message.should.equal(message);
				a.should.equal(2);

				done();
			});
		});

		it('async stream task succeeds', function(done) {
			var a, task;

			// arrange
			a = 0;
			task = function() {
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
			};

			// act
			runTask(task, function (err) {

				// assert
				should.not.exist(err);
				a.should.equal(2);

				done();
			});
		});

		/*
		it('async stream task fails', function(done) {
			var a, task, message;

			// arrange
			a = 0;
			message = 'testing';
			task = function() {
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
			};

			// act
			runTask(task, function (err) {

				// assert
				should.exist(err);
				err.message.should.equal(message);
				a.should.equal(2);

				done();
			});
		});
		*/

	});
});
