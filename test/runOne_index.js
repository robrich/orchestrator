/*global describe:false, it:false */

'use strict';

var runOne = require('../lib/runOne');
var makeArgs = require('../lib/runOne/args');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('index()', function() {

		/*
		- runs fn
		- scoped to task
		- emits events
		*/

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
			var orchestrator = {
				emit: function (name, emitArgs) {
					a++;

					// assert
					emitArgs.should.equal(task);
					switch(name) {
						case 'taskStart':
							// great
							break;
						case 'taskEnd':
							// great
							break;
						default:
							// fail
							name.should.equal('taskStart');
							break;
					}
				}
			};
			var args = makeArgs(task, orchestrator);

			// act
			runOne(args, function (err) {

				// assert
				a.should.equal(3); // fn, taskStart, taskEnd
				should.not.exist(err);

				done();
			});
		});



		it('runs a failing task', function (done) {
			''.should.equal('write this');
			done();
		});

		it('runs a timeout task', function (done) {
			''.should.equal('write this');
			done();
		});

	});
});
