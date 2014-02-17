/*global describe:false, it:false */

'use strict';

var discoverDependencies = require('../lib/run/discoverDependencies');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('discoverDependencies()', function() {

		var makeArgs = function (tasks, runTaskNames) {
			return {
				orchestrator: {
					tasks: tasks // all of the registered tasks
				},
				runTaskNames: runTaskNames // the names of the tasks passed to #run()
			};
		};

		it('runs task successfully', function(done) {

			// arrange
			var args = makeArgs({}, []);

			// act
			discoverDependencies(args, function (err) {

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
					before: [],
					after: []
				},
				test2: {
					name: 'test2',
					before: [],
					after: []
				}
			};
			var args = makeArgs(tasks, runTaskNames);

			// act
			discoverDependencies(args, function (err) {

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
					before: [],
					after: []
				},
				test: {
					name: 'test',
					before: ['dep'],
					after: []
				}
			};
			var args = makeArgs(tasks, runTaskNames);

			// act
			discoverDependencies(args, function (err) {

				// assert
				args.runTaskNames.length.should.equal(2);
				args.runTaskNames.indexOf('dep').should.be.above(-1);
				args.runTaskNames.indexOf('test').should.be.above(-1);
				should.not.exist(err);

				done();
			});
		});

		it('discovers post dependency', function(done) {

			// arrange
			var runTaskNames = ['test'];
			var tasks = {
				dep: {
					name: 'dep',
					before: [],
					after: []
				},
				test: {
					name: 'test',
					before: [],
					after: ['dep']
				}
			};
			var args = makeArgs(tasks, runTaskNames);

			// act
			discoverDependencies(args, function (err) {

				// assert
				args.runTaskNames.length.should.equal(2);
				args.runTaskNames.indexOf('dep').should.be.above(-1);
				args.runTaskNames.indexOf('test').should.be.above(-1);
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
					before: ['dep'],
					after: []
				}
			};
			var args = makeArgs(tasks, runTaskNames);

			// act
			discoverDependencies(args, function (err) {

				// assert
				should.exist(err);
				should.exist(err.missingTasks);
				err.missingTasks[0].should.equal('dep');

				done();
			});
		});

		it('error on missing post-dependency', function(done) {

			// arrange
			var runTaskNames = ['test'];
			var tasks = {
				test: {
					name: 'test',
					before: [],
					after: ['dep']
				}
			};
			var args = makeArgs(tasks, runTaskNames);

			// act
			discoverDependencies(args, function (err) {

				// assert
				should.exist(err);
				should.exist(err.missingTasks);
				err.missingTasks[0].should.equal('dep');

				done();
			});
		});

		it('resolves complex dependency chain', function(done) {

			// arrange
			var runTaskNames = ['fn4'];
			var tasks = {
				fn1: {
					name: 'fn1',
					before: [],
					after: []
				},
				fn2: {
					name: 'fn2',
					before: [],
					after: []
				},
				fn3: {
					name: 'fn3',
					before: ['fn1', 'fn2'],
					after: []
				},
				fn4: {
					name: 'fn4',
					before: ['fn3'],
					after: []
				}
			};
			var args = makeArgs(tasks, runTaskNames);

			// act
			discoverDependencies(args, function (err) {

				// assert
				args.runTaskNames.length.should.equal(4);
				args.runTaskNames.indexOf('fn1').should.be.above(-1);
				args.runTaskNames.indexOf('fn2').should.be.above(-1);
				args.runTaskNames.indexOf('fn3').should.be.above(-1);
				args.runTaskNames.indexOf('fn4').should.be.above(-1);
				should.not.exist(err);

				done();
			});
		});

	});
});
