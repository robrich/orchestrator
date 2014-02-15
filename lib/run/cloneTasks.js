'use strict';

var extend = require('util')._extend;

// duplicate task -- avoid poluting other runs in process
module.exports = function (args, cb) {
	var oldTasks = args.runTasks;
	var newTasks = {};

	Object.keys(oldTasks).forEach(function (prop) {
		var task = oldTasks[prop];

		// shallow-copy the task
		var taskCopy = extend({},task);

		// duplicate the array
		taskCopy.dep = task.dep.slice(0);

		newTasks[prop] = taskCopy;
	});

	args.runTasks = newTasks; // overwrite original list with cloned list
	cb(null);
};
