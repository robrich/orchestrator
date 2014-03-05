'use strict';

var validateBuilderArgs = require('./validateBuilderArgs');

// create a 'parallel' dependency tree from the passed in arguments
// this is very similar to require('series') but not abstracted to avoid the complexity
function parallel() {
	var args = Array.prototype.slice.call(arguments, 0);
	validateBuilderArgs(args);
	return {
		isBuilder: true,
		parallel: args
	};
}

module.exports = parallel;
