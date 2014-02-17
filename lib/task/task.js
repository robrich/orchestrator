'use strict';

var validate = require('./validateTask');

var get = function (name, tasks) {
	if (tasks.hasOwnProperty(name)) {
		return tasks[name];
	} else {
		return; // undefined
	}
};

var set = function (name, dep, fn, tasks) {
	var task;
	if (!fn && typeof dep === 'function') {
		fn = dep;
		dep = undefined;
	}
	if (typeof dep === 'object' && !Array.isArray(dep)) {
		task = dep;
	} else {
		task = {
			before: dep
		};
	}
	task.name = name;
	task.fn = fn || function () {}; // no-op
	if (!task.before) {
		task.before = [];
	}
	if (!task.after) {
		task.after = [];
	}
	validate(task); // throw on fail
	tasks[name] = task;
	// return nothing
};

// Orchestrator#task() -- add a task or get a task by name
module.exports = function (name, dep, fn) {
	if (typeof name !== 'string') {
		throw new Error('Task requires a name that is a string');
	}
	if (dep || fn) {
		return set(name, dep, fn, this.tasks);
	} else {
		return get(name, this.tasks);
	}
};
