import {Event, EventManager} from "./../../dist/index"
// local import

@Event() class CreationEvent {
    constructor(public readonly car:Car){}
 }

@Event() class ModificationEvent { }

@Event() class DestroyEvent { }

class Car
{

    private hasBeenTuned:boolean = false;

    constructor(public color:number, public type:string)
    {
        EventManager.dispatchEvent(new CreationEvent(this),this);
    }

    public changeColor(color:number)
    {
        if(color != this.color)
        {
            this.color = color;
            EventManager.dispatchEvent(new ModificationEvent(),this);
        }
    }

    public tunning()
    {
        if(!this.hasBeenTuned)
        {
            this.hasBeenTuned = true;
            EventManager.dispatchEvent(new ModificationEvent(),this);
        }
    }

    public makeAccident()
    {
        EventManager.dispatchEvent(new DestroyEvent(),this);
    }
}

EventManager.addEventListener(CreationEvent,(ev) => {
    console.log("New car " + ev.car.type + " of color : " + ev.car.color);
    let modListener = EventManager.addEventListener(ModificationEvent,(ev)=>{ console.log("the color of the car " + ev.emitter.type + " is : ", ev.emitter.color)},ev.car)

    let destroyListener = EventManager.addEventListener(DestroyEvent,(ev)=> { 
        console.log("Car destroyed : " + ev.emitter.type);
        EventManager.deleteEventListener(ModificationEvent, modListener);
        EventManager.deleteEventListener(DestroyEvent, destroyListener);
    },ev.car);
})

let myCar = new Car(0xFF0000, "Ferrari");
let mySecondCar = new Car(0x0000FF, "Lamborghini");

mySecondCar.tunning();

myCar.changeColor(0x00FF00);
myCar.tunning();

mySecondCar.makeAccident();

myCar.changeColor(0x0000FF);
mySecondCar.changeColor(0x00FF00);
myCar.makeAccident();

myCar.changeColor(0xFF0000);
myCar.makeAccident();
