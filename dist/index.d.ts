export interface EventArgument<U> {
    emitter: U;
    queued: boolean;
    following: boolean;
}
export declare type EventCallback<T, U> = (arg: T & EventArgument<U>) => void;
export declare type EventTransformer<T extends Object, U extends Object> = (arg: T) => U;
export declare class EventFollower {
    transform: EventTransformer<Object, Object>;
    emitter: Object | null;
    ctor: {
        new (...args: any[]): {};
    } | null;
    constructor(transform: EventTransformer<Object, Object>, emitter: Object | null, ctor: {
        new (...args: any[]): {};
    } | null);
}
export interface ObjectCallbackGeneric {
    callback: (arg: any) => void;
    emitter: Object | undefined;
}
export declare type Options = "Always" | "Never" | "Default";
export interface EventParameter {
    async?: boolean;
    queued?: Options;
    tag?: string;
    removeDuplicate?: boolean;
    testDuplicate?: (e1: any, e2: any) => boolean;
}
export interface EnableQueueParameter {
    removeDuplicate?: boolean;
    dontQueueAsync?: boolean;
    autoFlushAfter?: number;
    stackEnableCall?: boolean;
}
export declare function Event({ async, queued, tag, removeDuplicate, testDuplicate }?: EventParameter): any;
export declare class EventManager {
    private static _events;
    private static _queuedEvents;
    private static _queueEnable;
    private static _removeDuplicate;
    private static _dontQueueAsync;
    private static _autoFlushAfter;
    private static _stackEnableCall;
    private static _queueCallStackSize;
    static addEventListener<T, U>(ctor: {
        new (...arg: any[]): T;
    }, cb: EventCallback<T, U>, emitter?: U | undefined): ObjectCallbackGeneric;
    static dispatchEvent<T>(arg: T, emitter?: Object | undefined, async?: boolean | undefined, bypassQueue?: boolean): boolean;
    private static executeEvent;
    static deleteEventListener<T>(ctor: {
        new (...arg: any[]): T;
    }, obj: ObjectCallbackGeneric): boolean;
    private static queueEvent;
    static flushQueue(ctor?: {
        new (...args: any[]): {};
    }): number;
    static readonly queueLength: number;
    static readonly queueEnabled: boolean;
    static enableQueue({ removeDuplicate, dontQueueAsync, autoFlushAfter, stackEnableCall }?: EnableQueueParameter): void;
    static disableQueue(autoflush?: boolean, force?: boolean): number;
    static clearQueue(): void;
    static follow<T extends Object, U extends Object>(evo: {
        new (...args: any[]): T;
    }, evt: {
        new (...args: any[]): U;
    }, t: EventTransformer<T, U>, emitter?: Object | undefined): EventFollower;
    static unfollow(ef: EventFollower): void;
    static compressQueue(keep: {
        new (...arg: any[]): Object;
    }, erase: {
        new (...arg: any[]): Object;
    }[], sameEmitters?: boolean): void;
}
export declare class TriggerDispatchEvent {
    readonly callbackArgument: Object;
    readonly eventName: string;
    readonly eventConstructor: {
        new (...arg: any[]): any;
    };
    readonly originalEmitter: Object | undefined;
    readonly listernerNumber: number;
    constructor(callbackArgument: Object, eventName: string, eventConstructor: {
        new (...arg: any[]): any;
    }, originalEmitter: Object | undefined, listernerNumber: number);
}
export declare class AddListenerEvent {
    readonly eventName: string;
    readonly eventConstructor: {
        new (...arg: any[]): any;
    };
    readonly listernerNumber: number;
    constructor(eventName: string, eventConstructor: {
        new (...arg: any[]): any;
    }, listernerNumber: number);
}
export declare class RemoveListenerEvent {
    readonly eventName: string;
    readonly eventConstructor: {
        new (...arg: any[]): any;
    };
    readonly success: boolean;
    constructor(eventName: string, eventConstructor: {
        new (...arg: any[]): any;
    }, success: boolean);
}
export declare class StartQueueEvent {
    constructor();
}
export declare class StopQueueEvent {
    constructor();
}
export declare class EndQueueEvent {
    constructor();
}
