'use strict';

// validate the task parameters, throw on failure
module.exports = function (task) {
	var err;
	if (!task) {
		err = new Error('Task is blank');
		err.invalidTask = true;
		err.invalid = 'task';
		throw err;
	}
	if (!task.name) {
		err = new Error('Task requires a name');
		err.invalidTask = true;
		err.invalid = 'name';
		throw err;
	}
	// validate name is a string, dep is an array of strings, and fn is a function
	if (typeof task.name !== 'string') {
		err = new Error('Task requires a name that is a string');
		err.invalidTask = true;
		err.invalid = 'name';
		throw err;
	}
	if (typeof task.fn !== 'function') {
		err = new Error('Task '+task.name+' requires a function that is a function');
		err.invalidTask = true;
		err.invalid = 'function';
		throw err;
	}
	if (!Array.isArray(task.before)) {
		err = new Error('Task '+task.name+' can\'t support dependencies that is not an array of strings');
		err.invalidTask = true;
		err.invalid = 'dependencies';
		throw err;
	}
	task.before.forEach(function (item) {
		if (typeof item !== 'string') {
			err = new Error('Task '+task.name+' dependency '+item+' is not a string');
			err.invalidTask = true;
			err.invalid = 'dependencies';
			throw err;
		}
	});
	if (!Array.isArray(task.after)) {
		err = new Error('Task '+task.name+' can\'t support post-dependencies that is not an array of strings');
		err.invalidTask = true;
		err.invalid = 'dependencies';
		throw err;
	}
	task.after.forEach(function (item) {
		if (typeof item !== 'string') {
			err = new Error('Task '+task.name+' post-dependency '+item+' is not a string');
			err.invalidTask = true;
			err.invalid = 'dependencies';
			throw err;
		}
	});
	// we're still here, it's good
};
