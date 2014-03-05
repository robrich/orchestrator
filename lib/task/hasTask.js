'use strict';

// Orchestrator#hasTask() -- is there a task with this name?
function hasTask(name) {
	/*jshint validthis:true */
	return !!this.tasks[name];
	/*jshint validthis:false */
}

module.exports = hasTask;
