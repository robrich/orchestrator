'use strict';

var extend = require('util')._extend;

// duplicate task -- avoid poluting other runs in process
module.exports = function (cb, args) {
	var oldTasks = args.runTasks;

	var copy = oldTasks.map(function (task) {

		// shallow-copy the task
		var taskCopy = extend({},task);

		// duplicate the array
		taskCopy.dep = task.dep.map(function (t) {
			return t;
		});

		return taskCopy;
	});

	args.runTasks = copy; // overwrite original list with cloned list
	cb(null, args);
};
