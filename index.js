'use strict';

var util = require('util');
var EventEmitter = require('eventemitter2').EventEmitter2;

function Orchestrator () {
	EventEmitter.call(this, {maxListeners:0});
	this.tasks = {};
	this.taskTimeout = 20*1000; // ms until the task fails
}
util.inherits(Orchestrator, EventEmitter);

Orchestrator.prototype.task = require('./lib/task/task');
Orchestrator.prototype.taskNames = require('./lib/task/taskNames');
Orchestrator.prototype.reset = require('./lib/task/reset');
Orchestrator.prototype.run = require('./lib/run');

module.exports = Orchestrator;
