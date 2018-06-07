/**
 * 
 * Eventify library : CREACORE
 * creacore.be
 * 
 */

class EventCounter
{
    private static id:number = 0;
    public static generateId():number
    {
        EventCounter.id++;
        return EventCounter.id;
    }
}

export interface EventArgument<U>
{
    emitter:U;
    queued:boolean,
    following:boolean
}

export declare type EventCallback<T, U> = (arg:T&EventArgument<U>)=>void;
export declare type EventTransformer<T extends Object, U extends Object> = (arg:T)=>U;

export class EventFollower
{
    constructor(    public transform:EventTransformer<Object, Object>,
                    public emitter:Object|null = null,
                    public ctor:{new(...args:any[]):{}}|null){}
}

export interface ObjectCallbackGeneric
{
    callback: (arg:any)=>void;
    emitter: Object|undefined;
}

export type Options = "Always" | "Never" | "Default";

export interface EventParameter
{
    async?:boolean,
    queued?:Options,
    tag?:string,
    removeDuplicate?:boolean,
    testDuplicate?:(e1:any, e2:any) => boolean;
}

export interface EnableQueueParameter
{
    removeDuplicate?:boolean,
    dontQueueAsync?:boolean,
    autoFlushAfter?:number,
    stackEnableCall?:boolean
}

export function Event({ async = false, queued , tag ="", removeDuplicate , testDuplicate } : EventParameter = {}):any // decorator
{
    return function<T extends {new(...args:any[]):{}}>(constructor:T) {
        return class extends constructor {
            static readonly eventName:string = ((tag == "")?tag+"_":"") + "EVENTIFY_" + constructor.name +"_"+ EventCounter.generateId();
            static readonly hasBeenEventify:boolean = true;
            static readonly async:boolean = async;
            static readonly queued:string = (queued !== undefined)?queued:((async)?"Never":"Default");
            static readonly removeDuplicate?:boolean = removeDuplicate;
            static readonly testDuplicate:((e1:any, e2:any) => boolean) = (removeDuplicate==false)?(e1:any, e2:any) => false:(testDuplicate)?testDuplicate:(e1:any, e2:any) => true;
            static followers: EventFollower[] = []
        }
    }
}

class ListEventCallback
{
    private _objectCallbacks: ObjectCallbackGeneric[] = [];
    private _event: { new(... arg:any[]): any };

    constructor(ev:{ new(... arg:any[]): any })
    {
        this._event = ev;
    }

    public get event():{ new(... arg:any[]): any }
    {
        return this._event;
    }

    public register<T,U>(cb:EventCallback<T,U>, emitter: Object|undefined): ObjectCallbackGeneric
    {
        let objc: ObjectCallbackGeneric = {callback: cb, emitter: emitter};
        this._objectCallbacks.push(objc);
        return objc;
    }

    public unRegister(callback: ObjectCallbackGeneric):boolean
    {
        let i = this._objectCallbacks.indexOf(callback);
        if(i > -1)
        {
            this._objectCallbacks.splice(i, 1);
            return true;
        }
        else
        {
            return false;
        }
    }

    public getObjectCallbacks(filter: Object|undefined): ObjectCallbackGeneric[]
    {
        return this._objectCallbacks.filter((objc: ObjectCallbackGeneric) => {
            return (objc.emitter == filter || objc.emitter == undefined);
        });
    }
}

class QueuedEvent
{
    constructor(
        public eventName: string,
        public argm: Object&EventArgument<Object|undefined>,
        public async: boolean|undefined,
        public ctor: {new(...args:any[]):{}}
    ){}
}

export class EventManager
{
    private static _events: Map<string, ListEventCallback> = new Map<string, ListEventCallback>();

    private static _queuedEvents: QueuedEvent[]  = [];
    private static _queueEnable:boolean = false;

    private static _removeDuplicate:boolean = true;
    private static _dontQueueAsync:boolean = false;
    private static _autoFlushAfter:number = -1;
    private static _stackEnableCall:boolean = true;
    private static _queueCallStackSize = 0;

    public static addEventListener<T,U>(ctor: { new(... arg:any[]): T }, cb:EventCallback<T, U>, emitter:U|undefined = undefined):ObjectCallbackGeneric
    {
        if(!(<any>ctor).hasBeenEventify)
            throw("Event must be decorated with @Event");

        let ev = this._events.get((<any>ctor).eventName)
        if(ev === undefined)
        {
            ev = new ListEventCallback(ctor)
            this._events.set((<any>ctor).eventName, ev);
        }
        EventManager.dispatchEvent(new AddListenerEvent((<any>ctor).eventName,ctor),this)

        return ev.register(cb,emitter);        
    }

    public static dispatchEvent<T>(arg:T, emitter:Object|undefined = undefined, async:boolean|undefined = undefined, bypassQueue:boolean = false):boolean
    {
        if(!(<any>arg.constructor).hasBeenEventify)
            throw("Event must be decorated with @Event");

        let argm : T&EventArgument<Object|undefined> = arg as T&EventArgument<Object|undefined>;
        argm.emitter = emitter;
        argm.queued = false;
        argm.following = false;

        if(((<any>arg.constructor).queued == "Always") || ((!bypassQueue) && (this._queueEnable) && !((<any>arg.constructor).queued == "Never") && (!(<any>arg.constructor).async || !this._dontQueueAsync)))
        {
            return this.queueEvent(new QueuedEvent((<any>arg.constructor).eventName,argm,async,(<any>arg.constructor)))
        }
        else
        {
            this.executeEvent((<any>arg.constructor).eventName,argm,async,(<any>arg.constructor))
            return true;
        }
    }

    private static executeEvent(eventName:string, argm:Object&Object&EventArgument<Object|undefined>, async:boolean|undefined, ctor: {new(...args:any[]):{}})
    {
        let ev:ListEventCallback|undefined;

        ev = EventManager._events.get(eventName)

        if(ctor != TriggerDispatchEvent)
        {
            let argtde : TriggerDispatchEvent&EventArgument<Object> = new TriggerDispatchEvent(argm,eventName,ctor,argm.emitter,(ev)?ev.getObjectCallbacks(argm.emitter).length:0) as TriggerDispatchEvent&EventArgument<Object>;
            argtde.emitter = this;
            argtde.queued = false;
            argtde.following = false;
            
            EventManager.executeEvent((<any>TriggerDispatchEvent).eventName,argtde,undefined,TriggerDispatchEvent)
        }

        if(ev)
        {

            ev.getObjectCallbacks(argm.emitter).forEach( (c: ObjectCallbackGeneric) => {
                if(async || (async==undefined && (<any>ctor).async))
                {
                    setTimeout(()=>c.callback(argm),0);
                    
                }
                else
                {
                    c.callback(argm)
                }
            });

            ((<any>ev.event).followers).forEach((t:EventFollower)=>
            {
                if(t.emitter === null || argm.emitter == t.emitter)
                {
                    let arg : any = t.transform(argm);
                    arg.emitter = argm.emitter;
                    arg.queued = argm.queued;
                    arg.following = true;

                    this.executeEvent((<any>arg).constructor.eventName, arg,async, arg.constructor)
                }
                
            })
        }
    }

    public static deleteEventListener<T>(ctor: { new(...arg:any[]): T }, obj:ObjectCallbackGeneric): boolean
    {
        let success:boolean = false;
        if(!(<any>ctor).hasBeenEventify)
            throw("Event must be decorated with @Event");

        let ev = this._events.get((<any>ctor).eventName)
        if(ev !== undefined)
        {
            success = ev.unRegister(obj);
        }

        EventManager.dispatchEvent(new RemoveListenerEvent((<any>ctor).eventName,ctor, success),this)
        obj.emitter = undefined;
        return success;
    }

    private static queueEvent(qe:QueuedEvent):boolean
    {
        qe.argm.queued = true;
        if(((<any>qe.ctor).removeDuplicate == undefined && this._removeDuplicate) || (<any>qe.ctor).removeDuplicate){
            let idDuplicate = this._queuedEvents.findIndex(q=> (q.eventName == qe.eventName) && (q.argm.emitter == qe.argm.emitter) && ((<any>q.ctor).testDuplicate(q.argm,qe.argm)))
            if(idDuplicate > -1)
            {
                this._queuedEvents.splice(idDuplicate,1,qe);
                return false;
            }
        }
        
        this._queuedEvents.push(qe);
        if(this._autoFlushAfter > -1 && this._queuedEvents.length > this._autoFlushAfter)
        {
            this.flushQueue();
            return true;
        }
        return false;
    }

    public static flushQueue(ctor?:{new(...args:any[]):{}}):number
    {
        let nevent = 0;
        if(ctor === undefined)
        {
            let nevent = this._queuedEvents.length;

            this._queuedEvents.forEach(qe=>{
                this.executeEvent(qe.eventName,qe.argm,qe.async,qe.ctor);
            })

            this._queuedEvents.length = 0;
        }
        else
        {
            let eventSaved = this._queuedEvents.filter((qe)=>{return qe.ctor !== ctor});
            let eventFlushed = this._queuedEvents.filter((qe)=>{return qe.ctor === ctor});

            let nevent = eventFlushed.length;

            eventFlushed.forEach(qe=>{
                this.executeEvent(qe.eventName,qe.argm,qe.async,qe.ctor);
            })

            this._queuedEvents = eventSaved;
        }

        return nevent;
    }

    public static get queueLength():number
    {
        return this._queuedEvents.length;
    }

    public static get queueEnabled():boolean
    {
        return this._queueEnable;
    }

    public static enableQueue({removeDuplicate = true, dontQueueAsync = false, autoFlushAfter = -1, stackEnableCall = true}:EnableQueueParameter = {}):void
    {
        if(!this._queueEnable)
        {
            this._queueEnable = true;
            this._queueCallStackSize = 0;
            this._stackEnableCall = stackEnableCall;
            this._removeDuplicate = removeDuplicate;
            this._dontQueueAsync = dontQueueAsync;
            this._autoFlushAfter = autoFlushAfter;
        }
        else if(this._stackEnableCall)
        {
            this._queueCallStackSize++;
        }
    }

    public static disableQueue(autoflush:boolean = true, force:boolean = false):number
    {
        let nevent = 0;
        if(!this._stackEnableCall || this._queueCallStackSize == 0 || force)
        {
            if(autoflush)
            {
                nevent = this.flushQueue();
            }
            else
            {
                this.clearQueue();
            }
            this._queueCallStackSize = 0;
            this._queueEnable = false;
        }
        else if (this._stackEnableCall)
        {
            this._queueCallStackSize--;
            if(this._queueCallStackSize<0)
            {
                this._queueCallStackSize = 0;
            }
        }
        return nevent;
    }

    public static clearQueue():void
    {
        this._queuedEvents.length = 0;
    }

    public static follow<T extends Object,U extends Object>(evo:{new(...args:any[]):T} ,evt:{new(...args:any[]):U},t:EventTransformer<T,U>, emitter:Object|undefined = undefined):EventFollower
    {
        if(!(<any>evo).hasBeenEventify || !(<any>evt).hasBeenEventify)
        {
            throw("Event must be decorated with @Event");
        }

        let ev = this._events.get((<any>evo).eventName)
        if(ev === undefined)
        {
            ev = new ListEventCallback(evo)
            this._events.set((<any>evo).eventName, ev);
        }

        
        let f = new EventFollower(<any>t,(emitter)?emitter:null,evo);
        (<any>evo).followers.push(f);

        return f;
    }

    public static unfollow(ef:EventFollower)
    {
        let id:number = (<any>ef.ctor).followers.findIndex((efi:EventFollower)=>{return ef==efi})
        if(id > -1)
        {
            (<any>ef.ctor).followers.splice(id,1);
        }

        ef.ctor = null;
        ef.emitter = null;
    }
}

@Event({tag:"EventManager", async:true})
export class TriggerDispatchEvent
{
    constructor(
    public readonly callbackArgument:Object,
    public readonly eventName:string,
    public readonly eventConstructor: { new(...arg:any[]): any },
    public readonly originalEmitter:Object|undefined,
    public readonly listernerNumber:number
    ){}
}

@Event({tag:"EventManager", async:true})
export class AddListenerEvent
{
    constructor(
    public readonly eventName:string,
    public readonly eventConstructor: { new(...arg:any[]): any }
    ){}
}

@Event({tag:"EventManager", async:true})
export class RemoveListenerEvent
{
    constructor(
    public readonly eventName:string,
    public readonly eventConstructor: { new(...arg:any[]): any },
    public readonly success:boolean
    ){}
}
