
import {Event, EventManager, TriggerDispatchEvent, AddListenerEvent, RemoveListenerEvent} from "./../../dist/index"
// local import
import { OtherLibFunc1, OtherLibFunc2 } from "./helper_function/external"

//Creation of a new Event with no parameter
@Event({tag:"TAG_MyFirst ! SimpleEvent"})
class FirstSimpleEvent
{

}

console.log(" ! you should execute event-ts_NO-events.ts BEFORE in order to compare ")

EventManager.addEventListener(AddListenerEvent, (ev) => {
    console.log("There now "+ ev.listernerNumber +" guy interested in listening to ... " + ev.eventName);
});

EventManager.addEventListener(TriggerDispatchEvent, (ev) => {

    console.log("Event "+  ev.eventName + " has been dispatched.\n"+
                "There is "+  ev.listernerNumber + " listener interested by this event");
});

EventManager.addEventListener(FirstSimpleEvent,()=>{console.log("receive a FirstSimpleEvent")})
EventManager.addEventListener(FirstSimpleEvent,()=>{console.log("Yay !")})
OtherLibFunc1();

EventManager.dispatchEvent(new FirstSimpleEvent());
OtherLibFunc2();

EventManager.dispatchEvent(new FirstSimpleEvent());
OtherLibFunc2();

// TriggerDispatchEvent
// AddListenerEvent
// RemoveListenerEvent