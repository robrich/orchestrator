'use strict';

var validateBuilderArgs = require('./validateBuilderArgs');

// create a 'series' dependency tree from the passed in arguments
// this is very similar to require('parallel') but not abstracted to avoid the complexity
function series() {
	var args = Array.prototype.slice.call(arguments, 0);
	validateBuilderArgs(args);
	return {
		isBuilder: true,
		series: args
	};
}

module.exports = series;
