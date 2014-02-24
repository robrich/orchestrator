'use strict';

// time an action
function start(args, cb) {

	// mark start time
	args.start = process.hrtime();

	cb(null);
}

function end(args, cb) {

	// grab duration
	args.duration = process.hrtime(args.start);

	cb(null);
}

module.exports = {
	start: start,
	end: end
};
