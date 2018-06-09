# @creacore/event-ts
## Description
The library event-ts is a standalone typescript library for managing events. It makes heavy use of type system in order to provide helpful hints and compilation errors. It provides a decorator [`@Event`](#event_decorator) to create new event classes and a static class [`EventManager`](#eventmanager) to listen, dispatch and manage all events.

---

## Setting up

### npm

The easiest way to install is to use npm :
```shell
npm install @creacore/event-ts
```

you need to activate the typescript decorator in your ```tsconfig.js```:
```json
"experimentalDecorators": true
```

you can now import the component in you typescript file
```typescript
import {Event, EventManager} from "@creacore/event-ts";
```

### git and build

you can also clone the project from github

```shell
git clone https://github.com/creacore-team/event-ts.git
```
and compile with npm
```shell
npm run build
```
or with typescript compiler only
```shell
tsc
```

---
## Examples

You can build the examples provided in repository, simply run
```shell
npm run build-examples
```
Examples sources are in `examples/src` directory and the built examples are found under the `example/build` directory and can be run with node.

---

## API

## <a name="event_decorator"></a> ***@Event***
In order to define a class as an event, it must be decorated with `@Event` decorator. This decorator takes an object as a parameter that fulfill the `EventParameter` interface and configure the main behavior of the event. Note that all properties of `EventParameter` are optional.

```typescript
// An event with no parameter
@Event()
class MyEvent
{
    constructor(public readonly value:number){}
}

// An event with parameter
@Event({async:false})
class AnotherEvent
{
    // constructor can be omitted if trivial
}
```

#### `EventParameter`
The decoratore ```@Event({async, queued, tag, removeDuplicate, testDuplicate})``` can take up to 5 optionals parameters.
* `async : boolean`
   
   If async is defined at `true`, the event is triggered asynchronously. If omitted, default is `false`. Note that this parameter can be overridden when the event is dispatched.

* `queued : "Always" | "Never" | "Default"`
  * Always : the event is always queued and is dispatched only when the queue is flushed
  * Never : the event is never queued, even when the queue is manually enabled
  * Automatic : the event is queued only when the queue is enabled. The async event are never queued.


* `tag : string`

    This tag is added at the beginning of the auto-generated event name. This is useful when you want to track your events to debug code.

* `removeDuplicate : boolean`

    When events are queued the duplicated event are removed (the last one is conserved). The default value is `true`

* `testDuplicate :(e1:any, e2:any) => boolean`

    Two events are considered equals if they have the _same name_ (they are instance of the same event class) and have the _same emitter_ and if the function testDuplicate return true. If omitted, by default the function `testDuplicate` return `true` no matter the arguments.


## <a name="eventmanager"></a> ***EventManager (class)***

### *Methods:*


## addEventListener

The method  `addEventListener` allow to subscribe to an event. It takes 2 mandatory parameters and one optional.

```typescript
EventManager.addEventListener(eventCtor, callback, emitter?):id
```

* `eventCtor`

    The class name of you event (this is actually the constructor of you event class - after the application of the decorator event). This determines the event to which you subscribe.

* `callback`

    Function that is called each time your event is dispatched. It take as argument an instance of the Event class you are listening to with three additional parameters :

    * `emitter` : Object
        
        The Object emitter, the default type is object but if you specified an emitter as the third argument of `addEventListener` the type is the same.

    * `queued` : boolean

        A boolean value which is true if the event has been queued before to be dispatched.

    * `following` : boolean
        
        A boolean value which is true if the event has been dispatched because it is following another event.

* `emitter` : Object (*optional*)
    Object that must be the emitter of the event to trigger the callback. If emitter is *undefined* all emitters trigger the callback.

* `id` : Object (__return value__)

    Object that can be used as an id to refer to the link between the event and the callback (the exact type is `ObjectCallbackGeneric` but it should never be used otherwise than an id).

## deleteEventListener

The method  `deleteEventListener` allow to unsubscribe to an event. It takes 2 mandatory parameters and one optional.

```typescript
EventManager.deleteEventListener(eventCtor, id):success
```

* `eventCtor`

    Class name of you event (this is actually the constructor of you event class - after the application of the decorator event). This determines the event to which you subscribe.

* `id` : Object

    Object that refer to the link between the event and the callback (the exact type is `ObjectCallbackGeneric` but it should never be used otherwise than an id).

* `success` : boolean (__return value__)

    The return value, `true` if the unsubscription is successfull, `false` otherwise.

## dispatchEvent

The method  `dispatchEvent` allow to unsubscribe to an event. It takes 2 mandatory parameters and one optional.

```typescript
EventManager.dispatchEvent(eventCtor, emitter, async, bypassQueue) : success
```

## enableQueue

```typescript
EventManager.enableQueue({removeDuplicate, dontQueueAsync, autoFlushAfter, stackEnableCall}) : void
```

## disableQueue

```typescript
EventManager.disableQueue(autoflush, force) : nevent
```

## flushQueue

```typescript
EventManager.flushQueue(eventCtor) : nevent
```

## clearQueue

```typescript
EventManager.clearQueue() : void
```

## follow

```typescript
EventManager.follow(eventACtor , eventBCtor, eventTransformer, emitter) : id
```

## unfollow

```typescript
EventManager.unfollow(id) : void
```

### *Properties:* 

## queueLength : number
## queueEnabled : boolean

## <a name="eventmanager_events"></a> ***EventManager dispatched Event***

#### TriggerDispatchEvent
#### AddListenerEvent
#### RemoveListenerEvent