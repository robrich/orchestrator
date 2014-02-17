'use strict';

// build the async.auto object for each task
module.exports = function (args, cb) {
	var allTasks = args.runTasks;
	var autoTasks = {};
	var missing = [];
	var err;

	// get before dependencies
	Object.keys(allTasks).forEach(function (prop) {
		var task = allTasks[prop];
		if (!task) {
			missing.push(prop);
			return;
		}

		var name = task.name; // TODO: use prop instead?
		var arr = task.before.slice(0);

		autoTasks[name] = arr;
	});

	// get after dependencies, resolve each into a "before" for the other task
	Object.keys(allTasks).forEach(function (prop) {
		var task = allTasks[prop];

		var name = task.name; // TODO: use prop instead?

		task.after.forEach(function (dep) {
			var arr = autoTasks[dep];
			if (!arr) {
				missing.push(dep);
			} else if (arr.indexOf(name) === -1) {
				arr.push(name);
			}
		});
	});

	if (missing.length > 0) {
		err = new Error('tasks not defined: '+missing.join(', '));
		err.missingTasks = missing;
		return cb(err);
	}

	// sequence tasks, discover recursion
	// !!!!!!


	// put function on the end
	Object.keys(allTasks).forEach(function (prop) {
		var task = allTasks[prop];

		var name = task.name; // TODO: use prop instead?
		var arr = autoTasks[name];
		var fn = task.fnAuto;
		arr.push(fn);
	});

	args.runAutoTasks = autoTasks;

	cb(null);
};
