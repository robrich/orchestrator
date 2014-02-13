'use strict';

// build the async.auto object for each task
module.exports = function (args, cb) {
	var allTasks = args.runTasks;
	var autoTasks = {};

	Object.keys(allTasks).forEach(function (prop) {
		var task = allTasks[prop];

		var name = task.name;
		var arr = task.dep;
		var fn = task.fnAuto;
		arr.push(fn); // FRAGILE: breaks Orchestrator's use of task.dep[]

		autoTasks[name] = arr;
	});

	args.runAutoTasks = autoTasks;

	cb(null);
};
