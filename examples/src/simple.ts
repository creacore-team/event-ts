import {Event, EventManager} from "./../../dist/index"
// local import

//Creation of a new Event with no parameter
@Event()
class FirstSimpleEvent
{

}

//Creation of a new Event with one readonly parameter
@Event()
class SecondSimpleEvent
{
    constructor(public readonly value:number){}
}

//Creation of an artificial emitter
let myEmitter = {}

// Adding a listener for FirstSimpleEvent with no specific emitter, all FirstSimpleEvent are catched
let firstListener = EventManager.addEventListener(FirstSimpleEvent,(ev) => {
    console.log("  !! FirstSimpleEvent with NO specific emitter catched ! is it myEmitter : " + (myEmitter == ev.emitter) + "\n" )
});

// Adding a listener for FirstSimpleEvent when the emitter is myEmitter
let secondListener = EventManager.addEventListener(FirstSimpleEvent,(ev) => {
    console.log("  !! FirstSimpleEvent with specific emitter catched ! is it myEmitter : " + (myEmitter == ev.emitter) + "\n" )
}, myEmitter);

// Adding a listener for SecondSimpleEvent with no specific emitter, all SecondSimpleEvent are catched
let thirdListener = EventManager.addEventListener(SecondSimpleEvent,(ev) => {
    console.log("  !! SecondSimpleEvent catched ! value :" + ev.value + "\n")
});

// Dispatching a FirstSimpleEvent with no specific emitter
    console.log("  >> Dispatch FirstSimpleEvent");
EventManager.dispatchEvent(new FirstSimpleEvent());

// Dispatching a FirstSimpleEvent with myEmitter as emitter
    console.log("  >> Dispatch FirstSimpleEvent with emitter");
EventManager.dispatchEvent(new FirstSimpleEvent(),myEmitter);

// Dispatching a SecondSimpleEvent with value = 5 and no emitter
    console.log("  >> Dispatch SecondSimpleEvent");
EventManager.dispatchEvent(new SecondSimpleEvent(5));

// Dispatching a SecondSimpleEvent with value = 10 and no emitter
    console.log("  >> Dispatch SecondSimpleEvent");
EventManager.dispatchEvent(new SecondSimpleEvent(10));

    console.log("\n* Delete FirstSimpleEvent listener with no specific emitter");
let success = EventManager.deleteEventListener(FirstSimpleEvent, firstListener);
    console.log("* Delete success : " + success);

// Dispatching a FirstSimpleEvent with no specific emitter
    console.log("  >> Dispatch FirstSimpleEvent");
EventManager.dispatchEvent(new FirstSimpleEvent());

    console.log("  >> Dispatch FirstSimpleEvent with emitter");
// Dispatching a FirstSimpleEvent with myEmitter as emitter
EventManager.dispatchEvent(new FirstSimpleEvent(),myEmitter);

