/*jshint node:true */

'use strict';

var emitTask = require('./emitTask');

// Build the async.auto object for the task
module.exports = function (task, taskTimeout, emit) {

	// duplicate the array
	var autoObj = task.dep.map(function (t) {
		return t;
	});

	// append the function to run
	autoObj.push(emitTask.bind(null, task, taskTimeout, emit));

	return autoObj;
};
