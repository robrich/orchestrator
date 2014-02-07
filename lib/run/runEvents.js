/*jshint node:true */

'use strict';

var getQueue = require('./getQueue');
var runQueue = require('./runQueue');

module.exports = function(allTasks, taskTimeout, emit, args) {
	getQueue(allTasks, args, function (err, queue, cb) {

		// the thing to do when the all tasks in this run are done
		var end = function (err) {
			// tell them what happened
			if (err) {
				emit('error', {message:'orchestration failed', err:err});
			}
			emit('end', {message:'orchestration succeeded'});
			if (cb) {
				cb(err);
			} else if (err) {
				throw err;
			}
		};

		if (err) {
			// is this a known error?
			if (err.missingTask) {
				emit('task_not_found', {message: err.message, task:err.missingTask, err: err});
			}
			if (err.recursiveTasks) {
				emit('task_recursion', {message: err.message, recursiveTasks:err.recursiveTasks, err: err});
			}
			end(err);
		}

		runQueue(queue, taskTimeout, emit, end);
	});
};
