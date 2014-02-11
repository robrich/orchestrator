'use strict';

var async = require('async');
var doneOnce = require('./doneOnce');
var emitTask = require('./emitTask');
var runTask = require('./runTask');
var timeoutTask = require('./timeoutTask');
var timeTask = require('./timeTask');

// run a single task's function and supporting tasks
module.exports = function (args, cb) {
	return async.series([
		function (cb) {
			cb(null, args);
		},
		emitTask.start,
		timeTask.start,
		timeoutTask.bind(null, runTask),
		timeTask.end,
		doneOnce,
		emitTask.end
	], function (err/*, results*/) {
		if (err) {
			return cb(err);
		}
		cb(args.task.err);
	});
};
