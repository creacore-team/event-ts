import {Event, EventManager} from "./../../dist/index"

@Event({})
class FirstSimpleEvent
{

}

@Event({})
class SecondSimpleEvent
{
    constructor(public readonly value:number){}
}

EventManager.addEventListener(FirstSimpleEvent,(ev)=>{console.log("FirstSimpleEvent catched ! queued :", ev.queued, "- following :", ev.following)});
EventManager.addEventListener(SecondSimpleEvent,(ev)=>{console.log("SecondSimpleEvent catched ! value :", ev.value)});

EventManager.dispatchEvent(new FirstSimpleEvent());

EventManager.dispatchEvent(new SecondSimpleEvent(5));
EventManager.dispatchEvent(new SecondSimpleEvent(10));