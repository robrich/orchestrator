/*jshint node:true */

'use strict';

var runTask = require('./runTask');
var timeTask = require('./timeTask');

// Instrument the function, emiting events on task start, end, and error
module.exports = function (task, taskTimeout, emit) {
	return function (done) {

		// tell them we're beginning
		var args = {name:task.name, message:task.name+' started'};
		emit('taskRun', args);

		// timeTask calls runTask
		timeTask(runTask.bind(null, task.fn), task.name, taskTimeout, function (err, stats) {

			// harvest the results
			if (stats) {
				args.duration = stats.duration;
				args.hrDuration = stats.hrDuration;
				args.message = task.name+' '+stats.runMethod;
			}

			// tell them what happened
			if (err) {
				args.err = err;
				emit('taskError', args);
				evt = 'Error';
			}
			emit('taskEnd', args);

			// all done
			done(err);
		});
	};
};
