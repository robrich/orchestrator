'use strict';

// Orchestrator#reset() -- clear all tasks
module.exports = function () {
	this.tasks = {};
	return this;
};
