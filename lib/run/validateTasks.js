'use strict';

var validateTask = require('../task/validateTask');

// re-verify each task -- Justin Case is a friend of mine
module.exports = function (args, cb) {
	var tasks = args.runTasks;

	var validateErr;
	Object.keys(tasks).forEach(function (prop) {
		var task = tasks[prop];
		if (task.name !== prop) {
			// TODO: just fix it for them?
			validateErr = new Error('Task name mismatch between task.name and tasks[name]');
			validateErr.invalidTask = true;
			validateErr.invalid = 'name';
		}
		try {
			validateTask(task);
		} catch (err) {
			validateErr = err; // fail
		}
	});

	cb(validateErr);
};
