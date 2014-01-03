/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var Orchestrator = require('../');
var Q = require('q');
var map = require('map-stream');
var es = require('event-stream');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('_runTask() waits for done correctly', function() {

		it('sync task sets done after calling function', function(done) {
			var orchestrator, task, a;

			// Arrange
			a = 0;
			task = {
				name: 'test',
				fn: function() {
					should.not.exist(task.done);
				}
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator._runStep = function () {
				a.should.equal(0);
				a++;
			};
			orchestrator._runTask(task);

			// Assert
			should.exist(task.done);
			task.done.should.equal(true);
			a.should.equal(1);
			done();
		});

		it('sync task logs finish after calling function', function(done) {
			var orchestrator, task, a;

			// Arrange
			a = 0;
			task = {
				name: 'test',
				fn: function() {
					a.should.equal(0);
				}
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.on('task_stop', function (e) {
				should.exist(e.task);
				e.task.should.equal('test');
				if (e.message.indexOf('finish')) {
					++a;
				}
			});
			orchestrator._runStep = function () {}; // fake

			// Act
			orchestrator._runTask(task);

			// Assert
			a.should.equal(1);
			done();
		});

		it('async promise task sets done after task resolves', function(done) {
			var orchestrator, task, timeout = 5, a;

			// Arrange
			a = 0;
			task = {
				name: 'test',
				fn: function() {
					var deferred = Q.defer();
					setTimeout(function () {
						should.not.exist(task.done);
						deferred.resolve();
					}, timeout);
					return deferred.promise;
				}
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator._runStep = function () {
				a.should.equal(0);
				a++;
			};
			orchestrator._runTask(task);

			// Assert
			should.not.exist(task.done);
			setTimeout(function () {
				should.exist(task.done);
				task.done.should.equal(true);
				a.should.equal(1);
				done();
			}, timeout*2);
		});

		it('async promise task logs finish after task resolves', function(done) {
			var orchestrator, task, timeout = 5, a;

			// Arrange
			a = 0;
			task = {
				name: 'test',
				fn: function() {
					var deferred = Q.defer();
					setTimeout(function () {
						a.should.equal(0);
						deferred.resolve();
					}, timeout);
					return deferred.promise;
				}
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.on('task_stop', function (e) {
				should.exist(e.task);
				e.task.should.equal('test');
				if (e.message.indexOf('promise') > -1) {
					++a;
				}
			});
			orchestrator._runStep = function () {};

			// Act
			orchestrator._runTask(task);

			// Assert
			setTimeout(function () {
				a.should.equal(1);
				done();
			}, timeout*2);
		});

		it('async callback task sets done after task resolves', function(done) {
			var orchestrator, task, timeout = 5, a;

			// Arrange
			a = 0;
			task = {
				name: 'test',
				fn: function(cb) {
					setTimeout(function () {
						should.not.exist(task.done);
						cb(null);
					}, timeout);
				}
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator._runStep = function () {
				a.should.equal(0);
				a++;
			};
			orchestrator._runTask(task);

			// Assert
			should.not.exist(task.done);
			setTimeout(function () {
				should.exist(task.done);
				task.done.should.equal(true);
				a.should.equal(1);
				done();
			}, timeout*2);
		});

		it('async callback task logs finish after task resolves', function(done) {
			var orchestrator, task, timeout = 5, a;

			// Arrange
			a = 0;
			task = {
				name: 'test',
				fn: function(cb) {
					setTimeout(function () {
						should.not.exist(task.done);
						cb(null);
					}, timeout);
				}
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.on('task_stop', function (e) {
				should.exist(e.task);
				e.task.should.equal('test');
				if (e.message.indexOf('callback') > -1) {
					++a;
				}
			});
			orchestrator._runStep = function () {};

			// Act
			orchestrator._runTask(task);

			// Assert
			setTimeout(function () {
				a.should.equal(1);
				done();
			}, timeout*2);
		});

		it('async stream task sets done after task resolves', function(done) {
			var orchestrator, task, timeout = 5, a;

			// Arrange
			a = 0;
			task = {
				name: 'test',
				fn: function() {
					return es.readable(function(/*count, callback*/) {
						this.emit('data', {a:'rgs'});
						this.emit('end');
					}).pipe(map(function (f, cb) {
						setTimeout(function () {
							cb(null, f);
						}, timeout);
					}));
				}
			};
			should.not.exist(task.done);

			// Act
			orchestrator = new Orchestrator();
			orchestrator._runStep = function () {
				a.should.equal(0);
				a++;
			};
			orchestrator._runTask(task);

			// Assert
			setTimeout(function () {
				should.exist(task.done);
				task.done.should.equal(true);
				a.should.equal(1);
				done();
			}, timeout*2);
		});

		it('async stream task logs finish after task resolves', function(done) {
			var orchestrator, task, timeout = 5, a;

			// Arrange
			a = 0;
			task = {
				name: 'test',
				fn: function() {
					return es.readable(function(/*count, callback*/) {
						this.emit('data', {a:'rgs'});
						this.emit('end');
					}).pipe(es.map(function (f, cb) {
						setTimeout(function () {
							cb(null, f);
						}, timeout);
					}));
				}
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.on('task_stop', function (e) {
				should.exist(e.task);
				e.task.should.equal('test');
				if (e.message.indexOf('stream') > -1) {
					++a;
				}
			});
			orchestrator._runStep = function () {};

			// Act
			orchestrator._runTask(task);

			// Assert
			setTimeout(function () {
				a.should.equal(1);
				done();
			}, timeout*2);
		});

	});
});
