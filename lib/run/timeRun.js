'use strict';

// time an action
var start = function (args, cb) {

	// mark start time
	args.start = process.hrtime();

	cb(null);
};

var end = function (args, cb) {

	// grab duration
	args.duration = process.hrtime(args.start);

	cb(null);
};

module.exports = {
	start: start,
	end: end
};
