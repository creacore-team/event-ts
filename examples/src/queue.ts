import {Event, EventManager} from "./../../dist/index"
// local import

//Creation of a new Event with no parameter
@Event()
class SimpleEvent
{
    constructor(public readonly id:number){};
}

//Creation of a new Event Always queued
@Event({queued:"Always"})
class SimpleQueuedEvent
{
    constructor(public readonly id:number){};
}

//Creation of a new Event Never queued
@Event({queued:"Never"})
class NeverQueuedEvent
{
    constructor(public readonly id:number){};
}


// Adding a listener for SimpleEvent with no specific emitter, all SimpleEvent are catched
EventManager.addEventListener(SimpleEvent,(ev) => {
    console.log("  !! SimpleEvent(" + ev.id + ") \t\t\t(queued:"+ ev.queued+ ")\n" );
});

// Adding a listener for SimpleQueuedEvent with no specific emitter, all SimpleQueuedEvent are catched
EventManager.addEventListener(SimpleQueuedEvent,(ev) => {
    console.log("  !! SimpleQueuedEvent(" + ev.id + ") \t\t(queued:"+ ev.queued+ ")\n" );
});

// Adding a listener for NeverQueuedEvent with no specific emitter, all NeverQueuedEvent are catched
EventManager.addEventListener(NeverQueuedEvent,(ev) => {
    console.log("  !! NeverQueuedEvent(" + ev.id + ") \t\t(queued:"+ ev.queued+ ")\n" );
});

    console.log("\n* Queue is disabled by default");
    console.log("\n* EventManager.queueEnabled : " + EventManager.queueEnabled);


    console.log("  >> Dispatch SimpleQueuedEvent(1) \t[@Event{queued:'Always'}]");
EventManager.dispatchEvent(new SimpleQueuedEvent(1));

    console.log("  >> Dispatch NeverQueuedEvent(2) \t[@Event{queued:'Never'}]");
EventManager.dispatchEvent(new NeverQueuedEvent(2));

    console.log("  >> Dispatch SimpleEvent(3) \t \t[@Event{queued:'Default'}]");
EventManager.dispatchEvent(new SimpleEvent(3));

    console.log("\n* The number of queued event is : "+ EventManager.queueLength);

    console.log("\n* Flush queue");
EventManager.flushQueue();
    console.log("\n* The number of queued event is : "+ EventManager.queueLength);

    console.log("\n* Enable queue (without removing duplicated event)");
EventManager.enableQueue({removeDuplicate:false});
    console.log("\n* EventManager.queueEnabled : " + EventManager.queueEnabled);


    console.log("  >> Dispatch SimpleQueuedEvent(4) \t[@Event{queued:'Always'}]");
EventManager.dispatchEvent(new SimpleQueuedEvent(4));

    console.log("  >> Dispatch NeverQueuedEvent(5) \t[@Event{queued:'Never'}]");
EventManager.dispatchEvent(new NeverQueuedEvent(5));

    console.log("  >> Dispatch SimpleEvent(6) \t \t[@Event{queued:'Default'}]");
EventManager.dispatchEvent(new SimpleEvent(6));

// Last parameter force to bypass the queue
    console.log("  >> Dispatch SimpleEvent(7) \t\t[@Event{queued:'Default'}] - (bypass queue)");
EventManager.dispatchEvent(new SimpleEvent(7),undefined,false,true);

    console.log("\n* The number of queued event is : "+ EventManager.queueLength);
    console.log("\n* Disable queue, autoflush = true by default");
EventManager.disableQueue();
    console.log("\n* EventManager.queueEnabled : " + EventManager.queueEnabled);

    console.log("  >> Dispatch SimpleQueuedEvent(8) \t[@Event{queued:'Always'}]");
EventManager.dispatchEvent(new SimpleQueuedEvent(8));


    console.log("  >> Dispatch NeverQueuedEvent(9) \t[@Event{queued:'Never'}]");
EventManager.dispatchEvent(new NeverQueuedEvent(9));

    console.log("  >> Dispatch SimpleEvent(10) \t \t[@Event{queued:'Default'}]");
EventManager.dispatchEvent(new SimpleEvent(10));

    console.log("\n* The number of queued event is : "+ EventManager.queueLength);
    console.log("\n* Flush queue");
EventManager.flushQueue();

    console.log("  >> Dispatch SimpleQueuedEvent(11) \t[@Event{queued:'Always'}]");
EventManager.dispatchEvent(new SimpleQueuedEvent(11));

    console.log("  >> Dispatch SimpleQueuedEvent(12) \t[@Event{queued:'Always'}]");
EventManager.dispatchEvent(new SimpleQueuedEvent(12));

    console.log("  >> Dispatch SimpleQueuedEvent(13) \t[@Event{queued:'Always'}]");
EventManager.dispatchEvent(new SimpleQueuedEvent(13));

    console.log("\n* The number of queued event is : "+ EventManager.queueLength);
    console.log("\n* Clear queue, does not flush");
EventManager.clearQueue();
    console.log("\n* The number of queued event is : "+ EventManager.queueLength);
    console.log("\n* Flush queue");
EventManager.flushQueue();