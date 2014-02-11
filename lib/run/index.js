'use strict';

var async = require('async');

var pluckArgs = require('./pluckArgs');
var resolveDependencies = require('./resolveDependencies');
var pluckTasks = require('./pluckTasks');
var validateTasks = require('./validateTasks');
var cloneTasks = require('./cloneTasks');
var makeRunOneFn = require('./makeRunOneFn');
var shimToAuto = require('./shimToAuto');
var runQueue = require('./runQueue');

var runOne = require('../run');

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
		pluckArgs,
		resolveDependencies,
		pluckTasks,
		validateTasks,
		cloneTasks,
		makeRunOneFn,
		shimToAuto,
		runQueue
	], function (err, results) {
		var cb = results.doneCallback;
		err = err || cb.err;
		if (cb) {
			return cb(err);
		} else if (err) {
			throw err;
		}
		// done successfully and you didn't want to know
	});

};
