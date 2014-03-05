/*global describe:false, it:false */

'use strict';

var getTaskNames = require('../lib/builder/getTaskNames');
var parallel = require('../lib/builder/parallel');
var series = require('../lib/builder/series');
var should = require('should');
require('mocha');

describe('lib/builder/', function() {
	describe('getTaskNames()', function() {

		it('gets zero tasks', function(done) {

			// arrange
			var builder = parallel();

			// act
			getTaskNames(builder, function (err, tasks) {

				// assert
				should.not.exist(err);
				tasks.length.should.equal(0);

				done();
			});
		});

		it('gets tasks from series', function(done) {

			// arrange
			var builder = series('one','two','three');

			// act
			getTaskNames(builder, function (err, tasks) {

				// assert
				should.not.exist(err);
				tasks.length.should.equal(3);
				tasks[0].should.equal('one');
				tasks[1].should.equal('two');
				tasks[2].should.equal('three');

				done();
			});
		});

		it('gets tasks from parallel', function(done) {

			// arrange
			var builder = parallel('one','two','three');

			// act
			getTaskNames(builder, function (err, tasks) {

				// assert
				should.not.exist(err);
				tasks.length.should.equal(3);
				tasks[0].should.equal('one');
				tasks[1].should.equal('two');
				tasks[2].should.equal('three');

				done();
			});
		});

		it('gets tasks from nested parallel', function(done) {

			// arrange
			var builder = parallel('one','two', parallel('three', 'four'));

			// act
			getTaskNames(builder, function (err, tasks) {

				// assert
				should.not.exist(err);
				tasks.length.should.equal(4);
				tasks[0].should.equal('one');
				tasks[1].should.equal('two');
				tasks[2].should.equal('three');
				tasks[3].should.equal('four');

				done();
			});
		});

		it('gets tasks from nested series', function(done) {

			// arrange
			var builder = series('one','two', series('three', 'four'));

			// act
			getTaskNames(builder, function (err, tasks) {

				// assert
				should.not.exist(err);
				tasks.length.should.equal(4);
				tasks[0].should.equal('one');
				tasks[1].should.equal('two');
				tasks[2].should.equal('three');
				tasks[3].should.equal('four');

				done();
			});
		});

		it('errors on null builder', function(done) {

			// arrange
			var builder = null;

			// act
			getTaskNames(builder, function (err, tasks) {

				// assert
				should.exist(err);
				tasks.length.should.equal(0);

				done();
			});
		});

		it('errors on builder content is a number', function(done) {

			// arrange
			var builder = {
				isBuilder: true,
				series: [42]
			}; // FRAGILE: Can't use the real series function because it'll blow up

			// act
			getTaskNames(builder, function (err, tasks) {

				// assert
				should.exist(err);
				err.taskInvalid.should.equal(true);
				tasks.length.should.equal(0);

				done();
			});
		});

		it('errors on builder content is an array', function(done) {

			// arrange
			var builder = {
				isBuilder: true,
				parallel: [['thing']]
			}; // FRAGILE: Can't use the real series function because it'll blow up

			// act
			getTaskNames(builder, function (err, tasks) {

				// assert
				should.exist(err);
				err.taskInvalid.should.equal(true);
				tasks.length.should.equal(0);

				done();
			});
		});

	});
});
