'use strict';

// validate the task parameters, throw on failure
module.exports = function (name, dep, fn) {
	var err;
	if (!name) {
		err = new Error('Task requires a name');
		err.invalidTask = true;
		err.invalid = 'name';
		throw err;
	}
	// validate name is a string, dep is an array of strings, and fn is a function
	if (typeof name !== 'string') {
		err = new Error('Task requires a name that is a string');
		err.invalidTask = true;
		err.invalid = 'name';
		throw err;
	}
	if (typeof fn !== 'function') {
		err = new Error('Task '+name+' requires a function that is a function');
		err.invalidTask = true;
		err.invalid = 'function';
		throw err;
	}
	if (!Array.isArray(dep)) {
		err = new Error('Task '+name+' can\'t support dependencies that is not an array of strings');
		err.invalidTask = true;
		err.invalid = 'dependencies';
		throw err;
	}
	dep.forEach(function (item) {
		if (typeof item !== 'string') {
			err = new Error('Task '+name+' dependency '+item+' is not a string');
			err.invalidTask = true;
			err.invalid = 'dependencies';
			throw err;
		}
	});
	// we're still here, it's good
};
