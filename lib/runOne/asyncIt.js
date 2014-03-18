'use strict';

// timeout if it takes too long
function run(args, cb) {
	process.nextTick(function () {
		cb(null);
	});
}

module.exports = {
	run: run
};
