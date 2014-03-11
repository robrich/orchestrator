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

		var verifyDependencies = function (task, depArray) {
			var message = task.name+' -> expected: \''+depArray.join('\', \'')+
				'\' actual: \''+task.before.join('\', \'')+'\'';
			task.before.length.should.equal(depArray.length, message);
			var i = 0;
			for (i = 0; i < task.before.length; i++) {
				task.before[i].should.equal(depArray[i], message);
			}
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
				verifyDependencies(allTasks.one, []);
				verifyDependencies(allTasks.two, []);
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
				verifyDependencies(allTasks.one, []);
				verifyDependencies(allTasks.two, ['one']);
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
			var builder = parallel('one', nested, 'four');
			var allTasks = {
				one: makeTask('one'),
				two: makeTask('two'),
				three: makeTask('three'),
				four: makeTask('four')
			};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				verifyDependencies(allTasks.one, []);
				verifyDependencies(allTasks.two, []);
				verifyDependencies(allTasks.three, []);
				verifyDependencies(allTasks.four, []);
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
				verifyDependencies(allTasks.one, []);
				verifyDependencies(allTasks.two, ['one']);
				verifyDependencies(allTasks.three, ['one']);
				verifyDependencies(allTasks.four, ['two','three']);
				should.not.exist(err);

				done();
			});
		});

		it('should resolve series nested inside parallel dependencies', function(done) {

			// arrange
			var nested = series('two', 'three');
			var builder = parallel('one', nested, 'four');
			var allTasks = {
				one: makeTask('one'),
				two: makeTask('two'),
				three: makeTask('three'),
				four: makeTask('four')
			};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				verifyDependencies(allTasks.one, []);
				verifyDependencies(allTasks.two, []);
				verifyDependencies(allTasks.three, ['two']);
				verifyDependencies(allTasks.four, []);
				should.not.exist(err);

				done();
			});
		});

		it('should resolve series nested inside series dependencies', function(done) {

			// arrange
			var nested = series('two', 'three');
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
				verifyDependencies(allTasks.one, []);
				verifyDependencies(allTasks.two, ['one']);
				verifyDependencies(allTasks.three, ['two']);
				verifyDependencies(allTasks.four, ['three']);
				should.not.exist(err);

				done();
			});
		});

		it('should resolve series,series nested inside series dependencies', function(done) {

			// arrange
			var nested1 = series('one', 'two');
			var nested2 = series('three', 'four');
			var builder = series(nested1, nested2);
			var allTasks = {
				one: makeTask('one'),
				two: makeTask('two'),
				three: makeTask('three'),
				four: makeTask('four')
			};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				verifyDependencies(allTasks.one, []);
				verifyDependencies(allTasks.two, ['one']);
				verifyDependencies(allTasks.three, ['two']);
				verifyDependencies(allTasks.four, ['three']);
				should.not.exist(err);

				done();
			});
		});

		it('should resolve parallel,parallel nested inside series dependencies', function(done) {

			// arrange
			var nested1 = parallel('one', 'two');
			var nested2 = parallel('three', 'four');
			var builder = series(nested1, nested2);
			var allTasks = {
				one: makeTask('one'),
				two: makeTask('two'),
				three: makeTask('three'),
				four: makeTask('four')
			};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				verifyDependencies(allTasks.one, []);
				verifyDependencies(allTasks.two, []);
				verifyDependencies(allTasks.three, ['one', 'two']);
				verifyDependencies(allTasks.four, ['one', 'two']);
				should.not.exist(err);

				done();
			});
		});

		it('should resolve series, parallel nested inside series dependencies', function(done) {

			// arrange
			var nested1 = series('one', 'two');
			var nested2 = parallel('three', 'four');
			var builder = series(nested1, nested2);
			var allTasks = {
				one: makeTask('one'),
				two: makeTask('two'),
				three: makeTask('three'),
				four: makeTask('four')
			};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				verifyDependencies(allTasks.one, []);
				verifyDependencies(allTasks.two, ['one']);
				verifyDependencies(allTasks.three, ['two']);
				verifyDependencies(allTasks.four, ['two']);
				should.not.exist(err);

				done();
			});
		});

		it('should resolve series inside parallel inside series dependencies', function(done) {

			// arrange
			var grandNested = series('three', 'four');
			var nested = parallel('two', grandNested, 'five');
			var builder = series('one', nested, 'six');
			var allTasks = {
				one: makeTask('one'),
				two: makeTask('two'),
				three: makeTask('three'),
				four: makeTask('four'),
				five: makeTask('five'),
				six: makeTask('six')
			};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				verifyDependencies(allTasks.one, []);
				verifyDependencies(allTasks.two, ['one']);
				verifyDependencies(allTasks.three, ['one']);
				verifyDependencies(allTasks.four, ['three']);
				verifyDependencies(allTasks.five, ['one']);
				verifyDependencies(allTasks.six, ['two', 'four', 'five']);
				should.not.exist(err);

				done();
			});
		});

		it('should resolve series inside series inside series dependencies', function(done) {

			// arrange
			var grandNested = series('three', 'four');
			var nested = series('two', grandNested, 'five');
			var builder = series('one', nested, 'six');
			var allTasks = {
				one: makeTask('one'),
				two: makeTask('two'),
				three: makeTask('three'),
				four: makeTask('four'),
				five: makeTask('five'),
				six: makeTask('six')
			};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				verifyDependencies(allTasks.one, []);
				verifyDependencies(allTasks.two, ['one']);
				verifyDependencies(allTasks.three, ['two']);
				verifyDependencies(allTasks.four, ['three']);
				verifyDependencies(allTasks.five, ['four']);
				verifyDependencies(allTasks.six, ['five']);
				should.not.exist(err);

				done();
			});
		});

		it('should resolve series inside parallel inside series with builder preNested dependencies', function(done) {

			// arrange
			var preNested = parallel('one', 'two');
			var grandNested = series('four', 'five');
			var nested = parallel('three', grandNested, 'six');
			var builder = series(preNested, nested);
			var allTasks = {
				one: makeTask('one'),
				two: makeTask('two'),
				three: makeTask('three'),
				four: makeTask('four'),
				five: makeTask('five'),
				six: makeTask('six')
			};

			// act
			resolveDependencies(builder, allTasks, function (err) {

				// assert
				verifyDependencies(allTasks.one, []);
				verifyDependencies(allTasks.two, []);
				verifyDependencies(allTasks.three, ['one', 'two']);
				verifyDependencies(allTasks.four, ['one', 'two']);
				verifyDependencies(allTasks.five, ['four']);
				verifyDependencies(allTasks.six, ['one', 'two']);
				should.not.exist(err);

				done();
			});
		});

	});
});
