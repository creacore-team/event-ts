import {Event, EventManager} from "./../../dist/index"

@Event() class EventA{};
@Event() class EventB{};
@Event() class EventC{};

EventManager.follow(EventA,EventB,(ev:EventA)=>{return new EventB()});
EventManager.follow(EventC,EventB,(ev:EventA)=>{return new EventB()});

EventManager.addEventListener(EventA, (ev)=>{console.log("EVENTA")})
EventManager.addEventListener(EventB, (ev)=>{console.log("EventB")})
EventManager.addEventListener(EventC, (ev)=>{console.log("EventC")})

EventManager.enableQueue();
EventManager.dispatchEvent(new EventA());
EventManager.disableQueue();

console.log("-----");
EventManager.enableQueue();
EventManager.dispatchEvent(new EventC());
EventManager.disableQueue();

console.log("-----");

EventManager.enableQueue();
EventManager.dispatchEvent(new EventA());
EventManager.dispatchEvent(new EventB());
EventManager.dispatchEvent(new EventC());
EventManager.disableQueue();