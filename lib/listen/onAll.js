'use strict';

// FRAGILE: ASSUME: this list is an exhaustive list of events emitted
var events = ['start','end','error','taskStart','taskEnd','taskError','taskNotFound','taskRecursion'];

var listenToEvent = function (target, event, callback) {
	target.on(event, function (e) {
		e.src = event;
		callback(e);
	});
};

// Orchestrator#onAll() -- listen to all events
module.exports = function (callback) {
	var i;
	if (typeof callback !== 'function') {
		throw new Error('No callback specified');
	}

	for (i = 0; i < events.length; i++) {
		listenToEvent(this, events[i], callback);
	}
};
module.exports.events = events.slice(0); // copy array
