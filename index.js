'use strict';

var util = require('util');
var events = require('events');
var EventEmitter = events.EventEmitter;

var Orchestrator = function () {
	EventEmitter.call(this);
	this.tasks = {};
	this.taskTimeout = 20*1000; // ms until the task fails
};
util.inherits(Orchestrator, EventEmitter);

Orchestrator.prototype.task = require('./lib/task/task');
Orchestrator.prototype.hasTask = require('./lib/task/hasTask');
Orchestrator.prototype.taskNames = require('./lib/task/taskNames');
Orchestrator.prototype.reset = require('./lib/task/reset');
Orchestrator.prototype.run = require('./lib/run');
Orchestrator.prototype.onAll = require('./lib/listen/onAll');

module.exports = Orchestrator;
