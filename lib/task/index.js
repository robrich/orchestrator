/*jshint node:true */

'use strict';

var validate = require('./validateTask');

// add a task or get a task by name
module.exports = function (name, dep, fn) {
	if (typeof name !== 'string') {
		throw new Error('Task requires a name that is a string');
	}
	if (dep || fn) {
		if (!fn && typeof dep === 'function') {
			fn = dep;
			dep = undefined;
		}
		dep = dep || [];
		fn = fn || function () {}; // no-op
		validate(name, dep, fn); // throw on fail
		this.tasks[name] = {
			fn: fn,
			dep: dep,
			name: name
		};
		// return nothing
	} else {
		// TODO: Don't return the internal object?
		return this.tasks[name];
	}
};
