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
In order to user `event-ts` in a browser the library need to be browserify.
```shell
npm run build-browser
```
create the file `event-ts.js` in the folder browser with the main declaraction of the library store in a variable `EVENTTS`.

---
## Examples

### Simple examples

Here is a simple example of how to use @creacore/event-ts.

```typescript
import {Event, EventManager} from "@creacore/event-ts";

@Event()
class MyEvent
{
    constructor(public readonly myParameter:string){}
}

EventManager.addEventListener(MyEvent,(ev) => {
    console.log("Event : " + ev.myParameter )
});

EventManager.dispatchEvent(new MyEvent("Hello world !"));
```
This example will output in the console when compiled and run:
```shell
Event : Hello world !
```

When using a IDE supporting typescript, usefull suggestion will show up

![event-ts type support in Visual Studio Code](https://github.com/creacore-team/event-ts/raw/master/type_support.png)

### Other examples
More examples are available in the examples directory. You can build the examples provided in repository by simply run
```shell
npm run build-examples
```
[Examples sources](https://github.com/creacore-team/event-ts/tree/master/examples/src) are in `examples/src` directory and the built examples are found under the `example/build` directory once they have been compiled and can be run with node.

---

## API

## <a name="event_decorator"></a> ***@Event***
In order to define a class as an event, it must be decorated with `@Event` decorator. This decorator takes an object as a parameter that fulfill the `EventParameter` interface and configure the main behavior of the event. Note that all properties of `EventParameter` are optional.

Note that the decorator add three parameters to your classes :
  * `emitter` : the object emitter of the event or `null`
  * `queued` : a boolean which is `true` if the event has been queued before being dispatched
  * `following` : a boolean which is `true` if the event has been trigger because of a [follow rule](#follow)

>![event-ts type support in Visual Studio Code](https://github.com/creacore-team/event-ts/raw/master/warning.png) 
>**Your event class should never define the properties `emitter`, `queued` and `following` itself ! They will be erased when the event is dispatched**
**Your event class should never define the _static_ properties `eventName`, `hasBeenEventify`, `async`, `queued`, `removeDuplicate`, `testDuplicate` and `followers` itself ! They will be erased when the decorator is applied**

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

#### Event decorator parameters : `EventParameter` interface
The decorator ```@Event``` take (or not) an `EventParameter = {async, queued, tag, removeDuplicate, testDuplicate}` as argument which can contain 5 optionals parameters.

* `async : boolean`
   
   If async is defined at `true`, the event is triggered asynchronously. If omitted, default is `false`. Note that this parameter can be overridden when the event is dispatched.

* <a name="event_parameter_queued"></a>`queued : "Always" | "Never" | "Default"`
  * Always : the event is *always* queued and is dispatched only when the [queue is flushed](#flush_queue), even asynchronous event are queued with this parameter active
  * Never : the event is *never* queued, even when the [queue is enabled](#enable-queue)
  * Default : the synchronous event is queued only when the queue is enabled while the asynchronous event are not queued, when omitted this is the default.



* `tag : string`

    This tag is added at the beginning of the auto-generated event name. This is useful when you want to track your events to debug code (see the `eventName` parameter of [TriggerDispatchEvent](#trigger-dispatch-event)).

* `removeDuplicate : boolean`

    If `true`, when events are queued the duplicated event are removed (the last added is kept). The default value is `true` (if no `testDuplicate` is specified two events are considered identical if they are instances of the same event classes and have the same emitter, no matter their parameters).

* `testDuplicate :(e1:any, e2:any) => boolean`

    Two events are considered equals if they have the _same name_ (they are instance of the same event class) and have the _same emitter_ and if the function testDuplicate return true. If omitted, by default the function `testDuplicate` return `true` no matter the parameters of the class.


## <a name="eventmanager"></a> ***EventManager (class)***

### *Methods:*


#### `addEventListener`

The method  `addEventListener` allow to subscribe to an event. It takes 2 mandatory parameters and one optional.

```typescript
EventManager.addEventListener(eventCtor, callback, emitter?):id
```

* `eventCtor`

    The class name of you event (this is actually the *constructor* of you event class after the application of the *`Event` decorator*). This determines the event to which you subscribe.

* `callback`

    Function that is called each time your event is dispatched. The callback take as argument an instance of the Event class you are listening to with three additional parameters :

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

#### `deleteEventListener`

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

#### `dispatchEvent`

The method  `dispatchEvent` allow to unsubscribe to an event. It takes 1 mandatory parameters and 3 optional.

```typescript
EventManager.dispatchEvent(event, emitter?, async?, bypassQueue?) : success
```
* `event` : Event

    An instance of the class event that you want to dispatch.

* `emitter` : Object (*optional*)

    The emitter of the event. If an event subscriber have specified an emitter, it will be triggered only if this is the same emitter. If omitted the default value is `undefined` and only subscriber without specific emitter can catch the event.

* `async` : boolean (*optional*)

    Specified if the event is launch synchronously or asynchronously. If omitted (default value `undefined`), the synchronicity is the one defined in the event class, this is a way to override the default event class behavior at dispatching time.

* `bypassQueue` : boolean (*optional*)

    This parameter allow to bypass the queue when it has been manually enabled (see [enableQueue](#enable-queue)). Note that if the event queued id defined as [Always](#event_parameter_queued) bypassQueue is ignore.

    

* `success` : boolean (__return value__)

    The return value, `true` if the dispatching was successfull, `false` otherwise.

#### <a name="enable-queue"></a>`enableQueue`

```typescript
EventManager.enableQueue({removeDuplicate, dontQueueAsync, autoFlushAfter, stackEnableCall}) : void
```

#### `disableQueue`

```typescript
EventManager.disableQueue(autoflush, force) : nevent
```

#### <a name="flush_queue"></a>`flushQueue`

```typescript
EventManager.flushQueue(eventCtor) : nevent
```

#### `clearQueue`

```typescript
EventManager.clearQueue() : void
```

#### `compressQueue`

```typescript
EventManager.compressQueue(keep, erase, sameEmitters:boolean = true) : void
```

#### <a name="follow"></a>`follow`

```typescript
EventManager.follow(eventACtor , eventBCtor, eventTransformer, emitter) : id
```

#### `unfollow`

```typescript
EventManager.unfollow(id) : void
```

### *Properties:* 

#### queueLength : number
#### queueEnabled : boolean

## <a name="eventmanager_events"></a> ***EventManager dispatched Event***

#### <a name="trigger-dispatch-event"></a> TriggerDispatchEvent
#### AddListenerEvent
#### RemoveListenerEvent