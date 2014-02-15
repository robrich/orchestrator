[![Build Status](https://secure.travis-ci.org/robrich/orchestrator.png?branch=master)](https://travis-ci.org/robrich/orchestrator)
[![Dependency Status](https://david-dm.org/robrich/orchestrator.png)](https://david-dm.org/robrich/orchestrator)

Orchestrator
============

A module for sequencing and executing tasks and dependencies in maximum concurrency

Usage
-----

### 1. Get a reference:

```javascript
var Orchestrator = require('orchestrator');
var orchestrator = new Orchestrator();
```

### 2. Load it up with stuff to do:

```javascript
orchestrator.task('thing1', function(){
  // do stuff
});
orchestrator.task('thing2', function(){
  // do stuff
});
```

### 3. Run the tasks:

```javascript
orchestrator.run('thing1', 'thing2', function (err, stats) {
  // all done
});
```

API
---

### orchestrator.task(name[, deps][, function]);

Define a task

```javascript
orchestrator.task('thing1', function(){
  // do stuff
});
```

#### name
Type: `String`

The name of the task.

#### deps
Type: `Array`

An array of task names to be executed and completed before your task will run.

```javascript
orchestrator.add('mytask', ['array', 'of', 'task', 'names'], function() {
  // Do stuff
});
```

**Note:** Are your tasks running before the dependencies are complete?  Make sure your dependency tasks
are correctly using the async run hints: take in a callback or return a promise or event stream.

#### fn
Type: `function`

The function that performs the task's operations.  For asynchronous tasks, you need to provide a hint when the task is complete:

- Take in a callback
- Return a stream or a promise

#### examples:

**Accept a callback:**

```javascript
orchestrator.add('thing2', function(callback){
  // do stuff
  callback(err);
});
```

**Return a promise:**

```javascript
var Q = require('q');

orchestrator.add('thing3', function(){
  var deferred = Q.defer();

  // do async stuff
  setTimeout(function () {
    deferred.resolve();
  }, 1);

  return deferred.promise;
});
```

**Return a stream:** (task is marked complete when stream ends)

```javascript
var map = require('map-stream');

orchestrator.add('thing4', function(){
  var stream = map(function (args, cb) {
    cb(null, args);
  });
  // do stream stuff
  return stream;
});
```

**Note:** By default, tasks run with maximum concurrency -- e.g. it launches all the tasks at once and waits for nothing.
If you want to create a series where tasks run in a particular order, you need to do two things:

- give it a hint to tell it when the task is done,
- and give it a hint that a task depends on completion of another.

For these examples, let's presume you have two tasks, "one" and "two" that you specifically want to run in this order:

1. In task "one" you add a hint to tell it when the task is done.  Either take in a callback and call it when you're
done or return a promise or stream that the engine should wait to resolve or end respectively.

2. In task "two" you add a hint telling the engine that it depends on completion of the first task.

So this example would look like this:

```javascript
var Orchestrator = require('orchestrator');
var orchestrator = new Orchestrator();

// takes in a callback so the engine knows when it'll be done
orchestrator.task('one', function (cb) {
    // do stuff -- async or otherwise
    cb(err); // if err is not null and not undefined, the orchestration will stop, and 'two' will not run
});

// identifies a dependent task must be complete before this one begins
orchestrator.task('two', ['one'], function () {
    // task 'one' is done now
});

orchestrator.run('one', 'two');
```

### orchestrator.hasTask(name);

Have you defined a task with this name?

#### name
Type: `String`

The task name to query

#### returns `Bool`

Is there a task?

### orchestrator.run(tasks...[, cb]);

Start running the tasks

#### tasks
Type: `String` or `Array` of `String`s

Tasks to be executed. You may pass any number of tasks as individual arguments.

#### cb
Type: `function`: `function (err, stats) {`

Callback to call after run completed.

Passes arguments:

- `err`: did the orchestration succeed?

- `stats`: Type: `Object`, {tasks:[], message:'succeeded', duration:[process.hrDuration]}

**Note:** Orchestrator uses [`async.auto`](https://github.com/caolan/async) to resolve dependencies, so tasks may not run in the specfied order.
Listen to orchestration events to watch task running.

```javascript
orchestrator.run('thing1', 'thing2', 'thing3', 'thing4', function (err, stats) {
  // all done
  console.log('ran '+stats.tasks.join(', ')+' in '+require('pretty-hrTime')(stats.duration));
});
```
```javascript
orchestrator.run(['thing1','thing2'], ['thing3','thing4']);
```

**FRAGILE:** Orchestrator catches exceptions on sync runs to pass to your callback
but doesn't hook to process.uncaughtException so it can't pass those exceptions
to your callback

**FRAGILE:** Orchestrator will ensure each task and each dependency is run once during an orchestration run
even if you specify it to run more than once. (e.g. `orchestrator.run('thing1', 'thing1')`
will only run 'thing1' once.) If you need it to run a task multiple times, call `.run()` a second time.
(e.g. `orchestrator.run('thing1', function () {orchestrator.run('thing1');})`.)
Alternatively create a second orchestrator instance.

### orchestrator.on(event, cb);

Listen to orchestrator internals

#### event
Type: `String`

Event name to listen to:
- start: starting a run
- error: the run was aborted due to an error
- end: the queue finished
- taskStart: task was started
- taskError: task errored
- taskEnd: task completed

#### cb
Type: `function`: `function (e) {`

Passes single argument: `e`: event details

```javascript
orchestrator.on('tasStart', function (e) {
  // e.message is the log message
  // e.task is the task name if the message applies to a task else `undefined`
  // e.err is the error if event is 'error' else `undefined`
});
// for taskEnd and taskErr:
orchestrator.on('taskEnd', function (e) {
  // e is the same object from task_start
  // e.message is updated to show how the task ended
  // e.duration is the task run duration (in seconds)
});
```

### orchestrator.onAll(cb);

Listen to all orchestrator events from one callback

#### cb
Type: `function`: `function (e) {`

Passes single argument: `e`: event details

```javascript
orchestrator.onAll(orchestrator, function (e) {
  // e is the original event args
  // e.src is event name
});
```

LICENSE
-------

(MIT License)

Copyright (c) 2014 [Richardson & Sons, LLC](http://richardsonandsons.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
