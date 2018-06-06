"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var EventCounter = (function () {
    function EventCounter() {
    }
    EventCounter.generateId = function () {
        EventCounter.id++;
        return EventCounter.id;
    };
    EventCounter.id = 0;
    return EventCounter;
}());
var EventFollower = (function () {
    function EventFollower(transform, emitter, ctor) {
        if (emitter === void 0) { emitter = null; }
        this.transform = transform;
        this.emitter = emitter;
        this.ctor = ctor;
    }
    return EventFollower;
}());
exports.EventFollower = EventFollower;
function Event(_a) {
    var _b = _a.async, async = _b === void 0 ? false : _b, queued = _a.queued, _c = _a.tag, tag = _c === void 0 ? "" : _c, removeDuplicate = _a.removeDuplicate, testDuplicate = _a.testDuplicate;
    return function (constructor) {
        return _a = (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return class_1;
            }(constructor)),
            _a.eventName = ((tag == "") ? tag + "_" : "") + "EVENTIFY_" + constructor.name + "_" + EventCounter.generateId(),
            _a.hasBeenEventify = true,
            _a.async = async,
            _a.queued = (queued !== undefined) ? queued : ((async) ? "Never" : "Default"),
            _a.removeDuplicate = removeDuplicate,
            _a.testDuplicate = (removeDuplicate == false) ? function (e1, e2) { return false; } : (testDuplicate) ? testDuplicate : function (e1, e2) { return true; },
            _a.followers = [],
            _a;
        var _a;
    };
}
exports.Event = Event;
var ListEventCallback = (function () {
    function ListEventCallback(ev) {
        this._objectCallbacks = [];
        this._event = ev;
    }
    Object.defineProperty(ListEventCallback.prototype, "event", {
        get: function () {
            return this._event;
        },
        enumerable: true,
        configurable: true
    });
    ListEventCallback.prototype.register = function (cb, emitter) {
        var objc = { callback: cb, emitter: emitter };
        this._objectCallbacks.push(objc);
        return objc;
    };
    ListEventCallback.prototype.unRegister = function (callback) {
        var i = this._objectCallbacks.indexOf(callback);
        if (i > -1) {
            this._objectCallbacks.splice(i, 1);
            return true;
        }
        else {
            return false;
        }
    };
    ListEventCallback.prototype.getObjectCallbacks = function (filter) {
        return this._objectCallbacks.filter(function (objc) {
            return (objc.emitter == filter || objc.emitter == null);
        });
    };
    return ListEventCallback;
}());
var QueuedEvent = (function () {
    function QueuedEvent(eventName, argm, async, ctor) {
        this.eventName = eventName;
        this.argm = argm;
        this.async = async;
        this.ctor = ctor;
    }
    return QueuedEvent;
}());
var EventManager = (function () {
    function EventManager() {
    }
    EventManager.addEventListener = function (ctor, cb, emitter) {
        if (emitter === void 0) { emitter = undefined; }
        if (!ctor.hasBeenEventify)
            throw ("Event must be decorated with @Event");
        var ev = this._events.get(ctor.eventName);
        if (ev === undefined) {
            ev = new ListEventCallback(ctor);
            this._events.set(ctor.eventName, ev);
        }
        EventManager.dispatchEvent(new AddListenerEvent(ctor.eventName, ctor), this);
        return ev.register(cb, emitter);
    };
    EventManager.dispatchEvent = function (arg, emitter, async, bypassQueue) {
        if (emitter === void 0) { emitter = null; }
        if (async === void 0) { async = undefined; }
        if (bypassQueue === void 0) { bypassQueue = false; }
        if (!arg.constructor.hasBeenEventify)
            throw ("Event must be decorated with @Event");
        var argm = arg;
        argm.emitter = emitter;
        argm.queued = false;
        argm.following = false;
        if ((arg.constructor.queued == "Always") || ((!bypassQueue) && (this._queueEnable) && !(arg.constructor.queued == "Never") && (!arg.constructor.async || !this._dontQueueAsync))) {
            return this.queueEvent(new QueuedEvent(arg.constructor.eventName, argm, async, arg.constructor));
        }
        else {
            this.executeEvent(arg.constructor.eventName, argm, async, arg.constructor);
            return true;
        }
    };
    EventManager.executeEvent = function (eventName, argm, async, ctor) {
        var _this = this;
        var ev;
        ev = EventManager._events.get(eventName);
        if (ctor != TriggerDispatchEvent) {
            var argtde = new TriggerDispatchEvent(argm, eventName, ctor, argm.emitter, (ev) ? ev.getObjectCallbacks(argm.emitter).length : 0);
            argtde.emitter = this;
            argtde.queued = false;
            argtde.following = false;
            EventManager.executeEvent(TriggerDispatchEvent.eventName, argtde, undefined, TriggerDispatchEvent);
        }
        if (ev) {
            ev.getObjectCallbacks(argm.emitter).forEach(function (c) {
                if (async || (async == undefined && ctor.async)) {
                    setTimeout(function () { return c.callback(argm); }, 0);
                }
                else {
                    c.callback(argm);
                }
            });
            (ev.event.followers).forEach(function (t) {
                if (t.emitter === null || argm.emitter == t.emitter) {
                    var arg = t.transform(argm);
                    arg.emitter = argm.emitter;
                    arg.queued = argm.queued;
                    arg.following = true;
                    _this.executeEvent(arg.constructor.eventName, arg, async, arg.constructor);
                }
            });
        }
    };
    EventManager.deleteEventListener = function (ctor, obj) {
        var success = false;
        if (!ctor.hasBeenEventify)
            throw ("Event must be decorated with @Event");
        var ev = this._events.get(ctor.eventName);
        if (ev !== undefined) {
            success = ev.unRegister(obj);
        }
        EventManager.dispatchEvent(new RemoveListenerEvent(ctor.eventName, ctor, success), this);
        return success;
    };
    EventManager.queueEvent = function (qe) {
        qe.argm.queued = true;
        if ((qe.ctor.removeDuplicate == undefined && this._removeDuplicate) || qe.ctor.removeDuplicate) {
            var idDuplicate = this._queuedEvents.findIndex(function (q) { return (q.eventName == qe.eventName) && (q.argm.emitter == qe.argm.emitter) && (q.ctor.testDuplicate(q.argm, qe.argm)); });
            if (idDuplicate > -1) {
                this._queuedEvents.splice(idDuplicate, 1, qe);
                return false;
            }
        }
        this._queuedEvents.push(qe);
        if (this._autoFlushAfter > -1 && this._queuedEvents.length > this._autoFlushAfter) {
            this.flushQueue();
            return true;
        }
        return false;
    };
    EventManager.flushQueue = function (ctor) {
        var _this = this;
        var nevent = 0;
        if (ctor === undefined) {
            var nevent_1 = this._queuedEvents.length;
            this._queuedEvents.forEach(function (qe) {
                _this.executeEvent(qe.eventName, qe.argm, qe.async, qe.ctor);
            });
            this._queuedEvents.length = 0;
        }
        else {
            var eventSaved = this._queuedEvents.filter(function (qe) { return qe.ctor !== ctor; });
            var eventFlushed = this._queuedEvents.filter(function (qe) { return qe.ctor === ctor; });
            var nevent_2 = eventFlushed.length;
            eventFlushed.forEach(function (qe) {
                _this.executeEvent(qe.eventName, qe.argm, qe.async, qe.ctor);
            });
            this._queuedEvents = eventSaved;
        }
        return nevent;
    };
    Object.defineProperty(EventManager, "queueLength", {
        get: function () {
            return this._queuedEvents.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventManager, "queueEnabled", {
        get: function () {
            return this._queueEnable;
        },
        enumerable: true,
        configurable: true
    });
    EventManager.enableQueue = function (_a) {
        var _b = _a.removeDuplicate, removeDuplicate = _b === void 0 ? true : _b, _c = _a.dontQueueAsync, dontQueueAsync = _c === void 0 ? false : _c, _d = _a.autoFlushAfter, autoFlushAfter = _d === void 0 ? -1 : _d, _e = _a.stackEnableCall, stackEnableCall = _e === void 0 ? true : _e;
        if (!this._queueEnable) {
            this._queueEnable = true;
            this._queueCallStackSize = 0;
            this._stackEnableCall = stackEnableCall;
            this._removeDuplicate = removeDuplicate;
            this._dontQueueAsync = dontQueueAsync;
            this._autoFlushAfter = autoFlushAfter;
        }
        else if (this._stackEnableCall) {
            this._queueCallStackSize++;
        }
    };
    EventManager.disableQueue = function (autoflush, force) {
        if (autoflush === void 0) { autoflush = true; }
        if (force === void 0) { force = false; }
        var nevent = 0;
        if (!this._stackEnableCall || this._queueCallStackSize == 0 || force) {
            if (autoflush) {
                nevent = this.flushQueue();
            }
            else {
                this.clearQueue();
            }
            this._queueCallStackSize = 0;
            this._queueEnable = false;
        }
        else if (this._stackEnableCall) {
            this._queueCallStackSize--;
            if (this._queueCallStackSize < 0) {
                this._queueCallStackSize = 0;
            }
        }
        return nevent;
    };
    EventManager.clearQueue = function () {
        this._queuedEvents.length = 0;
    };
    EventManager.follow = function (evo, evt, t, emitter) {
        if (emitter === void 0) { emitter = undefined; }
        if (!evo.hasBeenEventify || !evt.hasBeenEventify) {
            throw ("Event must be decorated with @Event");
        }
        var ev = this._events.get(evo.eventName);
        if (ev === undefined) {
            ev = new ListEventCallback(evo);
            this._events.set(evo.eventName, ev);
        }
        var f = new EventFollower(t, (emitter) ? emitter : null, evo);
        evo.followers.push(f);
        return f;
    };
    EventManager.unfollow = function (ef) {
        var id = ef.ctor.followers.findIndex(function (efi) { return ef == efi; });
        if (id > -1) {
            ef.ctor.followers.splice(id, 1);
        }
    };
    EventManager._events = new Map();
    EventManager._queuedEvents = [];
    EventManager._queueEnable = false;
    EventManager._removeDuplicate = true;
    EventManager._dontQueueAsync = false;
    EventManager._autoFlushAfter = -1;
    EventManager._stackEnableCall = true;
    EventManager._queueCallStackSize = 0;
    return EventManager;
}());
exports.EventManager = EventManager;
var TriggerDispatchEvent = (function () {
    function TriggerDispatchEvent(callbackArgument, eventName, eventConstructor, originalEmitter, listernerNumber) {
        this.callbackArgument = callbackArgument;
        this.eventName = eventName;
        this.eventConstructor = eventConstructor;
        this.originalEmitter = originalEmitter;
        this.listernerNumber = listernerNumber;
    }
    TriggerDispatchEvent = __decorate([
        Event({ tag: "EventManager", async: true })
    ], TriggerDispatchEvent);
    return TriggerDispatchEvent;
}());
exports.TriggerDispatchEvent = TriggerDispatchEvent;
var AddListenerEvent = (function () {
    function AddListenerEvent(eventName, eventConstructor) {
        this.eventName = eventName;
        this.eventConstructor = eventConstructor;
    }
    AddListenerEvent = __decorate([
        Event({ tag: "EventManager", async: true })
    ], AddListenerEvent);
    return AddListenerEvent;
}());
exports.AddListenerEvent = AddListenerEvent;
var RemoveListenerEvent = (function () {
    function RemoveListenerEvent(eventName, eventConstructor, success) {
        this.eventName = eventName;
        this.eventConstructor = eventConstructor;
        this.success = success;
    }
    RemoveListenerEvent = __decorate([
        Event({ tag: "EventManager", async: true })
    ], RemoveListenerEvent);
    return RemoveListenerEvent;
}());
exports.RemoveListenerEvent = RemoveListenerEvent;
//# sourceMappingURL=index.js.map