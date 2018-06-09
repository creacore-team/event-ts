import {Event, EventManager} from "./../../../dist/index"
// local import

//Creation of a new Event with no parameter
@Event() class FirstSimpleEvent
{

}

export function OtherLibFunc1()
{
    EventManager.addEventListener(FirstSimpleEvent,()=>{console.log("receive a FirstSimpleEvent")});
}

export function OtherLibFunc2()
{
    EventManager.dispatchEvent(new FirstSimpleEvent());
}
