# Orchestrator Registry

Registries adhere to a small API and can be passed to Orchestrator upon
construction or assigned with setRegistry on an Orchestrator instance.

## API

A registry must adhere to these APIs

### `get(name)` : Function

The method used by Orchestrator to retrieve a task from the registry.

### `set(name, taskDefinition)` : Function

The method used by Orchestrator to add a task to the registry.

### `time` : Function

The method used by Orchestrator to time task execution.

### Events

The events that must be emitted on the registry instance.

#### `start` : Event

Signals the start of a task. Typically only used when timing a task.

#### `stop` : Event

Signals the end of a task. Typically only used when timing a task.

#### `new` : Event

Signals a new task added to the registry.

#### `update` : Event

Signals a task being updated (overwritten) in the registry.
