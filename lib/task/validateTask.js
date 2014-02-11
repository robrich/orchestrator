'use strict';

// validate the task parameters, throw on failure
module.exports = function (name, dep, fn) {
	if (!name) {
		throw new Error('Task requires a name');
	}
	// validate name is a string, dep is an array of strings, and fn is a function
	if (typeof name !== 'string') {
		throw new Error('Task requires a name that is a string');
	}
	if (typeof fn !== 'function') {
		throw new Error('Task '+name+' requires a function that is a function');
	}
	if (!Array.isArray(dep)) {
		throw new Error('Task '+name+' can\'t support dependencies that is not an array of strings');
	}
	dep.forEach(function (item) {
		if (typeof item !== 'string') {
			throw new Error('Task '+name+' dependency '+item+' is not a string');
		}
	});
	// we're still here, it's good
};
