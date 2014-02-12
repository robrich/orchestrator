'use strict';

// time an action
var start = function (cb, args) {

	// mark start time
	args.start = process.hrtime();

	cb(null, args);
};

var end = function (cb, args) {

	// grab duration
	args.duration = process.hrtime(args.start);

	cb(null, args);
};

module.exports = {
	start: start,
	end: end
};
