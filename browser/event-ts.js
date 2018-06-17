var EVENTTS=function(e){var t={};function n(r){if(t[r])return t[r].exports;var u=t[r]={i:r,l:!1,exports:{}};return e[r].call(u.exports,u,u.exports,n),u.l=!0,u.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var u in e)n.d(r,u,function(t){return e[t]}.bind(null,u));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";var r,u=this&&this.__extends||(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),i=this&&this.__decorate||function(e,t,n,r){var u,i=arguments.length,o=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(u=e[a])&&(o=(i<3?u(o):i>3?u(t,n,o):u(t,n))||o);return i>3&&o&&Object.defineProperty(t,n,o),o};Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(){}return e.generateId=function(){return e.id++,e.id},e.id=0,e}(),a=function(){return function(e,t,n){void 0===t&&(t=null),this.transform=e,this.emitter=t,this.ctor=n}}();function c(e){var t=void 0===e?{}:e,n=t.async,r=void 0!==n&&n,i=t.queued,a=t.tag,c=void 0===a?"":a,s=t.removeDuplicate,l=t.testDuplicate;return function(e){var t;return(t=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return u(t,e),t}(e)).eventName=(""!=c?c+"_":"")+"EVENTIFY_"+e.name+"_"+o.generateId(),t.hasBeenEventify=!0,t.async=r,t.queued=void 0!==i?i:r?"Never":"Default",t.removeDuplicate=s,t.testDuplicate=0==s?function(e,t){return!1}:l||function(e,t){return!0},t.followers=[],t}}t.EventFollower=a,t.Event=c;var s=function(){function e(e){this._objectCallbacks=[],this._event=e}return Object.defineProperty(e.prototype,"event",{get:function(){return this._event},enumerable:!0,configurable:!0}),e.prototype.register=function(e,t){var n={callback:e,emitter:t};return this._objectCallbacks.push(n),n},e.prototype.unRegister=function(e){var t=this._objectCallbacks.indexOf(e);return t>-1&&(this._objectCallbacks.splice(t,1),!0)},e.prototype.getObjectCallbacks=function(e){return this._objectCallbacks.filter(function(t){return t.emitter==e||void 0==t.emitter})},e}(),l=function(){return function(e,t,n,r){this.eventName=e,this.argm=t,this.async=n,this.ctor=r}}(),v=function(){function e(){}return e.addEventListener=function(t,n,r){if(void 0===r&&(r=void 0),!t.hasBeenEventify)throw"Event must be decorated with @Event";var u=this._events.get(t.eventName);return void 0===u&&(u=new s(t),this._events.set(t.eventName,u)),e.dispatchEvent(new h(t.eventName,t,u?u.getObjectCallbacks(r).length+1:1),this),u.register(n,r)},e.dispatchEvent=function(e,t,n,r){var u=this;if(void 0===t&&(t=void 0),void 0===n&&(n=void 0),void 0===r&&(r=!1),!e.constructor.hasBeenEventify)throw"Event must be decorated with @Event";var i=e;if(i.emitter=t,i.queued=!1,i.following=!1,"Always"!=e.constructor.queued&&(r||!this._queueEnable||"Never"==e.constructor.queued||e.constructor.async&&this._dontQueueAsync))return this.executeEvent(e.constructor.eventName,i,n,e.constructor),e.constructor.followers.forEach(function(e){if(null===e.emitter||i.emitter==e.emitter){var t=e.transform(i);t.emitter=i.emitter,t.queued=i.queued,t.following=!0,u.executeEvent(t.constructor.eventName,t,n,t.constructor)}}),!0;var o=this.queueEvent(new l(e.constructor.eventName,i,n,e.constructor));return e.constructor.followers.forEach(function(e){if(null===e.emitter||i.emitter==e.emitter){var t=e.transform(i);t.emitter=i.emitter,t.queued=i.queued,t.following=!0,u.queueEvent(new l(t.constructor.eventName,t,n,t.constructor))}}),o},e.executeEvent=function(t,n,r,u){var i;if(i=e._events.get(t),u!=f){var o=new f(n,t,u,n.emitter,i?i.getObjectCallbacks(n.emitter).length:0);o.emitter=this,o.queued=!1,o.following=!1,e.executeEvent(f.eventName,o,void 0,f)}i&&i.getObjectCallbacks(n.emitter).forEach(function(e){r||void 0==r&&u.async?setTimeout(function(){return e.callback(n)},0):e.callback(n)})},e.deleteEventListener=function(t,n){var r=!1;if(!t.hasBeenEventify)throw"Event must be decorated with @Event";var u=this._events.get(t.eventName);return void 0!==u&&(r=u.unRegister(n)),e.dispatchEvent(new d(t.eventName,t,r),this),n.emitter=void 0,r},e.queueEvent=function(e){if(e.argm.queued=!0,void 0==e.ctor.removeDuplicate&&this._removeDuplicate||e.ctor.removeDuplicate){var t=this._queuedEvents.findIndex(function(t){return t.eventName==e.eventName&&t.argm.emitter==e.argm.emitter&&t.ctor.testDuplicate(t.argm,e.argm)});if(t>-1)return this._queuedEvents.splice(t,1,e),!1}return this._queuedEvents.push(e),this._autoFlushAfter>-1&&this._queuedEvents.length>this._autoFlushAfter&&(this.flushQueue(),!0)},e.flushQueue=function(e){if(void 0===e){this._queuedEvents.length;for(var t=0,n=this._queuedEvents;t<n.length;t++){var r=n[t];this.executeEvent(r.eventName,r.argm,r.async,r.ctor)}this._queuedEvents.length=0}else{for(var u=this._queuedEvents.filter(function(t){return t.ctor!==e}),i=this._queuedEvents.filter(function(t){return t.ctor===e}),o=(i.length,0),a=i;o<a.length;o++){r=a[o];this.executeEvent(r.eventName,r.argm,r.async,r.ctor)}this._queuedEvents=u}return 0},Object.defineProperty(e,"queueLength",{get:function(){return this._queuedEvents.length},enumerable:!0,configurable:!0}),Object.defineProperty(e,"queueEnabled",{get:function(){return this._queueEnable},enumerable:!0,configurable:!0}),e.enableQueue=function(e){var t=void 0===e?{}:e,n=t.removeDuplicate,r=void 0===n||n,u=t.dontQueueAsync,i=void 0!==u&&u,o=t.autoFlushAfter,a=void 0===o?-1:o,c=t.stackEnableCall,s=void 0===c||c;this._queueEnable?this._stackEnableCall&&this._queueCallStackSize++:(this._queueEnable=!0,this._queueCallStackSize=0,this._stackEnableCall=s,this._removeDuplicate=r,this._dontQueueAsync=i,this._autoFlushAfter=a)},e.disableQueue=function(e,t){void 0===e&&(e=!0),void 0===t&&(t=!1);var n=0;return!this._stackEnableCall||0==this._queueCallStackSize||t?(e?n=this.flushQueue():this.clearQueue(),this._queueCallStackSize=0,this._queueEnable=!1):this._stackEnableCall&&(this._queueCallStackSize--,this._queueCallStackSize<0&&(this._queueCallStackSize=0)),n},e.clearQueue=function(){this._queuedEvents.length=0},e.follow=function(e,t,n,r){if(void 0===r&&(r=void 0),!e.hasBeenEventify||!t.hasBeenEventify)throw"Event must be decorated with @Event";var u=this._events.get(e.eventName);void 0===u&&(u=new s(e),this._events.set(e.eventName,u));var i=new a(n,r||null,e);return e.followers.push(i),i},e.unfollow=function(e){var t=e.ctor.followers.findIndex(function(t){return e==t});t>-1&&e.ctor.followers.splice(t,1),e.ctor=null,e.emitter=null},e._events=new Map,e._queuedEvents=[],e._queueEnable=!1,e._removeDuplicate=!0,e._dontQueueAsync=!1,e._autoFlushAfter=-1,e._stackEnableCall=!0,e._queueCallStackSize=0,e}();t.EventManager=v;var f=function(){function e(e,t,n,r,u){this.callbackArgument=e,this.eventName=t,this.eventConstructor=n,this.originalEmitter=r,this.listernerNumber=u}return e=i([c({tag:"EventManager",async:!1,queued:"Never"})],e)}();t.TriggerDispatchEvent=f;var h=function(){function e(e,t,n){this.eventName=e,this.eventConstructor=t,this.listernerNumber=n}return e=i([c({tag:"EventManager",async:!1,queued:"Never"})],e)}();t.AddListenerEvent=h;var d=function(){function e(e,t,n){this.eventName=e,this.eventConstructor=t,this.success=n}return e=i([c({tag:"EventManager",async:!1,queued:"Never"})],e)}();t.RemoveListenerEvent=d},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0);t.EventManager=r.EventManager,t.Event=r.Event,t.TriggerDispatchEvent=r.TriggerDispatchEvent,t.AddListenerEvent=r.AddListenerEvent,t.RemoveListenerEvent=r.RemoveListenerEvent}]);