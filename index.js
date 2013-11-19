/*jshint node:true */

"use strict";

var util = require('util');
var events = require('events');
var EventEmitter = events.EventEmitter;

var Orchestrator = function () {
	EventEmitter.call(this);
	this.doneCallback = undefined; // call this when all tasks in the queue are done
	this.seq = []; // the order to run the tasks
	this.tasks = {}; // task objects: name, dep (list of names of dependencies), fn (the task to run)
	this.isRunning = false; // is the orchestrator running tasks? .start() to start, .stop() to stop
};
util.inherits(Orchestrator, EventEmitter);

	Orchestrator.prototype.reset = function () {
		this.stop(null);
		this.tasks = {};
		this.seq = [];
		this.isRunning = false;
		this.doneCallback = undefined;
		return this;
	};
	Orchestrator.prototype.add = function (name, dep, fn) {
		if (!fn) {
			fn = dep;
			dep = undefined;
		}
		dep = dep || [];
		if (!name || !fn) {
			throw new Error('Task requires a name and a function to execute');
		}
		// validate name is a string, dep is an array of strings, and fn is a function
		if (typeof name !== 'string') {
			throw new Error('Task requires a name that is a string');
		}
		if (typeof fn !== 'function') {
			throw new Error('Task '+name+' requires a function that is a function');
		}
		if (!Array.isArray(dep)) {
			throw new Error('Task '+name+' can\'t support dependencies that is not an array of strings');
		}
		dep.forEach(function (item) {
			if (typeof item !== 'string') {
				throw new Error('Task '+name+' dependency '+item+' is not a string');
			}
		});
		this.tasks[name] = {
			fn: fn,
			dep: dep,
			name: name
		};
		return this;
	};
	// tasks and optionally a callback
	Orchestrator.prototype.start = function() {
		var names, lastTask, i, seq = [];
		names = [].slice.call(arguments, 0);
		if (names.length) {
			lastTask = names[names.length-1];
			if (typeof lastTask === 'function') {
				this.doneCallback = lastTask;
				names.pop();
			}
		}
		if (this.isRunning) {
			// reset specified tasks (and dependencies) as not run
			this._resetSpecificTasks(names);
		} else {
			// reset all tasks as not run
			this._resetAllTasks();
		}
		if (this.isRunning) {
			// if you call start() again while a previous run is still in play
			// prepend the new tasks to the existing task queue
			names = names.concat(this.seq);
		}
		if (names.length < 1) {
			// run all tasks
			for (i in this.tasks) {
				if (this.tasks.hasOwnProperty(i)) {
					names.push(this.tasks[i].name);
				}
			}
		}
		seq = [];
		this.sequence(this.tasks, names, seq, []);
		this.seq = seq;
		this.emit('start', {message:'seq: '+this.seq.join(',')});
		if (!this.isRunning) {
			this.isRunning = true;
		}
		this._runStep();
		return this;
	};
	Orchestrator.prototype.stop = function (err, successfulFinish) {
		this.isRunning = false;
		if (err) {
			this.emit('err', {message:'orchestration failed', err:err});
		} else if (successfulFinish) {
			this.emit('stop', {message:'orchestration succeeded'});
		} else {
			// ASSUME
			err = 'orchestration aborted';
			this.emit('err', {message:'orchestration aborted', err: err});
		}
		if (this.doneCallback) {
			// Avoid calling it multiple times
			var cb = this.doneCallback;
			this.doneCallback = null;
			cb(err);
		}
	};
	Orchestrator.prototype.sequence = require('sequencify');
	Orchestrator.prototype.allDone = function () {
		var i, task, allDone = true; // nothing disputed it yet
		for (i = 0; i < this.seq.length; i++) {
			task = this.tasks[this.seq[i]];
			if (!task.done) {
				allDone = false;
				break;
			}
		}
		return allDone;
	};
	Orchestrator.prototype._resetTask = function(task) {
		if (task) {
			if (task.done) {
				task.done = false;
			}
			delete task.start;
			delete task.stop;
			delete task.duration;
			delete task.args;
		}
	};
	Orchestrator.prototype._resetAllTasks = function() {
		var task;
		for (task in this.tasks) {
			if (this.tasks.hasOwnProperty(task)) {
				this._resetTask(this.tasks[task]);
			}
		}
	};
	Orchestrator.prototype._resetSpecificTasks = function (names) {
		var i, name, t;

		if (names && names.length) {
			for (i = 0; i < names.length; i++) {
				name = names[i];
				t = this.tasks[name];
				if (t) {
					this._resetTask(t);
					if (t.dep && t.dep.length) {
						this._resetSpecificTasks(t.dep); // recurse
					}
				//} else {
					// FRAGILE: ignore that the task doesn't exist
				}
			}
		}
	};
	Orchestrator.prototype._runStep = function () {
		var i, task;
		if (!this.isRunning) {
			return; // user aborted, ASSUME: stop called previously
		}
		for (i = 0; i < this.seq.length; i++) {
			task = this.tasks[this.seq[i]];
			if (!task.done && !task.running && this._readyToRunTask(task)) {
				this._runTask(task);
			}
			if (!this.isRunning) {
				return; // task failed or user aborted, ASSUME: stop called previously
			}
		}
		if (this.allDone()) {
			this.stop(null, true);
		}
	};
	Orchestrator.prototype._readyToRunTask = function (task) {
		var ready = true, // no one disproved it yet
			i, name, t;
		if (task.dep.length) {
			for (i = 0; i < task.dep.length; i++) {
				name = task.dep[i];
				t = this.tasks[name];
				if (!t) {
					// FRAGILE: this should never happen
					this.stop("can't run "+task.name+" because it depends on "+name+" which doesn't exist");
					ready = false;
					break;
				}
				if (!t.done) {
					ready = false;
					break;
				}
			}
		}
		return ready;
	};
	Orchestrator.prototype._stopTask = function (task) {
		task.stop = new Date();
		task.running = false;
		task.done = true;
		if (task.start) {
			task.duration = (task.stop.getTime() - task.start.getTime()) / 1000.0; // seconds
		}
	};
	Orchestrator.prototype._emitTaskDone = function (task, message, err) {
		if (!task.args) {
			task.args = {task:task.name};
		}
		task.args.duration = task.duration;
		task.args.message = task.name+' '+message;
		var evt = 'stop';
		if (err) {
			task.args.err = err;
			evt = 'err';
		}
		// 'task_stop' or 'task_err'
		this.emit('task_'+evt, task.args);
	};
	Orchestrator.prototype._runTask = function (task) {
		var that = this, cb, p;
		task.args = {task:task.name, message:task.name+' started'};
		this.emit('task_start', task.args);
		task.running = true;
		cb = function (err) {
			that._stopTask(task);
			that._emitTaskDone.call(that, task, 'calledback', err);
			if (err) {
				return that.stop.call(that, err);
			}
			that._runStep.call(that);
		};
		try {
			task.start = new Date();
			p = task.fn.call(this, cb);
		} catch (err) {
			this._stopTask(task);
			this._emitTaskDone.call(that, task, 'threw an exception', err);
			this.stop(err || task.name+' threw an exception');
		}
		if (p && typeof p.done === 'function') {
			// wait for promise to resolve
			// FRAGILE: ASSUME: Promises/A+, see http://promises-aplus.github.io/promises-spec/
			p.done(function () {
				that._stopTask(task);
				that._emitTaskDone.call(that, task, 'resolved');
				that._runStep.call(that);
			}, function(err) {
				that._stopTask(task);
				that._emitTaskDone.call(that, task, 'rejected', err);
				that.stop.call(that, err || task.name+' promise rejected');
			});
		} else if (p && typeof p.on === 'function' && typeof p.once === 'function' && typeof p.end === 'function' && p.pipe) {
			p.once('error', function (err) {
				that._stopTask(task);
				that._emitTaskDone.call(that, task, 'stream error', err);
				that.stop.call(that, err || task.name+' stream error');
			});
			p.once('end', function () {
				if (task.running) {
					that._stopTask(task);
					that._emitTaskDone.call(that, task, 'stream ended');
					that._runStep.call(that);
				//} else {
					// it errored and was closed previously
				}
			});
		} else if (!task.fn.length) {
			// no promise, no callback, we're done
			this._stopTask(task);
			this._emitTaskDone.call(that, task, 'finished');
		//} else {
			// FRAGILE: ASSUME: callback
		}
	};

// FRAGILE: ASSUME: this list is an exhaustive list of events emitted
var events = ['start','stop','err','task_start','task_stop','task_err'];

var listenToEvent = function (target, event, callback) {
	target.on(event, function (e) {
		e.src = event;
		callback(e);
	});
};

	Orchestrator.prototype.onAll = function (callback) {
		var i;
		if (typeof callback !== 'function') {
			throw new Error('No callback specified');
		}

		for (i = 0; i < events.length; i++) {
			listenToEvent(this, events[i], callback);
		}
	};

module.exports = Orchestrator;
