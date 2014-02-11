'use strict';

var async = require('async');

// run the tasks
module.exports = function (cb, args) {
	var queue = args.runAutoTasks;
	async.auto(queue, function (err) {
		cb(err, args); // trim off results -- doesn't apply
	});
};
