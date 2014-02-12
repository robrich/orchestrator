'use strict';

var async = require('async');

var timeRun = require('./timeRun');
var pluckArgs = require('./pluckArgs');
var resolveDependencies = require('./resolveDependencies');
var pluckTasks = require('./pluckTasks');
var validateTasks = require('./validateTasks');
var cloneTasks = require('./cloneTasks');
var makeRunOneFn = require('./makeRunOneFn');
var shimToAuto = require('./shimToAuto');
var runQueue = require('./runQueue');

var runOne = require('../runOne');

// Orchestrator#run() -- run the selected tasks, their dependencies, and call the callback when done
module.exports = function() {
	var runArgs = Array.prototype.slice.call(arguments, 0);

	return async.series([
		function (cb) {
			cb(null, {
				runOneFn: runOne,
				runArgs: runArgs,
				orchestrator: this
			});
		},
		timeRun.start,
		pluckArgs,
		resolveDependencies,
		pluckTasks,
		validateTasks,
		cloneTasks,
		makeRunOneFn,
		shimToAuto,
		runQueue
	], function (err, results) {
		timeRun.end(function (err) {
			var cb = results && results.doneCallback;
			err = err || results.err;
			if (cb) {
				return cb(err);
			} else if (err) {
				throw err;
			}
		}, results);
		// done successfully and you didn't want to know
	});

};
