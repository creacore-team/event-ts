import {Event, EventManager} from "./../../dist/index"
// local import

//Creation of a new Event with no parameter
@Event({})
class SimpleEvent
{
    constructor(public readonly id:number){};
}

//Creation of a new Event dispatch asynchronously by default
@Event({async:true})
class SimpleAsyncEvent
{
    constructor(public readonly id:number){};
}

// Adding a listener for SimpleEvent with no specific emitter, all SimpleEvent are catched
EventManager.addEventListener(SimpleEvent,(ev) => {
    console.log("  !! SimpleEvent(" + ev.id + ")\n");
});

// Adding a listener for SimpleAsyncEvent with no specific emitter, all SimpleAsyncEvent are catched
EventManager.addEventListener(SimpleAsyncEvent,(ev) => {
    console.log("  !! SimpleAsyncEvent(" + ev.id + ")\n" );
});

console.log("\n* Event are synchronous by default \n");


console.log("  >> Dispatch SimpleEvent(1)");
EventManager.dispatchEvent(new SimpleEvent(1))

console.log("  >> Dispatch SimpleAsyncEvent(2) \t[@Event{async:true}]");
EventManager.dispatchEvent(new SimpleAsyncEvent(2))

console.log("  >> Dispatch SimpleEvent(3)");
EventManager.dispatchEvent(new SimpleEvent(3))

console.log("  >> Dispatch SimpleAsyncEvent(4) \t[@Event{async:true}]");
EventManager.dispatchEvent(new SimpleAsyncEvent(4));

console.log("  >> Dispatch SimpleEvent(5) \t\trequest asynchronous execution a dispatching");
EventManager.dispatchEvent(new SimpleEvent(5),null,true)

console.log("  >> Dispatch SimpleEvent(6)");
EventManager.dispatchEvent(new SimpleEvent(6))

console.log("  >> Dispatch SimpleAsyncEvent(7) \t[@Event{async:true}] request synchronous! execution a dispatching");
EventManager.dispatchEvent(new SimpleAsyncEvent(7), null, false)

console.log("  >> Dispatch SimpleEvent(8)");
EventManager.dispatchEvent(new SimpleEvent(8))
