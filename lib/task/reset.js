'use strict';

// Orchestrator#reset() -- clear all tasks
function reset() {
	this.tasks = {};
	return this;
}

module.exports = reset;
