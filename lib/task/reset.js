'use strict';

// Orchestrator#reset() -- clear all tasks
function reset() {
	/*jshint validthis:true */
	this.tasks = {};
	/*jshint validthis:false */
}

module.exports = reset;
