'use strict';

var async = require('async');

// run the tasks
function runQueue(args, cb) {
	var queue = args.runAutoTasks;
	async.auto(queue, function (err) {
		cb(err); // trim off results -- doesn't apply
	});
}

module.exports = runQueue;
