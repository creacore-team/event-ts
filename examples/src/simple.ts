import {Event, EventManager} from "./../../dist/index"
// local import

//Creation of a new Event with no parameter
@Event({})
class FirstSimpleEvent
{

}

//Creation of a new Event with one readonly parameter
@Event({})
class SecondSimpleEvent
{
    constructor(public readonly value:number){}
}

//Creation of an artificial emitter
let myEmitter = {}

// Adding a listener for FirstSimpleEvent with no specific emitter, all FirstSimpleEvent are catched
EventManager.addEventListener(FirstSimpleEvent,(ev) => {
    console.log("FirstSimpleEvent with NO specific emitter catched ! is it myEmitter : ", myEmitter == ev.emitter )
});

// Adding a listener for FirstSimpleEvent when the emitter is myEmitter
EventManager.addEventListener(FirstSimpleEvent,(ev) => {
    console.log("FirstSimpleEvent with specific emitter catched ! is it myEmitter : ", myEmitter == ev.emitter )
},myEmitter);

// Adding a listener for SecondSimpleEvent with no specific emitter, all SecondSimpleEvent are catched
EventManager.addEventListener(SecondSimpleEvent,(ev) => {
    console.log("SecondSimpleEvent catched ! value :", ev.value)
});

// Dispatching a FirstSimpleEvent with no specific emitter
EventManager.dispatchEvent(new FirstSimpleEvent());

// Dispatching a FirstSimpleEvent with myEmitter as emitter
EventManager.dispatchEvent(new FirstSimpleEvent(),myEmitter);

// Dispatching a SecondSimpleEvent with value = 5 and no emitter
EventManager.dispatchEvent(new SecondSimpleEvent(5));

// Dispatching a SecondSimpleEvent with value = 10 and no emitter
EventManager.dispatchEvent(new SecondSimpleEvent(10));