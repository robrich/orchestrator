/*jshint node:true */

"use strict";

var util = require('util');
var events = require('events');
var EventEmitter = events.EventEmitter;

var Orchestrator = function () {
	EventEmitter.call(this);
	this.tasks = {};
	this.taskTimeout = 20*1000; // ms until the task fails
};
util.inherits(Orchestrator, EventEmitter);

Orchestrator.prototype.task = require('./lib/task');
Orchestrator.prototype.hasTask = function (name) {
	return !!this.tasks[name];
};
Orchestrator.prototype.reset = function () {
	this.tasks = {};
	return this;
};
Orchestrator.prototype.run = require('./lib/run');
Orchestrator.prototype.onAll = require('./lib/listen/onAll');

module.exports = Orchestrator;
