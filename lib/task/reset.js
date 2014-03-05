'use strict';

// Orchestrator#reset() -- clear all tasks
function reset() {
	/*jshint validthis:true */
	this.tasks = {};
	return this;
	/*jshint validthis:false */
}

module.exports = reset;
