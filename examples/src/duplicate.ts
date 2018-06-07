import {Event, EventManager} from "./../../dist/index"
// local import

//Creation of a new Event with no parameter
@Event()
class SimpleEvent
{
    constructor(public readonly id:number){};
}

@Event({testDuplicate:(a,b)=>a.id == b.id})
class DuplicateEvent
{
    private static counter:number = 0;
    public counter:number;

    constructor(public readonly id:number){
        this.counter = DuplicateEvent.counter;
        DuplicateEvent.counter++;
    };
}

@Event({removeDuplicate:false})
class SimpleNoRemoveDuplicateEvent
{
    constructor(public readonly id:number){};
}

EventManager.addEventListener(SimpleEvent,(ev) => {
    console.log("  !! SimpleEvent(" + ev.id + ") \t\t(queued:"+ ev.queued+ ")\n" );
});

EventManager.addEventListener(DuplicateEvent,(ev) => {
    console.log("  !! DuplicateEvent(" + ev.id + "):"+ ev.counter + "\t\t(queued:"+ ev.queued+ ")\n" );
});

EventManager.addEventListener(SimpleNoRemoveDuplicateEvent,(ev) => {
    console.log("  !! SimpleNoRemoveDuplicateEvent(" + ev.id + ") \t\t(queued:"+ ev.queued+ ")\n" );
});

let emitter = {};

    console.log("\n* Enable queue (removing duplicated event by Default)");
EventManager.enableQueue();
    console.log("\n* EventManager.queueEnabled : " + EventManager.queueEnabled);

    console.log("  >> Dispatch SimpleEvent(1) no emitter");
EventManager.dispatchEvent(new SimpleEvent(1));

    console.log("  >> Dispatch SimpleEvent(2) emitter");
EventManager.dispatchEvent(new SimpleEvent(2),emitter);

    console.log("  >> Dispatch SimpleEvent(2) emitter, again!");
EventManager.dispatchEvent(new SimpleEvent(2),emitter);

    console.log("  >> Dispatch SimpleEvent(2) emitter, again! again!");
EventManager.dispatchEvent(new SimpleEvent(2),emitter);

    console.log("  >> Dispatch SimpleEvent(2) emitter, again! again! again!");
EventManager.dispatchEvent(new SimpleEvent(2),emitter);

    console.log("  >> Dispatch SimpleEvent(3) emitter");
EventManager.dispatchEvent(new SimpleEvent(3),emitter);

    console.log("  >> Dispatch SimpleEvent(4) emitter");
EventManager.dispatchEvent(new SimpleEvent(4),emitter);

    console.log("\n* The number of queued event is : "+ EventManager.queueLength);
    console.log("\n* Disable queue, autoflush = true by default");
EventManager.disableQueue();


    console.log("\n* Enable queue (removing duplicated event by Default)");
EventManager.enableQueue();
    console.log("\n* EventManager.queueEnabled : " + EventManager.queueEnabled);

    console.log("  >> Dispatch DuplicateEvent(1) no emitter  \t  \t  \t \t[@Event{testDuplicate}]");
EventManager.dispatchEvent(new DuplicateEvent(1));

    console.log("  >> Dispatch DuplicateEvent(2) emitter  \t \t \t \t[@Event{testDuplicate}]");
EventManager.dispatchEvent(new DuplicateEvent(2),emitter);

    console.log("  >> Dispatch DuplicateEvent(2) emitter, again!  \t  \t \t[@Event{testDuplicate}]");
EventManager.dispatchEvent(new DuplicateEvent(2),emitter);

    console.log("  >> Dispatch DuplicateEvent(2) emitter, again! again!  \t \t[@Event{testDuplicate}]");
EventManager.dispatchEvent(new DuplicateEvent(2),emitter);

    console.log("  >> Dispatch DuplicateEvent(2) emitter, again! again! again!  \t \t[@Event{testDuplicate}]");
EventManager.dispatchEvent(new DuplicateEvent(2),emitter);

    console.log("  >> Dispatch DuplicateEvent(3) emitter   \t  \t \t \t[@Event{testDuplicate}]");
EventManager.dispatchEvent(new DuplicateEvent(3),emitter);

    console.log("\n* The number of queued event is : "+ EventManager.queueLength);
    console.log("\n* Disable queue, autoflush = true by default");
EventManager.disableQueue();



console.log("\n* Enable queue (removing duplicated event by Default)");
EventManager.enableQueue();
    console.log("\n* EventManager.queueEnabled : " + EventManager.queueEnabled);

    console.log("  >> Dispatch SimpleNoRemoveDuplicateEvent(1) no emitter   \t  \t \t[@Event{removeDuplicate:false}]");
EventManager.dispatchEvent(new SimpleNoRemoveDuplicateEvent(1));

    console.log("  >> Dispatch SimpleNoRemoveDuplicateEvent(2) emitter  \t  \t  \t \t[@Event{removeDuplicate:false}]");
EventManager.dispatchEvent(new SimpleNoRemoveDuplicateEvent(2));

    console.log("  >> Dispatch SimpleNoRemoveDuplicateEvent(2) emitter  again  \t  \t \t[@Event{removeDuplicate:false}]");
EventManager.dispatchEvent(new SimpleNoRemoveDuplicateEvent(2));

    console.log("  >> Dispatch SimpleNoRemoveDuplicateEvent(3) emitter   \t  \t \t[@Event{removeDuplicate:false}]");
EventManager.dispatchEvent(new SimpleNoRemoveDuplicateEvent(3));

    console.log("\n* The number of queued event is : "+ EventManager.queueLength);
    console.log("\n* Disable queue, autoflush = true by default");
EventManager.disableQueue();