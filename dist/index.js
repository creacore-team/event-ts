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
    var _b = _a === void 0 ? {} : _a, _c = _b.async, async = _c === void 0 ? false : _c, queued = _b.queued, _d = _b.tag, tag = _d === void 0 ? "" : _d, removeDuplicate = _b.removeDuplicate, testDuplicate = _b.testDuplicate;
    return function (constructor) {
        var _a;
        return _a = (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return class_1;
            }(constructor)),
            _a.eventName = ((tag != "") ? tag + "_" : "") + "EVENTIFY_" + constructor.name + "_" + EventCounter.generateId(),
            _a.hasBeenEventify = true,
            _a.async = async,
            _a.queued = (queued !== undefined) ? queued : ((async) ? "Never" : "Default"),
            _a.removeDuplicate = removeDuplicate,
            _a.testDuplicate = (removeDuplicate == false) ? function (e1, e2) { return false; } : (testDuplicate) ? testDuplicate : function (e1, e2) { return true; },
            _a.followers = [],
            _a;
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
    ListEventCallback.prototype.clearAllCallback = function () {
        this._objectCallbacks.length = 0;
    };
    ListEventCallback.prototype.clearCallbackOf = function (filter) {
        for (var i = 0; i < this._objectCallbacks.length; i++) {
            if (this._objectCallbacks[i].emitter == filter) {
                this._objectCallbacks.splice(i, 1);
                i--;
            }
        }
    };
    ListEventCallback.prototype.getObjectCallbacks = function (filter) {
        return this._objectCallbacks.filter(function (objc) {
            return (objc.emitter == filter || objc.emitter == undefined);
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
        EventManager.dispatchEvent(new AddListenerEvent(ctor.eventName, ctor, (ev) ? ev.getObjectCallbacks(emitter).length + 1 : 1), this);
        return ev.register(cb, emitter);
    };
    EventManager.dispatchEvent = function (arg, emitter, async, bypassQueue) {
        var _this = this;
        if (emitter === void 0) { emitter = undefined; }
        if (async === void 0) { async = undefined; }
        if (bypassQueue === void 0) { bypassQueue = false; }
        if (!arg.constructor.hasBeenEventify)
            throw ("Event must be decorated with @Event");
        var argm = arg;
        argm.emitter = emitter;
        argm.queued = false;
        argm.following = false;
        if ((arg.constructor.queued == "Always") || ((!bypassQueue) && (this._queueEnable) && !(arg.constructor.queued == "Never") && (!arg.constructor.async || !this._dontQueueAsync))) {
            var ret = this.queueEvent(new QueuedEvent(arg.constructor.eventName, argm, async, arg.constructor));
            ((arg.constructor).followers).forEach(function (t) {
                if (t.emitter === null || argm.emitter == t.emitter) {
                    var arg_1 = t.transform(argm);
                    arg_1.emitter = argm.emitter;
                    arg_1.queued = argm.queued;
                    arg_1.following = true;
                    _this.queueEvent(new QueuedEvent(arg_1.constructor.eventName, arg_1, async, arg_1.constructor));
                }
            });
            return ret;
        }
        else {
            this.executeEvent(arg.constructor.eventName, argm, async, arg.constructor);
            ((arg.constructor).followers).forEach(function (t) {
                if (t.emitter === null || argm.emitter == t.emitter) {
                    var arg_2 = t.transform(argm);
                    arg_2.emitter = argm.emitter;
                    arg_2.queued = argm.queued;
                    arg_2.following = true;
                    _this.executeEvent(arg_2.constructor.eventName, arg_2, async, arg_2.constructor);
                }
            });
            return true;
        }
    };
    EventManager.executeEvent = function (eventName, argm, async, ctor) {
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
        obj.emitter = undefined;
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
        var nevent = 0;
        if (ctor === undefined) {
            var nevent_1 = this._queuedEvents.length;
            for (var _i = 0, _a = this._queuedEvents; _i < _a.length; _i++) {
                var qe = _a[_i];
                this.executeEvent(qe.eventName, qe.argm, qe.async, qe.ctor);
            }
            this._queuedEvents.length = 0;
        }
        else {
            var eventSaved = this._queuedEvents.filter(function (qe) { return qe.ctor !== ctor; });
            var eventFlushed = this._queuedEvents.filter(function (qe) { return qe.ctor === ctor; });
            var nevent_2 = eventFlushed.length;
            for (var _b = 0, eventFlushed_1 = eventFlushed; _b < eventFlushed_1.length; _b++) {
                var qe = eventFlushed_1[_b];
                this.executeEvent(qe.eventName, qe.argm, qe.async, qe.ctor);
            }
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
        var _b = _a === void 0 ? {} : _a, _c = _b.removeDuplicate, removeDuplicate = _c === void 0 ? true : _c, _d = _b.dontQueueAsync, dontQueueAsync = _d === void 0 ? false : _d, _e = _b.autoFlushAfter, autoFlushAfter = _e === void 0 ? -1 : _e, _f = _b.stackEnableCall, stackEnableCall = _f === void 0 ? true : _f;
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
        ef.ctor = null;
        ef.emitter = null;
    };
    EventManager.compressQueue = function (keep, erase, sameEmitters) {
        if (sameEmitters === void 0) { sameEmitters = true; }
        if (!keep.hasBeenEventify) {
            throw ("Event must be decorated with @Event");
        }
        for (var _i = 0, erase_1 = erase; _i < erase_1.length; _i++) {
            var evo = erase_1[_i];
            if (!evo.hasBeenEventify) {
                throw ("Event must be decorated with @Event");
            }
        }
        var allKeptEmitters = [];
        var oneEmitter = false;
        for (var _a = 0, _b = this._queuedEvents; _a < _b.length; _a++) {
            var qev = _b[_a];
            if (qev.eventName == keep.eventName) {
                oneEmitter = true;
                if (qev.argm.emitter)
                    allKeptEmitters.push(qev.argm.emitter);
            }
        }
        console.log(allKeptEmitters);
        if (sameEmitters && allKeptEmitters.length > 0) {
            this._queuedEvents = this._queuedEvents.filter(function (qev) {
                var sameName = erase.some(function (ev) { return ev.eventName == qev.eventName; });
                var se = allKeptEmitters.some(function (em) { return (em) == qev.argm.emitter; });
                return (!sameName || !se);
            });
        }
        if (!sameEmitters && oneEmitter) {
            this._queuedEvents = this._queuedEvents.filter(function (qev) {
                var sameName = erase.some(function (ev) { return ev.eventName == qev.eventName; });
                return (!sameName);
            });
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
        Event({ tag: "EventManager", async: false, queued: "Never" })
    ], TriggerDispatchEvent);
    return TriggerDispatchEvent;
}());
exports.TriggerDispatchEvent = TriggerDispatchEvent;
var AddListenerEvent = (function () {
    function AddListenerEvent(eventName, eventConstructor, listernerNumber) {
        this.eventName = eventName;
        this.eventConstructor = eventConstructor;
        this.listernerNumber = listernerNumber;
    }
    AddListenerEvent = __decorate([
        Event({ tag: "EventManager", async: false, queued: "Never" })
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
        Event({ tag: "EventManager", async: false, queued: "Never" })
    ], RemoveListenerEvent);
    return RemoveListenerEvent;
}());
exports.RemoveListenerEvent = RemoveListenerEvent;
//# sourceMappingURL=index.js.map