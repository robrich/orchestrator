'use strict';

var validateTask = require('../task/validateTask');

// re-verify each task -- Justin Case is a friend of mine
module.exports = function (args, cb) {
	var tasks = args.runTasks;

	var validateErr;
	tasks.forEach(function (task) {
		try {
			validateTask(task.name, task.dep, task.fn);
		} catch (err) {
			validateErr = err; // fail
		}
	});

	cb(validateErr);
};
