'use strict';

var chai = require('chai');
var expect = chai.expect;

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
