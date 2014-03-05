'use strict';

var getCallback = require('./lib/getCallback');

// sugar for calling this.parallel then this.run with the results
// this is very similar to require('runSeries') but not abstracted to avoid the complexity
function runParallel() {

	var args = Array.prototype.slice.call(arguments, 0);
	var cb = getCallback(args);

	/*jshint validthis:true */
	return this.run(this.parallel.apply(this, args), cb);
	/*jshint validthis:false */
}

module.exports = runParallel;
