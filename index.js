'use strict';

var util = require('util');
var EventEmitter = require('eventemitter2').EventEmitter2;

function Orchestrator () {
	EventEmitter.call(this, {
		maxListeners: 0,
		wildcard: true
	});
	this.tasks = {};
	this.taskTimeout = 20*1000; // ms until the task fails
}
util.inherits(Orchestrator, EventEmitter);

Orchestrator.prototype.task = require('./lib/task/task');
Orchestrator.prototype.hasTask = require('./lib/task/hasTask');
Orchestrator.prototype.taskNames = require('./lib/task/taskNames');
Orchestrator.prototype.reset = require('./lib/task/reset');
Orchestrator.prototype.run = require('./lib/run');
Orchestrator.prototype.series = require('./lib/builder/series');
Orchestrator.prototype.parallel = require('./lib/builder/parallel');
Orchestrator.prototype.runSeries = require('./lib/builder/runSeries');
Orchestrator.prototype.runParallel = require('./lib/builder/runParallel');

module.exports = Orchestrator;
