import {Event, EventManager} from "./../../dist/index"
// local import

@Event() class EventA{};
@Event() class EventB{};
@Event() class EventC{};
@Event() class EventD{};
@Event() class EventE{};
@Event() class EventABCDE{
    constructor(public readonly letter:string){};
};

let fA = EventManager.follow(EventA,EventABCDE,(a)=>{return new EventABCDE("A")});
let fB = EventManager.follow(EventB,EventABCDE,(a)=>{return new EventABCDE("B")});
let fC = EventManager.follow(EventC,EventABCDE,(a)=>{return new EventABCDE("C")});
let fD = EventManager.follow(EventD,EventABCDE,(a)=>{return new EventABCDE("D")});
let fE = EventManager.follow(EventE,EventABCDE,(a)=>{return new EventABCDE("E")});

EventManager.addEventListener(EventA,(ev)=>{
    console.log("EventA catched\n");
})

EventManager.addEventListener(EventABCDE,(ev)=>{
    if(ev.following)
    {
        console.log("EventABCDE catched following Event" + ev.letter + "\n");
    }
    else
    {
        console.log("EventABCDE catched trigger with letter " + ev.letter+ "\n");
    }
})

EventManager.dispatchEvent(new EventA());
EventManager.dispatchEvent(new EventB());
EventManager.dispatchEvent(new EventC());
EventManager.dispatchEvent(new EventD());
EventManager.dispatchEvent(new EventE());
EventManager.dispatchEvent(new EventABCDE("F"));

EventManager.unfollow(fA);
EventManager.unfollow(fC);
EventManager.unfollow(fE);

EventManager.dispatchEvent(new EventA());
EventManager.dispatchEvent(new EventB());
EventManager.dispatchEvent(new EventC());
EventManager.dispatchEvent(new EventD());
EventManager.dispatchEvent(new EventE());
EventManager.dispatchEvent(new EventABCDE("G"));

EventManager.unfollow(fB);
EventManager.unfollow(fD);