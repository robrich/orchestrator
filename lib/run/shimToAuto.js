'use strict';

// build the async.auto object for each task
module.exports = function (args, cb) {
	var allTasks = args.runTasks;
	var autoTasks = {};

	Object.keys(allTasks).forEach(function (prop) {
		var task = allTasks[prop];

		var name = task.name; // TODO: use prop instead?
		var arr = task.dep.slice(0);
		var fn = task.fnAuto;
		arr.push(fn);

		autoTasks[name] = arr;
	});

	args.runAutoTasks = autoTasks;

	cb(null);
};
