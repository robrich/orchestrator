/*jshint node:true */

'use strict';

var sequence = require('sequencify');

// Pluck run() arg names into an array of task objects
module.exports = function (args, allTasks, cb) {

	var arg, names = [], lastTask, doneCallback, i, seq = [];
	if (args.length) {
		lastTask = args[args.length-1];
		if (typeof lastTask === 'function') {
			doneCallback = lastTask;
			args.pop();
		}
		for (i = 0; i < args.length; i++) {
			arg = args[i];
			if (typeof arg === 'string') {
				names.push(arg);
			} else if (Array.isArray(arg)) {
				names.concat(arg); // FRAGILE: ASSUME: it's an array of strings
			} else {
				cb(new Error('pass strings or arrays of strings'), null, doneCallback);
			}
		}
	}

	seq = [];
	try {
		sequence(allTasks, names, seq, []);
	} catch (err) {
		cb(err, null, doneCallback);
	}

	var queue = seq.map(function (t) {
		return allTasks[t];
	});

	cb(null, queue, doneCallback);
};
