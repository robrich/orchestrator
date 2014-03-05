'use strict';

// Orchestrator#taskNames() -- return all defined task names
function taskNames() {
	/*jshint validthis:true */
	return Object.keys(this.tasks);
	/*jshint validthis:false */
}

module.exports = taskNames;
