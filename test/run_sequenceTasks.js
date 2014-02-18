/*global describe:false, it:false */

'use strict';

var sequenceTasks = require('../lib/run/sequenceTasks');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('sequenceTasks()', function() {

		var makeArgs = function (tasks, runTaskNames) {
			return {
				runTasks: tasks, // the tasks
				runTaskNames: runTaskNames // the names of the tasks
			};
		};

		it('runs task successfully', function(done) {

			// arrange
			var args = makeArgs({}, []);

			// act
			sequenceTasks(args, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		// Technically these are duplicated from require('sequencify'),
		// but those are unit tests and these are integration tests
		it('no dependencies', function(done) {

			// arrange
			var runTaskNames = ['test1', 'test2'];
			var tasks = {
				test1: {
					name: 'test1',
					dep: []
				},
				test2: {
					name: 'test2',
					dep: []
				}
			};
			var args = makeArgs(tasks, runTaskNames);

			// act
			sequenceTasks(args, function (err) {

				// assert
				args.runTaskNames.length.should.equal(2);
				args.runTaskNames[0].should.equal('test1');
				args.runTaskNames[1].should.equal('test2');
				should.not.exist(err);

				done();
			});
		});

		it('discovers dependency', function(done) {

			// arrange
			var runTaskNames = ['test'];
			var tasks = {
				dep: {
					name: 'dep',
					dep: []
				},
				test: {
					name: 'test',
					dep: ['dep']
				}
			};
			var args = makeArgs(tasks, runTaskNames);

			// act
			sequenceTasks(args, function (err) {

				// assert
				args.runTaskNames.length.should.equal(2);
				args.runTaskNames[0].should.equal('dep');
				args.runTaskNames[1].should.equal('test');
				should.not.exist(err);

				done();
			});
		});

		it('error on missing dependency', function(done) {

			// arrange
			var runTaskNames = ['test'];
			var tasks = {
				test: {
					name: 'test',
					dep: ['dep']
				}
			};
			var args = makeArgs(tasks, runTaskNames);

			// act
			sequenceTasks(args, function (err) {

				// assert
				should.exist(err);
				should.exist(err.missingTasks);
				err.missingTasks.length.should.equal(1);
				err.missingTasks[0].should.equal('dep');

				done();
			});
		});

		it('error on recursive dependency', function(done) {

			// arrange
			var runTaskNames = ['test'];
			var tasks = {
				dep: {
					name: 'dep',
					dep: ['test']
				},
				test: {
					name: 'test',
					dep: ['dep']
				}
			};
			var args = makeArgs(tasks, runTaskNames);

			// act
			sequenceTasks(args, function (err) {

				// assert
				should.exist(err);
				should.exist(err.recursiveTasks);
				err.recursiveTasks.join(',').should.equal('test,dep,test');

				done();
			});
		});

		it('sequences dependency first', function(done) {

			// arrange
			var runTaskNames = ['test', 'dep'];
			var tasks = {
				dep: {
					name: 'dep',
					dep: []
				},
				test: {
					name: 'test',
					dep: ['dep']
				}
			};
			var args = makeArgs(tasks, runTaskNames);

			// act
			sequenceTasks(args, function (err) {

				// assert
				args.runTaskNames.length.should.equal(2);
				args.runTaskNames[0].should.equal('dep');
				args.runTaskNames[1].should.equal('test');
				should.not.exist(err);

				done();
			});
		});

		it('resolves complex dependency chain', function(done) {

			// arrange
			var runTaskNames = ['fn4'];
			var tasks = {
				fn1: {
					name: 'fn1',
					dep: []
				},
				fn2: {
					name: 'fn2',
					dep: []
				},
				fn3: {
					name: 'fn3',
					dep: ['fn1', 'fn2']
				},
				fn4: {
					name: 'fn4',
					dep: ['fn3']
				}
			};
			var args = makeArgs(tasks, runTaskNames);

			// act
			sequenceTasks(args, function (err) {

				// assert
				args.runTaskNames.length.should.equal(4);
				args.runTaskNames[0].should.equal('fn1');
				args.runTaskNames[1].should.equal('fn2');
				args.runTaskNames[2].should.equal('fn3');
				args.runTaskNames[3].should.equal('fn4');
				should.not.exist(err);

				done();
			});
		});

	});
});
