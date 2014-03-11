/*global describe:false, it:false */

'use strict';

var resolveDependencies = require('../lib/builder/resolveDependencies');
var parallel = require('../lib/builder/parallel');
var series = require('../lib/builder/series');
var should = require('should');
require('mocha');

describe('lib/builder/', function() {
	describe('resolveDependencies()', function() {

		var makeTask = function (name) {
			// FRAGILE: ASSUME: before: [], after: [], fn: function () {}
			return {
				name: name,
				before: [],
				after: [],
				fn: function () {}
			};
		};

		it('should run successfully', function(done) {

			// arrange
			var builder = parallel();
			var allTasks = {};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('should resolve parallel dependencies', function(done) {

			// arrange
			var builder = parallel('one','two');
			var allTasks = {
				one: makeTask('one'),
				two: makeTask('two')
			};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				allTasks.one.before.length.should.equal(0);
				allTasks.two.before.length.should.equal(0);
				should.not.exist(err);

				done();
			});
		});

		it('should resolve series dependencies', function(done) {

			// arrange
			var builder = series('one','two');
			var allTasks = {
				one: makeTask('one'),
				two: makeTask('two')
			};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				allTasks.one.before.length.should.equal(0);
				allTasks.two.before.length.should.equal(1);
				allTasks.two.before[0].should.equal('one');
				should.not.exist(err);

				done();
			});
		});

		it('should fail on missing dependency', function(done) {

			// arrange
			var builder = series('one','two');
			var allTasks = {
				one: makeTask('one')
			};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				should.exist(err);
				err.missingTasks.length.should.equal(1);
				err.missingTasks[0].should.equal('two');

				done();
			});
		});

		it('should fail on invalid builder', function(done) {

			// arrange
			var builder = null;
			var allTasks = {};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				should.exist(err);
				err.taskInvalid.should.equal(true);

				done();
			});
		});

		it('should resolve parallel nested inside parallel dependencies', function(done) {

			// arrange
			var nested = parallel('two', 'three');
			var builder = parallel('one','four');
			var allTasks = {
				one: makeTask('one'),
				two: makeTask('two'),
				three: makeTask('three'),
				four: makeTask('four')
			};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				allTasks.one.before.length.should.equal(0);
				allTasks.two.before.length.should.equal(0);
				allTasks.three.before.length.should.equal(0);
				allTasks.four.before.length.should.equal(0);
				should.not.exist(err);

				done();
			});
		});

		it('should resolve parallel nested inside series dependencies', function(done) {

			// arrange
			var nested = parallel('two', 'three');
			var builder = series('one', nested, 'four');
			var allTasks = {
				one: makeTask('one'),
				two: makeTask('two'),
				three: makeTask('three'),
				four: makeTask('four')
			};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				allTasks.one.before.length.should.equal(0);
				allTasks.two.before.length.should.equal(1);
				allTasks.two.before[0].should.equal('one');
				allTasks.three.before.length.should.equal(1);
				allTasks.three.before[0].should.equal('one');
				allTasks.four.before.length.should.equal(2);
				allTasks.four.before[0].should.equal('two');
				allTasks.four.before[0].should.equal('three');
				should.not.exist(err);

				done();
			});
		});

		/*
		x parallel nested in parallel
		. parallel nested in series
		- series nested in parallel
		- series nested in series
		- 3 levels (various configurations)
		- parallel(series('one','two'),series('three','four'))
		- series(parallel('one','two'),parallel('three','four'))
		*/

	});
});
