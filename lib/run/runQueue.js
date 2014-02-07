/*jshint node:true */

'use strict';

var async = require('async');
var runOne = require('../runOne');

// Run the specified tasks
module.exports = function (tasks, taskTimeout, emit, cb) {

	var queue = {};
	tasks.forEach(function (t) {
		queue[t.name] = runOne(t, taskTimeout, emit);
	});

	async.auto(queue, function (err) {
		cb(err); // trim off results -- doesn't apply
	});
};
