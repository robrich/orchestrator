/*jshint node:true */

'use strict';

var runEvents = require('./runEvents');

module.exports = function() {
	var args = Array.prototype.slice.call(arguments, 0);
	runEvents(this.tasks, this.taskTimeout, this.emit, args);
};
