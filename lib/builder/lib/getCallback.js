'use strict';

// pop the callback off the array (if any)
function getCallback(ary) {
	var last, cb;

	// pull callback off the end if any
	if (ary.length) {
		last = ary[ary.length-1];
		if (typeof last === 'function') {
			cb = last;
			ary.pop();
		}
	}

	return cb;
}

module.exports = getCallback;
