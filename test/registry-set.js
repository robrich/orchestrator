'use strict';

var lab = require('lab');
var describe = lab.experiment;
var it = lab.test;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;
var afterEach = lab.afterEach;
var expect = lab.expect;

var DefaultRegistry = require('../registry/Default');

describe('DefaultRegistry', function() {
	describe('set()', function() {

		var registry;

		beforeEach(function(){
			registry = new DefaultRegistry();
		});

		it('should define a task', function() {
			// Arrange
			var fn = function() {};

			// Act
			registry.set('test', fn);

			// Assert
			expect(registry.tasks.test).to.exist;
			expect(registry.tasks.test).to.equal(fn);
		});
	});
});
