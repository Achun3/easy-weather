(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),
/* 2 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!******************************************!*\
  !*** D:/iotat/2020.7/weather/pages.json ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 5 */
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 6 */
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25120200103005","_inBundle":false,"_integrity":"sha512-nYoIrRV2e5o/vzr6foSdWi3Rl2p0GuO+LPY3JctyY6uTKgPnuH99d7aL/QQdJ1SacQjBWO+QGK1qankN7oyrWw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25120200103005.tgz","_shasum":"a77a63481f36474f3e86686868051219d1bb12df","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"6be187a3dfe15f95dd6146d9fec08e1f81100987","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25120200103005"};

/***/ }),
/* 7 */
/*!***********************************************************!*\
  !*** D:/iotat/2020.7/weather/pages.json?{"type":"style"} ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "无忧气象", "usingComponents": {}, "usingAutoImportComponents": {} } }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "uni-app", "navigationBarBackgroundColor": "#F8F8F8", "backgroundColor": "#F8F8F8" } };exports.default = _default;

/***/ }),
/* 8 */
/*!**********************************************************!*\
  !*** D:/iotat/2020.7/weather/pages.json?{"type":"stat"} ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "" };exports.default = _default;

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
/*!*******************************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02 sync ^\.\/.*\.png$ ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./0.png": 20,
	"./1.png": 21,
	"./10.png": 22,
	"./11.png": 23,
	"./12.png": 24,
	"./13.png": 25,
	"./14.png": 26,
	"./15.png": 27,
	"./16.png": 28,
	"./17.png": 29,
	"./18.png": 30,
	"./19.png": 31,
	"./2.png": 32,
	"./20.png": 33,
	"./21.png": 34,
	"./22.png": 35,
	"./23.png": 36,
	"./24.png": 37,
	"./25.png": 38,
	"./26.png": 39,
	"./27.png": 40,
	"./28.png": 41,
	"./29.png": 42,
	"./3.png": 43,
	"./30.png": 44,
	"./301.png": 45,
	"./302.png": 46,
	"./31.png": 47,
	"./32.png": 48,
	"./39.png": 49,
	"./4.png": 50,
	"./49.png": 51,
	"./5.png": 52,
	"./53.png": 53,
	"./54.png": 54,
	"./55.png": 55,
	"./56.png": 56,
	"./57.png": 57,
	"./58.png": 58,
	"./6.png": 59,
	"./7.png": 60,
	"./8.png": 61,
	"./9.png": 62,
	"./99.png": 63
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 19;

/***/ }),
/* 20 */
/*!******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/0.png ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzdDNkNFQUExMUUyMTFFNkJFQjJEMTU1MjFFQkU2REMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzdDNkNFQTkxMUUyMTFFNkJFQjJEMTU1MjFFQkU2REMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMjY4QTYwNTAwQjQxMUUzODYxQUZFRDdFM0FFMTIzRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMjY4QTYwNjAwQjQxMUUzODYxQUZFRDdFM0FFMTIzRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqRotuAAAAZSSURBVHja7FxpbFRV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"

/***/ }),
/* 21 */
/*!******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/1.png ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzcyNjQ2OTAxMUUyMTFFNjk0MzFGQzk1RkEwRDkyNTMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzcyNjQ2OEYxMUUyMTFFNjk0MzFGQzk1RkEwRDkyNTMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEQjhDNDIyMDAwQjQxMUUzOTk5RDlEQUNFNzBBRTA4NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEQjhDNDIyMTAwQjQxMUUzOTk5RDlEQUNFNzBBRTA4NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuzIhwgAAAdHSURBVHja7Ft7bBRF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"

/***/ }),
/* 22 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/10.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzAzMTJBRkMxMUUyMTFFNjhBNDQ4MzAxMjhDNDcyNDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzAzMTJBRkIxMUUyMTFFNjhBNDQ4MzAxMjhDNDcyNDAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBM0Y2Njg2MDE2QzYxMUUzQTdBOUVGQzE5RTM2QjY3RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBM0Y2Njg2MTE2QzYxMUUzQTdBOUVGQzE5RTM2QjY3RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqJ3ZQUAAAJXSURBVHja7JsxS0MxFIX7YsFJxFHs6uDmKDhKB10cRNDNwUGQOlR/hOiiCIKTgyC4CDq0gxYX/4N/oIqjIo7yPIVa2prXJM3NS6I3cBAbvKc5vNDPgyZpmhZ49S7BEXAoHAqHwqFwKLmvou2Ar8Zy97dVaA/ahGqO3nOPx8jCTdBPSgU6hCahS2jRQSB5eJCFsgUdd80bh66gMuF7lXrgSS2HGMo8dAQlfa+PQedQybUHgimFFso2NJqxNwWtReJBGsq0Yn82Eg/SUD4V+2+ReJCGcqvYv47EgzSUM+g+Y+8EeojEg/z6rEIH0Ev7tSdoB9qFUtceADjSUqiooNUOPcK4prjT+9ArNAM9QhcagZgQsNRDFYjBGToryWreMKzSZoPW0/QOrWNoXYH5pnTaMx+qmw4ZhPm6Z9C6Phjmmh6dE7DNGYRkmGt6dE7AtmcQHugxeAIWHugxeAIWHugxeAIWHugxeAIWHugxeAIWks99G3qstn9mySEBKz0szzAQ3ibwZUNFj13wZgpjv+ZrBGIEY7pn0A7FgAl+YOy0jws+oBXojhD4pB44KJUH2S+EXEfGCGM+QuE6MkYY8xEK15Exwpiv68N1ZMad5jpSQrSmi+tICZ1yHZknAXMd6cCD60jNULiO9ECP/66O1GnebOnUuQdlHan7R3o2BKzlEUodOUzzZlpHGjdvPuvIFhM0Mj4Cn6E5qEnANgM9cNhmgWhx8+YoFG7eYuQOH6Fw8+apFePmzdQj1+bNYA3bvFl7UAdCwil/cfF/hnEoHAqHwqE4Xt8CDADs0rRdGAPehwAAAABJRU5ErkJggg=="

/***/ }),
/* 23 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/11.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjlGNUM1MkYxMUUyMTFFNjhDMUFBMjA0QjRCMzgyNDQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjlGNUM1MkUxMUUyMTFFNjhDMUFBMjA0QjRCMzgyNDQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDQjExMEQxNDE2QzYxMUUzOEMwM0Y5QzA2NjcxNjQwQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDQjExMEQxNTE2QzYxMUUzOEMwM0Y5QzA2NjcxNjQwQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi5NMRIAAAKDSURBVHja7JsxS8NQFIWbWHAScRS7Ori5O0oHuziIoJuDgyB1qP4I0UURBCcHQXARdGgHFRf/g/+gOCriKPEEgtg0L+/d3HfTVO6DQ7CvPb0eX+mXAwZRFNV0Da5QI9BQnFbd9oTvp9UOLgfQ9sTyXTdjnzvDrz/Upb4YM7HmJ58UGLZxOYZmoWv8vOL5jzLgD3n1Lzp/mGO4g8vpn+dMQzd4vOlp5kx/qOkpkMLzhwbDJVxOoCC1NQVdYr/BnDnXH2owA2HNbzopu9CkYW8O2mCGUml/UyjzljddZA5daX9TKF8W03fm0JX2N4VybzG9ZQ5daX9TKBfQo2HvDHpmDl1p/9AARPHxW4eOoH7y8Cu0B+1j33bD1Ele18o53kZ/KGJ4s+cP8m4I8dU1g8sWtAC9QFdpwwyibSdfh3HgH9Am1DO8xZC/JZAhb8zT48xPDsWRCdJAdp7ig09oDXrwAHuZ3vhFud5iN4SSQCYNk2KhSAKZNOyJhSIJZNKwJxaKJJBJw55YKJJAJg17YqFIApk07NFCiZsrqA+1HI54ESCzwpjNO489CPM7w5sVljLgjQJkFNDL9LYEQoI9ayhJc2WFJUZH6wX0TB2t6/zOHx9t3sawGZP21+aNEIo2b+PWjEn7a/PmGoo2b9q80UJxZALvQEaFPW3eZGBSLBRt3koGMm3eRgB7YqFo81YykGnzRvXW5k2bN/vS5s2dsrV58+2vzRshFG3exq0Zk/bX5s01FG3etHmjheLIBN6BjAp72rzJwKRYKNq8lQxk2ryNAPbEQtHmrWQgq1bzRjziRYGM5e3CHpRVr/ld8Wf7EHojABnL23cgXuDtPy79D/aM9SPAABRZPvvGr6QuAAAAAElFTkSuQmCC"

/***/ }),
/* 24 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/12.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Qjc3MDcwNkMxMUUyMTFFNjhEMkJDODI3QkVEQjhDMjgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Qjc3MDcwNkIxMUUyMTFFNjhEMkJDODI3QkVEQjhDMjgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0OUE3OEZFQzE2QzYxMUUzQUQ5QUFFMTM2OTQ2RDExMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0OUE3OEZFRDE2QzYxMUUzQUQ5QUFFMTM2OTQ2RDExMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpGDS6EAAAI5SURBVHja7Ju/S8NAHMXbs4P9CwRddBecBBdBEEcpgiAuxX9CHP0X+h84OPkDjItb0b+gFITOurkKoqUo8QUypOeluTu/uUR8B4+DXvKae6TN6wfajOO4wTE9FCNgKFaj5XviV7+ziOkOeoIOoQ9PKykfL6+57VuZOwWBLGGKoDWoA51B8x5WUj6iXi2PQBYwXUPrmZcP0rkLTSytpHykvdzuFASSJN+DNgzLyUWcWFpJ+Uh7eX18NqH9GetH0EpAH2kvr1BWCz5yy5YXIOUj7eUVymvB+jv0FtBH2ssrlD70PGP9AXoM6CPt5R4KnunJmx/nfJu/QKeWPUPKR9orP5SkmEFDKILaWjBXmHahe+gzvT0voR1oYChTw7Q/tLU1KR9pr0ZT/0GYFrObzDP/IvkGRxhj7bgtTHvpBZxDI0OZ+uEDjbXjpHy8vfS9TYWSFrPI8MxPTu7i5InhrsorU7k+jgVPwqfQK7s3VeNiVlnBUy4lCMGFLGZBC152b6rGxayygqdqXMwqK3iqxsWssoKnXIoZjglZzIIWvOzelG0xw9rAVPBKLmYuPt5e+t6aJpqvFzOcNLIpeCUWsyIfby99b7mhWJC3P1XMZnn9mtGSvJG8kbyRvJG8kbyRvJG8kbyRvJG8kbyRvJG8kbyRvJG8kbyRvJG8kbyRvJG8kbyRvJG8kbyRvJG8kbyRvJG8kbyRvJG8VUjeCoYrMSvbp3zyZtFTXIiZzZDyKYe8/YfBf7AbxrcAAwD9bC4+mFoBpAAAAABJRU5ErkJggg=="

/***/ }),
/* 25 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/13.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkU5N0U3NUUxMUUyMTFFNjkwNUJFOUI4MUI0Qzg5NkUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkU5N0U3NUQxMUUyMTFFNjkwNUJFOUI4MUI0Qzg5NkUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozREIyQUEzOTAwQjUxMUUzOTdFREMxNzRCRkU2M0Q4OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozREIyQUEzQTAwQjUxMUUzOTdFREMxNzRCRkU2M0Q4OSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmdlxKYAAAfRSURBVHja5FsLbBRV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"

/***/ }),
/* 26 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/14.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzJGMjlGNDAxMUUyMTFFNjhCQzhDNkNEMTYzREIzQTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzJGMjlGM0YxMUUyMTFFNjhCQzhDNkNEMTYzREIzQTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyRTYxQjFFMDAwQjUxMUUzOUYwOUVGRDA3RjE4Q0VGMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyRTYxQjFFMTAwQjUxMUUzOUYwOUVGRDA3RjE4Q0VGMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt/ca+UAAAeESURBVHja3FsJbFRF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"

/***/ }),
/* 27 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/15.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkRDQTVCMkIxMUUyMTFFNkI2OTU5RTAwMDY1RUQ4NjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkRDQTVCMkExMUUyMTFFNkI2OTU5RTAwMDY1RUQ4NjEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3ODQ1QUE4QjE2QkUxMUUzOERCMkYwODg1Q0JERjU1NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3ODQ1QUE4QzE2QkUxMUUzOERCMkYwODg1Q0JERjU1NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmCMpWgAAAfySURBVHja3FsHbFVVGD6PliEgq4IkTmQ4AEEEEQ0JgrgYYgTEEYtEUESwgEVARBSIUFuWkYahEBIHookyogFFDQGME5kCAQngRGlFlmXU/6ffSf/3c+5990Foz+NPvvTe23PXd/99zosVFxebs5ETn91rzoFUJFQnHCMcPMNr1CbwyxWGDUrr9NFpxyoYP2U6YT9hFyFDHO9JmEV4BvtVCa/j2FViXA+cX0DonOzN0z0k5CLCAGwzIWNBAm/PhgacJKzCyz+FsfUI9xEqE/LE9UYSViTzAD5qyl+EJWKfX7opYTwIsc9dg1BTaUcnwlClNQuSfYCYpz6lIWETvjrL94TrhWZ/AFOqQ9gmTOwnwiWEC7H/FeEW+JaU9yk7CFPFfitByFFCNrb3w7ysXCMIKYbWFKeyT2Gn+Q7+GkQfl7C/+Fnss58ZSGimxh2GyVlZTRiXaqQ8R+ieYMyvhEnq2HFohHam1Qi3i/2OBLaVH1LJ0f4eYUx1vKyWehHOLUqUs/ioKXMITYT5WGFn+ygHBUScCYT+yuwmi/1fCMsc11+rzM5rUtoT5sMMWN33BGS4D2G7HyEfEcnmIZeKsWxKixzXyIQD/5vQAT7HW/OZgryiicNfyATssHjmadCcywnPinFfBBDCGpaD+7QhDPHdp6wT2w8ir9CyRxHG2tWLkEu4wKZM0BKXjFV+Z4PvpIwhHLDJJOqeCgGheLfYn4kEzsobimArjQmDxf7HAT7HK1L+ILws9lvD/o0j75CmkgESDaLKmBDzrIRtrrqH+Zrmvwf190H6UKq/sLw1paVHhLBM9MF8thC2e0TKUh/ylP9Q5jcVx9qpyMFV8MIApznRcZxzj0Hos2jJRei29+ZezRHx/+W+JG+bAautI8X/ClHg7XOctzjgehkIzfMDgsm7Iju+QhaKvrYO+qE1YGVCACF3ELqJ/Xxlhq8gSXM59VUqEbzM95CcLba3EmYElCOyv8KkjVYhuj5hlONc21c5KWqlp30nZbbYHo5cQgu3JK9TGWohzGm5qnsaOs7/jjBP5CrzfMxTpHBi1RxpOj9wFUeVzD3bOtj/kXAjxhs47HXCPy4NaCYdhpYcMiVty0Cf4kOVXIQv2Rp/E2nvUEEIyyak/LbI6wpoYf/TDPdLmSbTgAjPw1/48wQmGCQczjtGeRCfSJmGnkqYcGO6i+P48AjXX28izv+kR/QbVaCeXIDlkx0eOIOXzkSE+AR+wZW7NBDFW3cVcaxMxcsVRSgg25vSFmSBMruz1hQOm5PR0xgtyOqFkHcMDi8NTo+PvSXOvxken8+fG3LfvYSdpqSlOEj5HVcrIAYNq+AYVxVk7QQKon69qKS0EdtZREYjaE+O0LgXUei1EA2jW0WPxJb53GGrleB+WYRGYv9JwreOppG9h0z8PlSh/NpkVToqKSOFvXOIfBWJ05ViDD/MStUw4q/Yl3CTyjz3h9yrjtRGkm+QvmeZ0omtGnCaMh/YhecagRrHfqycc0IK+ZDNCHtWeqimzhpTMpH1p6NhlC/2dwT4CaNqn20iGx2Cv6tFDcNOcxHuZT8Wk3EUoXe6uN7XyZISmryRifCEdm3xBb80p09BcPrcVqg3a9IG2L4rx1gs7H9vwK3ZBO8i/GbOYIIcmjQQZM4AWUEfPDopREgaXrRlggdg1X5MHesWUtFaOY6X31yeeUCyVXLnCIQY2LGWJTKVDkkHhhoPJYyUlRE7ZE84jt2GRCtM2Oxm+UiK03zIdPiFqqF4cs3djhP1hTaDNNQwLUTS1FVEBCts5xUxfkOUmqSszCc9gJD1eOC5dFJ/x5gsmFdl0eu4E//uLwixBK5xPE8XU9of5fCe57P5ZIKQU10xIqCVg10dWm1XrJYKyVtUKLfC189VyZnXPmWmUfO2REzMMY6TMLl8Ig/H6qrM1FXkDVY+Z7LXpJAWuOZtezvGHTDxDefG6osvNY5OOUh7Qezz6oE3fSIlHT6iJkzAym44RrsQL4fGuKYP2Fny9EKG439rjXvSq7eqfTghvF81jco1dzkVfeiFp5sEyxPKUDgNaO6IVmWevHXxSHsbR8hxysSnjPGIlEUBTSgvkrf1IjQvIzXr6hhXFxWtqz/ygCmZiNLS18RPMZRrjpJM7TNFEFIUUqOMF4QUw+nKmqiq45wFjobRxV6HZPr67F/uFodeIza3O8Zxsfi4OPS+iW8h8qT28ICaRzeMJvievDUX27pppLUpDdtHYAZR521Xoyll5QbfSeHwzC1AbvaOcHXuSUt6ohK2kovcxjVvG7TicRT80U7fWgiJOm/sFNs5/nWPKV27yt2zq038utQ5wrSK4Ud03sHjs03iuZ4yd7RhnbcGyCyrJLjuw4S31TGe39lq3EsjpHC3Pd83UsKaTNybrRThuq419QdNtN/+1U+ZJpPQFu6FyHmVdo6m00Y4SmkGHE2eD6iHDgnn3MeELAf3znwcBLXFS8USmEGY2U0y7oU1KWM+khA7sRUT5rFVJXF2KiRHEHLClP6wwJjTf9/npUSdIXzElMwHW+EVinKJFLcO2NQ6mPil4bxEItPEzy7mnS+k9BXb/JuZqaR2n5r4edt/CP+KHKUQzaSNKsJ0M/HdOe8k6kombhfaBS/DiBCbc2Qj6z0Of8FOk9e+8/q0FaIWesmU/F7H/rZ4n8+kJONoufCLESEF6njUe1VHkcn+6JjPjvasFwKej/K/AAMAcl4qIeP5HFkAAAAASUVORK5CYII="

/***/ }),
/* 28 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/16.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkNFNzIzQzcxMUUyMTFFNjkyQUNEMTczRTFFQkYyOTciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkNFNzIzQzYxMUUyMTFFNjkyQUNEMTczRTFFQkYyOTciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5REVBNEI5NTE2QkUxMUUzODIyRUVCN0ZCMzRFQkJDNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5REVBNEI5NjE2QkUxMUUzODIyRUVCN0ZCMzRFQkJDNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvBQ+4oAAAwBSURBVHja5FsLlFVV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"

/***/ }),
/* 29 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/17.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkJFMUJERTQxMUUyMTFFNkFERTBGQ0RBOTk1NzgyQzgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkJFMUJERTMxMUUyMTFFNkFERTBGQ0RBOTk1NzgyQzgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEOTZBRkQ5RjE2QkUxMUUzOUMxRkMwNzY1MkU2MjczNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEOTZBRkRBMDE2QkUxMUUzOUMxRkMwNzY1MkU2MjczNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjPmRngAAAhNSURBVHjazJt9kE1l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"

/***/ }),
/* 30 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/18.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUJBNUVDRUExMUUyMTFFNjgzMjdFN0QwRkE3NTIyNTUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUJBNUVDRTkxMUUyMTFFNjgzMjdFN0QwRkE3NTIyNTUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMkNBRTlCNTAwQjUxMUUzODMxREJGQkVDRjU2ODA3NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMkNBRTlCNjAwQjUxMUUzODMxREJGQkVDRjU2ODA3NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsAkKL4AAATmSURBVHja7JtnaBRBFMf3YtSowfLFjoIdsWCv2LtiUMGCBbFGP1jQD6KoQcQuKvaCYAdRMKLYsGFBjSWK2EDsFTsmlmjO/597gc26u1dyd3u52Qc/Ru8my95/5715b2bW4/V6tYLY39MpZh8ngzLSlhASwE/wXfgMsjWHrUjX9P8+Swzj9auBNqA1aARqgyoiht74FF6A++AGyABXwRstRiwconQHA8BAUCGA/h4RkPSUz56BI2AvuOy0KJ5Q3Qdu0wnNXNDJZDSEanSr42A5uOaU+wQtCsQoi2YZGB/Be80CG0Ga/DuqoiQEKUhbNBcjLAitFJgJzoB6MRtTIMhoNOtByUC6g6fgNfiie9qcjTjSqkpM8fdQWoKzYAw4FlOiQJBUGc7+LBOky2ySaTOjUJBmgCOvD6hvc82K4AAYB/bFRKCFIKPQ7PBznQyJM0ckFwnGyokw80Adm3687lAR3bmYAkE6otli04WuMR10lqf5M4T7YhK3BzQFi8T1zCwJbAaNIz1SEmwEqYRmLShu0eUu6AFWh2mG4DXmgBRJ7syMedA6ESj6okgO0tDiu1ugK4ZeRgTu6SjoBx5YfN8ezIh6oMUooTtMsvgbpud9Icj7CN7XHTAInAKVTb6nKB/BJ1AdFAW/5P9PRdA3YRMFghRBs8Ci/wcwCoJEo065B8ZaTMXlbGbD3+J+FPYw2B9s4WnmPr1BC4v+aRDkehTzqLyUPxgrBmpKPbZdis4JnGgKIspEi+B6GmxwoD5bAh6FmnJIRsxZ6yRoErQocJ1aNn+4AqPE64AojBObwnCdLuASGBawKBCkNAOorIEY7aLDJT3d4HkYrlNCliemBRpoy4NWFv22YZR8c1CUr+AQmKIL+OeklGB9lav5VvpqykJXCz/XWyV50VZ/ojSVi5oVd7c1541Bd7Bkvekyw5i5c7LUUpPBCJsAu1pi1Xm7mFJfqlejXQ/T0C2onZEHt1bux2uzUMUFqtGScT+26MdqfyHCRpKdKDXEhYz2EK7zKQZE+RVCQkYhO0hMtMqOZ9qJUskiw32pFW57LTNOpsX3IzFakq1EqWYT5Aq78cGmSrZrNC5XzLcKtENkVSxH569JUuvEgzE2NpdZKlc+4+8sZXRLT4Q2wwqNFXjhWhVzRXFFcUUJ2fIFWgTNvOmpuaT33jj//UWlCl+OgHvwP1EgCBOc6QEUU/Fq/cEFiPNF7z6pCgtC46mJdsaYUkzxUMLfX9woyk7Nt1isqnFp4pIxzeeS302wUpYRchQJtD/AUsSSXbZpvlSNiQqIQsuGIDlu7ePWPm5G64oSlTRfYgSPO+St1XoVGBTcunmm3+hL1InB6amb5lv6ryOCqCAKN9+5X51mVvvMklS/uqJew13DwxgxT/QxZbDCgtC4O9rMGGjfKh5fsyS+5EvzeUaWRxd6KSgIU/3dmhx9Ny4yVRbf4glEFRaZEmV0rEMsOe+m+W6a72a0riiuKA7WPnyzgietczU1Vt7egRMIuFlmaT6PYgzXfMenVDMeYB4DYd4a3Ye1z2xFPYYHqqdiYDQxisI9j2SFQwkPQdY1isLjT38UFuWV5nvZIZ8oi8EaRQXhaa01iClXzGof7pLx5esGUhzG8+zjkUHB2eckBHmhL4j0dcBvCMNXQrK1+N/38UhLUfK9u/RPgAEAeRlxDnufCLsAAAAASUVORK5CYII="

/***/ }),
/* 31 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/19.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkFGNDI2MTkxMUUyMTFFNjg4QzhGOUNGQTVFOEI2NDQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkFGNDI2MTgxMUUyMTFFNjg4QzhGOUNGQTVFOEI2NDQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMjNGREUwRTE2QzgxMUUzQUQyMEVDNjUyQ0FFM0ZFOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMjNGREUwRjE2QzgxMUUzQUQyMEVDNjUyQ0FFM0ZFOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pun7ahUAAAVeSURBVHja7FpriFVVFL73zvTwlZqPwRKnQMKsTDGfaQQjpT3U/JUU/ahUJMgfGeaPUDGSQnFE8EEkpUhEWY0UDcpIPorywRTUEKU4akWmpmblvTNz7vFb+e3Yc9j7nnPPOfcSsRd8HL1z7jlrf3vttb61ZrK+72ecdbeco8CR4khxpDhSHCmOFEeKI8WR4khxpDhSHCnOHCl2q03yZa9lVpb/rPZQphcwApgIjANGAoOBPsAl4ChwBPgcOAictvlY09AUnxQQIFF1BzAdmAFMAHryx0XgS6AF+BhoBTorQMRjwMvAbSXuuxGoBxq0z34GlgHbgXzYi7JhkzeQcR0uC4FVwPURF9AFbABeAc4kJGMg8CowLwViO7iWt2VptkjJhRAibP8OrC2DEBWBzwO/AW8A/WMsQDZjNUmdl1K0XQu8CRwm2dEjhblCImNJSs5I5DzN8C1GuH8y8ClwQwXz0p+SAhApbVEjZU2KhKjI2QrsYTIsVQ3XMkFWkhCx3sA3CIARoZGCm57EZVsFnZEjNQX40RDaLfxZNe0CMBwRc85ICgjpyxxSaf3SxcV/xf/34DkfmcKzpfx+BvwEXAMMYum+tcR39gLTQEyXiZRNuCwo8eWzwDtczC/UBH2YtMayVI+K6LzklnslhIGvQ8psmIlf64GdQDtJ9zRtIjlyKDAfWGx5hpT7JhDj/0sKCBHN8VeJpPQC8CFw2fBS9eIaoA54CHgxZHdUxHwP3JkgKpYDH9HHTj7Tt4i1HDftgKaxlJ0QQQhS8jopD+LSbCGkgc7n1UuFUX4vEyBGvVxCdxLQWEb0RLU8Rdw2bmRHCBlBH6fyyATtPknyeu6YaXnIIhLyt+wEyCgqQgymnPLo+F7KcHn2qZQI+QAYDWwGztOvDh7HKO2G3LOfCjxoc2RDdVLutyjAT7hArwQZpfKGesbtlt0pp0o8DjwLnFSbFFH3mIjZbvj8AZEPeu9zi+GmVpVDYhASJKcfwzaO7aY8lxxS0I5K0lIctOGSF2sDSc+UmLwUHOjFihWn1C9lq6COiZfSMbQl96xOSrshId7NhJlUOX4L3ByjeZsNfMFo7UxxRJGzSI/2oMzfb2mgpmtVpVy7ibON+pjN28P0MU1CMsxL/QyfSzT7OinNlgdI6NZrA6Wo9igrTl0C558DvgMeSVFlz2HlMpkoYS8sUvTwnxGRmGFs/HamtJAhfNZpJtsBMZ9TR/G5o0QxkOroBWX+DjJpszYqyH2U1kUuvD/7i6Vs++MKskzEuc0x4C0u4igrSUHTSTn2U4PYYy2M4Nf7wDMiVoOkDKPcrbb9wSMitqvMgVZadg+PaqFbeEOLiChaWWVnfqC8bmWiu4tHpZq2hqMMUey+6cyvSKg8y7Et0rLzCFxmGT5GDXGkSj7IRqzm8SsaJ29gymMZPlBBR2S6Poud9xkS4mkS/CzHCq9XmBDJkXOBiypKrONIaZ/ZGTem7IR03C/x/Lawwy1Y+pcCE/cYNqRpWzNHHP+0DtLoWseRgdFkjsOjjbwmyRuNLK0XtVY/SjOXpZCTZvC1hLpHbYzMet5j69CNkFBSSIw4VUvJ/xTwRObqL5zCGsBD1AV7VBLThkBxOtscq5Ko3CUxNkmE5DrgXZbwDv3IlEVKgJwa9kJDKN3rOMHq4kskF/zKkMwzT6gpXdR5RxRyxI/B1CDS7o9nl9+b7zvHhN3GzZH573FFhL4xpl+GZcv923xN1eYY2lnLoMmPOAmLa1n6oEiqCfjjc+EKxo1JhRQDSZn/gIW1H9ZFVoSU/6O5v09xpDhSHCmOFEeKI8WR4khxpDhSHCmOFEeKM2VXBBgA5CrAMXDk5CoAAAAASUVORK5CYII="

/***/ }),
/* 32 */
/*!******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/2.png ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzY3MzIwOTExMUUyMTFFNjlEM0I5NkY3MTM3NUExNjYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzY3MzIwOTAxMUUyMTFFNjlEM0I5NkY3MTM3NUExNjYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMzI2Qzg0NzAwQjQxMUUzQTk2REQ4QTQ4NTIxNTVBMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMzI2Qzg0ODAwQjQxMUUzQTk2REQ4QTQ4NTIxNTVBMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqV644sAAAWoSURBVHja7JsJbBVVFIbve7VqKihqCsWglsW1YogQMSoxWkFDDAhGRA0uCGpUXFKDCiEmKBHUaKhK3BCX4IKCaYyJCiWIW6O4K6Ao1lQFF6QFxcZu/ifzDxlwzp3p61vmTeYkX9J07p2Z98+dc849906qq6vLJLanpRMJElESURJRsmj7dNSPz9a5ysBhYAg4GgwEB4Fech3QCraDJvANWA9+Bc2FFKCkuu7/omRBiJNANRkJ9u1G/6/BSvIu2BGJkZJhPxkBk8Bl4PQeXL+K3Aw+A8+AZ8GfxeZTLuBTfbyHguxtw8CDoAHMAKXFIEolWAZeACfk8J6OArVgLV/NyIpyDlgNLszjEzwFvAOuiqJPuQ481A0B/2KE2Qq2gZ2gHfQGh4ByRqY+IR35k4xmt0VFlNng7hDnaQNvgzfpE74ELUpbiU5DwWngLNI74PwzwQHghkKLclNIQZ6n032f4gTZv+BjIr7jRDAVTOMP1+x60EUnXBCfIuH2/oC+65ibXMpR0pbhPXzBkHwqqA9oKyPljkKIUkVBbKPoMXAGnW+2TMQZC+aCDks7Gb1j8i2KCHK4pY84vGvBrhzcj7xad4KrLeeXe36AU4q8iCLv67kBgtybB1/3FP1MpyUTlnstoTiS+A0Hx4OKbDraCo4Aze7LkyCuvQT60hn7WQ3zJ3HOh/IB/8P5k0w0N9P5r+jutCHVvmqc+/csME9pJ6F2Yo5emSB7GlyeYV+JVj9zwvkw+CTMLNl9ffqDyZb3fE6BBDG8dmOGfVNgALgSvAeWhPFFaU9KPVRpsxB8VMBJq2THj2ThPPuDK5gfjQ0SRThfOf4beC4CJY5F4NssnUt85+scgaooR4BxyvFXmbIX2nax1pJNm6slqCLKIGVyJuFwlYmOvexJ6jqY/c7iKB8FTmaGPR0sBr+EOGdNR/342X7RR4s6Gzhp2x4RUQ5mmJbZ93yw0ZLHGD7oiRRusKWd1I4nIQq95h0pVUrjxggJ4pYkLjJOCXR9gCBizUwCR7D8YHPA92DE9PWKMlBpvNFEy9oyfEjNfKVut7Rx68S7RemvNNxs4mULWA7RbAZGyzBXFL8CT7sp8HpMjqyW4d3PerlROK2UCDqZycbR5ltynskYLf3SHBV+obo0pqI0WRLS48AQ+fE7ldlzHxNfkxLqj8qxUSLKFuXg4BiLIkHkK+XYCBHlB+XgsSbe9rny/0FpJkJ+VsksMq72vZIAlqctZYFjjLMmE1fboQSZMhFlk+Js5djoGIsi9d2UXzqSphdeoXScYPTiU7FbhZJ2tKT5XtUpHWWSNCWmomgT4Sa3HNlgCVE3cqYZN9PegE2uKJKrvKg02g/cZZwdAHGxsy2ifOBdDFtsCc+yQDYnRqLIWrm2mL/OK4pUtB61nEjqEbfEZJRMV469Jdnu3sumsjnnDcsJZQ13ZhELUs5ZsmZLSqrr/vZbYL8V/GTpuIAjqth8jNSNZLfEcOX4h8ZZSfTddSB7W2uUbM+1a4yzJ6VYMt4jOTOeYGlTi1GyTRNFbBlHjM0kTMsyw1Lj7FWJYv1Fslap6K8B51naLYcgS711E81kuVRKdEFbvC4xzq7JNfRHstIvyyMtBR4ZZ/LegqYqUkbYYy9d0EbAefxxC419d2QpLz6aEy3xSbIdwrs7MpVDEbp4fweCfsZZ4BsQot/vYCpGyVbvP71bMWwm+0AW8WJxMVlBnAJBVvvNhMOY7E+RJUlZumyLgSAb6GN89+x1Zxt6IzPBiy3zpGIwydxl7flTrUEmHywsN86HCrJZb20RibGSPm8afZ1qmX7aIs73CeMsFciq2hhecGTEQvMWPsRXjLPPvzNMp55+BNXKskMDpwBSuJGvMGQvfaVxarxlzBfy8a1vK+dwUn+VwvR34I+wYuyOPsl3ydnxKYkoiSiJJaJo9p8AAwC0szCJ+Dy69gAAAABJRU5ErkJggg=="

/***/ }),
/* 33 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/20.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTdBNjRFQUQxMUUyMTFFNjhFQ0U5Qjg4NDIyNDNCMDkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTdBNjRFQUMxMUUyMTFFNjhFQ0U5Qjg4NDIyNDNCMDkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RjhCODk4MjE2Q0MxMUUzODc1RUY2Mzg4ODNCRkUyNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1RjhCODk4MzE2Q0MxMUUzODc1RUY2Mzg4ODNCRkUyNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgXRi5kAAARQSURBVHja7JtLaBNBGMcnMSCKQgQFFaTpQSiIuvVxEMWmqCeR1oM3HymCeJE2R09JTooKrQcPgrCB3gS19XESNYWiiKJpBemlNCIIgof0oKKg9T/sF5rEPHaeSdv9w59tm3R297ffzHzz2NDCwgILVKmIagF/nvWJfD0OO3AHHaN0LFceLsI5eIqORVMAVh0Z1w+liWJwP9xHQPzIKQNYDuomPGYSUElhQ+Um4PfwHDwsAKQRKJfKS1GELRkoCbpwt0a10CEOI03nGGp3KA5FhktVxrSiFIGuiagJa6wqDrMvfu4XusEoQUHP49LTaqUciprWQwGQIXpS7aCEzjYmLAmkX/fT0aCUrvYsLAEkqlBleI6RhU/CnXCoyt1wEi5INr6pVkXKoGTDliYQA5SE1bpxnqSN0PfSktUoahUKRYlM3e2FM4LZaIYAiqrfdqTIPIkkjV9klCWLqM82lHOC3y9QdVBRpm0jhaqOaII2pqHdK0iU49iKFJkTTWjqbvMSo3MrUHoku2AdEoW7W+VkpudTdKnQpIv+UfbzWtUIFYEiMyfiKPQ81VAytp5A2HD5gxajaWMroOQlyo/pSr196AN83DaUT5LnSFsaPG6GH8O34fW2oKi0DXxoMGdpquECRfUh2QJCIus+SOBu4bBJ8aK/w2/IH+l3Haq+kb/wdaq+v+r9U60ljpDqYpjguo9J1buRafgs89aQfEGJVN1gFw472fLSLvg1RcwNfpuieQofTF1hy0+r4avwCRrUzrYyT2k3HaRGmDfGoQDKotZRt/0I3hJAqRRP9KbRjp4KoPw/NLgLMKPwhgBKpU7zLhtgjgVQKrUNvs/TkgDKol7yqQ4kczMBFMZ+w5fhwwAyWyt5W2ni0w1nAGMq6H28weI1eH81kJUaKXM0QJwMMlpPd5g30z8pMiDMwk+X6A2/bfDZV/g8/MRPQU3nU9Bvx5m3hUpEfEE9ZxlKvRu5B1+Ev9X6sBX7aHVpK/ywzmf76vx9Hr4Ej4qebKlA+QLvFfj+c+bNB3+WOZmfhrYgUW5Pi+D9ZN4k+VFZIL6goM7JQNG9fdTPnhje0O5h3nZ13r5sNwaFJLoQxqc1YxqhNNpzUmpTDsAz8Brm7YnZ0W5QuFIao6RRWa8IjEPHd8xbrs2ZhjIuUXaC6Vn8Gm4SdRECU3IX5VtFo1DQrsi+UuIqgIlRfuTn/yNl5lLaoSCS5svuXXPp5uIC7UfpNZa4xPmykj2m/4y2LLON0oWq7FMtUvtUXd/jrPZbYjLld4pEtfKyKW0/f9DGSV63aKdQC0pYsIAxpr4F1JQGJHtJ9akDgEky8Q2/JlWkAai2a5KaTwEY/lSSbQAkR1VG64hcepIJYEZMXJBPFai69Kr2NFqhEJg8XZit+RPeppVeizFWhSMawzjH5N5DbhYRvNwJZumdZBPzKQXqnUbK8g8OqoOOMR85zDwd87YgKOUpK0X/BBgAF7IP0/IcAR4AAAAASUVORK5CYII="

/***/ }),
/* 34 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/21.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzBGQ0JCNTcxMUUyMTFFNkJDQUZGNkEzMTlENDQyRjQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzBGQ0JCNTYxMUUyMTFFNkJDQUZGNkEzMTlENDQyRjQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMDU4MjJBMzE2QzcxMUUzQUZCRURFQzE2NzkyRTNCQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMDU4MjJBNDE2QzcxMUUzQUZCRURFQzE2NzkyRTNCQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnCWNbcAAAb1SURBVHja7FsJbBRV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"

/***/ }),
/* 35 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/22.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjYwQkY5MzQxMUUyMTFFNjlCREJFQkI2ODlGREMyRjQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjYwQkY5MzMxMUUyMTFFNjlCREJFQkI2ODlGREMyRjQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozQzE5REVFQTE2QzcxMUUzQTVCQ0RGREFDQTYwMkQxQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozQzE5REVFQjE2QzcxMUUzQTVCQ0RGREFDQTYwMkQxQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlaZvQsAAAbNSURBVHja7FsJbBVF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"

/***/ }),
/* 36 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/23.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjQ1NkM4QkQxMUUyMTFFNkE3NzQ5M0M5RTA2QTVCNkUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjQ1NkM4QkMxMUUyMTFFNkE3NzQ5M0M5RTA2QTVCNkUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozQzE5REVFQTE2QzcxMUUzQTVCQ0RGREFDQTYwMkQxQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozQzE5REVFQjE2QzcxMUUzQTVCQ0RGREFDQTYwMkQxQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnxFJ2kAAAbNSURBVHja7FsJbBVFGJ4WVKiUo8VyCHJI8QCveGupSIWYihKraLzQxIhXiBGjJqKJmhgFi0eCtyFegHiUFqOgFEVBBBFQIzViLTYBREQsgkhr2+f/+b6NL4+Z2d33tu8tG77kS1+7s7Pzvp35j/mnOa21l6iA0U2YJ8wXFgi78+97hL/z55/CvSoE6FRWs9/fOgf8DAgwSNhH2FvYK0mUnWSj8GfhPhVCBCEKZsRFwrOEpwuPF/Z0uedX4QZhnXC9cJHwlyiIMkJ4i7BEeLLPe/uQY/j7D8LlwueFaw9EUfoLHxZeLCwKaBzHkJcK3xdO5yzKCnJ9tr1J+JXwxgAFSUShcJJwhfAuYZcwi4Kp/orwRWG/DIwLBrpS+LZwYBiXD2zHXOGJPvqFp9kk3C78S9hONw2PdBR/esF44XDhVcJ1YREF3qTG4+yAm50vXE13u0X4h7DFCQnoldDXUHqrCtoSGyDKR8IrhB9nQpQcS/A2UrhYeKRLH98IZwo/EW72+XwIdCbtR4lL250UZmlHB28mm4LpPdtFEAzybuG5wtdTEEQxNqkWjhPezOVmQgFd9pBsGdqnuHRMWMMYo5I2I138TSMOgZdY2g2jwT8006LcJrzGcs9C4flcNkGjXlgufMnSplR4RyZFGcLAzIQFwssCmh0mtAonc6mY8ICwmJ970qP1ZzIauPeZxgBKh2XCaznoTOBWBogVhnxrCXMo2JrD6PabhbuFDcKVzKk2CmOpeh/EIZ8akrntXDKZDr0H0Q0PTfF+bFGsEj4t/Izxky/vc7Ulu52WpVykkc9OZytjHPOpar5YzzYFrvc6Qxtkr3OymLS+yeAtXZRx1k13S2+ci+fRUOkwky4zm3g0ITJOF/fQ1vT1IooOyIg/CMG+zzLGRibEfBpTLKkq00ToTOs9ynDzh8J/VDhQxeBOMbeCAf2cn5soygAV3/AqZSLbw9Lf2YiH2pZOmCjGdm+yKJhGx2luaqFbCwuQ83zHlGKWMm98z09IZqcwwzYlvggUHxfenrx8ig03OG8jLNjA5HGG8lYJWMMNKwSbP1naTZbZUp4sytGGxtuY9IUFrSq1sshCep4vLAHsYyJMQaIoRRZRooJGbjt8bbh+gvDyRFHyLVsDUcJm2hiT45gksyVPuQQxLSp6WMFtER3g2U51RDF9+cNVNPGcipdvTdsS/4my29Cgd0RF2WQJSEtlCXWFKFsNDYpUdLHcYnALc6mcDv0s+dCBjnWGJYTv3C2XQVqbpgEEOS2iojjlFx16QBTsXn2ruYjN4dERFQXbqc0mB5PLZMpUS0ER/YgIioIX3slwrdmJU2oNDVBSqIigKHAi3Q3XmhxR1jID1QEbyL3SHMSVDJzOCUk/x6r4oQFdFL/HEWWH8F1DByep+OGcVDFB+AwjxleZ6WazH+AMw/LZmDhTgNcsFvn+FN8O6sMvqP/LJsO4HzI8S/0AebSVOqzqVFazK1GUBj7Y1BEGMdjnAO7VTNPiFGZeUP0AqFqMMFxbpksIH1Hx82c6oPbylnI/hZC89EzTV2WhH1QSHzRcw9JZqRMFxaL7VLzapgO2+BbQUHnBjoD2aoLoB5tJMywvdY4snd9MWwdVlvTaEQZ1GC+nknWFcpRLZvv0LH760QFG9Qk+QwcEsPOcX3IthnWx5SE4h1bDNHykpR0GjTqLc0b2exUvni/y6Vm89qPDAH7hKZY2lTJLfnR+sZ1kcorYbq4PUw5VvHdUvF5rMm74wtVq//MnJbw30ZBigOO5zr32owOEm6rsR8hgXC8UUZq9iKIYtGHAYzwMAPsy2ANdT3GwDL0UqN6jAMl4kl/IhEO4LNpJfO7LmTuadEto4XHHiiANycbHBsQtOPD7snCiS1vMrFHkYEswGJRn6cslXEDxc1T83C3C964enouTFNcnC+JFFADHGVBQquOby/dwzzyfnmVgCp5lK5PZU1KIVbbxO63QXfR6uLiN/n2CZdcq8Q3U+hhgqp4FY3ojBUFQ/7nACdTSEcUBjoWW0pKvtzy0yYe79eNZkvvBISOvJ6swpodU/DDBBreAJhWgloua7VgOtDyhr/qkgTrutpDuFkfEVifuX6h4PXeLi2fR9VPHmWnbNkXmi/Nzc93E8Op9vKALY4ESepEa5kl+3a1bQqjrB8b/WYYN7VxSKNnsEn5JgbFMjGd8O+o/w/ZxdtTzDXpN5KYGkBDeoOLHvwbQDmGJNFKEZuXzAGCQoiQiluGEECnHnUFvy+WqjkWYEsLQiJJuIhd0P6EQJZ1EriP6yYpNSYZXd5upfjwhJxaLqYPI7PI5KMpBUSKMfwUYAMlosyW/XWd8AAAAAElFTkSuQmCC"

/***/ }),
/* 37 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/24.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjFDQkY1QTYxMUUyMTFFNjk3ODlFRjAzRDMzMEYyOTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjFDQkY1QTUxMUUyMTFFNjk3ODlFRjAzRDMzMEYyOTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RjNBOEFDNzE2QzcxMUUzOEU0QUQzQkRFQjk2NkU4NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1RjNBOEFDODE2QzcxMUUzOEU0QUQzQkRFQjk2NkU4NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt6Fh50AAAcxSURBVHja3FsJbBVVFH39rQuVshRsAVEWWVRwRXGDitSg4tJYReJWFyKixhhRMbFqxESUzWiiuKZxo4hLaRsVsUWLFEQRKsZiJLVYAxQBsSwCrS31XueMmXzfe7P8mfnT3uSk7Z83yz9z373n3vea0lp5tfDZuhLSCRmETEI3fL6f8Ad+7iUcEBGw1Nyy/32W5vM9mIABhGxCb0LPOFJ2Aw2EXwmHRATND1LYI64gnEc4h3AKoYfNOb8TagkbCTWEpYTGzkDKCMI0whjCGS7PzQbG4++fCSsJrxDWdURS+hGeIlxFyPLpOYYD1xA+IcyGFyXFYi7H3kn4jjDFR0Ks1otQQKgmPEg4OsqksKu/SXiN0DeE5+IAPY/wAeH4KE4fjh3FhNNcXJczzWbCDsJfhMNI05yRTsBPJ3YlYRjhBsL6qJDC2aTMoXdwml1M+AbpdivhT0KLKQmQlfhag5Gt8hFLdMakfE64nvBFGKSkaMTbSMJnhONsrrGBMJ/wJWGLy/szQecifoyxGbsbxCwPWrypYgq7d5ENIfyQDxMuJLzjgRABbVJKmEC4C9NNZZlI2YOSFWifx9RR2VpojHmIGYnaQQRxJrhCM24IAv6RYZNyD+EmzTnlhIsxbfy2OsJEwuuaMTmE+8MkZRCEmcqWEK71yTtU1kqYiqmisscJQ/F7D2S0fihGfc8+hRBQMqsi3IyHDsPuhkDMV9RbFaihONYchbTfTNhHqCesRk21idDuNfuwDlmhKOZ2YMqELb0HIA0P9ng+tyjWEF4gfAX95Cr73KipbguTVIs04N6JtDImoJ4qxYt1HFM49d6iGMPV68IkFq3vQbwlarnwutl25Y158CIEKpnNR8pMpj1jUcaJ2gzEmj5OSJEZV8SfRqDvUwVtpLJ2l8GUp1SJyhHSEL3HKk5eRvhbRMNKIO4EaisOoKvwexNI6S+MhlcOCtnumuudz3qobXneJAq2B+JJYTc6WXJSC9JaVIxrnh9RUrwo1I3vxZZi9j5U2KrCl4XiXMK98dNnqOIE821ExWpRPM4RzlYC1qJhxWLzF824qeQtE+NJOVExeDuKvqhYq/C2LFKOzPO1RsA+S8RkWknJ0pDSWawBbYfvFcdPJVxnJSVD0xroTLYFMUaVOArIW9KFjYhpCfGBJwujWX1BwPepRltEZpzZRpmkqL78MSERkkd4CQ/1FoJpkPayMJZvVW2Jf0nZpxjQOwRCuAX5qqUyH4KUOyzAe27WCNIcmkJdmJRtigFZIZDyiDCWT6zGEmFawPddqQm4vWJgTmZ9NfWQX3a64vPRAd93vWIK8XfuGoNIa5MMYELODvjhdiVJDpjLLzLrzqRw9+oHyUFuDo8L+OFkvViuyIsCvi+3U5tVCSaGYkq1lsKL6McG+HBFKOXNbRg/CaM/uzRgUviFpyqONZs6pVIxgLNBfoA6pBkF2UOEBcLo0r+raQP4pWc4iXRTHGsySVmHClRm3EDuGbAOKUalWhGSnjlJkvVMFb8/Zgl4H2kyhNcU6ZcO8VvPjFZMn01WT2F7WxORH/Posn7pED/1TDpipczWpOaW7bGSUo+3oboQv5mBSdIhfuoZXrUYoThWJSsInxbG/jOZ8drL+8J+F4JXHaILon7pGV5JfFJxjKfOahkpvFj0qDBW22TGLb4lCFR+6hC7IOqHnuFm0hzNS11IU2enqnVQoimvTWJ4HcbJrmQnOsRJEE1Uz3BQfQ7eKDMWsIv+G/xEwXBVwTQKDyiVwsJoCPdBV0u1r6QNLtmIGzPZpXFj2EPOivuMCeL24zIX11FZf3ja7ZoxM8lLPjb/0O1kMhex7fQAuxyv4n0ojPVat/abkG/2WyXsdzfZGXvTdKHfQsbB9TIipdk6z1TGfZbL8WXHa8ZxGcBtvtuE0QOtATklwtkC1S4FKXZB9AhMi8NAKjx3JGq2cQ4KWs64U6yE2JEioFt4w+8bhEk2Y9mzxgIDNWJQFowXeAiiTABvGcgE+SnC2HfL8r2Lg/vylL+VCKmXRWQ724v4sRGumOHgnEUui0LebPMA+hkcRGc5CKLbUMye6WFabcd3qpYddLq5uA35PU/TtbK+gUoXGsRNUWi9ThvGuTVe/7nEFGqJkGIabwvNQQyp0dy0yUMhZ1cUyq6zQjjfWcXPNFMYmwlqdQNjwpvxWu6lwtgwWB73YHWWv4MuCLsJ/TZTs/KdhWuwt9tuGEjkX1t24u2WQAvwTXnb+AaHhdx0HwrCO4TRTs1GBuIpxUs2ewjfQsvwNHG1x9ePf4I6BO+og1uHWRCy6CvESzmIKdIAEpqFyw2AfpJitXaPGmQy4tQMId/+obpOoy5gerWYCNacFHJOAnGoDe6gSbEr5JwG4lAb3GkBk2JqkK3whNK4lOs0ENtdp0ORYtUgxT501FTX6VDTx8/OXGiWbFKStUIYaVKStUIYiZjiNRAnxf4RYAD1PuIgA/E5eQAAAABJRU5ErkJggg=="

/***/ }),
/* 38 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/25.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjFDQkY1QTYxMUUyMTFFNjk3ODlFRjAzRDMzMEYyOTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjFDQkY1QTUxMUUyMTFFNjk3ODlFRjAzRDMzMEYyOTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RjNBOEFDNzE2QzcxMUUzOEU0QUQzQkRFQjk2NkU4NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1RjNBOEFDODE2QzcxMUUzOEU0QUQzQkRFQjk2NkU4NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt6Fh50AAAcxSURBVHja3FsJbBVV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"

/***/ }),
/* 39 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/26.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjA1MTBGRUExMUUyMTFFNjlBOENDQzJDNzI3NThGMkQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjA1MTBGRTkxMUUyMTFFNjlBOENDQzJDNzI3NThGMkQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEOTZBRkQ5RjE2QkUxMUUzOUMxRkMwNzY1MkU2MjczNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEOTZBRkRBMDE2QkUxMUUzOUMxRkMwNzY1MkU2MjczNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ph6+bWcAAAhNSURBVHjazJt9kE1l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"

/***/ }),
/* 40 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/27.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUVENEEzODgxMUUyMTFFNkE3NTVERjkzNjRCRENCQ0UiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUVENEEzODcxMUUyMTFFNkE3NTVERjkzNjRCRENCQ0UiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEOTZBRkQ5RjE2QkUxMUUzOUMxRkMwNzY1MkU2MjczNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEOTZBRkRBMDE2QkUxMUUzOUMxRkMwNzY1MkU2MjczNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqTtAwQAAAhNSURBVHjazJt9kE1l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"

/***/ }),
/* 41 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/28.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUQ0MUExOTExMUUyMTFFNjlEQTQ4RTJCNUIzOTY1QzgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUQ0MUExOTAxMUUyMTFFNjlEQTQ4RTJCNUIzOTY1QzgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEOTZBRkQ5RjE2QkUxMUUzOUMxRkMwNzY1MkU2MjczNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEOTZBRkRBMDE2QkUxMUUzOUMxRkMwNzY1MkU2MjczNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlOOLpsAAAhNSURBVHjazJt9kE1l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"

/***/ }),
/* 42 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/29.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjhBRTlBNjUxMUUyMTFFNjk0NzFDRUY5OTJFQjMyMEUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjhBRTlBNjQxMUUyMTFFNjk0NzFDRUY5OTJFQjMyMEUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2OUI3QkVBMzE2Q0IxMUUzQkI4REYxQTJDOUI1NjYzOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2OUI3QkVBNDE2Q0IxMUUzQkI4REYxQTJDOUI1NjYzOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrtzmmMAAAOfSURBVHja7JvrcdpAEMcPQgFyBYYKjCsAJgUAFRgqiKkAqABcAaQC4wIyiAqiDixXEBrIkFvnr4xMFOK923uYYWd2+CL0+Gnfd6odDgd1kbdSvyD4Wxq2J/j5rW/z9zb0WmsTWpYcutOaad0fn+DT56f4oBhAIIpdKFcIzFetG8CK01LeIfT277SOKizB1LIWAPOgNZW+4ZptoD3hPgRgChguZal1rt1oH3ugvdf63QOQP9fSL6cdK5RE6xbmnXiMVWSVWykwdQdAuiqMJADTjAVKAaStwgrdx2MsUFYCQDJkktQy3ba1tYxCQxlAuZIjc9xSFsRvD9rSeqV1bAhoERqKyQ3M8OATWEiVUIpd47gZ141srMUKCi7MDWz09ufM/8wBkCP9UJZyZ2Aha4siLWW6td+KVlsJRfofzL9dVTV1zAflZJeernRTn5bCrUcySyAK/Q5HOr7d54Z5vFRvIt4AhrQUqYfJHd6j93mKVLU7hr6KiyGTz3FkqJ4oaiiUraYXKNV1yuicoZgGzhVqjeY5QrGJcFSEPQPQQPkdSLmraFHVSg6VUhR4L2gF3lXXxLjEMReE0i2da1qCtPNRsIlZCqyFRgf3Hu41hcu+WfOJtU6ZWHS+XEtaIBYVKwVJrJZSziq+020xiHrQFpPHCEXBjaYBsgnBWQLOPgb3KUsxc914hpKgMBRZFHNR0ZIZD9XvAbRvOE2AGcUGpZwtCE4xeM49wlnZgHG5wP6v8QFlkb6nrvlWx5gs9oYwQ9wh16rhd+KwOFt9hC65ysWOIS0FXc1otTC2PW8pLKeFLCZRFPY/OpRjVxsDkE0WG5wTlOMUP7ZIBqzapWFwgUTxhtC5UIxYo0gzWbtOnEIBkC3j+Jnirx2fqpidp3Mf7tMUPp/JrCA7dyjsYozbJPqAIr3lK3ENsW5APTV4iIEglE50UAwv9EXQSrgV6pMvKFxr6QpZC3d/7l5b9sYXFJMMYLuD0mTcadQmGEFBXMkNTJ8GzpxxZeEuzwZA9qb1kc32rpFpa44bJrC7ivhEKfxamX/+UshEv7ylVygAE3Lb+SnZaCDDUBXtUMlt25LursOU+agUexGBIZfs2S5zNITeDA2EHlXYDxZmGoZI4ylV5ucAMwtkHS0pINaBFsG2qgGcKrf7Tsg9Xr8hNJnW+3CfKquhQDcBmI4QoKyUxp0usvlc92ki5twAUPs/YElf8JueCPbxQTlHuXzWXyG/BBgAWE8f4HJLruEAAAAASUVORK5CYII="

/***/ }),
/* 43 */
/*!******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/3.png ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzVCOTkxRDkxMUUyMTFFNjhCNTdERkZEN0YzQjI0NjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzVCOTkxRDgxMUUyMTFFNjhCNTdERkZEN0YzQjI0NjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxQUNGN0Q3MzAwQjUxMUUzQUY3REEyQjE5NDNEQUUzRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxQUNGN0Q3NDAwQjUxMUUzQUY3REEyQjE5NDNEQUUzRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq99rLMAAAesSURBVHja5FsLsE1V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"

/***/ }),
/* 44 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/30.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTlEOUIxQUQxMUUyMTFFNjg0RjlBRkRBRkJGNkE2NjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTlEOUIxQUMxMUUyMTFFNjg0RjlBRkRBRkJGNkE2NjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFOUUzNDBFOTE2Q0IxMUUzQjBDOTkzNjQzNUJDMjcxMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFOUUzNDBFQTE2Q0IxMUUzQjBDOTkzNjQzNUJDMjcxMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pvzh4eQAAAOZSURBVHja7JtBaxNBFMcnTcBaqY0iFbXQtBdBGtmgR8GWfIDk5M2aHDyKigdvNjkVT41ePCg0V0Foe/AoSUE8CQ0ePIlNUagHweDFKoT4Hn2BJaZ2ZufN7uxuH/yxnZ2ZHX6+N/N2Zpro9XpCx7pvCoLJnoISoDsqjZL5DcFtKWGH3XDBeAt6GeRgRiwAchH0wvX7cyqLLZQx0CvQuKtsnMrG4grlGWhuSPkcPYsdlNugxf88X6Q6sYGSo9VGZkXKxQHKBM0ZoxJ1R6nuRJShYB5SB80qtJmlNomoQnkAKnpoV6S2kYNyDbSs0X6Z+ogMlEnKUnUy6BT1MWl6sCkfw2aX1LdLoOOHtPsF+jikr0eg32GFcgx0GrQCejjw7AMoe0j7T6CrA2XnKbk7C3oH6oQpfHBy/Aa6CboAukLKeugr62p/DpQHvQY14CvdCYunoGfco58fDzy77LHP90PKHAKTS+Y32jZ7yqoLiB+WBq0BmLStUEokvw095q6NUDIUNkFZBbwlYxuUJXLlIO2WTVAyCmGz56H/nwrhaw0UlXje8dD/V8l8JMOxRHNBmZestw7646H/LrWVnXStgCI7kJbGO2TPMqZtgDIv/LG2X55iy7mPrJctSNTr2ADluqJXVTXe1RwsMHFCyBE+O4pQTtrukiM+xnrfpuIApakYx8k4QBEKOUQojAtK9QjK8HnlvsFx4m5bMWxQ0Gpi/9DKhJ0BrYF+iP1NLCcsUNDKoIrB8abpS3gL1DCVTZvYjqxS5tk27OUIBPdnWbciTUHpL9Mz5DUdw3Bwrtnm3NU3fUKIXnOKwqplOKy2AEwpDFD6hhNwjrxn1+B7VmzaZFJZur8b9pjVsEHxwxzwluIRlH+tEAcoXQ/LdeShfFZc2jOBQYHYxayyJ6GGJpQ9w99WoZ1T6mGBIpvKc6XhTeZ6gUJxmMA4zOMyAkVl07rIAEQW7GaQUFTcVPdWwpKhcfFCoStVsq6Ky6TX+ytTCp62rnvVi2P1eaJQt0TLs2wecYLqfzE0nqGWYPgbQgyJbQ+hgXdOuA/GauAl2vkMh6dgpln20I4bCO7XsJwqcJ77+JZcHQBkAbykYxMUQd4SBJgmJxA07qsYZcoRVoT5S4EIoQowamH49kFvmaF/TWxa43JboXfUTNBOGfxfLNOXLeYXBc2MtkVhsil8OLdO+eDidddc45CmKbycAwB06BOirZudBpKnRNH+CjAARp7MRXb4dCMAAAAASUVORK5CYII="

/***/ }),
/* 45 */
/*!********************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/301.png ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjVDQTg0NDAxNjY4MTFFNjhCMENCNTRDODY1RDBBNEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjVDQTg0NDExNjY4MTFFNjhCMENCNTRDODY1RDBBNEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyNUNBODQzRTE2NjgxMUU2OEIwQ0I1NEM4NjVEMEE0RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyNUNBODQzRjE2NjgxMUU2OEIwQ0I1NEM4NjVEMEE0RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmD2pTcAAAMmSURBVHja7JtbiE1RGMfXMUMzOsIgD+SWFA9eXEqIZiJDGQ8eaFJELg8mXph4QJ1BlAcTkngQNeUybonGKA+Ih/EiSTxM8sQkcs+Z4/+1v13kuMzea337W+fsf/3q1MzZZ/fba6/9rbXXyhQKBZPm1/RLFaRSUilRUxnlS/nOBhfnsgUMAAdsH7ii7rJ7KQ7SCA7x51fgbLnfPrXgFMgw9HlJOUuZAS7ybROGPp8HC8pRyizQAQYX+VsVoI6gvpykzAU3/yAkTDW4BJaVg5Q6cAMM+o//pVvpHFhRylLoWX4NDOzjE/IMWFOKUhq5A62KUmqAk2BzKUnZCE7HrIvocX0Y7CwFKZvAUYu/lQP7fJayARzhq2wzzaDFRylrwTEHQsLsALt9kkKd6gmHQsLsYjnqpfw8lpFIC/dbaqVMKjKWkUgrWKhRSha0/6N0dxWqY9rAeG1SqIaYkuAAcyiLqdQipUGyDP9LZoKtGqRkuRbRkj1gXNJStoNRiqRU86M6MSlDTDDhrC2rwMSkpKzj20dbKniIIS4lY7tospzVoL+0FJp0nqBYynAwX1pKvdGfWmkpsz2QMk1aylQPpEyWlELzrCM9kDLa9G2SPJaUEcafDJOSkvFISlZKyhePpHyTkvLOIynvpaR8BW9TKb/nuQdC3vAFFJPy2AMpT6WLt/seSOmSlnLPAym3pKU8AS8VC/kAbktLofXrFxRLoWUfH6WlUNqUCqEL1hr1y3GlPACPFEq5ErWTtSGFklNY1jfHOYANKe3cYrQkF7U+sSmF7t8mkFfyCN4b9yC2Xps+BPsTFkIV9kobF8fmC3Z6K3c9ISHPwCIe6xhNUvJ8paQrXWqlc0yw+8NokxIO0+nVR4eQkONgHnht86AulneRmMXgIOh1JKMbLDXB+lzrs4CuFgJ+B9tMsDGhy+Jxe0yw8I8WB1111fxcr6Ol/mU6WA7uRDxGL/cb602w7oQWFn9yedIS2+XCgSMxlps9tSB6ezemyDl8Bi/AXdDJI90eyZ5beg9hNw/UwsEaLZmoMcE2F2oRNCGe+NxvJt3BLt+npFJKJT8EGADVJ4LaJF3s2gAAAABJRU5ErkJggg=="

/***/ }),
/* 46 */
/*!********************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/302.png ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkY3M0E0OTUxMUUyMTFFNkEzMkNDQkRGMTE1OUVBQjIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkY3M0E0OTQxMUUyMTFFNkEzMkNDQkRGMTE1OUVBQjIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NjM3ODQ4QTE2QkUxMUUzQjkxQzhCQ0Y4Rjc0Rjc1MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0NjM3ODQ4QjE2QkUxMUUzQjkxQzhCQ0Y4Rjc0Rjc1MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrnZm78AAAdWSURBVHja7FxpbFVF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"

/***/ }),
/* 47 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/31.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTdBNjRFQUQxMUUyMTFFNjhFQ0U5Qjg4NDIyNDNCMDkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTdBNjRFQUMxMUUyMTFFNjhFQ0U5Qjg4NDIyNDNCMDkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RjhCODk4MjE2Q0MxMUUzODc1RUY2Mzg4ODNCRkUyNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1RjhCODk4MzE2Q0MxMUUzODc1RUY2Mzg4ODNCRkUyNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgXRi5kAAARQSURBVHja7JtLaBNBGMcnMSCKQgQFFaTpQSiIuvVxEMWmqCeR1oM3HymCeJE2R09JTooKrQcPgrCB3gS19XESNYWiiKJpBemlNCIIgof0oKKg9T/sF5rEPHaeSdv9w59tm3R297ffzHzz2NDCwgILVKmIagF/nvWJfD0OO3AHHaN0LFceLsI5eIqORVMAVh0Z1w+liWJwP9xHQPzIKQNYDuomPGYSUElhQ+Um4PfwHDwsAKQRKJfKS1GELRkoCbpwt0a10CEOI03nGGp3KA5FhktVxrSiFIGuiagJa6wqDrMvfu4XusEoQUHP49LTaqUciprWQwGQIXpS7aCEzjYmLAmkX/fT0aCUrvYsLAEkqlBleI6RhU/CnXCoyt1wEi5INr6pVkXKoGTDliYQA5SE1bpxnqSN0PfSktUoahUKRYlM3e2FM4LZaIYAiqrfdqTIPIkkjV9klCWLqM82lHOC3y9QdVBRpm0jhaqOaII2pqHdK0iU49iKFJkTTWjqbvMSo3MrUHoku2AdEoW7W+VkpudTdKnQpIv+UfbzWtUIFYEiMyfiKPQ81VAytp5A2HD5gxajaWMroOQlyo/pSr196AN83DaUT5LnSFsaPG6GH8O34fW2oKi0DXxoMGdpquECRfUh2QJCIus+SOBu4bBJ8aK/w2/IH+l3Haq+kb/wdaq+v+r9U60ljpDqYpjguo9J1buRafgs89aQfEGJVN1gFw472fLSLvg1RcwNfpuieQofTF1hy0+r4avwCRrUzrYyT2k3HaRGmDfGoQDKotZRt/0I3hJAqRRP9KbRjp4KoPw/NLgLMKPwhgBKpU7zLhtgjgVQKrUNvs/TkgDKol7yqQ4kczMBFMZ+w5fhwwAyWyt5W2ni0w1nAGMq6H28weI1eH81kJUaKXM0QJwMMlpPd5g30z8pMiDMwk+X6A2/bfDZV/g8/MRPQU3nU9Bvx5m3hUpEfEE9ZxlKvRu5B1+Ev9X6sBX7aHVpK/ywzmf76vx9Hr4Ej4qebKlA+QLvFfj+c+bNB3+WOZmfhrYgUW5Pi+D9ZN4k+VFZIL6goM7JQNG9fdTPnhje0O5h3nZ13r5sNwaFJLoQxqc1YxqhNNpzUmpTDsAz8Brm7YnZ0W5QuFIao6RRWa8IjEPHd8xbrs2ZhjIuUXaC6Vn8Gm4SdRECU3IX5VtFo1DQrsi+UuIqgIlRfuTn/yNl5lLaoSCS5svuXXPp5uIC7UfpNZa4xPmykj2m/4y2LLON0oWq7FMtUvtUXd/jrPZbYjLld4pEtfKyKW0/f9DGSV63aKdQC0pYsIAxpr4F1JQGJHtJ9akDgEky8Q2/JlWkAai2a5KaTwEY/lSSbQAkR1VG64hcepIJYEZMXJBPFai69Kr2NFqhEJg8XZit+RPeppVeizFWhSMawzjH5N5DbhYRvNwJZumdZBPzKQXqnUbK8g8OqoOOMR85zDwd87YgKOUpK0X/BBgAF7IP0/IcAR4AAAAASUVORK5CYII="

/***/ }),
/* 48 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/32.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUJBNUVDRUExMUUyMTFFNjgzMjdFN0QwRkE3NTIyNTUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUJBNUVDRTkxMUUyMTFFNjgzMjdFN0QwRkE3NTIyNTUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMkNBRTlCNTAwQjUxMUUzODMxREJGQkVDRjU2ODA3NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMkNBRTlCNjAwQjUxMUUzODMxREJGQkVDRjU2ODA3NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsAkKL4AAATmSURBVHja7JtnaBRBFMf3YtSowfLFjoIdsWCv2LtiUMGCBbFGP1jQD6KoQcQuKvaCYAdRMKLYsGFBjSWK2EDsFTsmlmjO/597gc26u1dyd3u52Qc/Ru8my95/5715b2bW4/V6tYLY39MpZh8ngzLSlhASwE/wXfgMsjWHrUjX9P8+Swzj9auBNqA1aARqgyoiht74FF6A++AGyABXwRstRiwconQHA8BAUCGA/h4RkPSUz56BI2AvuOy0KJ5Q3Qdu0wnNXNDJZDSEanSr42A5uOaU+wQtCsQoi2YZGB/Be80CG0Ga/DuqoiQEKUhbNBcjLAitFJgJzoB6MRtTIMhoNOtByUC6g6fgNfiie9qcjTjSqkpM8fdQWoKzYAw4FlOiQJBUGc7+LBOky2ySaTOjUJBmgCOvD6hvc82K4AAYB/bFRKCFIKPQ7PBznQyJM0ckFwnGyokw80Adm3687lAR3bmYAkE6otli04WuMR10lqf5M4T7YhK3BzQFi8T1zCwJbAaNIz1SEmwEqYRmLShu0eUu6AFWh2mG4DXmgBRJ7syMedA6ESj6okgO0tDiu1ugK4ZeRgTu6SjoBx5YfN8ezIh6oMUooTtMsvgbpud9Icj7CN7XHTAInAKVTb6nKB/BJ1AdFAW/5P9PRdA3YRMFghRBs8Ci/wcwCoJEo065B8ZaTMXlbGbD3+J+FPYw2B9s4WnmPr1BC4v+aRDkehTzqLyUPxgrBmpKPbZdis4JnGgKIspEi+B6GmxwoD5bAh6FmnJIRsxZ6yRoErQocJ1aNn+4AqPE64AojBObwnCdLuASGBawKBCkNAOorIEY7aLDJT3d4HkYrlNCliemBRpoy4NWFv22YZR8c1CUr+AQmKIL+OeklGB9lav5VvpqykJXCz/XWyV50VZ/ojSVi5oVd7c1541Bd7Bkvekyw5i5c7LUUpPBCJsAu1pi1Xm7mFJfqlejXQ/T0C2onZEHt1bux2uzUMUFqtGScT+26MdqfyHCRpKdKDXEhYz2EK7zKQZE+RVCQkYhO0hMtMqOZ9qJUskiw32pFW57LTNOpsX3IzFakq1EqWYT5Aq78cGmSrZrNC5XzLcKtENkVSxH569JUuvEgzE2NpdZKlc+4+8sZXRLT4Q2wwqNFXjhWhVzRXFFcUUJ2fIFWgTNvOmpuaT33jj//UWlCl+OgHvwP1EgCBOc6QEUU/Fq/cEFiPNF7z6pCgtC46mJdsaYUkzxUMLfX9woyk7Nt1isqnFp4pIxzeeS302wUpYRchQJtD/AUsSSXbZpvlSNiQqIQsuGIDlu7ePWPm5G64oSlTRfYgSPO+St1XoVGBTcunmm3+hL1InB6amb5lv6ryOCqCAKN9+5X51mVvvMklS/uqJew13DwxgxT/QxZbDCgtC4O9rMGGjfKh5fsyS+5EvzeUaWRxd6KSgIU/3dmhx9Ny4yVRbf4glEFRaZEmV0rEMsOe+m+W6a72a0riiuKA7WPnyzgietczU1Vt7egRMIuFlmaT6PYgzXfMenVDMeYB4DYd4a3Ye1z2xFPYYHqqdiYDQxisI9j2SFQwkPQdY1isLjT38UFuWV5nvZIZ8oi8EaRQXhaa01iClXzGof7pLx5esGUhzG8+zjkUHB2eckBHmhL4j0dcBvCMNXQrK1+N/38UhLUfK9u/RPgAEAeRlxDnufCLsAAAAASUVORK5CYII="

/***/ }),
/* 49 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/39.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Qzg2QjlDOTQxMUUyMTFFNjlCMThFMzYyMjUxQzdEQjQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Qzg2QjlDOTMxMUUyMTFFNjlCMThFMzYyMjUxQzdEQjQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0REFERTJFNDE2Q0QxMUUzQkYwM0IzRTZBMzQwOTVEQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0REFERTJFNTE2Q0QxMUUzQkYwM0IzRTZBMzQwOTVEQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmreegQAAATkSURBVHja3Jt/aFVlGMefeS8zmj/+MaMidQ2hiWEwTcaKzA3LX1tMSqyYQsMf6KJBoxRMRFL/cExQKgPxB/5ABWFTtwatqTVGroErsKCmS1mh7Z+2JmXe1vfhPBdk3rZ7z3me957rF75cJu95z/Fznvc57/uc92QNDQ1REMVayijNyoGnwI/BT8CPwJPgyfLLHg+PgzvhukhxfftIHUYpMzQWng7ni2fAefBUgTCamuBto8EIM5SJ8Gz4OXgO/AycC0d89MUwtgBGRyoHRUMSBfPgEvgl+FmfAO4VR8RGwLjg5+BoGkEshV+DF8qY19AVeBNg1AfpxDWUJ+F34bckEWppkHOGJNE7QTtzBeVR+EO4Es5W7rsBrgKM61oduoCyHN4rj0ZSjo4NgHFQ+4ItoWTBtXC1Qd+cO5bBP1pcuBUUHiKHJUq0dQ5+A+63uptjDPqcAH9uBGQPXGoJxALKw/BZmW9oixP1O/C/1klQc/jwhOs4/ILyNcbg9fA+V/MGTSh1Etqa4tXq2/Ahl5MpLShv8lzB4PqqhgGJyuyXh+mAVW7JUigdPIWfLlmaa2qjACmVHFUATxt2IxnKdzCvcU5hztIVFihfGiVWXuEuSHFx2CYlgua0QQEQXtCdDGH5gReEawDnplMoAPKQzCxzKZzqhcsAptPlPGVdiIGwuDTZgps310mk4ESc7HrkxGEXD6FZqQwlv5FSliFA4mWLz1wMnwrKLJUiukvMoKBzno+8TJmnDywjZR55NVZNnSavKpcvZYd8+fu04jnm44ZOs4IyRzkJ1sCvw/vJKxr9I7/75d9rpF3giSq8JBOg7BLHRlghx9toqNAKSp7ikKlLYQWuMZRmWEF5XAlK4wgRkihiGhXOaZZTtFbDbcbtE2m8FZSYEpRu4/aJFLGCMqAEJc+4fSL9aQWlRwlKkXH7RPrVCsoVJSiLKPkCUkTaOxmyfqC0K0Epp+TfHlZL+6DqsILC73WGlMC8J46MECHxNuQKit96yhf4KVZe+zTKY7dbkmqRDJlypXP8DU+KFNePmmz9vuLYqQylXPE//39qTgaI73oKOudIaciw0sFhy9JBXKuVVq8uxEXsenMoUvPksuQfGQClFtd710WkMJhvJLf0hhjINfiTVA7Q2IrB71UKUglPx3ofN+8v11BIcsur8Cs+VrO8wGwyAtIKIKdSPUh70w6/w32evA3CH8Ff0/07A3hs/wyfgNeSt430ogEQfvxW+jnQas9blziuCVLLuC2r7HuTHm/I2WFwDWsRJVfDBGW4+inxXpKV5O1j09YeADnq9+AxlD6tIa9in6XcbwMF3KaaLiib4U8p+IcJw/UVvAJREqg66HpvPt+E3WSzFayVn4AAcjtoRy6hcLI9Bi826JufZBUaHyu4HD5Pk1ecsgBSJ0PmjlaHLiJlFXkfLOQo99tH3gcLJyzGuJWmyNT/gDIQjoiP4ZkybNRlESnZ8kjcrAzjFnxEEvUNy9DWhsKlhO2U5DvbJDQg6yJev5whr6RoLi0oL8pUvTBgPzy/uCyPV67unXcFQg1KrKWMt2VsJe/jSD8AuNbxPXlV9kvwtxSColXUJ4xCyRnJwPgd/oW8Kj2/SPtB/FM6okAdisDgJFogS/M2eTT2SSLsEwhcifsN5o8dBynDFHhv/oOo/wQYADxpL7PzwGUTAAAAAElFTkSuQmCC"

/***/ }),
/* 50 */
/*!******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/4.png ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzRGREI5MjkxMUUyMTFFNkI2NUZFQ0FDMEJDOEMyRjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzRGREI5MjgxMUUyMTFFNkI2NUZFQ0FDMEJDOEMyRjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NjVDQ0VDRDAwQjUxMUUzQkIzNUFGMDFFNzlFNTI5QiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NjVDQ0VDRTAwQjUxMUUzQkIzNUFGMDFFNzlFNTI5QiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PopEDXIAAAatSURBVHja7FsLbJRF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"

/***/ }),
/* 51 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/49.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEEyRDc5MDMxMUUyMTFFNkI2M0FGQTMzODY4RDdBM0MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEEyRDc5MDIxMUUyMTFFNkI2M0FGQTMzODY4RDdBM0MiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxOTNFNDAyRjE2Q0ExMUUzQjg1QURDQzRFRTBDNjRCMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxOTNFNDAzMDE2Q0ExMUUzQjg1QURDQzRFRTBDNjRCMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmWKxkgAAAQKSURBVHja7JpZSFRRGMfPpNhGadJCJi0amJa0GVipZUJFUYYQFVEJPRQU0VMPPfZS9BQE2UMRFS1UtGH0EGILLUaFRGmkpIQxLSMZmZXa2P/j/sWrzD73jjPj+eDHdUY8nvu/3znnO/9zHT09PUpH/ximJdCiaFG0KFoULYoWRYuiRYmdSAy3gX9VpZHsrwNMJqOBG/wGHeA7+MrvAo6EklvWi2JzyI0vB4tBEcgDI309IwrzCbwH70AdeAmaI5YpNsRYIOm3CZSAEcE8eFMm5Q34nQs8BFWgGtQHJQqGRD4ujUgtVwTnthWgHJT5yYZQYzzbLuNnyZwD4GqgE608qWaIUwFybRQjExwCTeAe2GqTIJ5iOlgQ7PCR8bxbgDCPcD0DbiN7Wi16YiJAISfPmFx9Ckk3BaomL8CfAP7HPFAA1oJijv24WZITeVPFptm+ETSAz6CVS6IMy4kcHvPBmKFUp8gTzyK6otVlvhZFR2KM9vunrISm0iFpqIniZHkuPOFq1+4h4yeBNJb42SAH5PLnUfEgiovl90XwGPg7nHJTPCc/Vw4QLIPVawE3lrm+pg5vokjd0Wl1WvoJufH74CS4AbosatfN7BKu8Ltk7r49Fp4ObyeEqFyn4LIL7ABTbRSjDZyjGPWRTklPforD37EpxJE0WwW2gzXc2luRFc/AKXCZJtGgREiiDBBIhtMy+hwF9CyGB/jn3RSikmncFA2TV9iieBFpJsv8TO6Ak7nX6eDS+QG8Aa/4OarCcjsSDXZCGLH76nRFqyvaqAkpwhax5vDm5jtpYfQa1+3xJko6WAdWK8PNnxBCGy2qz80XQ0wMsm+xJkoq2AI2g6UqfKsynaw0lQKvleEa3uW1KyBRMHnuY4dOYzJtt1mIBNZB5WB9EEt8KCH3NJfsB4fBwUAnWhmzx2RsQqDjIMeGDs4CR8BHcAdstFkQbyIFPXyket0L9kCYGlyvg5vInoYQO5HBmxcWxvrqI4rmk6MQqIXjsYaFmYj0RRlGdm8kUQRZMQpZAWfH85Isk9c2Yt7PtKk+Nz9FReGZTqSXZBFgnK5o4zS0KFqU+Nv7iD1aqwxb0an6u/nyDovZuE6LZ1Fk33INPFCGQRWoQyeeTq+bPxvMUcYhf2qsiiKvZ51VhpNfG2IbP8BTYp4qRKgi1kzFwYpyQRluWmkE5x0516lg1dxpQ/tuFprCCZYQKR5rC192JCpXcfHFzd8JptnQUXmi55Xh5L8djLQM2aOloy+G9QZ6HDPC6IdsBeRlvEvKOPD6NZhj1TLjGiJlcFwu4USW5cMEcnNv9FwZ77WJj+GKlgnMcjefApl31J7c/GbwN1qXN1tE0RWtFkWLokOLokXRomhRtCiRi/8CDAC9hxF/SBzitgAAAABJRU5ErkJggg=="

/***/ }),
/* 52 */
/*!******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/5.png ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzQ0QkNCQUUxMUUyMTFFNjlGNDc4NjZFMjQ0MEM3QzQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzQ0QkNCQUQxMUUyMTFFNjlGNDc4NjZFMjQ0MEM3QzQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDODU3ODdDNjE2QkYxMUUzQjgxRDhGREZBQTcyMTAwQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDODU3ODdDNzE2QkYxMUUzQjgxRDhGREZBQTcyMTAwQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Puq3y04AAAegSURBVHja3Ft5sJVj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"

/***/ }),
/* 53 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/53.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUZDRTQ5RDYxMUUyMTFFNjg2QjdCNjFEQkFEMUQ1QTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUZDRTQ5RDUxMUUyMTFFNjg2QjdCNjFEQkFEMUQ1QTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowOTAxMUZCNDAwQjUxMUUzOTU4NkZFQTI0NjBGMzVFRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowOTAxMUZCNTAwQjUxMUUzOTU4NkZFQTI0NjBGMzVFRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsYs8coAAAPuSURBVHja7JtbSBRRGMfPqqVFll1EgkIqLOgtsiCKbutDvZRFQhmhYZF0weqpEgmCDOklulm9BFG9ZBeDKAyxepBU1Aqhp4qEypAoqTTKbft/zRdsi+uc3bM7Z24f/BjdGdeZ/5zznf/5zkwgHA4LP/6PDNUvCDWvT/RP08EOsAvkgk5wDHTF9SXBRvuJohAFYBNYwL9PAy/Ac9JaZ0tJ0/R/qZWcA0URn2WBGlCmu/voEmURWBZjH4mS6UVR8sDYGPumaO7W2kTpBv0x9j0FQ14UpZdHmuh4C2rBb0cPyQpxFrwDJWAGaAf14I3jfYpi3AZ3wQQwYBfzlmaDcwjZSRC7iOI+m5+iyAZ7wCRwHzzxuijkdi+Bzfx7FVgF2rzcfWZFCEIxDmzxekv5Cr6AnIjP+iRn7NTtJrLP+YQZ9E+3tJSP4CAbvO+gCVwxESMTVOLHe+yWO8B1fLYhkRMIqBaZFOopZjEb5IMWk+PI49wAa2LsP4EWc8QtQ/JrCUHo/OtGEYTiMG5cqZd8yjxQKXFcNecbT4iyVPIa5nNX9IQouXEcO9lqUQKaRJGdUdMQ/cESn4J+uhybch4pfoEecIaTpBXRwkN4nslxD+IpSSQ8JEMQmpvUslmKDCoUVYBmi4ShJZILo+wnrxPEsNyW0u4DQVZgc3IEQQQntPNgqiUTpWDjRWyOsgseyQiWxyOISk4p5TlJrJjLxwiLhKHSZhHfjEfgoTDKnYXY15DyuQ9aSQZftFkUWjq1DjbSCmOnzlmyTGFZ6yqfpaLgjgwLY3nTLFqtvBC04ArQAa6CHB0t5bLJuE+V+WsWCjKHJn7cZbeq1l/SEuy/1FL28vQ+OijT7xTWLmiRR/oWVZNJ3ImqlA5wh6hKRmu/BZxnutkzDFqYYP+dy2r2Ry+5XBDSIkqK6ylxiaI10XohpFsKWkS6sO+SiEwMy3YpU1Go/onNWrBRGMVkJ/oPuqGfwS3QBHGGVB0tTfqq+IudHtvAabBfNaeUuUSQvz1DxsPIiNIl3BU9yZgQHuDmVuzw0Yp81B1hFMGSNvpQPXQ8CDu02wwiwfb75s03b74o+h0tugg980rT8ywH55Qf4JXMkwgyjnYJNofY1QYc3ADoQumpqDoI06o6JJ8Ci13SM9aB6WbXI5NT8l2WMmYmI9HSssGASwSh66hPhqM9Lox1lGI2b06dJQ+yo233zZvvU3xRfFFs5Wi5NrtSGK+gZDs40dJaED1F+ZhXOZVGn2qwTxhvgzo9Sthi1Kh2n90uEYSC3k/cnoyc0uuylNGXDFGopTS4RJCbfD3Kjva9MN4qXwjGOFgQWoR/Joz3FkeNPwIMANwTFMv+BAZ6AAAAAElFTkSuQmCC"

/***/ }),
/* 54 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/54.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzlCNkU2MUQxMUUyMTFFNjgzREI5MjBGQTY2RjJDQUMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzlCNkU2MUMxMUUyMTFFNjgzREI5MjBGQTY2RjJDQUMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMEJGODIxMTAwQjUxMUUzQUE2NUY2NjU3QjY2RjBFNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMEJGODIxMjAwQjUxMUUzQUE2NUY2NjU3QjY2RjBFNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhWNIkcAAAW2SURBVHja7FsLiBVVGD737t1NlNV8rCula5FsCj2w2tQiwjYtSdK2UtmoLMoS0UAiJbOgKJICI6VSKk17KNsSm0XiA5HENXI101CqbX1BYqtW5CN19/Z9zX9hdpo7d2Z3Zs7B6YePuXfmv3fO/e75n+dMKpvNqq5I28YJKgTpBlwLFAH7gON+P1hU3aDClowyQyqAG4E0eQa+0TkYE0gZD7wPlMn7c8AzwBu6BpTWTMglwFIbIZRiYD5wfVJJuQEodznfB7grqaS0A/k8/fmkkkKHesDlfCuwJqmk/AY8Chx0EPIssDvJ0WczcDNwG5ACtgM/JD0kUw4DKwwZi3bzMVJMJ6UHMBwY/D8plpQCS4AdwCbJfBNPymTgAXl9ObAIKEk6KT0d74vjCgwZg0lZC8wGLpX3nwCnCrQxhuFwL3AVcBLYAHxWVN1wJsiNU4b0U/LJUOBB4EfgI7fUP9dPwTim4bBYZpRdGmmK0Dt0oUQfNpzmAR941UIgpFaccrHL5VFAPXT6JCZPwY/tj8OcAmpVwCNJSt4qgWt86N2XJFJ6+dQr00lKKmZS/vCp1xp3SL5IpucdQG+gRUJoYwyk/AzsBYYV0KuPc6Z0B1YCH0r4ZDo+E9gKPBk1Iwi1R3B4uYDa98CyOEmh578/z7W3geoYiGEO85Ryb202cRZDx7f5dCl5Qzjsq6yGULmH2pIoZ4x9MQzj4YLaFIlIzH7XA3XQOR1nms9C7eICOleLnzkRw4zZhcMu3QXhKZW/G5+Ts8pa9QsqzE4HBgi5udlSBmR0ksJO/E8FdLYAf3Yi96Bj/FpZPdw6YJIPQuZJJFqJ16VaSMF0ZSX6kodKSxCvb5MZ0ku5TFkL7wz3qyWsluchhOvRUwH6uRpgnM5+Sp040hMuYZBR6ZdOfOeQPOdrpFru4XKNofmwvD4GNHc6+wyxdUD7vxvoB+wB1gF/dfJrmet8Kkmhm8wFFrhEH5rMGOAQzn9rQpOJ/9JbIX3XFzIraiR6VTnKBy6gfcwfb0sNxolD3w1C9nSpTjG8yfTvZFDWmlCt4zxnxAYxpXopMZT0XZiwLQQ5q3X5lMhbJsCbLhGsvxxH2gjJzf4RwCr8Ya9eqKRQenqYutfuhDkgZkZs5oOblchAsxERkRX0k7A+xnH9dmCjspY9FgKPKfclENY8I2FKvqNRJiARTKomyJStkKyzPSJS2sW5VgkxdtmpZFcCfuxZjGsWXr4rOQ0r9OtsuvzsrUFCtO+ZghszgXpBWcsHumU68I4zJMs4r5A+jr3Txpk2DbrnQ5spuNHjUu2mDCDkvRwhHqlBs4OU3vJbfZGS9kEIm8IvGkDIGUnYphfQGyTlgV2OqwDbxTIFCKmUFH6A4xL7ovvlRlFFsJQ42t+B75TV2dvh8BWDMMa06LXJOOe7jLfJr+n4MZ+xytplZBduyXoIN1kbU/LmJlcqa4FshA9dNpg2hZmn0Kk694YsyxGiUeb6JITyPMa7N0xS3LZ0njTA2fpNJRaBkNfDzmhbpCS3y0SYzADNpKzyaFzRt3DZ42FlNbPDLQjx4/kQwdPqv9163vQrZbUao9rOkZbvPyrJWpPq+HQHE7RbRK9djqdlbI3SAFNRkFIi6TV7G900zw5msM8Bn3cooSN4tMXTfJhCA18qa9+HbmFfpUHFsMDmN8fgoyavGFIxc4HtzihvEKhKhjndhANT/tGSOmcjrJJzlXKpi9+iP7sH+DsK8wncOgAxKRlkqVTJUZHSJlntKDHfCsd1nt9mxONyGARJOJeLBDFktGvkD1iuOm7fYo2zTadP0S2sfZwrA911O1rdMkV8mF1ao7qZyftoaR583IVds1oXQpqTRspwSdIG5rnOVcl9STOfJzwI4TLsayYkb3FLvk02NJnJUqgmjpTFquMzhPuVtbuBPma7KX2JuIUzgnvlKiUU/yrVcizyjwADAICghtYgfQwWAAAAAElFTkSuQmCC"

/***/ }),
/* 55 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/55.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzkxOTZCNEYxMUUyMTFFNjkyNTlGQTlBODBBMDYzQTIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzkxOTZCNEUxMUUyMTFFNjkyNTlGQTlBODBBMDYzQTIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGODE3NThFRTAwQjQxMUUzOTE1M0U0NzMzQUVFRTZDRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGODE3NThFRjAwQjQxMUUzOTE1M0U0NzMzQUVFRTZDRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv4zi+0AAAhiSURBVHja5FsJsE11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"

/***/ }),
/* 56 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/56.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E1MUExQzExMUUyMTFFNkI0OTY5NzQzNjI5NDVGMEQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0E1MUExQzAxMUUyMTFFNkI0OTY5NzQzNjI5NDVGMEQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMDcyMjRBNjAwQjQxMUUzQkZERUM4NTJFQTczQzMwMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGMDcyMjRBNzAwQjQxMUUzQkZERUM4NTJFQTczQzMwMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuQexYIAAAZBSURBVHja7Ft9bBRF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"

/***/ }),
/* 57 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/57.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0FFMjc0MzAxMUUyMTFFNjg1QkRBOEI1QUU3QjY2NDkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0FFMjc0MkYxMUUyMTFFNjg1QkRBOEI1QUU3QjY2NDkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4N0FERTJEODE2Q0ExMUUzOTQ0QkQ3QzFCQUU4NEQ4RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4N0FERTJEOTE2Q0ExMUUzOTQ0QkQ3QzFCQUU4NEQ4RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk9sk8kAAAQsSURBVHja7JpLbExhFMdn+hhapSXa0tajiVRCIiJCBCEEiTTEwkY3LUGE6KILr3ZVgkTQhQSp2NAFNkiDhdRCvCIiUhZtEY/SorQe1dKq/0n+k9zW7Z25M9/cGs5Jfvmq7r3m+8/5zuMe/r6+Pp9af/OrKCqKiqKiqCgqioqioqgo/4AovddXpyQuvfg91ANw3VB87mEgHYziKpYGOkAr+RXOg7DHP36X5HD9Gmx4FtaduLHH401ngAIwBUwFk8A4kMt1bIj7P4M6cA3UUCwjnrIOy1lwGxRDmAaPPOUUWG/wed+4j33gZTiekhDGQ+eBh9h8uRwpD7xkuOHnjQCbQCM4xGPmaAlhPljEqARPIcx2kG7wQ6eCHA/EDoAy8AQsd7owyeWDx4MqcUUIcx7rJR6v1kGuT+b5z2Y8yOI6kfFCmMBzX+RRvJJ/7yo4ACokAkQris8S6UuIWDv4aPn7kbwmxfd3mh/skrAAzpkSxS5bZMRhSZLk9vj0xsGmuoDUUp8svxsT7RfkJMoFsF/qFLqblyZfyGsJ7OQVaGbsCq5t4Mcg92cza64Ca8PJOK7KfATUFViqQV4MRbAG2hxuuNvQsyVTFoMdTBRWK0KdUuM6JeMmqQqngcMO34xJe2NQEB+r2Spmugoet+jrFAjzBZSx9K5mlWjSuj0QuxPsBTPBHeNdMos3cXep8eezanSyD6CFXiDrC9BAmgakc6+yjtQpD+yOj1PvMwfLe9z0PIRAiVgmg0yK025pyjpINJ6QzDiTa2kKs5hhApY1jZ2xiP4Y3AR3Q2TRVOyv0032kTNYi01LM1gbIlMEs4QJWwkKB1S8kdZTLWwwTzCD2R0p1zFFSvTLEKYaeFWcybHcApaB/CgLTPGsPeAZOG6TfSIOtFKjbJAuE8KUgkCcVq6bGcNKJXeY6JKDXnNUgiSEqQT5UXxIiQuLKPZBsNUjcdK4hzo2pUa65KBLlgsQRpS/wZc3UoH2MNj6GQAlS41moLR2ygGb4u2Yh56zENwHS0C96YawgMSjSbacYSdKgk/N1fF5JHUKFR1q+wnesRkMFoHtpIP1SRe/5Dym8cWRenGSQ2lfj5gxGz+e4Rn0ym4xPjVZkD9HMqCSZCAvwTcyphnrkiV9bWPfkBYjIWL9OjLADLfb1388EnGX3Auq6IonmWHizaS7P8I9nA7lda4bQniODKZkZFASboVoYz1sChvJFeKVFVKcUrcNoePYlMdqLlgAplOg4Bs6ue8rg2Ab35RJcHzLtZnBM1IzMTaVeJOJPd5zI4pMCEOOTWM0S/ZsbGo3IdSxqY5NdWxql5Z1bDqI6djU4R2Rjk3dnBQdm7oURcemDsWZjk1tihsdmw4ijI5Nw+iU/8+xqQuBYj02jaXZjk31v6GbOj4qioqipqKoKCqKiqKieGC/BRgAjtDkGzD78zkAAAAASUVORK5CYII="

/***/ }),
/* 58 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/58.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODMxMjVFNTAxMUUyMTFFNkE1QTlDRDI2Q0M3ODI3QTIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODMxMjVFNEYxMUUyMTFFNkE1QTlDRDI2Q0M3ODI3QTIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozOTBENkFBQjE2Q0ExMUUzOEE3N0YxRjQ5MzY2NDEzRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozOTBENkFBQzE2Q0ExMUUzOEE3N0YxRjQ5MzY2NDEzRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpoodLYAAAQESURBVHja7JpbSBRhGIZnazErUpMOZGGlgWUJHRSs1sq8KIoyhKiISuiioOgyoktviq6CILsooqIDFZ0wugixAx2MConSSEkJYzusZGVWamvvh68wLbs7O+vM5Kz/Bw/jrs7s/O98//9/3+t6ent7NRX/xjAlgRJFiRJveAd6gT/VpU7erwdMIqNBEPwEneAL+MT3Yo7hJdetF8XmkIEvAwvBEpAPRkZ7RhTmPXgDXoN68Ay0OJYpNkQKkPTbAEpAspkHr8uk/JDfBcA9UA1qQIMpUTAlCnFoQmoFHFzbloNyUGaQDfHGOF67jK8lc/aCS7EutPKkWiBOJcizUYxsUAGawW2w2SZBwsU0MN/s9JH5vFOAMPdxPAluIHvaLHpiIkARF09X7j5FpIcC1ZCn4FcMnzEX+MBqUMy5nzBbspeDKtat9k2gEXwAbdwSZVpO4PSYB8YMpTpFnngOURWtKvOVKCq8Lr3v77IT6kqHpKEmip/lufCQu11HmIyfCDJY4s8CuSCPP49KBFECLL/PgQfAyB4MUjw/X1eFCJbF6tXHxjIv2tIRSRSpO7qsTkuDkIHfAcfAVdBt0XWDzC7hIt9LZfcdtvD0RPJoUblOxmEH2AYybRSjHZymGA1Op2Q4P8VjZFxDHEmzFWArWMXW3oqseAyOgws0iYxC1oYCToVIJpOflXW/n9JhiyghAsl0Wkqfw0fPYkSMp/dQiCqmcbPB308Ba8BKmkzj4xC/VWcySZ8mfdtnS0WJINIMlvnZ7IBT2et0cut8C16C53wdLdLBJrARLLahg5bBvmAze0uOEKU7JlEw2D28oRM4qcNAmAFPa05PMZjWmsg8K+IAxrc/1opW5uxhmZsY9BGQa8MNzQQHwTtwE6x3WBAtUiYa1SmyqO4GuyBMLY5XwDWo2xjnTWRx8MICt5f5omghOQSBWjkva7leiEgf6a/0RxJFKKBB5eMOkrC9j+wMW4h+EWvXmUxp2iC0Gp0u80WAsco6UH6KEkWZTC4J6drr2O36Q0ym5BA/JSORRZG+5TK4y76pM8bzUnUm02wwR+v731O6W0WRbw2cosFUF+c1voJHRL9U5NJkkpqp2KwoZ9nklTq47ojdWMmqucuG6wdZaApHWUKkmTKZ2Oxl0mTaDqbacKPyRM/QYHrlKj+FRpP4KOvocUwfgBDSCsh3RM5rfT7sj4TwUyBSFuflIi5kOVFuOsje6InW93UL8TECQ8VPSYlgMrWA327yU7xR/JR9oAKDFlO5EifXG3zAN2LGTylnU5mh/Z9QforyU5SfovwU1SUrUZQoyk9RforyU5SfovyUwean2BJu81MGtygO+inuFcViPyXxRFEVrRJFiaJCF38FGACahY4qs4M/ugAAAABJRU5ErkJggg=="

/***/ }),
/* 59 */
/*!******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/6.png ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzNBMjFCQjIxMUUyMTFFNjgyNzdFMUM2QTIzMzYxMjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzNBMjFCQjExMUUyMTFFNjgyNzdFMUM2QTIzMzYxMjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFM0JGRkNERjAwQjQxMUUzQkQ3ODlFQTA4RUVBRjNGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFM0JGRkNFMDAwQjQxMUUzQkQ3ODlFQTA4RUVBRjNGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtFa+XAAAAiSSURBVHja7FwLkI5V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"

/***/ }),
/* 60 */
/*!******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/7.png ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzFDOTg0MzYxMUUyMTFFNkE1RDBEQzdFQjNDRDIyRDQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzFDOTg0MzUxMUUyMTFFNkE1RDBEQzdFQjNDRDIyRDQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozNjlBQzNFMjAwQjUxMUUzOEQ1NUE5Q0Y0OThGM0EwMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozNjlBQzNFMzAwQjUxMUUzOEQ1NUE5Q0Y0OThGM0EwMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuTor7IAAAbsSURBVHja7Ft5bBRV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"

/***/ }),
/* 61 */
/*!******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/8.png ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzBGQ0JCNTcxMUUyMTFFNkJDQUZGNkEzMTlENDQyRjQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzBGQ0JCNTYxMUUyMTFFNkJDQUZGNkEzMTlENDQyRjQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMDU4MjJBMzE2QzcxMUUzQUZCRURFQzE2NzkyRTNCQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMDU4MjJBNDE2QzcxMUUzQUZCRURFQzE2NzkyRTNCQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnCWNbcAAAb1SURBVHja7FsJbBRV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"

/***/ }),
/* 62 */
/*!******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/9.png ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjMyMjNCRDkxMUUyMTFFNkE5MDhGOERFQUJFNDY0RkYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjMyMjNCRDgxMUUyMTFFNkE5MDhGOERFQUJFNDY0RkYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RjNBOEFDNzE2QzcxMUUzOEU0QUQzQkRFQjk2NkU4NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1RjNBOEFDODE2QzcxMUUzOEU0QUQzQkRFQjk2NkU4NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgZC1woAAAcxSURBVHja3FsJbBVV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"

/***/ }),
/* 63 */
/*!*******************************************************************!*\
  !*** D:/iotat/2020.7/weather/static/icon/天气图标/weathercn02/99.png ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA9CAYAAAD7/KSFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjFBQTQwRjUxNjY3MTFFNjlFRkM4QkNBMjFDM0QwOEEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjFBQTQwRjYxNjY3MTFFNjlFRkM4QkNBMjFDM0QwOEEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMUFBNDBGMzE2NjcxMUU2OUVGQzhCQ0EyMUMzRDA4QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMUFBNDBGNDE2NjcxMUU2OUVGQzhCQ0EyMUMzRDA4QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Phi3L94AAABkSURBVHja7NAxAQAACAMgtX/neVvACyLQSYprFEiRIkWKFClSpEiRIkWKFKRIkSJFihQpUqRIkSJFihSkSJEiRYoUKVKkSJEiRQpSpEiRIkWKFClSpEiRIkUKUqRIkSLl0QowAD+8A3c/GCt8AAAAAElFTkSuQmCC"

/***/ }),
/* 64 */,
/* 65 */,
/* 66 */
/*!********************************************************************!*\
  !*** D:/iotat/2020.7/weather/js_sdk/u-charts/u-charts/u-charts.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {/*
 * uCharts v1.9.4.20200331
 * uni-app平台高性能跨全端图表，支持H5、APP、小程序（微信/支付宝/百度/头条/QQ/360）
 * Copyright (c) 2019 QIUN秋云 https://www.ucharts.cn All rights reserved.
 * Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
 * 
 * uCharts官方网站
 * https://www.uCharts.cn
 * 
 * 开源地址:
 * https://gitee.com/uCharts/uCharts
 * 
 * uni-app插件市场地址：
 * http://ext.dcloud.net.cn/plugin?id=271
 * 
 */



var config = {
  yAxisWidth: 15,
  yAxisSplit: 5,
  xAxisHeight: 15,
  xAxisLineHeight: 15,
  legendHeight: 15,
  yAxisTitleWidth: 15,
  padding: [10, 10, 10, 10],
  pixelRatio: 1,
  rotate: false,
  columePadding: 3,
  fontSize: 13,
  //dataPointShape: ['diamond', 'circle', 'triangle', 'rect'],
  dataPointShape: ['circle', 'circle', 'circle', 'circle'],
  colors: ['#1890ff', '#2fc25b', '#facc14', '#f04864', '#8543e0', '#90ed7d'],
  pieChartLinePadding: 15,
  pieChartTextPadding: 5,
  xAxisTextPadding: 3,
  titleColor: '#333333',
  titleFontSize: 20,
  subtitleColor: '#999999',
  subtitleFontSize: 15,
  toolTipPadding: 3,
  toolTipBackground: '#000000',
  toolTipOpacity: 0.7,
  toolTipLineHeight: 20,
  radarLabelTextMargin: 15,
  gaugeLabelTextMargin: 15 };


var assign = function assign(target) {for (var _len2 = arguments.length, varArgs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {varArgs[_key2 - 1] = arguments[_key2];}
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  if (!varArgs || varArgs.length <= 0) {
    return target;
  }
  // 深度合并对象
  function deepAssign(obj1, obj2) {
    for (var key in obj2) {
      obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ?
      deepAssign(obj1[key], obj2[key]) : obj1[key] = obj2[key];
    }
    return obj1;
  }

  varArgs.forEach(function (val) {
    target = deepAssign(target, val);
  });
  return target;
};

var util = {
  toFixed: function toFixed(num, limit) {
    limit = limit || 2;
    if (this.isFloat(num)) {
      num = num.toFixed(limit);
    }
    return num;
  },
  isFloat: function isFloat(num) {
    return num % 1 !== 0;
  },
  approximatelyEqual: function approximatelyEqual(num1, num2) {
    return Math.abs(num1 - num2) < 1e-10;
  },
  isSameSign: function isSameSign(num1, num2) {
    return Math.abs(num1) === num1 && Math.abs(num2) === num2 || Math.abs(num1) !== num1 && Math.abs(num2) !== num2;
  },
  isSameXCoordinateArea: function isSameXCoordinateArea(p1, p2) {
    return this.isSameSign(p1.x, p2.x);
  },
  isCollision: function isCollision(obj1, obj2) {
    obj1.end = {};
    obj1.end.x = obj1.start.x + obj1.width;
    obj1.end.y = obj1.start.y - obj1.height;
    obj2.end = {};
    obj2.end.x = obj2.start.x + obj2.width;
    obj2.end.y = obj2.start.y - obj2.height;
    var flag = obj2.start.x > obj1.end.x || obj2.end.x < obj1.start.x || obj2.end.y > obj1.start.y || obj2.start.y < obj1.end.y;
    return !flag;
  } };


//兼容H5点击事件
function getH5Offset(e) {
  e.mp = {
    changedTouches: [] };

  e.mp.changedTouches.push({
    x: e.offsetX,
    y: e.offsetY });

  return e;
}

// hex 转 rgba
function hexToRgb(hexValue, opc) {
  var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var hex = hexValue.replace(rgx, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(rgb[1], 16);
  var g = parseInt(rgb[2], 16);
  var b = parseInt(rgb[3], 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + opc + ')';
}

function findRange(num, type, limit) {
  if (isNaN(num)) {
    throw new Error('[uCharts] unvalid series data!');
  }
  limit = limit || 10;
  type = type ? type : 'upper';
  var multiple = 1;
  while (limit < 1) {
    limit *= 10;
    multiple *= 10;
  }
  if (type === 'upper') {
    num = Math.ceil(num * multiple);
  } else {
    num = Math.floor(num * multiple);
  }
  while (num % limit !== 0) {
    if (type === 'upper') {
      num++;
    } else {
      num--;
    }
  }
  return num / multiple;
}

function calCandleMA(dayArr, nameArr, colorArr, kdata) {
  var seriesTemp = [];
  for (var k = 0; k < dayArr.length; k++) {
    var seriesItem = {
      data: [],
      name: nameArr[k],
      color: colorArr[k] };

    for (var i = 0, len = kdata.length; i < len; i++) {
      if (i < dayArr[k]) {
        seriesItem.data.push(null);
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayArr[k]; j++) {
        sum += kdata[i - j][1];
      }
      seriesItem.data.push(+(sum / dayArr[k]).toFixed(3));
    }
    seriesTemp.push(seriesItem);
  }
  return seriesTemp;
}

function calValidDistance(self, distance, chartData, config, opts) {
  var dataChartAreaWidth = opts.width - opts.area[1] - opts.area[3];
  var dataChartWidth = chartData.eachSpacing * (opts.chartData.xAxisData.xAxisPoints.length - 1);
  var validDistance = distance;
  if (distance >= 0) {
    validDistance = 0;
    self.event.trigger('scrollLeft');
  } else if (Math.abs(distance) >= dataChartWidth - dataChartAreaWidth) {
    validDistance = dataChartAreaWidth - dataChartWidth;
    self.event.trigger('scrollRight');
  }
  return validDistance;
}

function isInAngleRange(angle, startAngle, endAngle) {
  function adjust(angle) {
    while (angle < 0) {
      angle += 2 * Math.PI;
    }
    while (angle > 2 * Math.PI) {
      angle -= 2 * Math.PI;
    }
    return angle;
  }
  angle = adjust(angle);
  startAngle = adjust(startAngle);
  endAngle = adjust(endAngle);
  if (startAngle > endAngle) {
    endAngle += 2 * Math.PI;
    if (angle < startAngle) {
      angle += 2 * Math.PI;
    }
  }
  return angle >= startAngle && angle <= endAngle;
}

function calRotateTranslate(x, y, h) {
  var xv = x;
  var yv = h - y;
  var transX = xv + (h - yv - xv) / Math.sqrt(2);
  transX *= -1;
  var transY = (h - yv) * (Math.sqrt(2) - 1) - (h - yv - xv) / Math.sqrt(2);
  return {
    transX: transX,
    transY: transY };

}

function createCurveControlPoints(points, i) {

  function isNotMiddlePoint(points, i) {
    if (points[i - 1] && points[i + 1]) {
      return points[i].y >= Math.max(points[i - 1].y, points[i + 1].y) || points[i].y <= Math.min(points[i - 1].y, points[i + 1].y);
    } else {
      return false;
    }
  }
  function isNotMiddlePointX(points, i) {
    if (points[i - 1] && points[i + 1]) {
      return points[i].x >= Math.max(points[i - 1].x, points[i + 1].x) || points[i].x <= Math.min(points[i - 1].x, points[i + 1].x);
    } else {
      return false;
    }
  }
  var a = 0.2;
  var b = 0.2;
  var pAx = null;
  var pAy = null;
  var pBx = null;
  var pBy = null;
  if (i < 1) {
    pAx = points[0].x + (points[1].x - points[0].x) * a;
    pAy = points[0].y + (points[1].y - points[0].y) * a;
  } else {
    pAx = points[i].x + (points[i + 1].x - points[i - 1].x) * a;
    pAy = points[i].y + (points[i + 1].y - points[i - 1].y) * a;
  }

  if (i > points.length - 3) {
    var last = points.length - 1;
    pBx = points[last].x - (points[last].x - points[last - 1].x) * b;
    pBy = points[last].y - (points[last].y - points[last - 1].y) * b;
  } else {
    pBx = points[i + 1].x - (points[i + 2].x - points[i].x) * b;
    pBy = points[i + 1].y - (points[i + 2].y - points[i].y) * b;
  }
  if (isNotMiddlePoint(points, i + 1)) {
    pBy = points[i + 1].y;
  }
  if (isNotMiddlePoint(points, i)) {
    pAy = points[i].y;
  }
  if (isNotMiddlePointX(points, i + 1)) {
    pBx = points[i + 1].x;
  }
  if (isNotMiddlePointX(points, i)) {
    pAx = points[i].x;
  }
  if (pAy >= Math.max(points[i].y, points[i + 1].y) || pAy <= Math.min(points[i].y, points[i + 1].y)) {
    pAy = points[i].y;
  }
  if (pBy >= Math.max(points[i].y, points[i + 1].y) || pBy <= Math.min(points[i].y, points[i + 1].y)) {
    pBy = points[i + 1].y;
  }
  if (pAx >= Math.max(points[i].x, points[i + 1].x) || pAx <= Math.min(points[i].x, points[i + 1].x)) {
    pAx = points[i].x;
  }
  if (pBx >= Math.max(points[i].x, points[i + 1].x) || pBx <= Math.min(points[i].x, points[i + 1].x)) {
    pBx = points[i + 1].x;
  }
  return {
    ctrA: {
      x: pAx,
      y: pAy },

    ctrB: {
      x: pBx,
      y: pBy } };


}

function convertCoordinateOrigin(x, y, center) {
  return {
    x: center.x + x,
    y: center.y - y };

}

function avoidCollision(obj, target) {
  if (target) {
    // is collision test
    while (util.isCollision(obj, target)) {
      if (obj.start.x > 0) {
        obj.start.y--;
      } else if (obj.start.x < 0) {
        obj.start.y++;
      } else {
        if (obj.start.y > 0) {
          obj.start.y++;
        } else {
          obj.start.y--;
        }
      }
    }
  }
  return obj;
}

function fillSeries(series, opts, config) {
  var index = 0;
  return series.map(function (item) {
    if (!item.color) {
      item.color = config.colors[index];
      index = (index + 1) % config.colors.length;
    }
    if (!item.index) {
      item.index = 0;
    }
    if (!item.type) {
      item.type = opts.type;
    }
    if (typeof item.show == "undefined") {
      item.show = true;
    }
    if (!item.type) {
      item.type = opts.type;
    }
    if (!item.pointShape) {
      item.pointShape = "circle";
    }
    if (!item.legendShape) {
      switch (item.type) {
        case 'line':
          item.legendShape = "line";
          break;
        case 'column':
          item.legendShape = "rect";
          break;
        case 'area':
          item.legendShape = "triangle";
          break;
        default:
          item.legendShape = "circle";}

    }
    return item;
  });
}

function getDataRange(minData, maxData) {
  var limit = 0;
  var range = maxData - minData;
  if (range >= 10000) {
    limit = 1000;
  } else if (range >= 1000) {
    limit = 100;
  } else if (range >= 100) {
    limit = 10;
  } else if (range >= 10) {
    limit = 5;
  } else if (range >= 1) {
    limit = 1;
  } else if (range >= 0.1) {
    limit = 0.1;
  } else if (range >= 0.01) {
    limit = 0.01;
  } else if (range >= 0.001) {
    limit = 0.001;
  } else if (range >= 0.0001) {
    limit = 0.0001;
  } else if (range >= 0.00001) {
    limit = 0.00001;
  } else {
    limit = 0.000001;
  }
  return {
    minRange: findRange(minData, 'lower', limit),
    maxRange: findRange(maxData, 'upper', limit) };

}

function measureText(text) {
  var fontSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : config.fontSize;
  text = String(text);
  var text = text.split('');
  var width = 0;
  for (var i = 0; i < text.length; i++) {
    var item = text[i];
    if (/[a-zA-Z]/.test(item)) {
      width += 7;
    } else if (/[0-9]/.test(item)) {
      width += 5.5;
    } else if (/\./.test(item)) {
      width += 2.7;
    } else if (/-/.test(item)) {
      width += 3.25;
    } else if (/[\u4e00-\u9fa5]/.test(item)) {
      width += 10;
    } else if (/\(|\)/.test(item)) {
      width += 3.73;
    } else if (/\s/.test(item)) {
      width += 2.5;
    } else if (/%/.test(item)) {
      width += 8;
    } else {
      width += 10;
    }
  }
  return width * fontSize / 10;
}

function dataCombine(series) {
  return series.reduce(function (a, b) {
    return (a.data ? a.data : a).concat(b.data);
  }, []);
}

function dataCombineStack(series, len) {
  var sum = new Array(len);
  for (var j = 0; j < sum.length; j++) {
    sum[j] = 0;
  }
  for (var i = 0; i < series.length; i++) {
    for (var j = 0; j < sum.length; j++) {
      sum[j] += series[i].data[j];
    }
  }
  return series.reduce(function (a, b) {
    return (a.data ? a.data : a).concat(b.data).concat(sum);
  }, []);
}

function getTouches(touches, opts, e) {
  var x, y;
  if (touches.clientX) {
    if (opts.rotate) {
      y = opts.height - touches.clientX * opts.pixelRatio;
      x = (touches.pageY - e.currentTarget.offsetTop - opts.height / opts.pixelRatio / 2 * (opts.pixelRatio - 1)) *
      opts.pixelRatio;
    } else {
      x = touches.clientX * opts.pixelRatio;
      y = (touches.pageY - e.currentTarget.offsetTop - opts.height / opts.pixelRatio / 2 * (opts.pixelRatio - 1)) *
      opts.pixelRatio;
    }
  } else {
    if (opts.rotate) {
      y = opts.height - touches.x * opts.pixelRatio;
      x = touches.y * opts.pixelRatio;
    } else {
      x = touches.x * opts.pixelRatio;
      y = touches.y * opts.pixelRatio;
    }
  }
  return {
    x: x,
    y: y };

}

function getSeriesDataItem(series, index) {
  var data = [];
  for (var i = 0; i < series.length; i++) {
    var item = series[i];
    if (item.data[index] !== null && typeof item.data[index] !== 'undefined' && item.show) {
      var seriesItem = {};
      seriesItem.color = item.color;
      seriesItem.type = item.type;
      seriesItem.style = item.style;
      seriesItem.pointShape = item.pointShape;
      seriesItem.disableLegend = item.disableLegend;
      seriesItem.name = item.name;
      seriesItem.show = item.show;
      seriesItem.data = item.format ? item.format(item.data[index]) : item.data[index];
      data.push(seriesItem);
    }
  }
  return data;
}

function getMaxTextListLength(list) {
  var lengthList = list.map(function (item) {
    return measureText(item);
  });
  return Math.max.apply(null, lengthList);
}

function getRadarCoordinateSeries(length) {
  var eachAngle = 2 * Math.PI / length;
  var CoordinateSeries = [];
  for (var i = 0; i < length; i++) {
    CoordinateSeries.push(eachAngle * i);
  }

  return CoordinateSeries.map(function (item) {
    return -1 * item + Math.PI / 2;
  });
}

function getToolTipData(seriesData, calPoints, index, categories) {
  var option = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var textList = seriesData.map(function (item) {
    var titleText = [];
    if (categories) {
      titleText = categories;
    } else {
      titleText = item.data;
    }
    return {
      text: option.format ? option.format(item, titleText[index]) : item.name + ': ' + item.data,
      color: item.color };

  });
  var validCalPoints = [];
  var offset = {
    x: 0,
    y: 0 };

  for (var i = 0; i < calPoints.length; i++) {
    var points = calPoints[i];
    if (typeof points[index] !== 'undefined' && points[index] !== null) {
      validCalPoints.push(points[index]);
    }
  }
  for (var _i = 0; _i < validCalPoints.length; _i++) {
    var item = validCalPoints[_i];
    offset.x = Math.round(item.x);
    offset.y += item.y;
  }
  offset.y /= validCalPoints.length;
  return {
    textList: textList,
    offset: offset };

}

function getMixToolTipData(seriesData, calPoints, index, categories) {
  var option = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var textList = seriesData.map(function (item) {
    return {
      text: option.format ? option.format(item, categories[index]) : item.name + ': ' + item.data,
      color: item.color,
      disableLegend: item.disableLegend ? true : false };

  });
  textList = textList.filter(function (item) {
    if (item.disableLegend !== true) {
      return item;
    }
  });
  var validCalPoints = [];
  var offset = {
    x: 0,
    y: 0 };

  for (var i = 0; i < calPoints.length; i++) {
    var points = calPoints[i];
    if (typeof points[index] !== 'undefined' && points[index] !== null) {
      validCalPoints.push(points[index]);
    }
  }
  for (var _i2 = 0; _i2 < validCalPoints.length; _i2++) {
    var item = validCalPoints[_i2];
    offset.x = Math.round(item.x);
    offset.y += item.y;
  }
  offset.y /= validCalPoints.length;
  return {
    textList: textList,
    offset: offset };

}

function getCandleToolTipData(series, seriesData, calPoints, index, categories, extra) {
  var option = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
  var upColor = extra.color.upFill;
  var downColor = extra.color.downFill;
  //颜色顺序为开盘，收盘，最低，最高
  var color = [upColor, upColor, downColor, upColor];
  var textList = [];
  var text0 = {
    text: categories[index],
    color: null };

  textList.push(text0);
  seriesData.map(function (item) {
    if (index == 0) {
      if (item.data[1] - item.data[0] < 0) {
        color[1] = downColor;
      } else {
        color[1] = upColor;
      }
    } else {
      if (item.data[0] < series[index - 1][1]) {
        color[0] = downColor;
      }
      if (item.data[1] < item.data[0]) {
        color[1] = downColor;
      }
      if (item.data[2] > series[index - 1][1]) {
        color[2] = upColor;
      }
      if (item.data[3] < series[index - 1][1]) {
        color[3] = downColor;
      }
    }
    var text1 = {
      text: '开盘：' + item.data[0],
      color: color[0] };

    var text2 = {
      text: '收盘：' + item.data[1],
      color: color[1] };

    var text3 = {
      text: '最低：' + item.data[2],
      color: color[2] };

    var text4 = {
      text: '最高：' + item.data[3],
      color: color[3] };

    textList.push(text1, text2, text3, text4);
  });
  var validCalPoints = [];
  var offset = {
    x: 0,
    y: 0 };

  for (var i = 0; i < calPoints.length; i++) {
    var points = calPoints[i];
    if (typeof points[index] !== 'undefined' && points[index] !== null) {
      validCalPoints.push(points[index]);
    }
  }
  offset.x = Math.round(validCalPoints[0][0].x);
  return {
    textList: textList,
    offset: offset };

}

function filterSeries(series) {
  var tempSeries = [];
  for (var i = 0; i < series.length; i++) {
    if (series[i].show == true) {
      tempSeries.push(series[i]);
    }
  }
  return tempSeries;
}

function findCurrentIndex(currentPoints, calPoints, opts, config) {
  var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var currentIndex = -1;
  var spacing = opts.chartData.eachSpacing / 2;
  var xAxisPoints = [];
  if (calPoints.length > 0) {
    if (opts.type == 'candle') {
      for (var i = 0; i < calPoints[0].length; i++) {
        xAxisPoints.push(calPoints[0][i][0].x);
      }
    } else {
      for (var _i3 = 0; _i3 < calPoints[0].length; _i3++) {
        xAxisPoints.push(calPoints[0][_i3].x);
      }
    }
    if ((opts.type == 'line' || opts.type == 'area') && opts.xAxis.boundaryGap == 'justify') {
      spacing = opts.chartData.eachSpacing / 2;
    }
    if (!opts.categories) {
      spacing = 0;
    }
    if (isInExactChartArea(currentPoints, opts, config)) {
      xAxisPoints.forEach(function (item, index) {
        if (currentPoints.x + offset + spacing > item) {
          currentIndex = index;
        }
      });
    }
  }
  return currentIndex;
}

function findLegendIndex(currentPoints, legendData, opts) {
  var currentIndex = -1;
  if (isInExactLegendArea(currentPoints, legendData.area)) {
    var points = legendData.points;
    var index = -1;
    for (var i = 0, len = points.length; i < len; i++) {
      var item = points[i];
      for (var j = 0; j < item.length; j++) {
        index += 1;
        var area = item[j]['area'];
        if (currentPoints.x > area[0] && currentPoints.x < area[2] && currentPoints.y > area[1] && currentPoints.y < area[3]) {
          currentIndex = index;
          break;
        }
      }
    }
    return currentIndex;
  }
  return currentIndex;
}

function isInExactLegendArea(currentPoints, area) {
  return currentPoints.x > area.start.x && currentPoints.x < area.end.x && currentPoints.y > area.start.y &&
  currentPoints.y < area.end.y;
}

function isInExactChartArea(currentPoints, opts, config) {
  return currentPoints.x <= opts.width - opts.area[1] + 10 && currentPoints.x >= opts.area[3] - 10 && currentPoints.y >= opts.area[0] && currentPoints.y <= opts.height - opts.area[2];
}

function findRadarChartCurrentIndex(currentPoints, radarData, count) {
  var eachAngleArea = 2 * Math.PI / count;
  var currentIndex = -1;
  if (isInExactPieChartArea(currentPoints, radarData.center, radarData.radius)) {
    var fixAngle = function fixAngle(angle) {
      if (angle < 0) {
        angle += 2 * Math.PI;
      }
      if (angle > 2 * Math.PI) {
        angle -= 2 * Math.PI;
      }
      return angle;
    };

    var angle = Math.atan2(radarData.center.y - currentPoints.y, currentPoints.x - radarData.center.x);
    angle = -1 * angle;
    if (angle < 0) {
      angle += 2 * Math.PI;
    }

    var angleList = radarData.angleList.map(function (item) {
      item = fixAngle(-1 * item);

      return item;
    });

    angleList.forEach(function (item, index) {
      var rangeStart = fixAngle(item - eachAngleArea / 2);
      var rangeEnd = fixAngle(item + eachAngleArea / 2);
      if (rangeEnd < rangeStart) {
        rangeEnd += 2 * Math.PI;
      }
      if (angle >= rangeStart && angle <= rangeEnd || angle + 2 * Math.PI >= rangeStart && angle + 2 * Math.PI <=
      rangeEnd) {
        currentIndex = index;
      }
    });
  }

  return currentIndex;
}

function findFunnelChartCurrentIndex(currentPoints, funnelData) {
  var currentIndex = -1;
  for (var i = 0, len = funnelData.series.length; i < len; i++) {
    var item = funnelData.series[i];
    if (currentPoints.x > item.funnelArea[0] && currentPoints.x < item.funnelArea[2] && currentPoints.y > item.funnelArea[1] && currentPoints.y < item.funnelArea[3]) {
      currentIndex = i;
      break;
    }
  }
  return currentIndex;
}

function findWordChartCurrentIndex(currentPoints, wordData) {
  var currentIndex = -1;
  for (var i = 0, len = wordData.length; i < len; i++) {
    var item = wordData[i];
    if (currentPoints.x > item.area[0] && currentPoints.x < item.area[2] && currentPoints.y > item.area[1] && currentPoints.y < item.area[3]) {
      currentIndex = i;
      break;
    }
  }
  return currentIndex;
}

function findMapChartCurrentIndex(currentPoints, opts) {
  var currentIndex = -1;
  var cData = opts.chartData.mapData;
  var data = opts.series;
  var tmp = pointToCoordinate(currentPoints.y, currentPoints.x, cData.bounds, cData.scale, cData.xoffset, cData.yoffset);
  var poi = [tmp.x, tmp.y];
  for (var i = 0, len = data.length; i < len; i++) {
    var item = data[i].geometry.coordinates;
    if (isPoiWithinPoly(poi, item)) {
      currentIndex = i;
      break;
    }
  }
  return currentIndex;
}

function findPieChartCurrentIndex(currentPoints, pieData) {
  var currentIndex = -1;
  if (isInExactPieChartArea(currentPoints, pieData.center, pieData.radius)) {
    var angle = Math.atan2(pieData.center.y - currentPoints.y, currentPoints.x - pieData.center.x);
    angle = -angle;
    for (var i = 0, len = pieData.series.length; i < len; i++) {
      var item = pieData.series[i];
      if (isInAngleRange(angle, item._start_, item._start_ + item._proportion_ * 2 * Math.PI)) {
        currentIndex = i;
        break;
      }
    }
  }

  return currentIndex;
}

function isInExactPieChartArea(currentPoints, center, radius) {
  return Math.pow(currentPoints.x - center.x, 2) + Math.pow(currentPoints.y - center.y, 2) <= Math.pow(radius, 2);
}

function splitPoints(points) {
  var newPoints = [];
  var items = [];
  points.forEach(function (item, index) {
    if (item !== null) {
      items.push(item);
    } else {
      if (items.length) {
        newPoints.push(items);
      }
      items = [];
    }
  });
  if (items.length) {
    newPoints.push(items);
  }

  return newPoints;
}

function calLegendData(series, opts, config, chartData) {
  var legendData = {
    area: {
      start: {
        x: 0,
        y: 0 },

      end: {
        x: 0,
        y: 0 },

      width: 0,
      height: 0,
      wholeWidth: 0,
      wholeHeight: 0 },

    points: [],
    widthArr: [],
    heightArr: [] };

  if (opts.legend.show === false) {
    chartData.legendData = legendData;
    return legendData;
  }

  var padding = opts.legend.padding;
  var margin = opts.legend.margin;
  var fontSize = opts.legend.fontSize;
  var shapeWidth = 15 * opts.pixelRatio;
  var shapeRight = 5 * opts.pixelRatio;
  var lineHeight = Math.max(opts.legend.lineHeight * opts.pixelRatio, fontSize);
  if (opts.legend.position == 'top' || opts.legend.position == 'bottom') {
    var legendList = [];
    var widthCount = 0;
    var widthCountArr = [];
    var currentRow = [];
    for (var i = 0; i < series.length; i++) {
      var item = series[i];
      var itemWidth = shapeWidth + shapeRight + measureText(item.name || 'undefined', fontSize) + opts.legend.itemGap;
      if (widthCount + itemWidth > opts.width - opts.padding[1] - opts.padding[3]) {
        legendList.push(currentRow);
        widthCountArr.push(widthCount - opts.legend.itemGap);
        widthCount = itemWidth;
        currentRow = [item];
      } else {
        widthCount += itemWidth;
        currentRow.push(item);
      }
    }
    if (currentRow.length) {
      legendList.push(currentRow);
      widthCountArr.push(widthCount - opts.legend.itemGap);
      legendData.widthArr = widthCountArr;
      var legendWidth = Math.max.apply(null, widthCountArr);
      switch (opts.legend.float) {
        case 'left':
          legendData.area.start.x = opts.padding[3];
          legendData.area.end.x = opts.padding[3] + 2 * padding;
          break;
        case 'right':
          legendData.area.start.x = opts.width - opts.padding[1] - legendWidth - 2 * padding;
          legendData.area.end.x = opts.width - opts.padding[1];
          break;
        default:
          legendData.area.start.x = (opts.width - legendWidth) / 2 - padding;
          legendData.area.end.x = (opts.width + legendWidth) / 2 + padding;}

      legendData.area.width = legendWidth + 2 * padding;
      legendData.area.wholeWidth = legendWidth + 2 * padding;
      legendData.area.height = legendList.length * lineHeight + 2 * padding;
      legendData.area.wholeHeight = legendList.length * lineHeight + 2 * padding + 2 * margin;
      legendData.points = legendList;
    }
  } else {
    var len = series.length;
    var maxHeight = opts.height - opts.padding[0] - opts.padding[2] - 2 * margin - 2 * padding;
    var maxLength = Math.min(Math.floor(maxHeight / lineHeight), len);
    legendData.area.height = maxLength * lineHeight + padding * 2;
    legendData.area.wholeHeight = maxLength * lineHeight + padding * 2;
    switch (opts.legend.float) {
      case 'top':
        legendData.area.start.y = opts.padding[0] + margin;
        legendData.area.end.y = opts.padding[0] + margin + legendData.area.height;
        break;
      case 'bottom':
        legendData.area.start.y = opts.height - opts.padding[2] - margin - legendData.area.height;
        legendData.area.end.y = opts.height - opts.padding[2] - margin;
        break;
      default:
        legendData.area.start.y = (opts.height - legendData.area.height) / 2;
        legendData.area.end.y = (opts.height + legendData.area.height) / 2;}

    var lineNum = len % maxLength === 0 ? len / maxLength : Math.floor(len / maxLength + 1);
    var _currentRow = [];
    for (var _i4 = 0; _i4 < lineNum; _i4++) {
      var temp = series.slice(_i4 * maxLength, _i4 * maxLength + maxLength);
      _currentRow.push(temp);
    }

    legendData.points = _currentRow;

    if (_currentRow.length) {
      for (var _i5 = 0; _i5 < _currentRow.length; _i5++) {
        var _item = _currentRow[_i5];
        var maxWidth = 0;
        for (var j = 0; j < _item.length; j++) {
          var _itemWidth = shapeWidth + shapeRight + measureText(_item[j].name || 'undefined', fontSize) + opts.legend.itemGap;
          if (_itemWidth > maxWidth) {
            maxWidth = _itemWidth;
          }
        }
        legendData.widthArr.push(maxWidth);
        legendData.heightArr.push(_item.length * lineHeight + padding * 2);
      }
      var _legendWidth = 0;
      for (var _i6 = 0; _i6 < legendData.widthArr.length; _i6++) {
        _legendWidth += legendData.widthArr[_i6];
      }
      legendData.area.width = _legendWidth - opts.legend.itemGap + 2 * padding;
      legendData.area.wholeWidth = legendData.area.width + padding;
    }
  }

  switch (opts.legend.position) {
    case 'top':
      legendData.area.start.y = opts.padding[0] + margin;
      legendData.area.end.y = opts.padding[0] + margin + legendData.area.height;
      break;
    case 'bottom':
      legendData.area.start.y = opts.height - opts.padding[2] - legendData.area.height - margin;
      legendData.area.end.y = opts.height - opts.padding[2] - margin;
      break;
    case 'left':
      legendData.area.start.x = opts.padding[3];
      legendData.area.end.x = opts.padding[3] + legendData.area.width;
      break;
    case 'right':
      legendData.area.start.x = opts.width - opts.padding[1] - legendData.area.width;
      legendData.area.end.x = opts.width - opts.padding[1];
      break;}

  chartData.legendData = legendData;
  return legendData;
}

function calCategoriesData(categories, opts, config, eachSpacing) {
  var result = {
    angle: 0,
    xAxisHeight: config.xAxisHeight };

  var categoriesTextLenth = categories.map(function (item) {
    return measureText(item, opts.xAxis.fontSize || config.fontSize);
  });
  var maxTextLength = Math.max.apply(this, categoriesTextLenth);

  if (opts.xAxis.rotateLabel == true && maxTextLength + 2 * config.xAxisTextPadding > eachSpacing) {
    result.angle = 45 * Math.PI / 180;
    result.xAxisHeight = 2 * config.xAxisTextPadding + maxTextLength * Math.sin(result.angle);
  }
  return result;
}

function getXAxisTextList(series, opts, config) {
  var index = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
  var data = dataCombine(series);
  var sorted = [];
  // remove null from data
  data = data.filter(function (item) {
    //return item !== null;
    if (typeof item === 'object' && item !== null) {
      if (item.constructor.toString().indexOf('Array') > -1) {
        return item !== null;
      } else {
        return item.value !== null;
      }
    } else {
      return item !== null;
    }
  });
  data.map(function (item) {
    if (typeof item === 'object') {
      if (item.constructor.toString().indexOf('Array') > -1) {
        if (opts.type == 'candle') {
          item.map(function (subitem) {
            sorted.push(subitem);
          });
        } else {
          sorted.push(item[0]);
        }
      } else {
        sorted.push(item.value);
      }
    } else {
      sorted.push(item);
    }
  });

  var minData = 0;
  var maxData = 0;
  if (sorted.length > 0) {
    minData = Math.min.apply(this, sorted);
    maxData = Math.max.apply(this, sorted);
  }
  //为了兼容v1.9.0之前的项目
  if (index > -1) {
    if (typeof opts.xAxis.data[index].min === 'number') {
      minData = Math.min(opts.xAxis.data[index].min, minData);
    }
    if (typeof opts.xAxis.data[index].max === 'number') {
      maxData = Math.max(opts.xAxis.data[index].max, maxData);
    }
  } else {
    if (typeof opts.xAxis.min === 'number') {
      minData = Math.min(opts.xAxis.min, minData);
    }
    if (typeof opts.xAxis.max === 'number') {
      maxData = Math.max(opts.xAxis.max, maxData);
    }
  }


  if (minData === maxData) {
    var rangeSpan = maxData || 10;
    maxData += rangeSpan;
  }

  //var dataRange = getDataRange(minData, maxData);
  var minRange = minData;
  var maxRange = maxData;

  var range = [];
  var eachRange = (maxRange - minRange) / opts.xAxis.splitNumber;

  for (var i = 0; i <= opts.xAxis.splitNumber; i++) {
    range.push(minRange + eachRange * i);
  }
  return range;
}

function calXAxisData(series, opts, config) {
  var result = {
    angle: 0,
    xAxisHeight: config.xAxisHeight };


  result.ranges = getXAxisTextList(series, opts, config);
  result.rangesFormat = result.ranges.map(function (item) {
    item = opts.xAxis.format ? opts.xAxis.format(item) : util.toFixed(item, 2);
    return item;
  });

  var xAxisScaleValues = result.ranges.map(function (item) {
    // 如果刻度值是浮点数,则保留两位小数
    item = util.toFixed(item, 2);
    // 若有自定义格式则调用自定义的格式化函数
    item = opts.xAxis.format ? opts.xAxis.format(Number(item)) : item;
    return item;
  });

  result = Object.assign(result, getXAxisPoints(xAxisScaleValues, opts, config));
  // 计算X轴刻度的属性譬如每个刻度的间隔,刻度的起始点\结束点以及总长
  var eachSpacing = result.eachSpacing;

  var textLength = xAxisScaleValues.map(function (item) {
    return measureText(item);
  });

  // get max length of categories text
  var maxTextLength = Math.max.apply(this, textLength);

  // 如果刻度值文本内容过长,则将其逆时针旋转45°
  if (maxTextLength + 2 * config.xAxisTextPadding > eachSpacing) {
    result.angle = 45 * Math.PI / 180;
    result.xAxisHeight = 2 * config.xAxisTextPadding + maxTextLength * Math.sin(result.angle);
  }

  if (opts.xAxis.disabled === true) {
    result.xAxisHeight = 0;
  }

  return result;
}

function getRadarDataPoints(angleList, center, radius, series, opts) {
  var process = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;

  var radarOption = opts.extra.radar || {};
  radarOption.max = radarOption.max || 0;
  var maxData = Math.max(radarOption.max, Math.max.apply(null, dataCombine(series)));

  var data = [];var _loop2 = function _loop2(
  i) {
    var each = series[i];
    var listItem = {};
    listItem.color = each.color;
    listItem.legendShape = each.legendShape;
    listItem.pointShape = each.pointShape;
    listItem.data = [];
    each.data.forEach(function (item, index) {
      var tmp = {};
      tmp.angle = angleList[index];

      tmp.proportion = item / maxData;
      tmp.position = convertCoordinateOrigin(radius * tmp.proportion * process * Math.cos(tmp.angle), radius * tmp.proportion *
      process * Math.sin(tmp.angle), center);
      listItem.data.push(tmp);
    });

    data.push(listItem);};for (var i = 0; i < series.length; i++) {_loop2(i);
  }

  return data;
}

function getPieDataPoints(series, radius) {
  var process = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var count = 0;
  var _start_ = 0;
  for (var i = 0; i < series.length; i++) {
    var item = series[i];
    item.data = item.data === null ? 0 : item.data;
    count += item.data;
  }
  for (var _i7 = 0; _i7 < series.length; _i7++) {
    var _item2 = series[_i7];
    _item2.data = _item2.data === null ? 0 : _item2.data;
    if (count === 0) {
      _item2._proportion_ = 1 / series.length * process;
    } else {
      _item2._proportion_ = _item2.data / count * process;
    }
    _item2._radius_ = radius;
  }
  for (var _i8 = 0; _i8 < series.length; _i8++) {
    var _item3 = series[_i8];
    _item3._start_ = _start_;
    _start_ += 2 * _item3._proportion_ * Math.PI;
  }

  return series;
}

function getFunnelDataPoints(series, radius) {
  var process = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  series = series.sort(function (a, b) {return parseInt(b.data) - parseInt(a.data);});
  for (var i = 0; i < series.length; i++) {
    series[i].radius = series[i].data / series[0].data * radius * process;
    series[i]._proportion_ = series[i].data / series[0].data;
  }
  return series.reverse();
}

function getRoseDataPoints(series, type, minRadius, radius) {
  var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var count = 0;
  var _start_ = 0;

  var dataArr = [];
  for (var i = 0; i < series.length; i++) {
    var item = series[i];
    item.data = item.data === null ? 0 : item.data;
    count += item.data;
    dataArr.push(item.data);
  }

  var minData = Math.min.apply(null, dataArr);
  var maxData = Math.max.apply(null, dataArr);
  var radiusLength = radius - minRadius;

  for (var _i9 = 0; _i9 < series.length; _i9++) {
    var _item4 = series[_i9];
    _item4.data = _item4.data === null ? 0 : _item4.data;
    if (count === 0 || type == 'area') {
      _item4._proportion_ = _item4.data / count * process;
      _item4._rose_proportion_ = 1 / series.length * process;
    } else {
      _item4._proportion_ = _item4.data / count * process;
      _item4._rose_proportion_ = _item4.data / count * process;
    }
    _item4._radius_ = minRadius + radiusLength * ((_item4.data - minData) / (maxData - minData));
  }
  for (var _i10 = 0; _i10 < series.length; _i10++) {
    var _item5 = series[_i10];
    _item5._start_ = _start_;
    _start_ += 2 * _item5._rose_proportion_ * Math.PI;
  }

  return series;
}

function getArcbarDataPoints(series, arcbarOption) {
  var process = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  if (process == 1) {
    process = 0.999999;
  }
  for (var i = 0; i < series.length; i++) {
    var item = series[i];
    item.data = item.data === null ? 0 : item.data;
    var totalAngle = void 0;
    if (arcbarOption.type == 'circle') {
      totalAngle = 2;
    } else {
      if (arcbarOption.endAngle < arcbarOption.startAngle) {
        totalAngle = 2 + arcbarOption.endAngle - arcbarOption.startAngle;
      } else {
        totalAngle = arcbarOption.startAngle - arcbarOption.endAngle;
      }
    }
    item._proportion_ = totalAngle * item.data * process + arcbarOption.startAngle;
    if (item._proportion_ >= 2) {
      item._proportion_ = item._proportion_ % 2;
    }
  }
  return series;
}

function getGaugeAxisPoints(categories, startAngle, endAngle) {
  var totalAngle = startAngle - endAngle + 1;
  var tempStartAngle = startAngle;
  for (var i = 0; i < categories.length; i++) {
    categories[i].value = categories[i].value === null ? 0 : categories[i].value;
    categories[i]._startAngle_ = tempStartAngle;
    categories[i]._endAngle_ = totalAngle * categories[i].value + startAngle;
    if (categories[i]._endAngle_ >= 2) {
      categories[i]._endAngle_ = categories[i]._endAngle_ % 2;
    }
    tempStartAngle = categories[i]._endAngle_;
  }
  return categories;
}

function getGaugeDataPoints(series, categories, gaugeOption) {
  var process = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  for (var i = 0; i < series.length; i++) {
    var item = series[i];
    item.data = item.data === null ? 0 : item.data;
    if (gaugeOption.pointer.color == 'auto') {
      for (var _i11 = 0; _i11 < categories.length; _i11++) {
        if (item.data <= categories[_i11].value) {
          item.color = categories[_i11].color;
          break;
        }
      }
    } else {
      item.color = gaugeOption.pointer.color;
    }
    var totalAngle = gaugeOption.startAngle - gaugeOption.endAngle + 1;
    item._endAngle_ = totalAngle * item.data + gaugeOption.startAngle;
    item._oldAngle_ = gaugeOption.oldAngle;
    if (gaugeOption.oldAngle < gaugeOption.endAngle) {
      item._oldAngle_ += 2;
    }
    if (item.data >= gaugeOption.oldData) {
      item._proportion_ = (item._endAngle_ - item._oldAngle_) * process + gaugeOption.oldAngle;
    } else {
      item._proportion_ = item._oldAngle_ - (item._oldAngle_ - item._endAngle_) * process;
    }
    if (item._proportion_ >= 2) {
      item._proportion_ = item._proportion_ % 2;
    }
  }
  return series;
}

function getPieTextMaxLength(series) {
  series = getPieDataPoints(series);
  var maxLength = 0;
  for (var i = 0; i < series.length; i++) {
    var item = series[i];
    var text = item.format ? item.format(+item._proportion_.toFixed(2)) : util.toFixed(item._proportion_ * 100) + '%';
    maxLength = Math.max(maxLength, measureText(text));
  }

  return maxLength;
}

function fixColumeData(points, eachSpacing, columnLen, index, config, opts) {
  return points.map(function (item) {
    if (item === null) {
      return null;
    }
    item.width = Math.ceil((eachSpacing - 2 * config.columePadding) / columnLen);

    if (opts.extra.column && opts.extra.column.width && +opts.extra.column.width > 0) {
      item.width = Math.min(item.width, +opts.extra.column.width);
    }
    if (item.width <= 0) {
      item.width = 1;
    }
    item.x += (index + 0.5 - columnLen / 2) * item.width;
    return item;
  });
}

function fixColumeMeterData(points, eachSpacing, columnLen, index, config, opts, border) {
  return points.map(function (item) {
    if (item === null) {
      return null;
    }
    item.width = Math.ceil((eachSpacing - 2 * config.columePadding) / 2);

    if (opts.extra.column && opts.extra.column.width && +opts.extra.column.width > 0) {
      item.width = Math.min(item.width, +opts.extra.column.width);
    }

    if (index > 0) {
      item.width -= 2 * border;
    }
    return item;
  });
}

function fixColumeStackData(points, eachSpacing, columnLen, index, config, opts, series) {

  return points.map(function (item, indexn) {

    if (item === null) {
      return null;
    }
    item.width = Math.ceil((eachSpacing - 2 * config.columePadding) / 2);

    if (opts.extra.column && opts.extra.column.width && +opts.extra.column.width > 0) {
      item.width = Math.min(item.width, +opts.extra.column.width);
    }
    return item;
  });
}

function getXAxisPoints(categories, opts, config) {
  var spacingValid = opts.width - opts.area[1] - opts.area[3];
  var dataCount = opts.enableScroll ? Math.min(opts.xAxis.itemCount, categories.length) : categories.length;
  if ((opts.type == 'line' || opts.type == 'area') && dataCount > 1 && opts.xAxis.boundaryGap == 'justify') {
    dataCount -= 1;
  }
  var eachSpacing = spacingValid / dataCount;

  var xAxisPoints = [];
  var startX = opts.area[3];
  var endX = opts.width - opts.area[1];
  categories.forEach(function (item, index) {
    xAxisPoints.push(startX + index * eachSpacing);
  });
  if (opts.xAxis.boundaryGap !== 'justify') {
    if (opts.enableScroll === true) {
      xAxisPoints.push(startX + categories.length * eachSpacing);
    } else {
      xAxisPoints.push(endX);
    }
  }
  return {
    xAxisPoints: xAxisPoints,
    startX: startX,
    endX: endX,
    eachSpacing: eachSpacing };

}

function getCandleDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config) {
  var process = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;
  var points = [];
  var validHeight = opts.height - opts.area[0] - opts.area[2];
  data.forEach(function (item, index) {
    if (item === null) {
      points.push(null);
    } else {
      var cPoints = [];
      item.forEach(function (items, indexs) {
        var point = {};
        point.x = xAxisPoints[index] + Math.round(eachSpacing / 2);
        var value = items.value || items;
        var height = validHeight * (value - minRange) / (maxRange - minRange);
        height *= process;
        point.y = opts.height - Math.round(height) - opts.area[2];
        cPoints.push(point);
      });
      points.push(cPoints);
    }
  });

  return points;
}

function getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config) {
  var process = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;
  var boundaryGap = 'center';
  if (opts.type == 'line' || opts.type == 'area') {
    boundaryGap = opts.xAxis.boundaryGap;
  }
  var points = [];
  var validHeight = opts.height - opts.area[0] - opts.area[2];
  var validWidth = opts.width - opts.area[1] - opts.area[3];
  data.forEach(function (item, index) {
    if (item === null) {
      points.push(null);
    } else {
      var point = {};
      point.color = item.color;
      point.x = xAxisPoints[index];
      var value = item;
      if (typeof item === 'object' && item !== null) {
        if (item.constructor.toString().indexOf('Array') > -1) {
          var xranges, xminRange, xmaxRange;
          xranges = [].concat(opts.chartData.xAxisData.ranges);
          xminRange = xranges.shift();
          xmaxRange = xranges.pop();
          value = item[1];
          point.x = opts.area[3] + validWidth * (item[0] - xminRange) / (xmaxRange - xminRange);
        } else {
          value = item.value;
        }
      }
      if (boundaryGap == 'center') {
        point.x += Math.round(eachSpacing / 2);
      }
      var height = validHeight * (value - minRange) / (maxRange - minRange);
      height *= process;
      point.y = opts.height - Math.round(height) - opts.area[2];
      points.push(point);
    }
  });

  return points;
}

function getStackDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, seriesIndex, stackSeries) {
  var process = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 1;
  var points = [];
  var validHeight = opts.height - opts.area[0] - opts.area[2];

  data.forEach(function (item, index) {
    if (item === null) {
      points.push(null);
    } else {
      var point = {};
      point.color = item.color;
      point.x = xAxisPoints[index] + Math.round(eachSpacing / 2);

      if (seriesIndex > 0) {
        var value = 0;
        for (var i = 0; i <= seriesIndex; i++) {
          value += stackSeries[i].data[index];
        }
        var value0 = value - item;
        var height = validHeight * (value - minRange) / (maxRange - minRange);
        var height0 = validHeight * (value0 - minRange) / (maxRange - minRange);
      } else {
        var value = item;
        var height = validHeight * (value - minRange) / (maxRange - minRange);
        var height0 = 0;
      }
      var heightc = height0;
      height *= process;
      heightc *= process;
      point.y = opts.height - Math.round(height) - opts.area[2];
      point.y0 = opts.height - Math.round(heightc) - opts.area[2];
      points.push(point);
    }
  });

  return points;
}

function getYAxisTextList(series, opts, config, stack) {
  var index = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
  var data;
  if (stack == 'stack') {
    data = dataCombineStack(series, opts.categories.length);
  } else {
    data = dataCombine(series);
  }
  var sorted = [];
  // remove null from data
  data = data.filter(function (item) {
    //return item !== null;
    if (typeof item === 'object' && item !== null) {
      if (item.constructor.toString().indexOf('Array') > -1) {
        return item !== null;
      } else {
        return item.value !== null;
      }
    } else {
      return item !== null;
    }
  });
  data.map(function (item) {
    if (typeof item === 'object') {
      if (item.constructor.toString().indexOf('Array') > -1) {
        if (opts.type == 'candle') {
          item.map(function (subitem) {
            sorted.push(subitem);
          });
        } else {
          sorted.push(item[1]);
        }
      } else {
        sorted.push(item.value);
      }
    } else {
      sorted.push(item);
    }
  });

  var minData = 0;
  var maxData = 0;
  if (sorted.length > 0) {
    minData = Math.min.apply(this, sorted);
    maxData = Math.max.apply(this, sorted);
  }
  //为了兼容v1.9.0之前的项目
  if (index > -1) {
    if (typeof opts.yAxis.data[index].min === 'number') {
      minData = Math.min(opts.yAxis.data[index].min, minData);
    }
    if (typeof opts.yAxis.data[index].max === 'number') {
      maxData = Math.max(opts.yAxis.data[index].max, maxData);
    }
  } else {
    if (typeof opts.yAxis.min === 'number') {
      minData = Math.min(opts.yAxis.min, minData);
    }
    if (typeof opts.yAxis.max === 'number') {
      maxData = Math.max(opts.yAxis.max, maxData);
    }
  }


  if (minData === maxData) {
    var rangeSpan = maxData || 10;
    maxData += rangeSpan;
  }

  var dataRange = getDataRange(minData, maxData);
  var minRange = dataRange.minRange;
  var maxRange = dataRange.maxRange;

  var range = [];
  var eachRange = (maxRange - minRange) / opts.yAxis.splitNumber;

  for (var i = 0; i <= opts.yAxis.splitNumber; i++) {
    range.push(minRange + eachRange * i);
  }
  return range.reverse();
}

function calYAxisData(series, opts, config) {
  //堆叠图重算Y轴
  var columnstyle = assign({}, {
    type: "" },
  opts.extra.column);
  //如果是多Y轴，重新计算
  var YLength = opts.yAxis.data.length;
  var newSeries = new Array(YLength);
  if (YLength > 0) {
    for (var i = 0; i < YLength; i++) {
      newSeries[i] = [];
      for (var j = 0; j < series.length; j++) {
        if (series[j].index == i) {
          newSeries[i].push(series[j]);
        }
      }
    }
    var rangesArr = new Array(YLength);
    var rangesFormatArr = new Array(YLength);
    var yAxisWidthArr = new Array(YLength);var _loop3 = function _loop3(

    _i12) {
      var yData = opts.yAxis.data[_i12];
      //如果总开关不显示，强制每个Y轴为不显示
      if (opts.yAxis.disabled == true) {
        yData.disabled = true;
      }
      rangesArr[_i12] = getYAxisTextList(newSeries[_i12], opts, config, columnstyle.type, _i12);
      var yAxisFontSizes = yData.fontSize || config.fontSize;
      yAxisWidthArr[_i12] = { position: yData.position ? yData.position : 'left', width: 0 };
      rangesFormatArr[_i12] = rangesArr[_i12].map(function (items) {
        items = util.toFixed(items, 6);
        items = yData.format ? yData.format(Number(items)) : items;
        yAxisWidthArr[_i12].width = Math.max(yAxisWidthArr[_i12].width, measureText(items, yAxisFontSizes) + 5);
        return items;
      });
      var calibration = yData.calibration ? 4 * opts.pixelRatio : 0;
      yAxisWidthArr[_i12].width += calibration + 3 * opts.pixelRatio;
      if (yData.disabled === true) {
        yAxisWidthArr[_i12].width = 0;
      }};for (var _i12 = 0; _i12 < YLength; _i12++) {_loop3(_i12);
    }

  } else {
    var rangesArr = new Array(1);
    var rangesFormatArr = new Array(1);
    var yAxisWidthArr = new Array(1);
    rangesArr[0] = getYAxisTextList(series, opts, config, columnstyle.type);
    yAxisWidthArr[0] = { position: 'left', width: 0 };
    var yAxisFontSize = opts.yAxis.fontSize || config.fontSize;
    rangesFormatArr[0] = rangesArr[0].map(function (item) {
      item = util.toFixed(item, 6);
      item = opts.yAxis.format ? opts.yAxis.format(Number(item)) : item;
      yAxisWidthArr[0].width = Math.max(yAxisWidthArr[0].width, measureText(item, yAxisFontSize) + 5);
      return item;
    });
    yAxisWidthArr[0].width += 3 * opts.pixelRatio;
    if (opts.yAxis.disabled === true) {
      yAxisWidthArr[0] = { position: 'left', width: 0 };
      opts.yAxis.data[0] = { disabled: true };
    } else {
      opts.yAxis.data[0] = { disabled: false, position: 'left', max: opts.yAxis.max, min: opts.yAxis.min, format: opts.yAxis.format };
    }

  }

  return {
    rangesFormat: rangesFormatArr,
    ranges: rangesArr,
    yAxisWidth: yAxisWidthArr };


}

function calTooltipYAxisData(point, series, opts, config, eachSpacing) {
  var ranges = [].concat(opts.chartData.yAxisData.ranges);
  var spacingValid = opts.height - opts.area[0] - opts.area[2];
  var minAxis = opts.area[0];
  var items = [];
  for (var i = 0; i < ranges.length; i++) {
    var maxVal = ranges[i].shift();
    var minVal = ranges[i].pop();
    var item = maxVal - (maxVal - minVal) * (point - minAxis) / spacingValid;
    item = opts.yAxis.data[i].format ? opts.yAxis.data[i].format(Number(item)) : item.toFixed(0);
    items.push(String(item));
  }
  return items;
}

function calMarkLineData(points, opts) {
  var minRange, maxRange;
  var spacingValid = opts.height - opts.area[0] - opts.area[2];
  for (var i = 0; i < points.length; i++) {
    points[i].yAxisIndex = points[i].yAxisIndex ? points[i].yAxisIndex : 0;
    var range = [].concat(opts.chartData.yAxisData.ranges[points[i].yAxisIndex]);
    minRange = range.pop();
    maxRange = range.shift();
    var height = spacingValid * (points[i].value - minRange) / (maxRange - minRange);
    points[i].y = opts.height - Math.round(height) - opts.area[2];
  }
  return points;
}

function contextRotate(context, opts) {
  if (opts.rotateLock !== true) {
    context.translate(opts.height, 0);
    context.rotate(90 * Math.PI / 180);
  } else if (opts._rotate_ !== true) {
    context.translate(opts.height, 0);
    context.rotate(90 * Math.PI / 180);
    opts._rotate_ = true;
  }
}

function drawPointShape(points, color, shape, context, opts) {
  context.beginPath();
  if (opts.dataPointShapeType == 'hollow') {
    context.setStrokeStyle(color);
    context.setFillStyle(opts.background);
    context.setLineWidth(2 * opts.pixelRatio);
  } else {
    context.setStrokeStyle("#ffffff");
    context.setFillStyle(color);
    context.setLineWidth(1 * opts.pixelRatio);
  }
  if (shape === 'diamond') {
    points.forEach(function (item, index) {
      if (item !== null) {
        context.moveTo(item.x, item.y - 4.5);
        context.lineTo(item.x - 4.5, item.y);
        context.lineTo(item.x, item.y + 4.5);
        context.lineTo(item.x + 4.5, item.y);
        context.lineTo(item.x, item.y - 4.5);
      }
    });
  } else if (shape === 'circle') {
    points.forEach(function (item, index) {
      if (item !== null) {
        context.moveTo(item.x + 2.5 * opts.pixelRatio, item.y);
        context.arc(item.x, item.y, 3 * opts.pixelRatio, 0, 2 * Math.PI, false);
      }
    });
  } else if (shape === 'rect') {
    points.forEach(function (item, index) {
      if (item !== null) {
        context.moveTo(item.x - 3.5, item.y - 3.5);
        context.rect(item.x - 3.5, item.y - 3.5, 7, 7);
      }
    });
  } else if (shape === 'triangle') {
    points.forEach(function (item, index) {
      if (item !== null) {
        context.moveTo(item.x, item.y - 4.5);
        context.lineTo(item.x - 4.5, item.y + 4.5);
        context.lineTo(item.x + 4.5, item.y + 4.5);
        context.lineTo(item.x, item.y - 4.5);
      }
    });
  }
  context.closePath();
  context.fill();
  context.stroke();
}

function drawRingTitle(opts, config, context, center) {
  var titlefontSize = opts.title.fontSize || config.titleFontSize;
  var subtitlefontSize = opts.subtitle.fontSize || config.subtitleFontSize;
  var title = opts.title.name || '';
  var subtitle = opts.subtitle.name || '';
  var titleFontColor = opts.title.color || config.titleColor;
  var subtitleFontColor = opts.subtitle.color || config.subtitleColor;
  var titleHeight = title ? titlefontSize : 0;
  var subtitleHeight = subtitle ? subtitlefontSize : 0;
  var margin = 5;

  if (subtitle) {
    var textWidth = measureText(subtitle, subtitlefontSize);
    var startX = center.x - textWidth / 2 + (opts.subtitle.offsetX || 0);
    var startY = center.y + subtitlefontSize / 2 + (opts.subtitle.offsetY || 0);
    if (title) {
      startY += (titleHeight + margin) / 2;
    }
    context.beginPath();
    context.setFontSize(subtitlefontSize);
    context.setFillStyle(subtitleFontColor);
    context.fillText(subtitle, startX, startY);
    context.closePath();
    context.stroke();
  }
  if (title) {
    var _textWidth = measureText(title, titlefontSize);
    var _startX = center.x - _textWidth / 2 + (opts.title.offsetX || 0);
    var _startY = center.y + titlefontSize / 2 + (opts.title.offsetY || 0);
    if (subtitle) {
      _startY -= (subtitleHeight + margin) / 2;
    }
    context.beginPath();
    context.setFontSize(titlefontSize);
    context.setFillStyle(titleFontColor);
    context.fillText(title, _startX, _startY);
    context.closePath();
    context.stroke();
  }
}

function drawPointText(points, series, config, context) {
  // 绘制数据文案
  var data = series.data;
  points.forEach(function (item, index) {
    if (item !== null) {
      //var formatVal = series.format ? series.format(data[index]) : data[index];
      context.beginPath();
      context.setFontSize(series.textSize || config.fontSize);
      context.setFillStyle(series.textColor || '#666666');
      var value = data[index];
      if (typeof data[index] === 'object' && data[index] !== null) {
        if (data[index].constructor == Array) {
          value = data[index][1];
        } else {
          value = data[index].value;
        }
      }
      var formatVal = series.format ? series.format(value) : value;
      context.fillText(String(formatVal), item.x - measureText(formatVal, series.textSize || config.fontSize) / 2, item.y - 4);
      context.closePath();
      context.stroke();
    }
  });

}

function drawGaugeLabel(gaugeOption, radius, centerPosition, opts, config, context) {
  radius -= gaugeOption.width / 2 + config.gaugeLabelTextMargin;

  var totalAngle = gaugeOption.startAngle - gaugeOption.endAngle + 1;
  var splitAngle = totalAngle / gaugeOption.splitLine.splitNumber;
  var totalNumber = gaugeOption.endNumber - gaugeOption.startNumber;
  var splitNumber = totalNumber / gaugeOption.splitLine.splitNumber;
  var nowAngle = gaugeOption.startAngle;
  var nowNumber = gaugeOption.startNumber;
  for (var i = 0; i < gaugeOption.splitLine.splitNumber + 1; i++) {
    var pos = {
      x: radius * Math.cos(nowAngle * Math.PI),
      y: radius * Math.sin(nowAngle * Math.PI) };

    var labelText = gaugeOption.labelFormat ? gaugeOption.labelFormat(nowNumber) : nowNumber;
    pos.x += centerPosition.x - measureText(labelText) / 2;
    pos.y += centerPosition.y;
    var startX = pos.x;
    var startY = pos.y;
    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle(gaugeOption.labelColor || '#666666');
    context.fillText(labelText, startX, startY + config.fontSize / 2);
    context.closePath();
    context.stroke();

    nowAngle += splitAngle;
    if (nowAngle >= 2) {
      nowAngle = nowAngle % 2;
    }
    nowNumber += splitNumber;
  }

}

function drawRadarLabel(angleList, radius, centerPosition, opts, config, context) {
  var radarOption = opts.extra.radar || {};
  radius += config.radarLabelTextMargin;

  angleList.forEach(function (angle, index) {
    var pos = {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle) };

    var posRelativeCanvas = convertCoordinateOrigin(pos.x, pos.y, centerPosition);
    var startX = posRelativeCanvas.x;
    var startY = posRelativeCanvas.y;
    if (util.approximatelyEqual(pos.x, 0)) {
      startX -= measureText(opts.categories[index] || '') / 2;
    } else if (pos.x < 0) {
      startX -= measureText(opts.categories[index] || '');
    }
    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle(radarOption.labelColor || '#666666');
    context.fillText(opts.categories[index] || '', startX, startY + config.fontSize / 2);
    context.closePath();
    context.stroke();
  });

}

function drawPieText(series, opts, config, context, radius, center) {
  var lineRadius = config.pieChartLinePadding;
  var textObjectCollection = [];
  var lastTextObject = null;

  var seriesConvert = series.map(function (item) {
    var text = item.format ? item.format(+item._proportion_.toFixed(2)) : util.toFixed(item._proportion_.toFixed(4) * 100) + '%';
    if (item._rose_proportion_) item._proportion_ = item._rose_proportion_;
    var arc = 2 * Math.PI - (item._start_ + 2 * Math.PI * item._proportion_ / 2);
    var color = item.color;
    var radius = item._radius_;
    return {
      arc: arc,
      text: text,
      color: color,
      radius: radius,
      textColor: item.textColor,
      textSize: item.textSize };

  });
  for (var i = 0; i < seriesConvert.length; i++) {
    var item = seriesConvert[i];
    // line end
    var orginX1 = Math.cos(item.arc) * (item.radius + lineRadius);
    var orginY1 = Math.sin(item.arc) * (item.radius + lineRadius);

    // line start
    var orginX2 = Math.cos(item.arc) * item.radius;
    var orginY2 = Math.sin(item.arc) * item.radius;

    // text start
    var orginX3 = orginX1 >= 0 ? orginX1 + config.pieChartTextPadding : orginX1 - config.pieChartTextPadding;
    var orginY3 = orginY1;
    var textWidth = measureText(item.text, item.textSize || config.fontSize);
    var startY = orginY3;

    if (lastTextObject && util.isSameXCoordinateArea(lastTextObject.start, {
      x: orginX3 }))
    {
      if (orginX3 > 0) {
        startY = Math.min(orginY3, lastTextObject.start.y);
      } else if (orginX1 < 0) {
        startY = Math.max(orginY3, lastTextObject.start.y);
      } else {
        if (orginY3 > 0) {
          startY = Math.max(orginY3, lastTextObject.start.y);
        } else {
          startY = Math.min(orginY3, lastTextObject.start.y);
        }
      }
    }
    if (orginX3 < 0) {
      orginX3 -= textWidth;
    }

    var textObject = {
      lineStart: {
        x: orginX2,
        y: orginY2 },

      lineEnd: {
        x: orginX1,
        y: orginY1 },

      start: {
        x: orginX3,
        y: startY },

      width: textWidth,
      height: config.fontSize,
      text: item.text,
      color: item.color,
      textColor: item.textColor,
      textSize: item.textSize };

    lastTextObject = avoidCollision(textObject, lastTextObject);
    textObjectCollection.push(lastTextObject);
  }

  for (var _i13 = 0; _i13 < textObjectCollection.length; _i13++) {
    var _item6 = textObjectCollection[_i13];
    var lineStartPoistion = convertCoordinateOrigin(_item6.lineStart.x, _item6.lineStart.y, center);
    var lineEndPoistion = convertCoordinateOrigin(_item6.lineEnd.x, _item6.lineEnd.y, center);
    var textPosition = convertCoordinateOrigin(_item6.start.x, _item6.start.y, center);
    context.setLineWidth(1 * opts.pixelRatio);
    context.setFontSize(config.fontSize);
    context.beginPath();
    context.setStrokeStyle(_item6.color);
    context.setFillStyle(_item6.color);
    context.moveTo(lineStartPoistion.x, lineStartPoistion.y);
    var curveStartX = _item6.start.x < 0 ? textPosition.x + _item6.width : textPosition.x;
    var textStartX = _item6.start.x < 0 ? textPosition.x - 5 : textPosition.x + 5;
    context.quadraticCurveTo(lineEndPoistion.x, lineEndPoistion.y, curveStartX, textPosition.y);
    context.moveTo(lineStartPoistion.x, lineStartPoistion.y);
    context.stroke();
    context.closePath();
    context.beginPath();
    context.moveTo(textPosition.x + _item6.width, textPosition.y);
    context.arc(curveStartX, textPosition.y, 2, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.beginPath();
    context.setFontSize(_item6.textSize || config.fontSize);
    context.setFillStyle(_item6.textColor || '#666666');
    context.fillText(_item6.text, textStartX, textPosition.y + 3);
    context.closePath();
    context.stroke();
    context.closePath();
  }
}

function drawToolTipSplitLine(offsetX, opts, config, context) {
  var toolTipOption = opts.extra.tooltip || {};
  toolTipOption.gridType = toolTipOption.gridType == undefined ? 'solid' : toolTipOption.gridType;
  toolTipOption.dashLength = toolTipOption.dashLength == undefined ? 4 : toolTipOption.dashLength;
  var startY = opts.area[0];
  var endY = opts.height - opts.area[2];

  if (toolTipOption.gridType == 'dash') {
    context.setLineDash([toolTipOption.dashLength, toolTipOption.dashLength]);
  }
  context.setStrokeStyle(toolTipOption.gridColor || '#cccccc');
  context.setLineWidth(1 * opts.pixelRatio);
  context.beginPath();
  context.moveTo(offsetX, startY);
  context.lineTo(offsetX, endY);
  context.stroke();
  context.setLineDash([]);

  if (toolTipOption.xAxisLabel) {
    var labelText = opts.categories[opts.tooltip.index];
    context.setFontSize(config.fontSize);
    var textWidth = measureText(labelText, config.fontSize);

    var textX = offsetX - 0.5 * textWidth;
    var textY = endY;
    context.beginPath();
    context.setFillStyle(hexToRgb(toolTipOption.labelBgColor || config.toolTipBackground, toolTipOption.labelBgOpacity || config.toolTipOpacity));
    context.setStrokeStyle(toolTipOption.labelBgColor || config.toolTipBackground);
    context.setLineWidth(1 * opts.pixelRatio);
    context.rect(textX - config.toolTipPadding, textY, textWidth + 2 * config.toolTipPadding, config.fontSize + 2 * config.toolTipPadding);
    context.closePath();
    context.stroke();
    context.fill();

    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle(toolTipOption.labelFontColor || config.fontColor);
    context.fillText(String(labelText), textX, textY + config.toolTipPadding + config.fontSize);
    context.closePath();
    context.stroke();
  }
}

function drawMarkLine(opts, config, context) {
  var markLineOption = assign({}, {
    type: 'solid',
    dashLength: 4,
    data: [] },
  opts.extra.markLine);
  var startX = opts.area[3];
  var endX = opts.width - opts.area[1];
  var points = calMarkLineData(markLineOption.data, opts);

  for (var i = 0; i < points.length; i++) {
    var item = assign({}, {
      lineColor: '#DE4A42',
      showLabel: false,
      labelFontColor: '#666666',
      labelBgColor: '#DFE8FF',
      labelBgOpacity: 0.8,
      yAxisIndex: 0 },
    points[i]);

    if (markLineOption.type == 'dash') {
      context.setLineDash([markLineOption.dashLength, markLineOption.dashLength]);
    }
    context.setStrokeStyle(item.lineColor);
    context.setLineWidth(1 * opts.pixelRatio);
    context.beginPath();
    context.moveTo(startX, item.y);
    context.lineTo(endX, item.y);
    context.stroke();
    context.setLineDash([]);
    if (item.showLabel) {
      var labelText = opts.yAxis.format ? opts.yAxis.format(Number(item.value)) : item.value;
      context.setFontSize(config.fontSize);
      var textWidth = measureText(labelText, config.fontSize);
      var bgStartX = opts.padding[3] + config.yAxisTitleWidth - config.toolTipPadding;
      var bgEndX = Math.max(opts.area[3], textWidth + config.toolTipPadding * 2);
      var bgWidth = bgEndX - bgStartX;

      var textX = bgStartX + (bgWidth - textWidth) / 2;
      var textY = item.y;
      context.setFillStyle(hexToRgb(item.labelBgColor, item.labelBgOpacity));
      context.setStrokeStyle(item.labelBgColor);
      context.setLineWidth(1 * opts.pixelRatio);
      context.beginPath();
      context.rect(bgStartX, textY - 0.5 * config.fontSize - config.toolTipPadding, bgWidth, config.fontSize + 2 * config.toolTipPadding);
      context.closePath();
      context.stroke();
      context.fill();

      context.beginPath();
      context.setFontSize(config.fontSize);
      context.setFillStyle(item.labelFontColor);
      context.fillText(String(labelText), textX, textY + 0.5 * config.fontSize);
      context.stroke();
    }
  }
}

function drawToolTipHorizentalLine(opts, config, context, eachSpacing, xAxisPoints) {
  var toolTipOption = assign({}, {
    gridType: 'solid',
    dashLength: 4 },
  opts.extra.tooltip);

  var startX = opts.area[3];
  var endX = opts.width - opts.area[1];

  if (toolTipOption.gridType == 'dash') {
    context.setLineDash([toolTipOption.dashLength, toolTipOption.dashLength]);
  }
  context.setStrokeStyle(toolTipOption.gridColor || '#cccccc');
  context.setLineWidth(1 * opts.pixelRatio);
  context.beginPath();
  context.moveTo(startX, opts.tooltip.offset.y);
  context.lineTo(endX, opts.tooltip.offset.y);
  context.stroke();
  context.setLineDash([]);

  if (toolTipOption.yAxisLabel) {
    var labelText = calTooltipYAxisData(opts.tooltip.offset.y, opts.series, opts, config, eachSpacing);
    var widthArr = opts.chartData.yAxisData.yAxisWidth;
    var tStartLeft = opts.area[3];
    var tStartRight = opts.width - opts.area[1];
    for (var i = 0; i < labelText.length; i++) {
      context.setFontSize(config.fontSize);
      var textWidth = measureText(labelText[i], config.fontSize);
      var bgStartX = void 0,bgEndX = void 0,bgWidth = void 0;
      if (widthArr[i].position == 'left') {
        bgStartX = tStartLeft - widthArr[i].width;
        bgEndX = Math.max(bgStartX, bgStartX + textWidth + config.toolTipPadding * 2);
      } else {
        bgStartX = tStartRight;
        bgEndX = Math.max(bgStartX + widthArr[i].width, bgStartX + textWidth + config.toolTipPadding * 2);
      }
      bgWidth = bgEndX - bgStartX;

      var textX = bgStartX + (bgWidth - textWidth) / 2;
      var textY = opts.tooltip.offset.y;
      context.beginPath();
      context.setFillStyle(hexToRgb(toolTipOption.labelBgColor || config.toolTipBackground, toolTipOption.labelBgOpacity || config.toolTipOpacity));
      context.setStrokeStyle(toolTipOption.labelBgColor || config.toolTipBackground);
      context.setLineWidth(1 * opts.pixelRatio);
      context.rect(bgStartX, textY - 0.5 * config.fontSize - config.toolTipPadding, bgWidth, config.fontSize + 2 * config.toolTipPadding);
      context.closePath();
      context.stroke();
      context.fill();

      context.beginPath();
      context.setFontSize(config.fontSize);
      context.setFillStyle(toolTipOption.labelFontColor || config.fontColor);
      context.fillText(labelText[i], textX, textY + 0.5 * config.fontSize);
      context.closePath();
      context.stroke();
      if (widthArr[i].position == 'left') {
        tStartLeft -= widthArr[i].width + opts.yAxis.padding;
      } else {
        tStartRight += widthArr[i].width + opts.yAxis.padding;
      }
    }
  }
}

function drawToolTipSplitArea(offsetX, opts, config, context, eachSpacing) {
  var toolTipOption = assign({}, {
    activeBgColor: '#000000',
    activeBgOpacity: 0.08 },
  opts.extra.tooltip);
  var startY = opts.area[0];
  var endY = opts.height - opts.area[2];
  context.beginPath();
  context.setFillStyle(hexToRgb(toolTipOption.activeBgColor, toolTipOption.activeBgOpacity));
  context.rect(offsetX - eachSpacing / 2, startY, eachSpacing, endY - startY);
  context.closePath();
  context.fill();
}

function drawToolTip(textList, offset, opts, config, context, eachSpacing, xAxisPoints) {
  var toolTipOption = assign({}, {
    showBox: true,
    bgColor: '#000000',
    bgOpacity: 0.7,
    fontColor: '#FFFFFF' },
  opts.extra.tooltip);
  var legendWidth = 4 * opts.pixelRatio;
  var legendMarginRight = 5 * opts.pixelRatio;
  var arrowWidth = 8 * opts.pixelRatio;
  var isOverRightBorder = false;
  if (opts.type == 'line' || opts.type == 'area' || opts.type == 'candle' || opts.type == 'mix') {
    drawToolTipSplitLine(opts.tooltip.offset.x, opts, config, context);
  }

  offset = assign({
    x: 0,
    y: 0 },
  offset);
  offset.y -= 8 * opts.pixelRatio;
  var textWidth = textList.map(function (item) {
    return measureText(item.text, config.fontSize);
  });
  var toolTipWidth = legendWidth + legendMarginRight + 4 * config.toolTipPadding + Math.max.apply(null, textWidth);
  var toolTipHeight = 2 * config.toolTipPadding + textList.length * config.toolTipLineHeight;

  if (toolTipOption.showBox == false) {return;}
  // if beyond the right border
  if (offset.x - Math.abs(opts._scrollDistance_) + arrowWidth + toolTipWidth > opts.width) {
    isOverRightBorder = true;
  }
  if (toolTipHeight + offset.y > opts.height) {
    offset.y = opts.height - toolTipHeight;
  }
  // draw background rect
  context.beginPath();
  context.setFillStyle(hexToRgb(toolTipOption.bgColor || config.toolTipBackground, toolTipOption.bgOpacity || config.toolTipOpacity));
  if (isOverRightBorder) {
    context.moveTo(offset.x, offset.y + 10 * opts.pixelRatio);
    context.lineTo(offset.x - arrowWidth, offset.y + 10 * opts.pixelRatio - 5 * opts.pixelRatio);
    context.lineTo(offset.x - arrowWidth, offset.y);
    context.lineTo(offset.x - arrowWidth - Math.round(toolTipWidth), offset.y);
    context.lineTo(offset.x - arrowWidth - Math.round(toolTipWidth), offset.y + toolTipHeight);
    context.lineTo(offset.x - arrowWidth, offset.y + toolTipHeight);
    context.lineTo(offset.x - arrowWidth, offset.y + 10 * opts.pixelRatio + 5 * opts.pixelRatio);
    context.lineTo(offset.x, offset.y + 10 * opts.pixelRatio);
  } else {
    context.moveTo(offset.x, offset.y + 10 * opts.pixelRatio);
    context.lineTo(offset.x + arrowWidth, offset.y + 10 * opts.pixelRatio - 5 * opts.pixelRatio);
    context.lineTo(offset.x + arrowWidth, offset.y);
    context.lineTo(offset.x + arrowWidth + Math.round(toolTipWidth), offset.y);
    context.lineTo(offset.x + arrowWidth + Math.round(toolTipWidth), offset.y + toolTipHeight);
    context.lineTo(offset.x + arrowWidth, offset.y + toolTipHeight);
    context.lineTo(offset.x + arrowWidth, offset.y + 10 * opts.pixelRatio + 5 * opts.pixelRatio);
    context.lineTo(offset.x, offset.y + 10 * opts.pixelRatio);
  }

  context.closePath();
  context.fill();

  // draw legend
  textList.forEach(function (item, index) {
    if (item.color !== null) {
      context.beginPath();
      context.setFillStyle(item.color);
      var startX = offset.x + arrowWidth + 2 * config.toolTipPadding;
      var startY = offset.y + (config.toolTipLineHeight - config.fontSize) / 2 + config.toolTipLineHeight * index +
      config.toolTipPadding + 1;
      if (isOverRightBorder) {
        startX = offset.x - toolTipWidth - arrowWidth + 2 * config.toolTipPadding;
      }
      context.fillRect(startX, startY, legendWidth, config.fontSize);
      context.closePath();
    }
  });

  // draw text list

  textList.forEach(function (item, index) {
    var startX = offset.x + arrowWidth + 2 * config.toolTipPadding + legendWidth + legendMarginRight;
    if (isOverRightBorder) {
      startX = offset.x - toolTipWidth - arrowWidth + 2 * config.toolTipPadding + +legendWidth + legendMarginRight;
    }
    var startY = offset.y + (config.toolTipLineHeight - config.fontSize) / 2 + config.toolTipLineHeight * index +
    config.toolTipPadding;
    context.beginPath();
    context.setFontSize(config.fontSize);
    context.setFillStyle(toolTipOption.fontColor);
    context.fillText(item.text, startX, startY + config.fontSize);
    context.closePath();
    context.stroke();
  });
}

function drawYAxisTitle(title, opts, config, context) {
  var startX = config.xAxisHeight + (opts.height - config.xAxisHeight - measureText(title)) / 2;
  context.save();
  context.beginPath();
  context.setFontSize(config.fontSize);
  context.setFillStyle(opts.yAxis.titleFontColor || '#333333');
  context.translate(0, opts.height);
  context.rotate(-90 * Math.PI / 180);
  context.fillText(title, startX, opts.padding[3] + 0.5 * config.fontSize);
  context.closePath();
  context.stroke();
  context.restore();
}

function drawColumnDataPoints(series, opts, config, context) {
  var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var xAxisData = opts.chartData.xAxisData,
  xAxisPoints = xAxisData.xAxisPoints,
  eachSpacing = xAxisData.eachSpacing;
  var columnOption = assign({}, {
    type: 'group',
    width: eachSpacing / 2,
    meter: {
      border: 4,
      fillColor: '#FFFFFF' } },

  opts.extra.column);

  var calPoints = [];
  context.save();

  var leftNum = -2;
  var rightNum = xAxisPoints.length + 2;

  if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
    context.translate(opts._scrollDistance_, 0);
    leftNum = Math.floor(-opts._scrollDistance_ / eachSpacing) - 2;
    rightNum = leftNum + opts.xAxis.itemCount + 4;
  }
  if (opts.tooltip && opts.tooltip.textList && opts.tooltip.textList.length && process === 1) {
    drawToolTipSplitArea(opts.tooltip.offset.x, opts, config, context, eachSpacing);
  }

  series.forEach(function (eachSeries, seriesIndex) {
    var ranges, minRange, maxRange;
    ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
    minRange = ranges.pop();
    maxRange = ranges.shift();

    var data = eachSeries.data;
    switch (columnOption.type) {
      case 'group':
        var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
        var tooltipPoints = getStackDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, seriesIndex, series, process);
        calPoints.push(tooltipPoints);
        points = fixColumeData(points, eachSpacing, series.length, seriesIndex, config, opts);
        for (var i = 0; i < points.length; i++) {
          var item = points[i];
          if (item !== null && i > leftNum && i < rightNum) {
            context.beginPath();
            context.setStrokeStyle(item.color || eachSeries.color);
            context.setLineWidth(1);
            context.setFillStyle(item.color || eachSeries.color);
            var startX = item.x - item.width / 2;
            var height = opts.height - item.y - opts.area[2];
            context.moveTo(startX, item.y);
            context.lineTo(startX + item.width - 2, item.y);
            context.lineTo(startX + item.width - 2, opts.height - opts.area[2]);
            context.lineTo(startX, opts.height - opts.area[2]);
            context.lineTo(startX, item.y);
            context.closePath();
            context.stroke();
            context.fill();
          }
        };
        break;
      case 'stack':
        // 绘制堆叠数据图
        var points = getStackDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, seriesIndex, series, process);
        calPoints.push(points);
        points = fixColumeStackData(points, eachSpacing, series.length, seriesIndex, config, opts, series);

        for (var _i14 = 0; _i14 < points.length; _i14++) {
          var _item7 = points[_i14];
          if (_item7 !== null && _i14 > leftNum && _i14 < rightNum) {
            context.beginPath();
            context.setFillStyle(_item7.color || eachSeries.color);
            var startX = _item7.x - _item7.width / 2 + 1;
            var height = opts.height - _item7.y - opts.area[2];
            var height0 = opts.height - _item7.y0 - opts.area[2];
            if (seriesIndex > 0) {
              height -= height0;
            }
            context.moveTo(startX, _item7.y);
            context.fillRect(startX, _item7.y, _item7.width - 2, height);
            context.closePath();
            context.fill();
          }
        };
        break;
      case 'meter':
        // 绘制温度计数据图
        var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
        calPoints.push(points);
        points = fixColumeMeterData(points, eachSpacing, series.length, seriesIndex, config, opts, columnOption.meter.border);
        if (seriesIndex == 0) {
          for (var _i15 = 0; _i15 < points.length; _i15++) {
            var _item8 = points[_i15];
            if (_item8 !== null && _i15 > leftNum && _i15 < rightNum) {
              //画背景颜色
              context.beginPath();
              context.setFillStyle(columnOption.meter.fillColor);
              var startX = _item8.x - _item8.width / 2;
              var height = opts.height - _item8.y - opts.area[2];
              context.moveTo(startX, _item8.y);
              context.fillRect(startX, _item8.y, _item8.width, height);
              context.closePath();
              context.fill();
              //画边框线
              if (columnOption.meter.border > 0) {
                context.beginPath();
                context.setStrokeStyle(eachSeries.color);
                context.setLineWidth(columnOption.meter.border * opts.pixelRatio);
                context.moveTo(startX + columnOption.meter.border * 0.5, _item8.y + height);
                context.lineTo(startX + columnOption.meter.border * 0.5, _item8.y + columnOption.meter.border * 0.5);
                context.lineTo(startX + _item8.width - columnOption.meter.border * 0.5, _item8.y + columnOption.meter.border * 0.5);
                context.lineTo(startX + _item8.width - columnOption.meter.border * 0.5, _item8.y + height);
                context.stroke();
              }
            }
          };
        } else {
          for (var _i16 = 0; _i16 < points.length; _i16++) {
            var _item9 = points[_i16];
            if (_item9 !== null && _i16 > leftNum && _i16 < rightNum) {
              context.beginPath();
              context.setFillStyle(_item9.color || eachSeries.color);
              var startX = _item9.x - _item9.width / 2;
              var height = opts.height - _item9.y - opts.area[2];
              context.moveTo(startX, _item9.y);
              context.fillRect(startX, _item9.y, _item9.width, height);
              context.closePath();
              context.fill();
            }
          };
        }
        break;}

  });

  if (opts.dataLabel !== false && process === 1) {
    series.forEach(function (eachSeries, seriesIndex) {
      var ranges, minRange, maxRange;
      ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
      minRange = ranges.pop();
      maxRange = ranges.shift();
      var data = eachSeries.data;
      switch (columnOption.type) {
        case 'group':
          var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
          points = fixColumeData(points, eachSpacing, series.length, seriesIndex, config, opts);
          drawPointText(points, eachSeries, config, context);
          break;
        case 'stack':
          var points = getStackDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, seriesIndex, series, process);
          drawPointText(points, eachSeries, config, context);
          break;
        case 'meter':
          var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
          drawPointText(points, eachSeries, config, context);
          break;}

    });
  }

  context.restore();

  return {
    xAxisPoints: xAxisPoints,
    calPoints: calPoints,
    eachSpacing: eachSpacing };

}

function drawCandleDataPoints(series, seriesMA, opts, config, context) {
  var process = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
  var candleOption = assign({}, {
    color: {},
    average: {} },
  opts.extra.candle);
  candleOption.color = assign({}, {
    upLine: '#f04864',
    upFill: '#f04864',
    downLine: '#2fc25b',
    downFill: '#2fc25b' },
  candleOption.color);
  candleOption.average = assign({}, {
    show: false,
    name: [],
    day: [],
    color: config.colors },
  candleOption.average);
  opts.extra.candle = candleOption;

  var xAxisData = opts.chartData.xAxisData,
  xAxisPoints = xAxisData.xAxisPoints,
  eachSpacing = xAxisData.eachSpacing;

  var calPoints = [];

  context.save();

  var leftNum = -2;
  var rightNum = xAxisPoints.length + 2;
  var leftSpace = 0;
  var rightSpace = opts.width + eachSpacing;

  if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
    context.translate(opts._scrollDistance_, 0);
    leftNum = Math.floor(-opts._scrollDistance_ / eachSpacing) - 2;
    rightNum = leftNum + opts.xAxis.itemCount + 4;
    leftSpace = -opts._scrollDistance_ - eachSpacing + opts.area[3];
    rightSpace = leftSpace + (opts.xAxis.itemCount + 4) * eachSpacing;
  }

  //画均线
  if (candleOption.average.show) {
    seriesMA.forEach(function (eachSeries, seriesIndex) {
      var ranges, minRange, maxRange;
      ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
      minRange = ranges.pop();
      maxRange = ranges.shift();

      var data = eachSeries.data;
      var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
      var splitPointList = splitPoints(points);

      for (var i = 0; i < splitPointList.length; i++) {
        var _points = splitPointList[i];
        context.beginPath();
        context.setStrokeStyle(eachSeries.color);
        context.setLineWidth(1);
        if (_points.length === 1) {
          context.moveTo(_points[0].x, _points[0].y);
          context.arc(_points[0].x, _points[0].y, 1, 0, 2 * Math.PI);
        } else {
          context.moveTo(_points[0].x, _points[0].y);
          var startPoint = 0;
          for (var j = 0; j < _points.length; j++) {
            var item = _points[j];
            if (startPoint == 0 && item.x > leftSpace) {
              context.moveTo(item.x, item.y);
              startPoint = 1;
            }
            if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
              var ctrlPoint = createCurveControlPoints(_points, j - 1);
              context.bezierCurveTo(ctrlPoint.ctrA.x, ctrlPoint.ctrA.y, ctrlPoint.ctrB.x, ctrlPoint.ctrB.y, item.x, item.y);
            }
          }
          context.moveTo(_points[0].x, _points[0].y);
        }
        context.closePath();
        context.stroke();
      }
    });
  }
  //画K线
  series.forEach(function (eachSeries, seriesIndex) {
    var ranges, minRange, maxRange;
    ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
    minRange = ranges.pop();
    maxRange = ranges.shift();
    var data = eachSeries.data;
    var points = getCandleDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
    calPoints.push(points);
    var splitPointList = splitPoints(points);

    for (var i = 0; i < splitPointList[0].length; i++) {
      if (i > leftNum && i < rightNum) {
        var item = splitPointList[0][i];
        context.beginPath();
        //如果上涨
        if (data[i][1] - data[i][0] > 0) {
          context.setStrokeStyle(candleOption.color.upLine);
          context.setFillStyle(candleOption.color.upFill);
          context.setLineWidth(1 * opts.pixelRatio);
          context.moveTo(item[3].x, item[3].y); //顶点
          context.lineTo(item[1].x, item[1].y); //收盘中间点
          context.lineTo(item[1].x - eachSpacing / 4, item[1].y); //收盘左侧点
          context.lineTo(item[0].x - eachSpacing / 4, item[0].y); //开盘左侧点
          context.lineTo(item[0].x, item[0].y); //开盘中间点
          context.lineTo(item[2].x, item[2].y); //底点
          context.lineTo(item[0].x, item[0].y); //开盘中间点
          context.lineTo(item[0].x + eachSpacing / 4, item[0].y); //开盘右侧点
          context.lineTo(item[1].x + eachSpacing / 4, item[1].y); //收盘右侧点
          context.lineTo(item[1].x, item[1].y); //收盘中间点
          context.moveTo(item[3].x, item[3].y); //顶点
        } else {
          context.setStrokeStyle(candleOption.color.downLine);
          context.setFillStyle(candleOption.color.downFill);
          context.setLineWidth(1 * opts.pixelRatio);
          context.moveTo(item[3].x, item[3].y); //顶点
          context.lineTo(item[0].x, item[0].y); //开盘中间点
          context.lineTo(item[0].x - eachSpacing / 4, item[0].y); //开盘左侧点
          context.lineTo(item[1].x - eachSpacing / 4, item[1].y); //收盘左侧点
          context.lineTo(item[1].x, item[1].y); //收盘中间点
          context.lineTo(item[2].x, item[2].y); //底点
          context.lineTo(item[1].x, item[1].y); //收盘中间点
          context.lineTo(item[1].x + eachSpacing / 4, item[1].y); //收盘右侧点
          context.lineTo(item[0].x + eachSpacing / 4, item[0].y); //开盘右侧点
          context.lineTo(item[0].x, item[0].y); //开盘中间点
          context.moveTo(item[3].x, item[3].y); //顶点
        }
        context.closePath();
        context.fill();
        context.stroke();
      }
    }
  });

  context.restore();

  return {
    xAxisPoints: xAxisPoints,
    calPoints: calPoints,
    eachSpacing: eachSpacing };

}

function drawAreaDataPoints(series, opts, config, context) {
  var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var areaOption = assign({}, {
    type: 'straight',
    opacity: 0.2,
    addLine: false,
    width: 2,
    gradient: false },
  opts.extra.area);

  var xAxisData = opts.chartData.xAxisData,
  xAxisPoints = xAxisData.xAxisPoints,
  eachSpacing = xAxisData.eachSpacing;

  var endY = opts.height - opts.area[2];
  var calPoints = [];

  context.save();
  var leftSpace = 0;
  var rightSpace = opts.width + eachSpacing;
  if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
    context.translate(opts._scrollDistance_, 0);
    leftSpace = -opts._scrollDistance_ - eachSpacing + opts.area[3];
    rightSpace = leftSpace + (opts.xAxis.itemCount + 4) * eachSpacing;
  }

  series.forEach(function (eachSeries, seriesIndex) {
    var ranges, minRange, maxRange;
    ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
    minRange = ranges.pop();
    maxRange = ranges.shift();
    var data = eachSeries.data;
    var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
    calPoints.push(points);

    var splitPointList = splitPoints(points);
    for (var i = 0; i < splitPointList.length; i++) {
      var _points2 = splitPointList[i];
      // 绘制区域数
      context.beginPath();
      context.setStrokeStyle(hexToRgb(eachSeries.color, areaOption.opacity));
      if (areaOption.gradient) {
        var gradient = context.createLinearGradient(0, opts.area[0], 0, opts.height - opts.area[2]);
        gradient.addColorStop('0', hexToRgb(eachSeries.color, areaOption.opacity));
        gradient.addColorStop('1.0', hexToRgb("#FFFFFF", 0.1));
        context.setFillStyle(gradient);
      } else {
        context.setFillStyle(hexToRgb(eachSeries.color, areaOption.opacity));
      }
      context.setLineWidth(areaOption.width * opts.pixelRatio);
      if (_points2.length > 1) {
        var firstPoint = _points2[0];
        var lastPoint = _points2[_points2.length - 1];
        context.moveTo(firstPoint.x, firstPoint.y);
        var startPoint = 0;
        if (areaOption.type === 'curve') {
          for (var j = 0; j < _points2.length; j++) {
            var item = _points2[j];
            if (startPoint == 0 && item.x > leftSpace) {
              context.moveTo(item.x, item.y);
              startPoint = 1;
            }
            if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
              var ctrlPoint = createCurveControlPoints(_points2, j - 1);
              context.bezierCurveTo(ctrlPoint.ctrA.x, ctrlPoint.ctrA.y, ctrlPoint.ctrB.x, ctrlPoint.ctrB.y, item.x, item.y);
            }
          };
        } else {
          for (var _j = 0; _j < _points2.length; _j++) {
            var _item10 = _points2[_j];
            if (startPoint == 0 && _item10.x > leftSpace) {
              context.moveTo(_item10.x, _item10.y);
              startPoint = 1;
            }
            if (_j > 0 && _item10.x > leftSpace && _item10.x < rightSpace) {
              context.lineTo(_item10.x, _item10.y);
            }
          };
        }

        context.lineTo(lastPoint.x, endY);
        context.lineTo(firstPoint.x, endY);
        context.lineTo(firstPoint.x, firstPoint.y);
      } else {
        var _item11 = _points2[0];
        context.moveTo(_item11.x - eachSpacing / 2, _item11.y);
        context.lineTo(_item11.x + eachSpacing / 2, _item11.y);
        context.lineTo(_item11.x + eachSpacing / 2, endY);
        context.lineTo(_item11.x - eachSpacing / 2, endY);
        context.moveTo(_item11.x - eachSpacing / 2, _item11.y);
      }
      context.closePath();
      context.fill();

      //画连线
      if (areaOption.addLine) {
        if (eachSeries.lineType == 'dash') {
          var dashLength = eachSeries.dashLength ? eachSeries.dashLength : 8;
          dashLength *= opts.pixelRatio;
          context.setLineDash([dashLength, dashLength]);
        }
        context.beginPath();
        context.setStrokeStyle(eachSeries.color);
        context.setLineWidth(areaOption.width * opts.pixelRatio);
        if (_points2.length === 1) {
          context.moveTo(_points2[0].x, _points2[0].y);
          context.arc(_points2[0].x, _points2[0].y, 1, 0, 2 * Math.PI);
        } else {
          context.moveTo(_points2[0].x, _points2[0].y);
          var _startPoint = 0;
          if (areaOption.type === 'curve') {
            for (var _j2 = 0; _j2 < _points2.length; _j2++) {
              var _item12 = _points2[_j2];
              if (_startPoint == 0 && _item12.x > leftSpace) {
                context.moveTo(_item12.x, _item12.y);
                _startPoint = 1;
              }
              if (_j2 > 0 && _item12.x > leftSpace && _item12.x < rightSpace) {
                var _ctrlPoint = createCurveControlPoints(_points2, _j2 - 1);
                context.bezierCurveTo(_ctrlPoint.ctrA.x, _ctrlPoint.ctrA.y, _ctrlPoint.ctrB.x, _ctrlPoint.ctrB.y, _item12.x, _item12.y);
              }
            };
          } else {
            for (var _j3 = 0; _j3 < _points2.length; _j3++) {
              var _item13 = _points2[_j3];
              if (_startPoint == 0 && _item13.x > leftSpace) {
                context.moveTo(_item13.x, _item13.y);
                _startPoint = 1;
              }
              if (_j3 > 0 && _item13.x > leftSpace && _item13.x < rightSpace) {
                context.lineTo(_item13.x, _item13.y);
              }
            };
          }
          context.moveTo(_points2[0].x, _points2[0].y);
        }
        context.stroke();
        context.setLineDash([]);
      }
    }

    //画点
    if (opts.dataPointShape !== false) {
      drawPointShape(points, eachSeries.color, eachSeries.pointShape, context, opts);
    }

  });

  if (opts.dataLabel !== false && process === 1) {
    series.forEach(function (eachSeries, seriesIndex) {
      var ranges, minRange, maxRange;
      ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
      minRange = ranges.pop();
      maxRange = ranges.shift();
      var data = eachSeries.data;
      var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
      drawPointText(points, eachSeries, config, context);
    });
  }

  context.restore();

  return {
    xAxisPoints: xAxisPoints,
    calPoints: calPoints,
    eachSpacing: eachSpacing };

}

function drawLineDataPoints(series, opts, config, context) {
  var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var lineOption = assign({}, {
    type: 'straight',
    width: 2 },
  opts.extra.line);
  lineOption.width *= opts.pixelRatio;

  var xAxisData = opts.chartData.xAxisData,
  xAxisPoints = xAxisData.xAxisPoints,
  eachSpacing = xAxisData.eachSpacing;
  var calPoints = [];

  context.save();
  var leftSpace = 0;
  var rightSpace = opts.width + eachSpacing;
  if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
    context.translate(opts._scrollDistance_, 0);
    leftSpace = -opts._scrollDistance_ - eachSpacing + opts.area[3];
    rightSpace = leftSpace + (opts.xAxis.itemCount + 4) * eachSpacing;
  }

  series.forEach(function (eachSeries, seriesIndex) {
    var ranges, minRange, maxRange;
    ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
    minRange = ranges.pop();
    maxRange = ranges.shift();
    var data = eachSeries.data;
    var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
    calPoints.push(points);
    var splitPointList = splitPoints(points);

    if (eachSeries.lineType == 'dash') {
      var dashLength = eachSeries.dashLength ? eachSeries.dashLength : 8;
      dashLength *= opts.pixelRatio;
      context.setLineDash([dashLength, dashLength]);
    }
    context.beginPath();
    context.setStrokeStyle(eachSeries.color);
    context.setLineWidth(lineOption.width);

    splitPointList.forEach(function (points, index) {

      if (points.length === 1) {
        context.moveTo(points[0].x, points[0].y);
        context.arc(points[0].x, points[0].y, 1, 0, 2 * Math.PI);
      } else {
        context.moveTo(points[0].x, points[0].y);
        var startPoint = 0;
        if (lineOption.type === 'curve') {
          for (var j = 0; j < points.length; j++) {
            var item = points[j];
            if (startPoint == 0 && item.x > leftSpace) {
              context.moveTo(item.x, item.y);
              startPoint = 1;
            }
            if (j > 0 && item.x > leftSpace && item.x < rightSpace) {
              var ctrlPoint = createCurveControlPoints(points, j - 1);
              context.bezierCurveTo(ctrlPoint.ctrA.x, ctrlPoint.ctrA.y, ctrlPoint.ctrB.x, ctrlPoint.ctrB.y, item.x, item.y);
            }
          };
        } else {
          for (var _j4 = 0; _j4 < points.length; _j4++) {
            var _item14 = points[_j4];
            if (startPoint == 0 && _item14.x > leftSpace) {
              context.moveTo(_item14.x, _item14.y);
              startPoint = 1;
            }
            if (_j4 > 0 && _item14.x > leftSpace && _item14.x < rightSpace) {
              context.lineTo(_item14.x, _item14.y);
            }
          };
        }
        context.moveTo(points[0].x, points[0].y);
      }

    });

    context.stroke();
    context.setLineDash([]);

    if (opts.dataPointShape !== false) {
      drawPointShape(points, eachSeries.color, eachSeries.pointShape, context, opts);
    }
  });

  if (opts.dataLabel !== false && process === 1) {
    series.forEach(function (eachSeries, seriesIndex) {
      var ranges, minRange, maxRange;
      ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
      minRange = ranges.pop();
      maxRange = ranges.shift();
      var data = eachSeries.data;
      var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
      drawPointText(points, eachSeries, config, context);
    });
  }

  context.restore();

  return {
    xAxisPoints: xAxisPoints,
    calPoints: calPoints,
    eachSpacing: eachSpacing };

}

function drawMixDataPoints(series, opts, config, context) {
  var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

  var xAxisData = opts.chartData.xAxisData,
  xAxisPoints = xAxisData.xAxisPoints,
  eachSpacing = xAxisData.eachSpacing;

  var endY = opts.height - opts.area[2];
  var calPoints = [];

  var columnIndex = 0;
  var columnLength = 0;
  series.forEach(function (eachSeries, seriesIndex) {
    if (eachSeries.type == 'column') {
      columnLength += 1;
    }
  });
  context.save();
  var leftNum = -2;
  var rightNum = xAxisPoints.length + 2;
  var leftSpace = 0;
  var rightSpace = opts.width + eachSpacing;
  if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
    context.translate(opts._scrollDistance_, 0);
    leftNum = Math.floor(-opts._scrollDistance_ / eachSpacing) - 2;
    rightNum = leftNum + opts.xAxis.itemCount + 4;
    leftSpace = -opts._scrollDistance_ - eachSpacing + opts.area[3];
    rightSpace = leftSpace + (opts.xAxis.itemCount + 4) * eachSpacing;
  }

  series.forEach(function (eachSeries, seriesIndex) {
    var ranges, minRange, maxRange;

    ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
    minRange = ranges.pop();
    maxRange = ranges.shift();

    var data = eachSeries.data;
    var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
    calPoints.push(points);

    // 绘制柱状数据图
    if (eachSeries.type == 'column') {
      points = fixColumeData(points, eachSpacing, columnLength, columnIndex, config, opts);
      for (var i = 0; i < points.length; i++) {
        var item = points[i];
        if (item !== null && i > leftNum && i < rightNum) {
          context.beginPath();
          context.setStrokeStyle(item.color || eachSeries.color);
          context.setLineWidth(1);
          context.setFillStyle(item.color || eachSeries.color);
          var startX = item.x - item.width / 2;
          var height = opts.height - item.y - opts.area[2];
          context.moveTo(startX, item.y);
          context.moveTo(startX, item.y);
          context.lineTo(startX + item.width - 2, item.y);
          context.lineTo(startX + item.width - 2, opts.height - opts.area[2]);
          context.lineTo(startX, opts.height - opts.area[2]);
          context.lineTo(startX, item.y);
          context.closePath();
          context.stroke();
          context.fill();
          context.closePath();
          context.fill();
        }
      }
      columnIndex += 1;
    }

    //绘制区域图数据

    if (eachSeries.type == 'area') {
      var _splitPointList = splitPoints(points);
      for (var _i17 = 0; _i17 < _splitPointList.length; _i17++) {
        var _points3 = _splitPointList[_i17];
        // 绘制区域数据
        context.beginPath();
        context.setStrokeStyle(eachSeries.color);
        context.setFillStyle(hexToRgb(eachSeries.color, 0.2));
        context.setLineWidth(2 * opts.pixelRatio);
        if (_points3.length > 1) {
          var firstPoint = _points3[0];
          var lastPoint = _points3[_points3.length - 1];
          context.moveTo(firstPoint.x, firstPoint.y);
          var startPoint = 0;
          if (eachSeries.style === 'curve') {
            for (var j = 0; j < _points3.length; j++) {
              var _item15 = _points3[j];
              if (startPoint == 0 && _item15.x > leftSpace) {
                context.moveTo(_item15.x, _item15.y);
                startPoint = 1;
              }
              if (j > 0 && _item15.x > leftSpace && _item15.x < rightSpace) {
                var ctrlPoint = createCurveControlPoints(_points3, j - 1);
                context.bezierCurveTo(ctrlPoint.ctrA.x, ctrlPoint.ctrA.y, ctrlPoint.ctrB.x, ctrlPoint.ctrB.y, _item15.x, _item15.y);
              }
            };
          } else {
            for (var _j5 = 0; _j5 < _points3.length; _j5++) {
              var _item16 = _points3[_j5];
              if (startPoint == 0 && _item16.x > leftSpace) {
                context.moveTo(_item16.x, _item16.y);
                startPoint = 1;
              }
              if (_j5 > 0 && _item16.x > leftSpace && _item16.x < rightSpace) {
                context.lineTo(_item16.x, _item16.y);
              }
            };
          }
          context.lineTo(lastPoint.x, endY);
          context.lineTo(firstPoint.x, endY);
          context.lineTo(firstPoint.x, firstPoint.y);
        } else {
          var _item17 = _points3[0];
          context.moveTo(_item17.x - eachSpacing / 2, _item17.y);
          context.lineTo(_item17.x + eachSpacing / 2, _item17.y);
          context.lineTo(_item17.x + eachSpacing / 2, endY);
          context.lineTo(_item17.x - eachSpacing / 2, endY);
          context.moveTo(_item17.x - eachSpacing / 2, _item17.y);
        }
        context.closePath();
        context.fill();
      }
    }

    // 绘制折线数据图
    if (eachSeries.type == 'line') {
      var splitPointList = splitPoints(points);
      splitPointList.forEach(function (points, index) {
        if (eachSeries.lineType == 'dash') {
          var dashLength = eachSeries.dashLength ? eachSeries.dashLength : 8;
          dashLength *= opts.pixelRatio;
          context.setLineDash([dashLength, dashLength]);
        }
        context.beginPath();
        context.setStrokeStyle(eachSeries.color);
        context.setLineWidth(2 * opts.pixelRatio);
        if (points.length === 1) {
          context.moveTo(points[0].x, points[0].y);
          context.arc(points[0].x, points[0].y, 1, 0, 2 * Math.PI);
        } else {
          context.moveTo(points[0].x, points[0].y);
          var _startPoint2 = 0;
          if (eachSeries.style == 'curve') {
            for (var _j6 = 0; _j6 < points.length; _j6++) {
              var _item18 = points[_j6];
              if (_startPoint2 == 0 && _item18.x > leftSpace) {
                context.moveTo(_item18.x, _item18.y);
                _startPoint2 = 1;
              }
              if (_j6 > 0 && _item18.x > leftSpace && _item18.x < rightSpace) {
                var ctrlPoint = createCurveControlPoints(points, _j6 - 1);
                context.bezierCurveTo(ctrlPoint.ctrA.x, ctrlPoint.ctrA.y, ctrlPoint.ctrB.x, ctrlPoint.ctrB.y, _item18.x, _item18.y);
              }
            }
          } else {
            for (var _j7 = 0; _j7 < points.length; _j7++) {
              var _item19 = points[_j7];
              if (_startPoint2 == 0 && _item19.x > leftSpace) {
                context.moveTo(_item19.x, _item19.y);
                _startPoint2 = 1;
              }
              if (_j7 > 0 && _item19.x > leftSpace && _item19.x < rightSpace) {
                context.lineTo(_item19.x, _item19.y);
              }
            }
          }
          context.moveTo(points[0].x, points[0].y);
        }
        context.stroke();
        context.setLineDash([]);
      });
    }

    // 绘制点数据图
    if (eachSeries.type == 'point') {
      eachSeries.addPoint = true;
    }

    if (eachSeries.addPoint == true && eachSeries.type !== 'column') {
      drawPointShape(points, eachSeries.color, eachSeries.pointShape, context, opts);
    }
  });
  if (opts.dataLabel !== false && process === 1) {
    var columnIndex = 0;
    series.forEach(function (eachSeries, seriesIndex) {
      var ranges, minRange, maxRange;

      ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
      minRange = ranges.pop();
      maxRange = ranges.shift();

      var data = eachSeries.data;
      var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
      if (eachSeries.type !== 'column') {
        drawPointText(points, eachSeries, config, context);
      } else {
        points = fixColumeData(points, eachSpacing, columnLength, columnIndex, config, opts);
        drawPointText(points, eachSeries, config, context);
        columnIndex += 1;
      }

    });
  }

  context.restore();

  return {
    xAxisPoints: xAxisPoints,
    calPoints: calPoints,
    eachSpacing: eachSpacing };

}

function drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints) {
  var toolTipOption = opts.extra.tooltip || {};
  if (toolTipOption.horizentalLine && opts.tooltip && process === 1 && (opts.type == 'line' || opts.type == 'area' || opts.type == 'column' || opts.type == 'candle' || opts.type == 'mix')) {
    drawToolTipHorizentalLine(opts, config, context, eachSpacing, xAxisPoints);
  }
  context.save();
  if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
    context.translate(opts._scrollDistance_, 0);
  }
  if (opts.tooltip && opts.tooltip.textList && opts.tooltip.textList.length && process === 1) {
    drawToolTip(opts.tooltip.textList, opts.tooltip.offset, opts, config, context, eachSpacing, xAxisPoints);
  }
  context.restore();

}

function drawXAxis(categories, opts, config, context) {

  var xAxisData = opts.chartData.xAxisData,
  xAxisPoints = xAxisData.xAxisPoints,
  startX = xAxisData.startX,
  endX = xAxisData.endX,
  eachSpacing = xAxisData.eachSpacing;
  var boundaryGap = 'center';
  if (opts.type == 'line' || opts.type == 'area') {
    boundaryGap = opts.xAxis.boundaryGap;
  }
  var startY = opts.height - opts.area[2];
  var endY = opts.area[0];

  //绘制滚动条
  if (opts.enableScroll && opts.xAxis.scrollShow) {
    var scrollY = opts.height - opts.area[2] + config.xAxisHeight;
    var scrollScreenWidth = endX - startX;
    var scrollTotalWidth = eachSpacing * (xAxisPoints.length - 1);
    var scrollWidth = scrollScreenWidth * scrollScreenWidth / scrollTotalWidth;
    var scrollLeft = 0;
    if (opts._scrollDistance_) {
      scrollLeft = -opts._scrollDistance_ * scrollScreenWidth / scrollTotalWidth;
    }
    context.beginPath();
    context.setLineCap('round');
    context.setLineWidth(6 * opts.pixelRatio);
    context.setStrokeStyle(opts.xAxis.scrollBackgroundColor || "#EFEBEF");
    context.moveTo(startX, scrollY);
    context.lineTo(endX, scrollY);
    context.stroke();
    context.closePath();
    context.beginPath();
    context.setLineCap('round');
    context.setLineWidth(6 * opts.pixelRatio);
    context.setStrokeStyle(opts.xAxis.scrollColor || "#A6A6A6");
    context.moveTo(startX + scrollLeft, scrollY);
    context.lineTo(startX + scrollLeft + scrollWidth, scrollY);
    context.stroke();
    context.closePath();
    context.setLineCap('butt');
  }

  context.save();

  if (opts._scrollDistance_ && opts._scrollDistance_ !== 0) {
    context.translate(opts._scrollDistance_, 0);
  }

  //绘制X轴刻度线
  if (opts.xAxis.calibration === true) {
    context.setStrokeStyle(opts.xAxis.gridColor || "#cccccc");
    context.setLineCap('butt');
    context.setLineWidth(1 * opts.pixelRatio);
    xAxisPoints.forEach(function (item, index) {
      if (index > 0) {
        context.beginPath();
        context.moveTo(item - eachSpacing / 2, startY);
        context.lineTo(item - eachSpacing / 2, startY + 3 * opts.pixelRatio);
        context.closePath();
        context.stroke();
      }
    });
  }
  //绘制X轴网格
  if (opts.xAxis.disableGrid !== true) {
    context.setStrokeStyle(opts.xAxis.gridColor || "#cccccc");
    context.setLineCap('butt');
    context.setLineWidth(1 * opts.pixelRatio);
    if (opts.xAxis.gridType == 'dash') {
      context.setLineDash([opts.xAxis.dashLength, opts.xAxis.dashLength]);
    }
    opts.xAxis.gridEval = opts.xAxis.gridEval || 1;
    xAxisPoints.forEach(function (item, index) {
      if (index % opts.xAxis.gridEval == 0) {
        context.beginPath();
        context.moveTo(item, startY);
        context.lineTo(item, endY);
        context.stroke();
      }
    });
    context.setLineDash([]);
  }


  //绘制X轴文案
  if (opts.xAxis.disabled !== true) {
    // 对X轴列表做抽稀处理
    //默认全部显示X轴标签
    var maxXAxisListLength = categories.length;
    //如果设置了X轴单屏数量
    if (opts.xAxis.labelCount) {
      //如果设置X轴密度
      if (opts.xAxis.itemCount) {
        maxXAxisListLength = Math.ceil(categories.length / opts.xAxis.itemCount * opts.xAxis.labelCount);
      } else {
        maxXAxisListLength = opts.xAxis.labelCount;
      }
      maxXAxisListLength -= 1;
    }

    var ratio = Math.ceil(categories.length / maxXAxisListLength);

    var newCategories = [];
    var cgLength = categories.length;
    for (var i = 0; i < cgLength; i++) {
      if (i % ratio !== 0) {
        newCategories.push("");
      } else {
        newCategories.push(categories[i]);
      }
    }
    newCategories[cgLength - 1] = categories[cgLength - 1];

    var xAxisFontSize = opts.xAxis.fontSize || config.fontSize;
    if (config._xAxisTextAngle_ === 0) {
      newCategories.forEach(function (item, index) {
        var offset = -measureText(String(item), xAxisFontSize) / 2;
        if (boundaryGap == 'center') {
          offset += eachSpacing / 2;
        }
        var scrollHeight = 0;
        if (opts.xAxis.scrollShow) {
          scrollHeight = 6 * opts.pixelRatio;
        }
        context.beginPath();
        context.setFontSize(xAxisFontSize);
        context.setFillStyle(opts.xAxis.fontColor || '#666666');
        context.fillText(String(item), xAxisPoints[index] + offset, startY + xAxisFontSize + (config.xAxisHeight - scrollHeight - xAxisFontSize) / 2);
        context.closePath();
        context.stroke();
      });

    } else {
      newCategories.forEach(function (item, index) {
        context.save();
        context.beginPath();
        context.setFontSize(xAxisFontSize);
        context.setFillStyle(opts.xAxis.fontColor || '#666666');
        var textWidth = measureText(String(item), xAxisFontSize);
        var offset = -textWidth;
        if (boundaryGap == 'center') {
          offset += eachSpacing / 2;
        }
        var _calRotateTranslate = calRotateTranslate(xAxisPoints[index] + eachSpacing / 2, startY + xAxisFontSize / 2 + 5, opts.height),
        transX = _calRotateTranslate.transX,
        transY = _calRotateTranslate.transY;

        context.rotate(-1 * config._xAxisTextAngle_);
        context.translate(transX, transY);
        context.fillText(String(item), xAxisPoints[index] + offset, startY + xAxisFontSize + 5);
        context.closePath();
        context.stroke();
        context.restore();
      });
    }
  }
  context.restore();

  //绘制X轴轴线
  if (opts.xAxis.axisLine) {
    context.beginPath();
    context.setStrokeStyle(opts.xAxis.axisLineColor);
    context.setLineWidth(1 * opts.pixelRatio);
    context.moveTo(startX, opts.height - opts.area[2]);
    context.lineTo(endX, opts.height - opts.area[2]);
    context.stroke();
  }
}

function drawYAxisGrid(categories, opts, config, context) {
  if (opts.yAxis.disableGrid === true) {
    return;
  }
  var spacingValid = opts.height - opts.area[0] - opts.area[2];
  var eachSpacing = spacingValid / opts.yAxis.splitNumber;
  var startX = opts.area[3];
  var xAxisPoints = opts.chartData.xAxisData.xAxisPoints,
  xAxiseachSpacing = opts.chartData.xAxisData.eachSpacing;
  var TotalWidth = xAxiseachSpacing * (xAxisPoints.length - 1);
  var endX = startX + TotalWidth;

  var points = [];
  for (var i = 0; i < opts.yAxis.splitNumber + 1; i++) {
    points.push(opts.height - opts.area[2] - eachSpacing * i);
  }

  context.save();
  if (opts._scrollDistance_ && opts._scrollDistance_ !== 0) {
    context.translate(opts._scrollDistance_, 0);
  }

  if (opts.yAxis.gridType == 'dash') {
    context.setLineDash([opts.yAxis.dashLength, opts.yAxis.dashLength]);
  }
  context.setStrokeStyle(opts.yAxis.gridColor);
  context.setLineWidth(1 * opts.pixelRatio);
  points.forEach(function (item, index) {
    context.beginPath();
    context.moveTo(startX, item);
    context.lineTo(endX, item);
    context.stroke();
  });
  context.setLineDash([]);

  context.restore();
}

function drawYAxis(series, opts, config, context) {
  if (opts.yAxis.disabled === true) {
    return;
  }
  var spacingValid = opts.height - opts.area[0] - opts.area[2];
  var eachSpacing = spacingValid / opts.yAxis.splitNumber;
  var startX = opts.area[3];
  var endX = opts.width - opts.area[1];
  var endY = opts.height - opts.area[2];
  var fillEndY = endY + config.xAxisHeight;
  if (opts.xAxis.scrollShow) {
    fillEndY -= 3 * opts.pixelRatio;
  }
  if (opts.xAxis.rotateLabel) {
    fillEndY = opts.height - opts.area[2] + 3;
  }
  // set YAxis background
  context.beginPath();
  context.setFillStyle(opts.background || '#ffffff');
  if (opts._scrollDistance_ < 0) {
    context.fillRect(0, 0, startX, fillEndY);
  }
  if (opts.enableScroll == true) {
    context.fillRect(endX, 0, opts.width, fillEndY);
  }
  context.closePath();
  context.stroke();

  var points = [];
  for (var i = 0; i <= opts.yAxis.splitNumber; i++) {
    points.push(opts.area[0] + eachSpacing * i);
  }

  var tStartLeft = opts.area[3];
  var tStartRight = opts.width - opts.area[1];var _loop4 = function _loop4(

  _i18) {
    var yData = opts.yAxis.data[_i18];
    if (yData.disabled !== true) {
      var rangesFormat = opts.chartData.yAxisData.rangesFormat[_i18];
      var yAxisFontSize = yData.fontSize || config.fontSize;
      var yAxisWidth = opts.chartData.yAxisData.yAxisWidth[_i18];
      //画Y轴刻度及文案
      rangesFormat.forEach(function (item, index) {
        var pos = points[index] ? points[index] : endY;
        context.beginPath();
        context.setFontSize(yAxisFontSize);
        context.setLineWidth(1 * opts.pixelRatio);
        context.setStrokeStyle(yData.axisLineColor || '#cccccc');
        context.setFillStyle(yData.fontColor || '#666666');
        if (yAxisWidth.position == 'left') {
          context.fillText(String(item), tStartLeft - yAxisWidth.width, pos + yAxisFontSize / 2);
          //画刻度线
          if (yData.calibration == true) {
            context.moveTo(tStartLeft, pos);
            context.lineTo(tStartLeft - 3 * opts.pixelRatio, pos);
          }
        } else {
          context.fillText(String(item), tStartRight + 4 * opts.pixelRatio, pos + yAxisFontSize / 2);
          //画刻度线
          if (yData.calibration == true) {
            context.moveTo(tStartRight, pos);
            context.lineTo(tStartRight + 3 * opts.pixelRatio, pos);
          }
        }
        context.closePath();
        context.stroke();
      });
      //画Y轴轴线
      if (yData.axisLine !== false) {
        context.beginPath();
        context.setStrokeStyle(yData.axisLineColor || '#cccccc');
        context.setLineWidth(1 * opts.pixelRatio);
        if (yAxisWidth.position == 'left') {
          context.moveTo(tStartLeft, opts.height - opts.area[2]);
          context.lineTo(tStartLeft, opts.area[0]);
        } else {
          context.moveTo(tStartRight, opts.height - opts.area[2]);
          context.lineTo(tStartRight, opts.area[0]);
        }
        context.stroke();
      }

      //画Y轴标题
      if (opts.yAxis.showTitle) {

        var titleFontSize = yData.titleFontSize || config.fontSize;
        var title = yData.title;
        context.beginPath();
        context.setFontSize(titleFontSize);
        context.setFillStyle(yData.titleFontColor || '#666666');
        if (yAxisWidth.position == 'left') {
          context.fillText(title, tStartLeft - measureText(title, titleFontSize) / 2, opts.area[0] - 10 * opts.pixelRatio);
        } else {
          context.fillText(title, tStartRight - measureText(title, titleFontSize) / 2, opts.area[0] - 10 * opts.pixelRatio);
        }
        context.closePath();
        context.stroke();
      }
      if (yAxisWidth.position == 'left') {
        tStartLeft -= yAxisWidth.width + opts.yAxis.padding;
      } else {
        tStartRight += yAxisWidth.width + opts.yAxis.padding;
      }
    }};for (var _i18 = 0; _i18 < opts.yAxis.data.length; _i18++) {_loop4(_i18);
  }
}

function drawLegend(series, opts, config, context, chartData) {
  if (opts.legend.show === false) {
    return;
  }
  var legendData = chartData.legendData;
  var legendList = legendData.points;
  var legendArea = legendData.area;
  var padding = opts.legend.padding;
  var fontSize = opts.legend.fontSize;
  var shapeWidth = 15 * opts.pixelRatio;
  var shapeRight = 5 * opts.pixelRatio;
  var itemGap = opts.legend.itemGap;
  var lineHeight = Math.max(opts.legend.lineHeight * opts.pixelRatio, fontSize);

  //画背景及边框
  context.beginPath();
  context.setLineWidth(opts.legend.borderWidth);
  context.setStrokeStyle(opts.legend.borderColor);
  context.setFillStyle(opts.legend.backgroundColor);
  context.moveTo(legendArea.start.x, legendArea.start.y);
  context.rect(legendArea.start.x, legendArea.start.y, legendArea.width, legendArea.height);
  context.closePath();
  context.fill();
  context.stroke();

  legendList.forEach(function (itemList, listIndex) {
    var width = 0;
    var height = 0;
    width = legendData.widthArr[listIndex];
    height = legendData.heightArr[listIndex];
    var startX = 0;
    var startY = 0;
    if (opts.legend.position == 'top' || opts.legend.position == 'bottom') {
      startX = legendArea.start.x + (legendArea.width - width) / 2;
      startY = legendArea.start.y + padding + listIndex * lineHeight;
    } else {
      if (listIndex == 0) {
        width = 0;
      } else {
        width = legendData.widthArr[listIndex - 1];
      }
      startX = legendArea.start.x + padding + width;
      startY = legendArea.start.y + padding + (legendArea.height - height) / 2;
    }

    context.setFontSize(config.fontSize);
    for (var i = 0; i < itemList.length; i++) {
      var item = itemList[i];
      item.area = [0, 0, 0, 0];
      item.area[0] = startX;
      item.area[1] = startY;
      item.area[3] = startY + lineHeight;
      context.beginPath();
      context.setLineWidth(1 * opts.pixelRatio);
      context.setStrokeStyle(item.show ? item.color : opts.legend.hiddenColor);
      context.setFillStyle(item.show ? item.color : opts.legend.hiddenColor);
      switch (item.legendShape) {
        case 'line':
          context.moveTo(startX, startY + 0.5 * lineHeight - 2 * opts.pixelRatio);
          context.fillRect(startX, startY + 0.5 * lineHeight - 2 * opts.pixelRatio, 15 * opts.pixelRatio, 4 * opts.pixelRatio);
          break;
        case 'triangle':
          context.moveTo(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight - 5 * opts.pixelRatio);
          context.lineTo(startX + 2.5 * opts.pixelRatio, startY + 0.5 * lineHeight + 5 * opts.pixelRatio);
          context.lineTo(startX + 12.5 * opts.pixelRatio, startY + 0.5 * lineHeight + 5 * opts.pixelRatio);
          context.lineTo(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight - 5 * opts.pixelRatio);
          break;
        case 'diamond':
          context.moveTo(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight - 5 * opts.pixelRatio);
          context.lineTo(startX + 2.5 * opts.pixelRatio, startY + 0.5 * lineHeight);
          context.lineTo(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight + 5 * opts.pixelRatio);
          context.lineTo(startX + 12.5 * opts.pixelRatio, startY + 0.5 * lineHeight);
          context.lineTo(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight - 5 * opts.pixelRatio);
          break;
        case 'circle':
          context.moveTo(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight);
          context.arc(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight, 5 * opts.pixelRatio, 0, 2 * Math.PI);
          break;
        case 'rect':
          context.moveTo(startX, startY + 0.5 * lineHeight - 5 * opts.pixelRatio);
          context.fillRect(startX, startY + 0.5 * lineHeight - 5 * opts.pixelRatio, 15 * opts.pixelRatio, 10 * opts.pixelRatio);
          break;
        default:
          context.moveTo(startX, startY + 0.5 * lineHeight - 5 * opts.pixelRatio);
          context.fillRect(startX, startY + 0.5 * lineHeight - 5 * opts.pixelRatio, 15 * opts.pixelRatio, 10 * opts.pixelRatio);}

      context.closePath();
      context.fill();
      context.stroke();

      startX += shapeWidth + shapeRight;
      var fontTrans = 0.5 * lineHeight + 0.5 * fontSize - 2;
      context.beginPath();
      context.setFontSize(fontSize);
      context.setFillStyle(item.show ? opts.legend.fontColor : opts.legend.hiddenColor);
      context.fillText(item.name, startX, startY + fontTrans);
      context.closePath();
      context.stroke();
      if (opts.legend.position == 'top' || opts.legend.position == 'bottom') {
        startX += measureText(item.name, fontSize) + itemGap;
        item.area[2] = startX;
      } else {
        item.area[2] = startX + measureText(item.name, fontSize) + itemGap;;
        startX -= shapeWidth + shapeRight;
        startY += lineHeight;
      }
    }
  });
}

function drawPieDataPoints(series, opts, config, context) {
  var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var pieOption = assign({}, {
    activeOpacity: 0.5,
    activeRadius: 10 * opts.pixelRatio,
    offsetAngle: 0,
    labelWidth: 15 * opts.pixelRatio,
    ringWidth: 0,
    border: false,
    borderWidth: 2,
    borderColor: '#FFFFFF' },
  opts.extra.pie);
  var centerPosition = {
    x: opts.area[3] + (opts.width - opts.area[1] - opts.area[3]) / 2,
    y: opts.area[0] + (opts.height - opts.area[0] - opts.area[2]) / 2 };

  if (config.pieChartLinePadding == 0) {
    config.pieChartLinePadding = pieOption.activeRadius;
  }

  var radius = Math.min((opts.width - opts.area[1] - opts.area[3]) / 2 - config.pieChartLinePadding - config.pieChartTextPadding - config._pieTextMaxLength_, (opts.height - opts.area[0] - opts.area[2]) / 2 - config.pieChartLinePadding - config.pieChartTextPadding);

  series = getPieDataPoints(series, radius, process);

  var activeRadius = pieOption.activeRadius;

  series = series.map(function (eachSeries) {
    eachSeries._start_ += pieOption.offsetAngle * Math.PI / 180;
    return eachSeries;
  });
  series.forEach(function (eachSeries, seriesIndex) {
    if (opts.tooltip) {
      if (opts.tooltip.index == seriesIndex) {
        context.beginPath();
        context.setFillStyle(hexToRgb(eachSeries.color, opts.extra.pie.activeOpacity || 0.5));
        context.moveTo(centerPosition.x, centerPosition.y);
        context.arc(centerPosition.x, centerPosition.y, eachSeries._radius_ + activeRadius, eachSeries._start_,
        eachSeries._start_ + 2 *
        eachSeries._proportion_ * Math.PI);
        context.closePath();
        context.fill();
      }
    }
    context.beginPath();
    context.setLineWidth(pieOption.borderWidth * opts.pixelRatio);
    context.lineJoin = "round";
    context.setStrokeStyle(pieOption.borderColor);
    context.setFillStyle(eachSeries.color);
    context.moveTo(centerPosition.x, centerPosition.y);
    context.arc(centerPosition.x, centerPosition.y, eachSeries._radius_, eachSeries._start_, eachSeries._start_ + 2 * eachSeries._proportion_ * Math.PI);
    context.closePath();
    context.fill();
    if (pieOption.border == true) {
      context.stroke();
    }
  });

  if (opts.type === 'ring') {
    var innerPieWidth = radius * 0.6;
    if (typeof opts.extra.pie.ringWidth === 'number' && opts.extra.pie.ringWidth > 0) {
      innerPieWidth = Math.max(0, radius - opts.extra.pie.ringWidth);
    }
    context.beginPath();
    context.setFillStyle(opts.background || '#ffffff');
    context.moveTo(centerPosition.x, centerPosition.y);
    context.arc(centerPosition.x, centerPosition.y, innerPieWidth, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
  }

  if (opts.dataLabel !== false && process === 1) {
    var valid = false;
    for (var i = 0, len = series.length; i < len; i++) {
      if (series[i].data > 0) {
        valid = true;
        break;
      }
    }

    if (valid) {
      drawPieText(series, opts, config, context, radius, centerPosition);
    }
  }

  if (process === 1 && opts.type === 'ring') {
    drawRingTitle(opts, config, context, centerPosition);
  }

  return {
    center: centerPosition,
    radius: radius,
    series: series };

}

function drawRoseDataPoints(series, opts, config, context) {
  var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var roseOption = assign({}, {
    type: 'area',
    activeOpacity: 0.5,
    activeRadius: 10 * opts.pixelRatio,
    offsetAngle: 0,
    labelWidth: 15 * opts.pixelRatio,
    border: false,
    borderWidth: 2,
    borderColor: '#FFFFFF' },
  opts.extra.rose);
  if (config.pieChartLinePadding == 0) {
    config.pieChartLinePadding = roseOption.activeRadius;
  }
  var centerPosition = {
    x: opts.area[3] + (opts.width - opts.area[1] - opts.area[3]) / 2,
    y: opts.area[0] + (opts.height - opts.area[0] - opts.area[2]) / 2 };

  var radius = Math.min((opts.width - opts.area[1] - opts.area[3]) / 2 - config.pieChartLinePadding - config.pieChartTextPadding - config._pieTextMaxLength_, (opts.height - opts.area[0] - opts.area[2]) / 2 - config.pieChartLinePadding - config.pieChartTextPadding);
  var minRadius = roseOption.minRadius || radius * 0.5;

  series = getRoseDataPoints(series, roseOption.type, minRadius, radius, process);

  var activeRadius = roseOption.activeRadius;

  series = series.map(function (eachSeries) {
    eachSeries._start_ += (roseOption.offsetAngle || 0) * Math.PI / 180;
    return eachSeries;
  });

  series.forEach(function (eachSeries, seriesIndex) {
    if (opts.tooltip) {
      if (opts.tooltip.index == seriesIndex) {
        context.beginPath();
        context.setFillStyle(hexToRgb(eachSeries.color, roseOption.activeOpacity || 0.5));
        context.moveTo(centerPosition.x, centerPosition.y);
        context.arc(centerPosition.x, centerPosition.y, activeRadius + eachSeries._radius_, eachSeries._start_,
        eachSeries._start_ + 2 * eachSeries._rose_proportion_ * Math.PI);
        context.closePath();
        context.fill();
      }
    }
    context.beginPath();
    context.setLineWidth(roseOption.borderWidth * opts.pixelRatio);
    context.lineJoin = "round";
    context.setStrokeStyle(roseOption.borderColor);
    context.setFillStyle(eachSeries.color);
    context.moveTo(centerPosition.x, centerPosition.y);
    context.arc(centerPosition.x, centerPosition.y, eachSeries._radius_, eachSeries._start_, eachSeries._start_ + 2 *
    eachSeries._rose_proportion_ * Math.PI);
    context.closePath();
    context.fill();
    if (roseOption.border == true) {
      context.stroke();
    }
  });

  if (opts.dataLabel !== false && process === 1) {
    var valid = false;
    for (var i = 0, len = series.length; i < len; i++) {
      if (series[i].data > 0) {
        valid = true;
        break;
      }
    }

    if (valid) {
      drawPieText(series, opts, config, context, radius, centerPosition);
    }
  }

  return {
    center: centerPosition,
    radius: radius,
    series: series };

}

function drawArcbarDataPoints(series, opts, config, context) {
  var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var arcbarOption = assign({}, {
    startAngle: 0.75,
    endAngle: 0.25,
    type: 'default',
    width: 12 * opts.pixelRatio,
    gap: 2 * opts.pixelRatio },
  opts.extra.arcbar);

  series = getArcbarDataPoints(series, arcbarOption, process);

  var centerPosition;
  if (arcbarOption.center) {
    centerPosition = arcbarOption.center;
  } else {
    centerPosition = {
      x: opts.width / 2,
      y: opts.height / 2 };

  }

  var radius;
  if (arcbarOption.radius) {
    radius = arcbarOption.radius;
  } else {
    radius = Math.min(centerPosition.x, centerPosition.y);
    radius -= 5 * opts.pixelRatio;
    radius -= arcbarOption.width / 2;
  }

  for (var i = 0; i < series.length; i++) {
    var eachSeries = series[i];
    //背景颜色
    context.setLineWidth(arcbarOption.width);
    context.setStrokeStyle(arcbarOption.backgroundColor || '#E9E9E9');
    context.setLineCap('round');
    context.beginPath();
    if (arcbarOption.type == 'default') {
      context.arc(centerPosition.x, centerPosition.y, radius - (arcbarOption.width + arcbarOption.gap) * i, arcbarOption.startAngle * Math.PI, arcbarOption.endAngle * Math.PI, false);
    } else {
      context.arc(centerPosition.x, centerPosition.y, radius - (arcbarOption.width + arcbarOption.gap) * i, 0, 2 * Math.PI, false);
    }
    context.stroke();
    //进度条
    context.setLineWidth(arcbarOption.width);
    context.setStrokeStyle(eachSeries.color);
    context.setLineCap('round');
    context.beginPath();
    context.arc(centerPosition.x, centerPosition.y, radius - (arcbarOption.width + arcbarOption.gap) * i, arcbarOption.startAngle * Math.PI, eachSeries._proportion_ * Math.PI, false);
    context.stroke();
  }

  drawRingTitle(opts, config, context, centerPosition);

  return {
    center: centerPosition,
    radius: radius,
    series: series };

}

function drawGaugeDataPoints(categories, series, opts, config, context) {
  var process = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
  var gaugeOption = assign({}, {
    type: 'default',
    startAngle: 0.75,
    endAngle: 0.25,
    width: 15,
    splitLine: {
      fixRadius: 0,
      splitNumber: 10,
      width: 15,
      color: '#FFFFFF',
      childNumber: 5,
      childWidth: 5 },

    pointer: {
      width: 15,
      color: 'auto' } },

  opts.extra.gauge);

  if (gaugeOption.oldAngle == undefined) {
    gaugeOption.oldAngle = gaugeOption.startAngle;
  }
  if (gaugeOption.oldData == undefined) {
    gaugeOption.oldData = 0;
  }
  categories = getGaugeAxisPoints(categories, gaugeOption.startAngle, gaugeOption.endAngle);

  var centerPosition = {
    x: opts.width / 2,
    y: opts.height / 2 };

  var radius = Math.min(centerPosition.x, centerPosition.y);
  radius -= 5 * opts.pixelRatio;
  radius -= gaugeOption.width / 2;
  var innerRadius = radius - gaugeOption.width;
  var totalAngle = 0;

  //判断仪表盘的样式：default百度样式，progress新样式
  if (gaugeOption.type == 'progress') {

    //## 第一步画中心圆形背景和进度条背景
    //中心圆形背景
    var pieRadius = radius - gaugeOption.width * 3;
    context.beginPath();
    var gradient = context.createLinearGradient(centerPosition.x, centerPosition.y - pieRadius, centerPosition.x, centerPosition.y + pieRadius);
    //配置渐变填充（起点：中心点向上减半径；结束点中心点向下加半径）
    gradient.addColorStop('0', hexToRgb(series[0].color, 0.3));
    gradient.addColorStop('1.0', hexToRgb("#FFFFFF", 0.1));
    context.setFillStyle(gradient);
    context.arc(centerPosition.x, centerPosition.y, pieRadius, 0, 2 * Math.PI, false);
    context.fill();
    //画进度条背景
    context.setLineWidth(gaugeOption.width);
    context.setStrokeStyle(hexToRgb(series[0].color, 0.3));
    context.setLineCap('round');
    context.beginPath();
    context.arc(centerPosition.x, centerPosition.y, innerRadius, gaugeOption.startAngle * Math.PI, gaugeOption.endAngle * Math.PI, false);
    context.stroke();

    //## 第二步画刻度线
    totalAngle = gaugeOption.startAngle - gaugeOption.endAngle + 1;
    var splitAngle = totalAngle / gaugeOption.splitLine.splitNumber;
    var childAngle = totalAngle / gaugeOption.splitLine.splitNumber / gaugeOption.splitLine.childNumber;
    var startX = -radius - gaugeOption.width * 0.5 - gaugeOption.splitLine.fixRadius;
    var endX = -radius - gaugeOption.width - gaugeOption.splitLine.fixRadius + gaugeOption.splitLine.width;
    context.save();
    context.translate(centerPosition.x, centerPosition.y);
    context.rotate((gaugeOption.startAngle - 1) * Math.PI);
    var len = gaugeOption.splitLine.splitNumber * gaugeOption.splitLine.childNumber + 1;
    var proc = series[0].data * process;
    for (var i = 0; i < len; i++) {
      context.beginPath();
      //刻度线随进度变色
      if (proc > i / len) {
        context.setStrokeStyle(hexToRgb(series[0].color, 1));
      } else {
        context.setStrokeStyle(hexToRgb(series[0].color, 0.3));
      }
      context.setLineWidth(3 * opts.pixelRatio);
      context.moveTo(startX, 0);
      context.lineTo(endX, 0);
      context.stroke();
      context.rotate(childAngle * Math.PI);
    }
    context.restore();

    //## 第三步画进度条
    series = getArcbarDataPoints(series, gaugeOption, process);
    context.setLineWidth(gaugeOption.width);
    context.setStrokeStyle(series[0].color);
    context.setLineCap('round');
    context.beginPath();
    context.arc(centerPosition.x, centerPosition.y, innerRadius, gaugeOption.startAngle * Math.PI, series[0]._proportion_ * Math.PI, false);
    context.stroke();

    //## 第四步画指针
    var pointerRadius = radius - gaugeOption.width * 2.5;
    context.save();
    context.translate(centerPosition.x, centerPosition.y);
    context.rotate((series[0]._proportion_ - 1) * Math.PI);
    context.beginPath();
    context.setLineWidth(gaugeOption.width / 3);
    var gradient3 = context.createLinearGradient(0, -pointerRadius * 0.6, 0, pointerRadius * 0.6);
    gradient3.addColorStop('0', hexToRgb('#FFFFFF', 0));
    gradient3.addColorStop('0.5', hexToRgb(series[0].color, 1));
    gradient3.addColorStop('1.0', hexToRgb('#FFFFFF', 0));
    context.setStrokeStyle(gradient3);
    context.arc(0, 0, pointerRadius, 0.85 * Math.PI, 1.15 * Math.PI, false);
    context.stroke();
    context.beginPath();
    context.setLineWidth(1);
    context.setStrokeStyle(series[0].color);
    context.setFillStyle(series[0].color);
    context.moveTo(-pointerRadius - gaugeOption.width / 3 / 2, -4);
    context.lineTo(-pointerRadius - gaugeOption.width / 3 / 2 - 4, 0);
    context.lineTo(-pointerRadius - gaugeOption.width / 3 / 2, 4);
    context.lineTo(-pointerRadius - gaugeOption.width / 3 / 2, -4);
    context.stroke();
    context.fill();
    context.restore();

    //default百度样式
  } else {
    //画背景
    context.setLineWidth(gaugeOption.width);
    context.setLineCap('butt');
    for (var _i19 = 0; _i19 < categories.length; _i19++) {
      var eachCategories = categories[_i19];
      context.beginPath();
      context.setStrokeStyle(eachCategories.color);
      context.arc(centerPosition.x, centerPosition.y, radius, eachCategories._startAngle_ * Math.PI, eachCategories._endAngle_ * Math.PI, false);
      context.stroke();
    }
    context.save();

    //画刻度线
    totalAngle = gaugeOption.startAngle - gaugeOption.endAngle + 1;
    var _splitAngle = totalAngle / gaugeOption.splitLine.splitNumber;
    var _childAngle = totalAngle / gaugeOption.splitLine.splitNumber / gaugeOption.splitLine.childNumber;
    var _startX2 = -radius - gaugeOption.width * 0.5 - gaugeOption.splitLine.fixRadius;
    var _endX = -radius - gaugeOption.width * 0.5 - gaugeOption.splitLine.fixRadius + gaugeOption.splitLine.width;
    var childendX = -radius - gaugeOption.width * 0.5 - gaugeOption.splitLine.fixRadius + gaugeOption.splitLine.childWidth;

    context.translate(centerPosition.x, centerPosition.y);
    context.rotate((gaugeOption.startAngle - 1) * Math.PI);

    for (var _i20 = 0; _i20 < gaugeOption.splitLine.splitNumber + 1; _i20++) {
      context.beginPath();
      context.setStrokeStyle(gaugeOption.splitLine.color);
      context.setLineWidth(2 * opts.pixelRatio);
      context.moveTo(_startX2, 0);
      context.lineTo(_endX, 0);
      context.stroke();
      context.rotate(_splitAngle * Math.PI);
    }
    context.restore();

    context.save();
    context.translate(centerPosition.x, centerPosition.y);
    context.rotate((gaugeOption.startAngle - 1) * Math.PI);

    for (var _i21 = 0; _i21 < gaugeOption.splitLine.splitNumber * gaugeOption.splitLine.childNumber + 1; _i21++) {
      context.beginPath();
      context.setStrokeStyle(gaugeOption.splitLine.color);
      context.setLineWidth(1 * opts.pixelRatio);
      context.moveTo(_startX2, 0);
      context.lineTo(childendX, 0);
      context.stroke();
      context.rotate(_childAngle * Math.PI);
    }
    context.restore();

    //画指针
    series = getGaugeDataPoints(series, categories, gaugeOption, process);

    for (var _i22 = 0; _i22 < series.length; _i22++) {
      var eachSeries = series[_i22];
      context.save();
      context.translate(centerPosition.x, centerPosition.y);
      context.rotate((eachSeries._proportion_ - 1) * Math.PI);
      context.beginPath();
      context.setFillStyle(eachSeries.color);
      context.moveTo(gaugeOption.pointer.width, 0);
      context.lineTo(0, -gaugeOption.pointer.width / 2);
      context.lineTo(-innerRadius, 0);
      context.lineTo(0, gaugeOption.pointer.width / 2);
      context.lineTo(gaugeOption.pointer.width, 0);
      context.closePath();
      context.fill();
      context.beginPath();
      context.setFillStyle('#FFFFFF');
      context.arc(0, 0, gaugeOption.pointer.width / 6, 0, 2 * Math.PI, false);
      context.fill();
      context.restore();
    }

    if (opts.dataLabel !== false) {
      drawGaugeLabel(gaugeOption, radius, centerPosition, opts, config, context);
    }
  }

  //画仪表盘标题，副标题
  drawRingTitle(opts, config, context, centerPosition);

  if (process === 1 && opts.type === 'gauge') {
    opts.extra.gauge.oldAngle = series[0]._proportion_;
    opts.extra.gauge.oldData = series[0].data;
  }
  return {
    center: centerPosition,
    radius: radius,
    innerRadius: innerRadius,
    categories: categories,
    totalAngle: totalAngle };

}

function drawRadarDataPoints(series, opts, config, context) {
  var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var radarOption = assign({}, {
    gridColor: '#cccccc',
    labelColor: '#666666',
    opacity: 0.2,
    gridCount: 3 },
  opts.extra.radar);

  var coordinateAngle = getRadarCoordinateSeries(opts.categories.length);

  var centerPosition = {
    x: opts.area[3] + (opts.width - opts.area[1] - opts.area[3]) / 2,
    y: opts.area[0] + (opts.height - opts.area[0] - opts.area[2]) / 2 };


  var radius = Math.min(centerPosition.x - (getMaxTextListLength(opts.categories) + config.radarLabelTextMargin),
  centerPosition.y - config.radarLabelTextMargin);
  //TODO逻辑不对
  radius -= opts.padding[1];

  // draw grid
  context.beginPath();
  context.setLineWidth(1 * opts.pixelRatio);
  context.setStrokeStyle(radarOption.gridColor);
  coordinateAngle.forEach(function (angle) {
    var pos = convertCoordinateOrigin(radius * Math.cos(angle), radius * Math.sin(angle), centerPosition);
    context.moveTo(centerPosition.x, centerPosition.y);
    context.lineTo(pos.x, pos.y);
  });
  context.stroke();
  context.closePath();
  // draw split line grid

  var _loop = function _loop(i) {
    var startPos = {};
    context.beginPath();
    context.setLineWidth(1 * opts.pixelRatio);
    context.setStrokeStyle(radarOption.gridColor);
    coordinateAngle.forEach(function (angle, index) {
      var pos = convertCoordinateOrigin(radius / radarOption.gridCount * i * Math.cos(angle), radius / radarOption.gridCount * i * Math.sin(angle), centerPosition);
      if (index === 0) {
        startPos = pos;
        context.moveTo(pos.x, pos.y);
      } else {
        context.lineTo(pos.x, pos.y);
      }
    });
    context.lineTo(startPos.x, startPos.y);
    context.stroke();
    context.closePath();
  };

  for (var i = 1; i <= radarOption.gridCount; i++) {
    _loop(i);
  }

  var radarDataPoints = getRadarDataPoints(coordinateAngle, centerPosition, radius, series, opts, process);

  radarDataPoints.forEach(function (eachSeries, seriesIndex) {
    // 绘制区域数据
    context.beginPath();
    context.setFillStyle(hexToRgb(eachSeries.color, radarOption.opacity));
    eachSeries.data.forEach(function (item, index) {
      if (index === 0) {
        context.moveTo(item.position.x, item.position.y);
      } else {
        context.lineTo(item.position.x, item.position.y);
      }
    });
    context.closePath();
    context.fill();

    if (opts.dataPointShape !== false) {
      var points = eachSeries.data.map(function (item) {
        return item.position;
      });
      drawPointShape(points, eachSeries.color, eachSeries.pointShape, context, opts);
    }
  });
  // draw label text
  drawRadarLabel(coordinateAngle, radius, centerPosition, opts, config, context);

  return {
    center: centerPosition,
    radius: radius,
    angleList: coordinateAngle };

}

function normalInt(min, max, iter) {
  iter = iter == 0 ? 1 : iter;
  var arr = [];
  for (var i = 0; i < iter; i++) {
    arr[i] = Math.random();
  };
  return Math.floor(arr.reduce(function (i, j) {return i + j;}) / iter * (max - min)) + min;
};

function collisionNew(area, points, width, height) {
  var isIn = false;
  for (var i = 0; i < points.length; i++) {
    if (points[i].area) {
      if (area[3] < points[i].area[1] || area[0] > points[i].area[2] || area[1] > points[i].area[3] || area[2] < points[i].area[0]) {
        if (area[0] < 0 || area[1] < 0 || area[2] > width || area[3] > height) {
          isIn = true;
          break;
        } else {
          isIn = false;
        }
      } else {
        isIn = true;
        break;
      }
    }
  }
  return isIn;
};

function getBoundingBox(data) {
  var bounds = {},coords;
  bounds.xMin = 180;
  bounds.xMax = 0;
  bounds.yMin = 90;
  bounds.yMax = 0;
  for (var i = 0; i < data.length; i++) {
    var coorda = data[i].geometry.coordinates;
    for (var k = 0; k < coorda.length; k++) {
      coords = coorda[k];
      if (coords.length == 1) {
        coords = coords[0];
      }
      for (var j = 0; j < coords.length; j++) {
        var longitude = coords[j][0];
        var latitude = coords[j][1];
        var point = {
          x: longitude,
          y: latitude };

        bounds.xMin = bounds.xMin < point.x ? bounds.xMin : point.x;
        bounds.xMax = bounds.xMax > point.x ? bounds.xMax : point.x;
        bounds.yMin = bounds.yMin < point.y ? bounds.yMin : point.y;
        bounds.yMax = bounds.yMax > point.y ? bounds.yMax : point.y;
      }
    }
  }
  return bounds;
}

function coordinateToPoint(latitude, longitude, bounds, scale, xoffset, yoffset) {
  return {
    x: (longitude - bounds.xMin) * scale + xoffset,
    y: (bounds.yMax - latitude) * scale + yoffset };

}

function pointToCoordinate(pointY, pointX, bounds, scale, xoffset, yoffset) {
  return {
    x: (pointX - xoffset) / scale + bounds.xMin,
    y: bounds.yMax - (pointY - yoffset) / scale };

}

function isRayIntersectsSegment(poi, s_poi, e_poi) {
  if (s_poi[1] == e_poi[1]) {return false;}
  if (s_poi[1] > poi[1] && e_poi[1] > poi[1]) {return false;}
  if (s_poi[1] < poi[1] && e_poi[1] < poi[1]) {return false;}
  if (s_poi[1] == poi[1] && e_poi[1] > poi[1]) {return false;}
  if (e_poi[1] == poi[1] && s_poi[1] > poi[1]) {return false;}
  if (s_poi[0] < poi[0] && e_poi[1] < poi[1]) {return false;}
  var xseg = e_poi[0] - (e_poi[0] - s_poi[0]) * (e_poi[1] - poi[1]) / (e_poi[1] - s_poi[1]);
  if (xseg < poi[0]) {
    return false;
  } else {
    return true;
  }
}

function isPoiWithinPoly(poi, poly) {
  var sinsc = 0;
  for (var i = 0; i < poly.length; i++) {
    var epoly = poly[i][0];
    if (poly.length == 1) {
      epoly = poly[i][0];
    }
    for (var j = 0; j < epoly.length - 1; j++) {
      var s_poi = epoly[j];
      var e_poi = epoly[j + 1];
      if (isRayIntersectsSegment(poi, s_poi, e_poi)) {
        sinsc += 1;
      }
    }
  }

  if (sinsc % 2 == 1) {
    return true;
  } else {
    return false;
  }
}


function drawMapDataPoints(series, opts, config, context) {
  var mapOption = assign({}, {
    border: true,
    borderWidth: 1,
    borderColor: '#666666',
    fillOpacity: 0.6,
    activeBorderColor: '#f04864',
    activeFillColor: '#facc14',
    activeFillOpacity: 1 },
  opts.extra.map);
  var coords, point;
  var data = series;
  var bounds = getBoundingBox(data);
  var xScale = opts.width / Math.abs(bounds.xMax - bounds.xMin);
  var yScale = opts.height / Math.abs(bounds.yMax - bounds.yMin);
  var scale = xScale < yScale ? xScale : yScale;
  var xoffset = opts.width / 2 - Math.abs(bounds.xMax - bounds.xMin) / 2 * scale;
  var yoffset = opts.height / 2 - Math.abs(bounds.yMax - bounds.yMin) / 2 * scale;
  context.beginPath();
  context.clearRect(0, 0, opts.width, opts.height);
  context.setFillStyle(opts.background || '#FFFFFF');
  context.rect(0, 0, opts.width, opts.height);
  context.fill();
  for (var i = 0; i < data.length; i++) {
    context.beginPath();
    context.setLineWidth(mapOption.borderWidth * opts.pixelRatio);
    context.setStrokeStyle(mapOption.borderColor);
    context.setFillStyle(hexToRgb(series[i].color, mapOption.fillOpacity));
    if (opts.tooltip) {
      if (opts.tooltip.index == i) {
        context.setStrokeStyle(mapOption.activeBorderColor);
        context.setFillStyle(hexToRgb(mapOption.activeFillColor, mapOption.activeFillOpacity));
      }
    }
    var coorda = data[i].geometry.coordinates;
    for (var k = 0; k < coorda.length; k++) {
      coords = coorda[k];
      if (coords.length == 1) {
        coords = coords[0];
      }
      for (var j = 0; j < coords.length; j++) {
        point = coordinateToPoint(coords[j][1], coords[j][0], bounds, scale, xoffset, yoffset);
        if (j === 0) {
          context.beginPath();
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      }
      context.fill();
      if (mapOption.border == true) {
        context.stroke();
      }
    }
    if (opts.dataLabel == true) {
      var centerPoint = data[i].properties.centroid;
      if (centerPoint) {
        point = coordinateToPoint(centerPoint[1], centerPoint[0], bounds, scale, xoffset, yoffset);
        var fontSize = data[i].textSize || config.fontSize;
        var text = data[i].properties.name;
        context.beginPath();
        context.setFontSize(fontSize);
        context.setFillStyle(data[i].textColor || '#666666');
        context.fillText(text, point.x - measureText(text, fontSize) / 2, point.y + fontSize / 2);
        context.closePath();
        context.stroke();
      }
    }
  }
  opts.chartData.mapData = {
    bounds: bounds,
    scale: scale,
    xoffset: xoffset,
    yoffset: yoffset };

  drawToolTipBridge(opts, config, context, 1);
  context.draw();
}

function getWordCloudPoint(opts, type) {
  var points = opts.series.sort(function (a, b) {return parseInt(b.textSize) - parseInt(a.textSize);});
  switch (type) {
    case 'normal':
      for (var i = 0; i < points.length; i++) {
        var text = points[i].name;
        var tHeight = points[i].textSize;
        var tWidth = measureText(text, tHeight);
        var x = void 0,y = void 0;
        var area = void 0;
        var breaknum = 0;
        while (true) {
          breaknum++;
          x = normalInt(-opts.width / 2, opts.width / 2, 5) - tWidth / 2;
          y = normalInt(-opts.height / 2, opts.height / 2, 5) + tHeight / 2;
          area = [x - 5 + opts.width / 2, y - 5 - tHeight + opts.height / 2, x + tWidth + 5 + opts.width / 2, y + 5 + opts.height / 2];
          var isCollision = collisionNew(area, points, opts.width, opts.height);
          if (!isCollision) break;
          if (breaknum == 1000) {
            area = [-100, -100, -100, -100];
            break;
          }
        };
        points[i].area = area;
      }
      break;
    case 'vertical':var
      Spin = function Spin() {
        //获取均匀随机值，是否旋转，旋转的概率为（1-0.5）
        if (Math.random() > 0.7) {
          return true;
        } else {return false;};
      };;
      for (var _i23 = 0; _i23 < points.length; _i23++) {
        var _text = points[_i23].name;
        var _tHeight = points[_i23].textSize;
        var _tWidth = measureText(_text, _tHeight);
        var isSpin = Spin();
        var _x = void 0,_y = void 0,_area = void 0,areav = void 0;
        var _breaknum = 0;
        while (true) {
          _breaknum++;
          var _isCollision = void 0;
          if (isSpin) {
            _x = normalInt(-opts.width / 2, opts.width / 2, 5) - _tWidth / 2;
            _y = normalInt(-opts.height / 2, opts.height / 2, 5) + _tHeight / 2;
            _area = [_y - 5 - _tWidth + opts.width / 2, -_x - 5 + opts.height / 2, _y + 5 + opts.width / 2, -_x + _tHeight + 5 + opts.height / 2];
            areav = [opts.width - (opts.width / 2 - opts.height / 2) - (-_x + _tHeight + 5 + opts.height / 2) - 5, opts.height / 2 - opts.width / 2 + (_y - 5 - _tWidth + opts.width / 2) - 5, opts.width - (opts.width / 2 - opts.height / 2) - (-_x + _tHeight + 5 + opts.height / 2) + _tHeight, opts.height / 2 - opts.width / 2 + (_y - 5 - _tWidth + opts.width / 2) + _tWidth + 5];
            _isCollision = collisionNew(areav, points, opts.height, opts.width);
          } else {
            _x = normalInt(-opts.width / 2, opts.width / 2, 5) - _tWidth / 2;
            _y = normalInt(-opts.height / 2, opts.height / 2, 5) + _tHeight / 2;
            _area = [_x - 5 + opts.width / 2, _y - 5 - _tHeight + opts.height / 2, _x + _tWidth + 5 + opts.width / 2, _y + 5 + opts.height / 2];
            _isCollision = collisionNew(_area, points, opts.width, opts.height);
          }
          if (!_isCollision) break;
          if (_breaknum == 1000) {
            _area = [-1000, -1000, -1000, -1000];
            break;
          }
        };
        if (isSpin) {
          points[_i23].area = areav;
          points[_i23].areav = _area;
        } else {
          points[_i23].area = _area;
        }
        points[_i23].rotate = isSpin;
      };
      break;}

  return points;
}


function drawWordCloudDataPoints(series, opts, config, context) {
  var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var wordOption = assign({}, {
    type: 'normal',
    autoColors: true },
  opts.extra.word);

  context.beginPath();
  context.setFillStyle(opts.background || '#FFFFFF');
  context.rect(0, 0, opts.width, opts.height);
  context.fill();
  context.save();
  var points = opts.chartData.wordCloudData;
  context.translate(opts.width / 2, opts.height / 2);

  for (var i = 0; i < points.length; i++) {
    context.save();
    if (points[i].rotate) {
      context.rotate(90 * Math.PI / 180);
    }
    var text = points[i].name;
    var tHeight = points[i].textSize;
    var tWidth = measureText(text, tHeight);
    context.beginPath();
    context.setStrokeStyle(points[i].color);
    context.setFillStyle(points[i].color);
    context.setFontSize(tHeight);
    if (points[i].rotate) {
      if (points[i].areav[0] > 0) {
        if (opts.tooltip) {
          if (opts.tooltip.index == i) {
            context.strokeText(text, (points[i].areav[0] + 5 - opts.width / 2) * process - tWidth * (1 - process) / 2, (points[i].areav[1] + 5 + tHeight - opts.height / 2) * process);
          } else {
            context.fillText(text, (points[i].areav[0] + 5 - opts.width / 2) * process - tWidth * (1 - process) / 2, (points[i].areav[1] + 5 + tHeight - opts.height / 2) * process);
          }
        } else {
          context.fillText(text, (points[i].areav[0] + 5 - opts.width / 2) * process - tWidth * (1 - process) / 2, (points[i].areav[1] + 5 + tHeight - opts.height / 2) * process);
        }
      }
    } else {
      if (points[i].area[0] > 0) {
        if (opts.tooltip) {
          if (opts.tooltip.index == i) {
            context.strokeText(text, (points[i].area[0] + 5 - opts.width / 2) * process - tWidth * (1 - process) / 2, (points[i].area[1] + 5 + tHeight - opts.height / 2) * process);
          } else {
            context.fillText(text, (points[i].area[0] + 5 - opts.width / 2) * process - tWidth * (1 - process) / 2, (points[i].area[1] + 5 + tHeight - opts.height / 2) * process);
          }
        } else {
          context.fillText(text, (points[i].area[0] + 5 - opts.width / 2) * process - tWidth * (1 - process) / 2, (points[i].area[1] + 5 + tHeight - opts.height / 2) * process);
        }

      }
    }

    context.stroke();
    context.restore();
  }
  context.restore();
}

function drawFunnelDataPoints(series, opts, config, context) {
  var process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var funnelOption = assign({}, {
    activeWidth: 10,
    activeOpacity: 0.3,
    border: false,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    fillOpacity: 1,
    labelAlign: 'right' },
  opts.extra.funnel);
  var eachSpacing = (opts.height - opts.area[0] - opts.area[2]) / series.length;
  var centerPosition = {
    x: opts.area[3] + (opts.width - opts.area[1] - opts.area[3]) / 2,
    y: opts.height - opts.area[2] };

  var activeWidth = funnelOption.activeWidth;
  var radius = Math.min((opts.width - opts.area[1] - opts.area[3]) / 2 - activeWidth, (opts.height - opts.area[0] - opts.area[2]) / 2 - activeWidth);
  series = getFunnelDataPoints(series, radius, process);
  context.save();
  context.translate(centerPosition.x, centerPosition.y);
  for (var i = 0; i < series.length; i++) {
    if (i == 0) {
      if (opts.tooltip) {
        if (opts.tooltip.index == i) {
          context.beginPath();
          context.setFillStyle(hexToRgb(series[i].color, funnelOption.activeOpacity));
          context.moveTo(-activeWidth, 0);
          context.lineTo(-series[i].radius - activeWidth, -eachSpacing);
          context.lineTo(series[i].radius + activeWidth, -eachSpacing);
          context.lineTo(activeWidth, 0);
          context.lineTo(-activeWidth, 0);
          context.closePath();
          context.fill();
        }
      }
      series[i].funnelArea = [centerPosition.x - series[i].radius, centerPosition.y - eachSpacing, centerPosition.x + series[i].radius, centerPosition.y];
      context.beginPath();
      context.setLineWidth(funnelOption.borderWidth * opts.pixelRatio);
      context.setStrokeStyle(funnelOption.borderColor);
      context.setFillStyle(hexToRgb(series[i].color, funnelOption.fillOpacity));
      context.moveTo(0, 0);
      context.lineTo(-series[i].radius, -eachSpacing);
      context.lineTo(series[i].radius, -eachSpacing);
      context.lineTo(0, 0);
      context.closePath();
      context.fill();
      if (funnelOption.border == true) {
        context.stroke();
      }
    } else {
      if (opts.tooltip) {
        if (opts.tooltip.index == i) {
          context.beginPath();
          context.setFillStyle(hexToRgb(series[i].color, funnelOption.activeOpacity));
          context.moveTo(0, 0);
          context.lineTo(-series[i - 1].radius - activeWidth, 0);
          context.lineTo(-series[i].radius - activeWidth, -eachSpacing);
          context.lineTo(series[i].radius + activeWidth, -eachSpacing);
          context.lineTo(series[i - 1].radius + activeWidth, 0);
          context.lineTo(0, 0);
          context.closePath();
          context.fill();
        }
      }
      series[i].funnelArea = [centerPosition.x - series[i].radius, centerPosition.y - eachSpacing * (i + 1), centerPosition.x + series[i].radius, centerPosition.y - eachSpacing * i];
      context.beginPath();
      context.setLineWidth(funnelOption.borderWidth * opts.pixelRatio);
      context.setStrokeStyle(funnelOption.borderColor);
      context.setFillStyle(hexToRgb(series[i].color, funnelOption.fillOpacity));
      context.moveTo(0, 0);
      context.lineTo(-series[i - 1].radius, 0);
      context.lineTo(-series[i].radius, -eachSpacing);
      context.lineTo(series[i].radius, -eachSpacing);
      context.lineTo(series[i - 1].radius, 0);
      context.lineTo(0, 0);
      context.closePath();
      context.fill();
      if (funnelOption.border == true) {
        context.stroke();
      }
    }
    context.translate(0, -eachSpacing);
  }
  context.restore();

  if (opts.dataLabel !== false && process === 1) {
    drawFunnelText(series, opts, context, eachSpacing, funnelOption.labelAlign, activeWidth, centerPosition);
  }

  return {
    center: centerPosition,
    radius: radius,
    series: series };

}

function drawFunnelText(series, opts, context, eachSpacing, labelAlign, activeWidth, centerPosition) {
  for (var i = 0; i < series.length; i++) {
    var item = series[i];
    var startX = void 0,endX = void 0,startY = void 0,fontSize = void 0;
    var text = item.format ? item.format(+item._proportion_.toFixed(2)) : util.toFixed(item._proportion_ * 100) + '%';
    if (labelAlign == 'right') {
      if (i == 0) {
        startX = (item.funnelArea[2] + centerPosition.x) / 2;
      } else {
        startX = (item.funnelArea[2] + series[i - 1].funnelArea[2]) / 2;
      }
      endX = startX + activeWidth * 2;
      startY = item.funnelArea[1] + eachSpacing / 2;
      fontSize = item.textSize || opts.fontSize;
      context.setLineWidth(1 * opts.pixelRatio);
      context.setStrokeStyle(item.color);
      context.setFillStyle(item.color);
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(endX, startY);
      context.stroke();
      context.closePath();
      context.beginPath();
      context.moveTo(endX, startY);
      context.arc(endX, startY, 2, 0, 2 * Math.PI);
      context.closePath();
      context.fill();
      context.beginPath();
      context.setFontSize(fontSize);
      context.setFillStyle(item.textColor || '#666666');
      context.fillText(text, endX + 5, startY + fontSize / 2 - 2);
      context.closePath();
      context.stroke();
      context.closePath();
    } else {
      if (i == 0) {
        startX = (item.funnelArea[0] + centerPosition.x) / 2;
      } else {
        startX = (item.funnelArea[0] + series[i - 1].funnelArea[0]) / 2;
      }
      endX = startX - activeWidth * 2;
      startY = item.funnelArea[1] + eachSpacing / 2;
      fontSize = item.textSize || opts.fontSize;
      context.setLineWidth(1 * opts.pixelRatio);
      context.setStrokeStyle(item.color);
      context.setFillStyle(item.color);
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(endX, startY);
      context.stroke();
      context.closePath();
      context.beginPath();
      context.moveTo(endX, startY);
      context.arc(endX, startY, 2, 0, 2 * Math.PI);
      context.closePath();
      context.fill();
      context.beginPath();
      context.setFontSize(fontSize);
      context.setFillStyle(item.textColor || '#666666');
      context.fillText(text, endX - 5 - measureText(text), startY + fontSize / 2 - 2);
      context.closePath();
      context.stroke();
      context.closePath();
    }

  }
}


function drawCanvas(opts, context) {
  context.draw();
}

var Timing = {
  easeIn: function easeIn(pos) {
    return Math.pow(pos, 3);
  },
  easeOut: function easeOut(pos) {
    return Math.pow(pos - 1, 3) + 1;
  },
  easeInOut: function easeInOut(pos) {
    if ((pos /= 0.5) < 1) {
      return 0.5 * Math.pow(pos, 3);
    } else {
      return 0.5 * (Math.pow(pos - 2, 3) + 2);
    }
  },
  linear: function linear(pos) {
    return pos;
  } };


function Animation(opts) {
  this.isStop = false;
  opts.duration = typeof opts.duration === 'undefined' ? 1000 : opts.duration;
  opts.timing = opts.timing || 'linear';
  var delay = 17;

  function createAnimationFrame() {
    if (typeof setTimeout !== 'undefined') {
      return function (step, delay) {
        setTimeout(function () {
          var timeStamp = +new Date();
          step(timeStamp);
        }, delay);
      };
    } else if (typeof requestAnimationFrame !== 'undefined') {
      return requestAnimationFrame;
    } else {
      return function (step) {
        step(null);
      };
    }
  };
  var animationFrame = createAnimationFrame();
  var startTimeStamp = null;
  var _step = function step(timestamp) {
    if (timestamp === null || this.isStop === true) {
      opts.onProcess && opts.onProcess(1);
      opts.onAnimationFinish && opts.onAnimationFinish();
      return;
    }
    if (startTimeStamp === null) {
      startTimeStamp = timestamp;
    }
    if (timestamp - startTimeStamp < opts.duration) {
      var process = (timestamp - startTimeStamp) / opts.duration;
      var timingFunction = Timing[opts.timing];
      process = timingFunction(process);

      opts.onProcess && opts.onProcess(process);
      animationFrame(_step, delay);
    } else {
      opts.onProcess && opts.onProcess(1);
      opts.onAnimationFinish && opts.onAnimationFinish();
    }
  };
  _step = _step.bind(this);
  animationFrame(_step, delay);
}

// stop animation immediately
// and tigger onAnimationFinish
Animation.prototype.stop = function () {
  this.isStop = true;
};

function drawCharts(type, opts, config, context) {
  var _this = this;
  var series = opts.series;
  var categories = opts.categories;
  series = fillSeries(series, opts, config);
  var duration = opts.animation ? opts.duration : 0;
  _this.animationInstance && _this.animationInstance.stop();
  var seriesMA = null;
  if (type == 'candle') {
    var average = assign({}, opts.extra.candle.average);
    if (average.show) {
      seriesMA = calCandleMA(average.day, average.name, average.color, series[0].data);
      seriesMA = fillSeries(seriesMA, opts, config);
      opts.seriesMA = seriesMA;
    } else if (opts.seriesMA) {
      seriesMA = opts.seriesMA = fillSeries(opts.seriesMA, opts, config);
    } else {
      seriesMA = series;
    }
  } else {
    seriesMA = series;
  }

  /* 过滤掉show=false的series */
  opts._series_ = series = filterSeries(series);

  //重新计算图表区域

  opts.area = new Array(4);
  //复位绘图区域
  for (var j = 0; j < 4; j++) {
    opts.area[j] = opts.padding[j];
  }

  //通过计算三大区域：图例、X轴、Y轴的大小，确定绘图区域
  var _calLegendData = calLegendData(seriesMA, opts, config, opts.chartData),
  legendHeight = _calLegendData.area.wholeHeight,
  legendWidth = _calLegendData.area.wholeWidth;

  switch (opts.legend.position) {
    case 'top':
      opts.area[0] += legendHeight;
      break;
    case 'bottom':
      opts.area[2] += legendHeight;
      break;
    case 'left':
      opts.area[3] += legendWidth;
      break;
    case 'right':
      opts.area[1] += legendWidth;
      break;}


  var _calYAxisData = {},yAxisWidth = 0;
  if (opts.type === 'line' || opts.type === 'column' || opts.type === 'area' || opts.type === 'mix' || opts.type === 'candle') {
    _calYAxisData = calYAxisData(series, opts, config);
    yAxisWidth = _calYAxisData.yAxisWidth;
    //如果显示Y轴标题
    if (opts.yAxis.showTitle) {
      var maxTitleHeight = 0;
      for (var i = 0; i < opts.yAxis.data.length; i++) {
        maxTitleHeight = Math.max(maxTitleHeight, opts.yAxis.data[i].titleFontSize ? opts.yAxis.data[i].titleFontSize : config.fontSize);
      }
      opts.area[0] += (maxTitleHeight + 6) * opts.pixelRatio;
    }
    var rightIndex = 0,leftIndex = 0;
    //计算主绘图区域左右位置
    for (var _i24 = 0; _i24 < yAxisWidth.length; _i24++) {
      if (yAxisWidth[_i24].position == 'left') {
        if (leftIndex > 0) {
          opts.area[3] += yAxisWidth[_i24].width + opts.yAxis.padding;
        } else {
          opts.area[3] += yAxisWidth[_i24].width;
        }
        leftIndex += 1;
      } else {
        if (rightIndex > 0) {
          opts.area[1] += yAxisWidth[_i24].width + opts.yAxis.padding;
        } else {
          opts.area[1] += yAxisWidth[_i24].width;
        }
        rightIndex += 1;
      }
    }
  } else {
    config.yAxisWidth = yAxisWidth;
  }
  opts.chartData.yAxisData = _calYAxisData;

  if (opts.categories && opts.categories.length) {
    opts.chartData.xAxisData = getXAxisPoints(opts.categories, opts, config);
    var _calCategoriesData = calCategoriesData(opts.categories, opts, config, opts.chartData.xAxisData.eachSpacing),
    xAxisHeight = _calCategoriesData.xAxisHeight,
    angle = _calCategoriesData.angle;
    config.xAxisHeight = xAxisHeight;
    config._xAxisTextAngle_ = angle;
    opts.area[2] += xAxisHeight;
    opts.chartData.categoriesData = _calCategoriesData;
  } else {
    if (opts.type === 'line' || opts.type === 'area' || opts.type === 'points') {
      opts.chartData.xAxisData = calXAxisData(series, opts, config);
      categories = opts.chartData.xAxisData.rangesFormat;
      var _calCategoriesData2 = calCategoriesData(categories, opts, config, opts.chartData.xAxisData.eachSpacing),
      _xAxisHeight = _calCategoriesData2.xAxisHeight,
      _angle = _calCategoriesData2.angle;
      config.xAxisHeight = _xAxisHeight;
      config._xAxisTextAngle_ = _angle;
      opts.area[2] += _xAxisHeight;
      opts.chartData.categoriesData = _calCategoriesData2;
    } else {
      opts.chartData.xAxisData = {
        xAxisPoints: [] };

    }
  }
  //计算右对齐偏移距离
  if (opts.enableScroll && opts.xAxis.scrollAlign == 'right' && opts._scrollDistance_ === undefined) {
    var offsetLeft = 0,
    xAxisPoints = opts.chartData.xAxisData.xAxisPoints,
    startX = opts.chartData.xAxisData.startX,
    endX = opts.chartData.xAxisData.endX,
    eachSpacing = opts.chartData.xAxisData.eachSpacing;
    var totalWidth = eachSpacing * (xAxisPoints.length - 1);
    var screenWidth = endX - startX;
    offsetLeft = screenWidth - totalWidth;
    _this.scrollOption = {
      currentOffset: offsetLeft,
      startTouchX: offsetLeft,
      distance: 0,
      lastMoveTime: 0 };

    opts._scrollDistance_ = offsetLeft;
  }

  if (type === 'pie' || type === 'ring' || type === 'rose') {
    config._pieTextMaxLength_ = opts.dataLabel === false ? 0 : getPieTextMaxLength(seriesMA);
  }

  switch (type) {
    case 'word':
      var wordOption = assign({}, {
        type: 'normal',
        autoColors: true },
      opts.extra.word);
      if (opts.updateData == true || opts.updateData == undefined) {
        opts.chartData.wordCloudData = getWordCloudPoint(opts, wordOption.type);
      }
      this.animationInstance = new Animation({
        timing: 'easeInOut',
        duration: duration,
        onProcess: function onProcess(process) {
          context.clearRect(0, 0, opts.width, opts.height);
          if (opts.rotate) {
            contextRotate(context, opts);
          }
          drawWordCloudDataPoints(series, opts, config, context, process);
          drawCanvas(opts, context);
        },
        onAnimationFinish: function onAnimationFinish() {
          _this.event.trigger('renderComplete');
        } });

      break;
    case 'map':
      context.clearRect(0, 0, opts.width, opts.height);
      drawMapDataPoints(series, opts, config, context);
      break;
    case 'funnel':
      this.animationInstance = new Animation({
        timing: 'easeInOut',
        duration: duration,
        onProcess: function onProcess(process) {
          context.clearRect(0, 0, opts.width, opts.height);
          if (opts.rotate) {
            contextRotate(context, opts);
          }
          opts.chartData.funnelData = drawFunnelDataPoints(series, opts, config, context, process);
          drawLegend(opts.series, opts, config, context, opts.chartData);
          drawToolTipBridge(opts, config, context, process);
          drawCanvas(opts, context);
        },
        onAnimationFinish: function onAnimationFinish() {
          _this.event.trigger('renderComplete');
        } });

      break;
    case 'line':
      this.animationInstance = new Animation({
        timing: 'easeIn',
        duration: duration,
        onProcess: function onProcess(process) {
          context.clearRect(0, 0, opts.width, opts.height);
          if (opts.rotate) {
            contextRotate(context, opts);
          }
          drawYAxisGrid(categories, opts, config, context);
          drawXAxis(categories, opts, config, context);
          var _drawLineDataPoints = drawLineDataPoints(series, opts, config, context, process),
          xAxisPoints = _drawLineDataPoints.xAxisPoints,
          calPoints = _drawLineDataPoints.calPoints,
          eachSpacing = _drawLineDataPoints.eachSpacing;
          opts.chartData.xAxisPoints = xAxisPoints;
          opts.chartData.calPoints = calPoints;
          opts.chartData.eachSpacing = eachSpacing;
          drawYAxis(series, opts, config, context);
          if (opts.enableMarkLine !== false && process === 1) {
            drawMarkLine(opts, config, context);
          }
          drawLegend(opts.series, opts, config, context, opts.chartData);
          drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
          drawCanvas(opts, context);

        },
        onAnimationFinish: function onAnimationFinish() {
          _this.event.trigger('renderComplete');
        } });

      break;
    case 'mix':
      this.animationInstance = new Animation({
        timing: 'easeIn',
        duration: duration,
        onProcess: function onProcess(process) {
          context.clearRect(0, 0, opts.width, opts.height);
          if (opts.rotate) {
            contextRotate(context, opts);
          }
          drawYAxisGrid(categories, opts, config, context);
          drawXAxis(categories, opts, config, context);
          var _drawMixDataPoints = drawMixDataPoints(series, opts, config, context, process),
          xAxisPoints = _drawMixDataPoints.xAxisPoints,
          calPoints = _drawMixDataPoints.calPoints,
          eachSpacing = _drawMixDataPoints.eachSpacing;
          opts.chartData.xAxisPoints = xAxisPoints;
          opts.chartData.calPoints = calPoints;
          opts.chartData.eachSpacing = eachSpacing;
          drawYAxis(series, opts, config, context);
          if (opts.enableMarkLine !== false && process === 1) {
            drawMarkLine(opts, config, context);
          }
          drawLegend(opts.series, opts, config, context, opts.chartData);
          drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
          drawCanvas(opts, context);
        },
        onAnimationFinish: function onAnimationFinish() {
          _this.event.trigger('renderComplete');
        } });

      break;
    case 'column':
      this.animationInstance = new Animation({
        timing: 'easeIn',
        duration: duration,
        onProcess: function onProcess(process) {
          context.clearRect(0, 0, opts.width, opts.height);
          if (opts.rotate) {
            contextRotate(context, opts);
          }
          drawYAxisGrid(categories, opts, config, context);
          drawXAxis(categories, opts, config, context);
          var _drawColumnDataPoints = drawColumnDataPoints(series, opts, config, context, process),
          xAxisPoints = _drawColumnDataPoints.xAxisPoints,
          calPoints = _drawColumnDataPoints.calPoints,
          eachSpacing = _drawColumnDataPoints.eachSpacing;
          opts.chartData.xAxisPoints = xAxisPoints;
          opts.chartData.calPoints = calPoints;
          opts.chartData.eachSpacing = eachSpacing;
          drawYAxis(series, opts, config, context);
          if (opts.enableMarkLine !== false && process === 1) {
            drawMarkLine(opts, config, context);
          }
          drawLegend(opts.series, opts, config, context, opts.chartData);
          drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
          drawCanvas(opts, context);
        },
        onAnimationFinish: function onAnimationFinish() {
          _this.event.trigger('renderComplete');
        } });

      break;
    case 'area':
      this.animationInstance = new Animation({
        timing: 'easeIn',
        duration: duration,
        onProcess: function onProcess(process) {
          context.clearRect(0, 0, opts.width, opts.height);
          if (opts.rotate) {
            contextRotate(context, opts);
          }
          drawYAxisGrid(categories, opts, config, context);
          drawXAxis(categories, opts, config, context);
          var _drawAreaDataPoints = drawAreaDataPoints(series, opts, config, context, process),
          xAxisPoints = _drawAreaDataPoints.xAxisPoints,
          calPoints = _drawAreaDataPoints.calPoints,
          eachSpacing = _drawAreaDataPoints.eachSpacing;
          opts.chartData.xAxisPoints = xAxisPoints;
          opts.chartData.calPoints = calPoints;
          opts.chartData.eachSpacing = eachSpacing;
          drawYAxis(series, opts, config, context);
          if (opts.enableMarkLine !== false && process === 1) {
            drawMarkLine(opts, config, context);
          }
          drawLegend(opts.series, opts, config, context, opts.chartData);
          drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
          drawCanvas(opts, context);
        },
        onAnimationFinish: function onAnimationFinish() {
          _this.event.trigger('renderComplete');
        } });

      break;
    case 'ring':
    case 'pie':
      this.animationInstance = new Animation({
        timing: 'easeInOut',
        duration: duration,
        onProcess: function onProcess(process) {
          context.clearRect(0, 0, opts.width, opts.height);
          if (opts.rotate) {
            contextRotate(context, opts);
          }
          opts.chartData.pieData = drawPieDataPoints(series, opts, config, context, process);
          drawLegend(opts.series, opts, config, context, opts.chartData);
          drawToolTipBridge(opts, config, context, process);
          drawCanvas(opts, context);
        },
        onAnimationFinish: function onAnimationFinish() {
          _this.event.trigger('renderComplete');
        } });

      break;
    case 'rose':
      this.animationInstance = new Animation({
        timing: 'easeInOut',
        duration: duration,
        onProcess: function onProcess(process) {
          context.clearRect(0, 0, opts.width, opts.height);
          if (opts.rotate) {
            contextRotate(context, opts);
          }
          opts.chartData.pieData = drawRoseDataPoints(series, opts, config, context, process);
          drawLegend(opts.series, opts, config, context, opts.chartData);
          drawToolTipBridge(opts, config, context, process);
          drawCanvas(opts, context);
        },
        onAnimationFinish: function onAnimationFinish() {
          _this.event.trigger('renderComplete');
        } });

      break;
    case 'radar':
      this.animationInstance = new Animation({
        timing: 'easeInOut',
        duration: duration,
        onProcess: function onProcess(process) {
          context.clearRect(0, 0, opts.width, opts.height);
          if (opts.rotate) {
            contextRotate(context, opts);
          }
          opts.chartData.radarData = drawRadarDataPoints(series, opts, config, context, process);
          drawLegend(opts.series, opts, config, context, opts.chartData);
          drawToolTipBridge(opts, config, context, process);
          drawCanvas(opts, context);
        },
        onAnimationFinish: function onAnimationFinish() {
          _this.event.trigger('renderComplete');
        } });

      break;
    case 'arcbar':
      this.animationInstance = new Animation({
        timing: 'easeInOut',
        duration: duration,
        onProcess: function onProcess(process) {
          context.clearRect(0, 0, opts.width, opts.height);
          if (opts.rotate) {
            contextRotate(context, opts);
          }
          opts.chartData.arcbarData = drawArcbarDataPoints(series, opts, config, context, process);
          drawCanvas(opts, context);
        },
        onAnimationFinish: function onAnimationFinish() {
          _this.event.trigger('renderComplete');
        } });

      break;
    case 'gauge':
      this.animationInstance = new Animation({
        timing: 'easeInOut',
        duration: duration,
        onProcess: function onProcess(process) {
          context.clearRect(0, 0, opts.width, opts.height);
          if (opts.rotate) {
            contextRotate(context, opts);
          }
          opts.chartData.gaugeData = drawGaugeDataPoints(categories, series, opts, config, context, process);
          drawCanvas(opts, context);
        },
        onAnimationFinish: function onAnimationFinish() {
          _this.event.trigger('renderComplete');
        } });

      break;
    case 'candle':
      this.animationInstance = new Animation({
        timing: 'easeIn',
        duration: duration,
        onProcess: function onProcess(process) {
          context.clearRect(0, 0, opts.width, opts.height);
          if (opts.rotate) {
            contextRotate(context, opts);
          }
          drawYAxisGrid(categories, opts, config, context);
          drawXAxis(categories, opts, config, context);
          var _drawCandleDataPoints = drawCandleDataPoints(series, seriesMA, opts, config, context, process),
          xAxisPoints = _drawCandleDataPoints.xAxisPoints,
          calPoints = _drawCandleDataPoints.calPoints,
          eachSpacing = _drawCandleDataPoints.eachSpacing;
          opts.chartData.xAxisPoints = xAxisPoints;
          opts.chartData.calPoints = calPoints;
          opts.chartData.eachSpacing = eachSpacing;
          drawYAxis(series, opts, config, context);
          if (opts.enableMarkLine !== false && process === 1) {
            drawMarkLine(opts, config, context);
          }
          if (seriesMA) {
            drawLegend(seriesMA, opts, config, context, opts.chartData);
          } else {
            drawLegend(opts.series, opts, config, context, opts.chartData);
          }
          drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
          drawCanvas(opts, context);
        },
        onAnimationFinish: function onAnimationFinish() {
          _this.event.trigger('renderComplete');
        } });

      break;}

}

// simple event implement

function Event() {
  this.events = {};
}

Event.prototype.addEventListener = function (type, listener) {
  this.events[type] = this.events[type] || [];
  this.events[type].push(listener);
};

Event.prototype.trigger = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var type = args[0];
  var params = args.slice(1);
  if (!!this.events[type]) {
    this.events[type].forEach(function (listener) {
      try {
        listener.apply(null, params);
      } catch (e) {
        console.error(e);
      }
    });
  }
};

var Charts = function Charts(opts) {
  opts.pixelRatio = opts.pixelRatio ? opts.pixelRatio : 1;
  opts.fontSize = opts.fontSize ? opts.fontSize * opts.pixelRatio : 13 * opts.pixelRatio;
  opts.title = assign({}, opts.title);
  opts.subtitle = assign({}, opts.subtitle);
  opts.duration = opts.duration ? opts.duration : 1000;
  opts.yAxis = assign({}, {
    data: [],
    showTitle: false,
    disabled: false,
    disableGrid: false,
    splitNumber: 5,
    gridType: 'solid',
    dashLength: 4 * opts.pixelRatio,
    gridColor: '#cccccc',
    padding: 10,
    fontColor: '#666666' },
  opts.yAxis);
  opts.yAxis.dashLength *= opts.pixelRatio;
  opts.yAxis.padding *= opts.pixelRatio;
  opts.xAxis = assign({}, {
    rotateLabel: false,
    type: 'calibration',
    gridType: 'solid',
    dashLength: 4,
    scrollAlign: 'left',
    boundaryGap: 'center',
    axisLine: true,
    axisLineColor: '#cccccc' },
  opts.xAxis);
  opts.xAxis.dashLength *= opts.pixelRatio;
  opts.legend = assign({}, {
    show: true,
    position: 'bottom',
    float: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
    padding: 5,
    margin: 5,
    itemGap: 10,
    fontSize: opts.fontSize,
    lineHeight: opts.fontSize,
    fontColor: '#333333',
    format: {},
    hiddenColor: '#CECECE' },
  opts.legend);
  opts.legend.borderWidth = opts.legend.borderWidth * opts.pixelRatio;
  opts.legend.itemGap = opts.legend.itemGap * opts.pixelRatio;
  opts.legend.padding = opts.legend.padding * opts.pixelRatio;
  opts.legend.margin = opts.legend.margin * opts.pixelRatio;
  opts.extra = assign({}, opts.extra);
  opts.rotate = opts.rotate ? true : false;
  opts.animation = opts.animation ? true : false;
  opts.rotate = opts.rotate ? true : false;

  var config$$1 = JSON.parse(JSON.stringify(config));
  config$$1.colors = opts.colors ? opts.colors : config$$1.colors;
  config$$1.yAxisTitleWidth = opts.yAxis.disabled !== true && opts.yAxis.title ? config$$1.yAxisTitleWidth : 0;
  if (opts.type == 'pie' || opts.type == 'ring') {
    config$$1.pieChartLinePadding = opts.dataLabel === false ? 0 : opts.extra.pie.labelWidth * opts.pixelRatio || config$$1.pieChartLinePadding * opts.pixelRatio;
  }
  if (opts.type == 'rose') {
    config$$1.pieChartLinePadding = opts.dataLabel === false ? 0 : opts.extra.rose.labelWidth * opts.pixelRatio || config$$1.pieChartLinePadding * opts.pixelRatio;
  }
  config$$1.pieChartTextPadding = opts.dataLabel === false ? 0 : config$$1.pieChartTextPadding * opts.pixelRatio;
  config$$1.yAxisSplit = opts.yAxis.splitNumber ? opts.yAxis.splitNumber : config.yAxisSplit;

  //屏幕旋转
  config$$1.rotate = opts.rotate;
  if (opts.rotate) {
    var tempWidth = opts.width;
    var tempHeight = opts.height;
    opts.width = tempHeight;
    opts.height = tempWidth;
  }

  //适配高分屏
  opts.padding = opts.padding ? opts.padding : config$$1.padding;
  for (var i = 0; i < 4; i++) {
    opts.padding[i] *= opts.pixelRatio;
  }
  config$$1.yAxisWidth = config.yAxisWidth * opts.pixelRatio;
  config$$1.xAxisHeight = config.xAxisHeight * opts.pixelRatio;
  if (opts.enableScroll && opts.xAxis.scrollShow) {
    config$$1.xAxisHeight += 6 * opts.pixelRatio;
  }
  config$$1.xAxisLineHeight = config.xAxisLineHeight * opts.pixelRatio;
  config$$1.fontSize = opts.fontSize;
  config$$1.titleFontSize = config.titleFontSize * opts.pixelRatio;
  config$$1.subtitleFontSize = config.subtitleFontSize * opts.pixelRatio;
  config$$1.toolTipPadding = config.toolTipPadding * opts.pixelRatio;
  config$$1.toolTipLineHeight = config.toolTipLineHeight * opts.pixelRatio;
  config$$1.columePadding = config.columePadding * opts.pixelRatio;
  opts.$this = opts.$this ? opts.$this : this;

  this.context = uni.createCanvasContext(opts.canvasId, opts.$this);
  /* 兼容原生H5
                                                                     this.context = document.getElementById(opts.canvasId).getContext("2d");
                                                                     this.context.setStrokeStyle = function(e){ return this.strokeStyle=e; }
                                                                     this.context.setLineWidth = function(e){ return this.lineWidth=e; }
                                                                     this.context.setLineCap = function(e){ return this.lineCap=e; }
                                                                     this.context.setFontSize = function(e){ return this.font=e+"px sans-serif"; }
                                                                     this.context.setFillStyle = function(e){ return this.fillStyle=e; }
                                                                     this.context.draw = function(){ }
                                                                     */

  opts.chartData = {};
  this.event = new Event();
  this.scrollOption = {
    currentOffset: 0,
    startTouchX: 0,
    distance: 0,
    lastMoveTime: 0 };


  this.opts = opts;
  this.config = config$$1;

  drawCharts.call(this, opts.type, opts, config$$1, this.context);
};

Charts.prototype.updateData = function () {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  this.opts = assign({}, this.opts, data);
  this.opts.updateData = true;
  var scrollPosition = data.scrollPosition || 'current';
  switch (scrollPosition) {
    case 'current':
      this.opts._scrollDistance_ = this.scrollOption.currentOffset;
      break;
    case 'left':
      this.opts._scrollDistance_ = 0;
      this.scrollOption = {
        currentOffset: 0,
        startTouchX: 0,
        distance: 0,
        lastMoveTime: 0 };

      break;
    case 'right':
      var _calYAxisData = calYAxisData(this.opts.series, this.opts, this.config),
      yAxisWidth = _calYAxisData.yAxisWidth;
      this.config.yAxisWidth = yAxisWidth;
      var offsetLeft = 0;
      var _getXAxisPoints0 = getXAxisPoints(this.opts.categories, this.opts, this.config),
      xAxisPoints = _getXAxisPoints0.xAxisPoints,
      startX = _getXAxisPoints0.startX,
      endX = _getXAxisPoints0.endX,
      eachSpacing = _getXAxisPoints0.eachSpacing;
      var totalWidth = eachSpacing * (xAxisPoints.length - 1);
      var screenWidth = endX - startX;
      offsetLeft = screenWidth - totalWidth;
      this.scrollOption = {
        currentOffset: offsetLeft,
        startTouchX: offsetLeft,
        distance: 0,
        lastMoveTime: 0 };

      this.opts._scrollDistance_ = offsetLeft;
      break;}

  drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
};

Charts.prototype.zoom = function () {
  var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.opts.xAxis.itemCount;
  if (this.opts.enableScroll !== true) {
    console.log('请启用滚动条后使用！');
    return;
  }
  //当前屏幕中间点
  var centerPoint = Math.round(Math.abs(this.scrollOption.currentOffset) / this.opts.chartData.eachSpacing) + Math.round(
  this.opts.xAxis.itemCount / 2);
  this.opts.animation = false;
  this.opts.xAxis.itemCount = val.itemCount;
  //重新计算x轴偏移距离
  var _calYAxisData = calYAxisData(this.opts.series, this.opts, this.config),
  yAxisWidth = _calYAxisData.yAxisWidth;
  this.config.yAxisWidth = yAxisWidth;
  var offsetLeft = 0;
  var _getXAxisPoints0 = getXAxisPoints(this.opts.categories, this.opts, this.config),
  xAxisPoints = _getXAxisPoints0.xAxisPoints,
  startX = _getXAxisPoints0.startX,
  endX = _getXAxisPoints0.endX,
  eachSpacing = _getXAxisPoints0.eachSpacing;
  var centerLeft = eachSpacing * centerPoint;
  var screenWidth = endX - startX;
  var MaxLeft = screenWidth - eachSpacing * (xAxisPoints.length - 1);
  offsetLeft = screenWidth / 2 - centerLeft;
  if (offsetLeft > 0) {
    offsetLeft = 0;
  }
  if (offsetLeft < MaxLeft) {
    offsetLeft = MaxLeft;
  }
  this.scrollOption = {
    currentOffset: offsetLeft,
    startTouchX: offsetLeft,
    distance: 0,
    lastMoveTime: 0 };

  this.opts._scrollDistance_ = offsetLeft;
  drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
};

Charts.prototype.stopAnimation = function () {
  this.animationInstance && this.animationInstance.stop();
};

Charts.prototype.addEventListener = function (type, listener) {
  this.event.addEventListener(type, listener);
};

Charts.prototype.getCurrentDataIndex = function (e) {
  var touches = null;
  if (e.changedTouches) {
    touches = e.changedTouches[0];
  } else {
    touches = e.mp.changedTouches[0];
  }
  if (touches) {
    var _touches$ = getTouches(touches, this.opts, e);
    if (this.opts.type === 'pie' || this.opts.type === 'ring' || this.opts.type === 'rose') {
      return findPieChartCurrentIndex({
        x: _touches$.x,
        y: _touches$.y },
      this.opts.chartData.pieData);
    } else if (this.opts.type === 'radar') {
      return findRadarChartCurrentIndex({
        x: _touches$.x,
        y: _touches$.y },
      this.opts.chartData.radarData, this.opts.categories.length);
    } else if (this.opts.type === 'funnel') {
      return findFunnelChartCurrentIndex({
        x: _touches$.x,
        y: _touches$.y },
      this.opts.chartData.funnelData);
    } else if (this.opts.type === 'map') {
      return findMapChartCurrentIndex({
        x: _touches$.x,
        y: _touches$.y },
      this.opts);
    } else if (this.opts.type === 'word') {
      return findWordChartCurrentIndex({
        x: _touches$.x,
        y: _touches$.y },
      this.opts.chartData.wordCloudData);
    } else {
      return findCurrentIndex({
        x: _touches$.x,
        y: _touches$.y },
      this.opts.chartData.calPoints, this.opts, this.config, Math.abs(this.scrollOption.currentOffset));
    }
  }
  return -1;
};

Charts.prototype.getLegendDataIndex = function (e) {
  var touches = null;
  if (e.changedTouches) {
    touches = e.changedTouches[0];
  } else {
    touches = e.mp.changedTouches[0];
  }
  if (touches) {
    var _touches$ = getTouches(touches, this.opts, e);
    return findLegendIndex({
      x: _touches$.x,
      y: _touches$.y },
    this.opts.chartData.legendData);
  }
  return -1;
};

Charts.prototype.touchLegend = function (e) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var touches = null;
  if (e.changedTouches) {
    touches = e.changedTouches[0];
  } else {
    touches = e.mp.changedTouches[0];
  }
  if (touches) {
    var _touches$ = getTouches(touches, this.opts, e);
    var index = this.getLegendDataIndex(e);
    if (index >= 0) {
      this.opts.series[index].show = !this.opts.series[index].show;
      this.opts.animation = option.animation ? true : false;
      this.opts._scrollDistance_ = this.scrollOption.currentOffset;
      drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
    }
  }

};

Charts.prototype.showToolTip = function (e) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var touches = null;
  if (e.changedTouches) {
    touches = e.changedTouches[0];
  } else {
    touches = e.mp.changedTouches[0];
  }
  if (!touches) {
    console.log("touchError");
  }
  var _touches$ = getTouches(touches, this.opts, e);
  var currentOffset = this.scrollOption.currentOffset;
  var opts = assign({}, this.opts, {
    _scrollDistance_: currentOffset,
    animation: false });

  if (this.opts.type === 'line' || this.opts.type === 'area' || this.opts.type === 'column') {
    var index = option.index == undefined ? this.getCurrentDataIndex(e) : option.index;
    if (index > -1) {
      var seriesData = getSeriesDataItem(this.opts.series, index);
      if (seriesData.length !== 0) {
        var _getToolTipData = getToolTipData(seriesData, this.opts.chartData.calPoints, index, this.opts.categories, option),
        textList = _getToolTipData.textList,
        offset = _getToolTipData.offset;
        offset.y = _touches$.y;
        opts.tooltip = {
          textList: option.textList ? option.textList : textList,
          offset: offset,
          option: option,
          index: index };

      }
    }
    drawCharts.call(this, opts.type, opts, this.config, this.context);
  }
  if (this.opts.type === 'mix') {
    var index = option.index == undefined ? this.getCurrentDataIndex(e) : option.index;
    if (index > -1) {
      var currentOffset = this.scrollOption.currentOffset;
      var opts = assign({}, this.opts, {
        _scrollDistance_: currentOffset,
        animation: false });

      var seriesData = getSeriesDataItem(this.opts.series, index);
      if (seriesData.length !== 0) {
        var _getMixToolTipData = getMixToolTipData(seriesData, this.opts.chartData.calPoints, index, this.opts.categories, option),
        textList = _getMixToolTipData.textList,
        offset = _getMixToolTipData.offset;
        offset.y = _touches$.y;
        opts.tooltip = {
          textList: option.textList ? option.textList : textList,
          offset: offset,
          option: option,
          index: index };

      }
    }
    drawCharts.call(this, opts.type, opts, this.config, this.context);
  }
  if (this.opts.type === 'candle') {
    var index = option.index == undefined ? this.getCurrentDataIndex(e) : option.index;
    if (index > -1) {
      var currentOffset = this.scrollOption.currentOffset;
      var opts = assign({}, this.opts, {
        _scrollDistance_: currentOffset,
        animation: false });

      var seriesData = getSeriesDataItem(this.opts.series, index);
      if (seriesData.length !== 0) {
        var _getToolTipData = getCandleToolTipData(this.opts.series[0].data, seriesData, this.opts.chartData.calPoints,
        index, this.opts.categories, this.opts.extra.candle, option),
        textList = _getToolTipData.textList,
        offset = _getToolTipData.offset;
        offset.y = _touches$.y;
        opts.tooltip = {
          textList: option.textList ? option.textList : textList,
          offset: offset,
          option: option,
          index: index };

      }
    }
    drawCharts.call(this, opts.type, opts, this.config, this.context);
  }
  if (this.opts.type === 'pie' || this.opts.type === 'ring' || this.opts.type === 'rose' || this.opts.type === 'funnel') {
    var index = option.index == undefined ? this.getCurrentDataIndex(e) : option.index;
    if (index > -1) {
      var currentOffset = this.scrollOption.currentOffset;
      var opts = assign({}, this.opts, {
        _scrollDistance_: currentOffset,
        animation: false });

      var seriesData = this.opts._series_[index];
      var textList = [{
        text: option.format ? option.format(seriesData) : seriesData.name + ': ' + seriesData.data,
        color: seriesData.color }];

      var offset = {
        x: _touches$.x,
        y: _touches$.y };

      opts.tooltip = {
        textList: option.textList ? option.textList : textList,
        offset: offset,
        option: option,
        index: index };

    }
    drawCharts.call(this, opts.type, opts, this.config, this.context);
  }
  if (this.opts.type === 'map' || this.opts.type === 'word') {
    var index = option.index == undefined ? this.getCurrentDataIndex(e) : option.index;
    if (index > -1) {
      var currentOffset = this.scrollOption.currentOffset;
      var opts = assign({}, this.opts, {
        _scrollDistance_: currentOffset,
        animation: false });

      var seriesData = this.opts._series_[index];
      var textList = [{
        text: option.format ? option.format(seriesData) : seriesData.properties.name,
        color: seriesData.color }];

      var offset = {
        x: _touches$.x,
        y: _touches$.y };

      opts.tooltip = {
        textList: option.textList ? option.textList : textList,
        offset: offset,
        option: option,
        index: index };

    }
    opts.updateData = false;
    drawCharts.call(this, opts.type, opts, this.config, this.context);
  }
  if (this.opts.type === 'radar') {
    var index = option.index == undefined ? this.getCurrentDataIndex(e) : option.index;
    if (index > -1) {
      var currentOffset = this.scrollOption.currentOffset;
      var opts = assign({}, this.opts, {
        _scrollDistance_: currentOffset,
        animation: false });

      var seriesData = getSeriesDataItem(this.opts.series, index);
      if (seriesData.length !== 0) {
        var textList = seriesData.map(function (item) {
          return {
            text: option.format ? option.format(item) : item.name + ': ' + item.data,
            color: item.color };

        });
        var offset = {
          x: _touches$.x,
          y: _touches$.y };

        opts.tooltip = {
          textList: option.textList ? option.textList : textList,
          offset: offset,
          option: option,
          index: index };

      }
    }
    drawCharts.call(this, opts.type, opts, this.config, this.context);
  }
};

Charts.prototype.translate = function (distance) {
  this.scrollOption = {
    currentOffset: distance,
    startTouchX: distance,
    distance: 0,
    lastMoveTime: 0 };

  var opts = assign({}, this.opts, {
    _scrollDistance_: distance,
    animation: false });

  drawCharts.call(this, this.opts.type, opts, this.config, this.context);
};

Charts.prototype.scrollStart = function (e) {
  var touches = null;
  if (e.changedTouches) {
    touches = e.changedTouches[0];
  } else {
    touches = e.mp.changedTouches[0];
  }
  var _touches$ = getTouches(touches, this.opts, e);
  if (touches && this.opts.enableScroll === true) {
    this.scrollOption.startTouchX = _touches$.x;
  }
};

Charts.prototype.scroll = function (e) {
  if (this.scrollOption.lastMoveTime === 0) {
    this.scrollOption.lastMoveTime = Date.now();
  }
  var Limit = this.opts.extra.touchMoveLimit || 20;
  var currMoveTime = Date.now();
  var duration = currMoveTime - this.scrollOption.lastMoveTime;
  if (duration < Math.floor(1000 / Limit)) return;
  this.scrollOption.lastMoveTime = currMoveTime;
  var touches = null;
  if (e.changedTouches) {
    touches = e.changedTouches[0];
  } else {
    touches = e.mp.changedTouches[0];
  }
  if (touches && this.opts.enableScroll === true) {
    var _touches$ = getTouches(touches, this.opts, e);
    var _distance;
    _distance = _touches$.x - this.scrollOption.startTouchX;
    var currentOffset = this.scrollOption.currentOffset;
    var validDistance = calValidDistance(this, currentOffset + _distance, this.opts.chartData, this.config, this.opts);
    this.scrollOption.distance = _distance = validDistance - currentOffset;
    var opts = assign({}, this.opts, {
      _scrollDistance_: currentOffset + _distance,
      animation: false });

    drawCharts.call(this, opts.type, opts, this.config, this.context);
    return currentOffset + _distance;
  }
};

Charts.prototype.scrollEnd = function (e) {
  if (this.opts.enableScroll === true) {
    var _scrollOption = this.scrollOption,
    currentOffset = _scrollOption.currentOffset,
    distance = _scrollOption.distance;
    this.scrollOption.currentOffset = currentOffset + distance;
    this.scrollOption.distance = 0;
  }
};
if ( true && typeof module.exports === "object") {
  module.exports = Charts;
  //export default Charts;//建议使用nodejs的module导出方式，如报错请使用export方式导出
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 67 */
/*!******************************************************!*\
  !*** D:/iotat/2020.7/weather/components/calendar.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.calendar = void 0; /**
                                                                                                      * @1900-2100区间内的公历、农历互转
                                                                                                      * @charset UTF-8
                                                                                                      * @Author  Jea杨(JJonline@JJonline.Cn)
                                                                                                      * @Time    2014-7-21
                                                                                                      * @Time    2016-8-13 Fixed 2033hex、Attribution Annals
                                                                                                      * @Time    2016-9-25 Fixed lunar LeapMonth Param Bug
                                                                                                      * @Time    2017-7-24 Fixed use getTerm Func Param Error.use solar year,NOT lunar year
                                                                                                      * @Version 1.0.3
                                                                                                      * @公历转农历：calendar.solar2lunar(1987,11,01); //[you can ignore params of prefix 0]
                                                                                                      * @农历转公历：calendar.lunar2solar(1987,09,10); //[you can ignore params of prefix 0]
                                                                                                      */
var calendar = {

  /**
                   * 农历1900-2100的润大小信息表
                   * @Array Of Property
                   * @return Hex
                   */
  lunarInfo: [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, //1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, //1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, //1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x16a95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, //1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, //1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
  /**Add By JJonline@JJonline.Cn**/
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
  0x0d520], //2100

  /**
    * 公历每个月份的天数普通表
    * @Array Of Property
    * @return Number
    */
  solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

  /**
                                                                  * 天干地支之天干速查表
                                                                  * @Array Of Property trans["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]
                                                                  * @return Cn string
                                                                  */
  Gan: ["\u7532", "\u4E59", "\u4E19", "\u4E01", "\u620A", "\u5DF1", "\u5E9A", "\u8F9B", "\u58EC", "\u7678"],

  /**
                                                                                                               * 天干地支之地支速查表
                                                                                                               * @Array Of Property
                                                                                                               * @trans["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]
                                                                                                               * @return Cn string
                                                                                                               */
  Zhi: ["\u5B50", "\u4E11", "\u5BC5", "\u536F", "\u8FB0", "\u5DF3", "\u5348", "\u672A", "\u7533", "\u9149", "\u620C", "\u4EA5"],

  /**
                                                                                                                                   * 天干地支之地支速查表<=>生肖
                                                                                                                                   * @Array Of Property
                                                                                                                                   * @trans["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]
                                                                                                                                   * @return Cn string
                                                                                                                                   */
  Animals: ["\u9F20", "\u725B", "\u864E", "\u5154", "\u9F99", "\u86C7", "\u9A6C", "\u7F8A", "\u7334", "\u9E21", "\u72D7", "\u732A"],

  /**
                                                                                                                                      * 阳历节日
                                                                                                                                      */
  festival: {
    '1-1': { title: '元旦节' },
    '2-14': { title: '情人节' },
    '5-1': { title: '劳动节' },
    '5-4': { title: '青年节' },
    '6-1': { title: '儿童节' },
    '9-10': { title: '教师节' },
    '10-1': { title: '国庆节' },
    '12-25': { title: '圣诞节' },

    '3-8': { title: '妇女节' },
    '3-12': { title: '植树节' },
    '4-1': { title: '愚人节' },
    '5-12': { title: '护士节' },
    '7-1': { title: '建党节' },
    '8-1': { title: '建军节' },
    '12-24': { title: '平安夜' } },


  /**
                                  * 农历节日
                                  */
  lfestival: {
    '12-30': { title: '除夕' },
    '1-1': { title: '春节' },
    '1-15': { title: '元宵节' },
    '5-5': { title: '端午节' },
    '8-15': { title: '中秋节' },
    '9-9': { title: '重阳节' } },


  /**
                                * 返回默认定义的阳历节日
                                */
  getFestival: function getFestival() {
    return this.festival;
  },

  /**
      * 返回默认定义的内容里节日
      */
  getLunarFestival: function getLunarFestival() {
    return this.lfestival;
  },

  /**
      * 
      * @param {Object} 按照festival的格式输入数据，设置阳历节日
      */
  setFestival: function setFestival() {var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.festival = param;
  },

  /**
      * 
      * @param {Object} 按照lfestival的格式输入数据，设置农历节日
      */
  setLunarFestival: function setLunarFestival() {var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.lfestival = param;
  },

  /**
       * 24节气速查表
       * @Array Of Property
       * @trans["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"]
       * @return Cn string
       */
  solarTerm: ["\u5C0F\u5BD2", "\u5927\u5BD2", "\u7ACB\u6625", "\u96E8\u6C34", "\u60CA\u86F0", "\u6625\u5206", "\u6E05\u660E", "\u8C37\u96E8", "\u7ACB\u590F", "\u5C0F\u6EE1", "\u8292\u79CD", "\u590F\u81F3", "\u5C0F\u6691", "\u5927\u6691", "\u7ACB\u79CB", "\u5904\u6691", "\u767D\u9732", "\u79CB\u5206", "\u5BD2\u9732", "\u971C\u964D", "\u7ACB\u51AC", "\u5C0F\u96EA", "\u5927\u96EA", "\u51AC\u81F3"],

  /**
                                                                                                                                                                                                                                                                                                                                                                                                                 * 1900-2100各年的24节气日期速查表
                                                                                                                                                                                                                                                                                                                                                                                                                 * @Array Of Property
                                                                                                                                                                                                                                                                                                                                                                                                                 * @return 0x string For splice
                                                                                                                                                                                                                                                                                                                                                                                                                 */
  sTermInfo: ['9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f',
  '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f',
  'b027097bd097c36b0b6fc9274c91aa', '9778397bd19801ec9210c965cc920e', '97b6b97bd19801ec95f8c965cc920f',
  '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd197c36c9210c9274c91aa',
  '97b6b97bd19801ec95f8c965cc920e', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2',
  '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bcf97c3598082c95f8e1cfcc920f',
  '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f',
  '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd07f595b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9210c8dc2', '9778397bd19801ec9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f',
  '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
  '97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
  '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bd07f1487f595b0b0bc920fb0722',
  '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
  '97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b97bd19801ec9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
  '9778397bd097c36b0b6fc9210c91aa', '97b6b97bd197c36c9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
  '97b6b7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
  '9778397bd097c36b0b70c9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
  '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
  '97b6b7f0e47f531b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
  '9778397bd097c36b0b6fc9210c91aa', '97b6b7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '977837f0e37f149b0723b0787b0721',
  '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c35b0b6fc9210c8dc2',
  '977837f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
  '7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd',
  '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
  '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd',
  '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
  '977837f0e37f14998082b0723b06bd', '7f07e7f0e37f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
  '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721',
  '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5',
  '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f531b0b0bb0b6fb0722',
  '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
  '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35',
  '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
  '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721',
  '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd',
  '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35',
  '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e37f14998083b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
  '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14898082b0723b02d5', '7f07e7f0e37f14998082b0787b0721',
  '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66aa89801e9808297c35', '665f67f0e37f14898082b0723b02d5',
  '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66a449801e9808297c35',
  '665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
  '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
  '7f07e7f0e47f531b0723b0b6fb0721', '7f0e26665b66a449801e9808297c35', '665f67f0e37f1489801eb072297c35',
  '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722'],

  /**
                                                                                                           * 数字转中文速查表
                                                                                                           * @Array Of Property
                                                                                                           * @trans ['日','一','二','三','四','五','六','七','八','九','十']
                                                                                                           * @return Cn string
                                                                                                           */
  nStr1: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341"],

  /**
                                                                                                                           * 日期转农历称呼速查表
                                                                                                                           * @Array Of Property
                                                                                                                           * @trans ['初','十','廿','卅']
                                                                                                                           * @return Cn string
                                                                                                                           */
  nStr2: ["\u521D", "\u5341", "\u5EFF", "\u5345"],

  /**
                                                     * 月份转农历称呼速查表
                                                     * @Array Of Property
                                                     * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
                                                     * @return Cn string
                                                     */
  nStr3: ["\u6B63", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D", "\u5341", "\u51AC", "\u814A"],

  /**
                                                                                                                                     * 返回农历y年一整年的总天数
                                                                                                                                     * @param lunar Year
                                                                                                                                     * @return Number
                                                                                                                                     * @eg:var count = calendar.lYearDays(1987) ;//count=387
                                                                                                                                     */
  lYearDays: function lYearDays(y) {
    var i,sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {sum += this.lunarInfo[y - 1900] & i ? 1 : 0;}
    return sum + this.leapDays(y);
  },

  /**
       * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
       * @param lunar Year
       * @return Number (0-12)
       * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
       */
  leapMonth: function leapMonth(y) {//闰字编码 \u95f0
    return this.lunarInfo[y - 1900] & 0xf;
  },

  /**
       * 返回农历y年闰月的天数 若该年没有闰月则返回0
       * @param lunar Year
       * @return Number (0、29、30)
       * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
       */
  leapDays: function leapDays(y) {
    if (this.leapMonth(y)) {
      return this.lunarInfo[y - 1900] & 0x10000 ? 30 : 29;
    }
    return 0;
  },

  /**
       * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
       * @param lunar Year
       * @return Number (-1、29、30)
       * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
       */
  monthDays: function monthDays(y, m) {
    if (m > 12 || m < 1) {return -1;} //月份参数从1至12，参数错误返回-1
    return this.lunarInfo[y - 1900] & 0x10000 >> m ? 30 : 29;
  },

  /**
       * 返回公历(!)y年m月的天数
       * @param solar Year
       * @return Number (-1、28、29、30、31)
       * @eg:var solarMonthDay = calendar.leapDays(1987) ;//solarMonthDay=30
       */
  solarDays: function solarDays(y, m) {
    if (m > 12 || m < 1) {return -1;} //若参数错误 返回-1
    var ms = m - 1;
    if (ms == 1) {//2月份的闰平规律测算后确认返回28或29
      return y % 4 == 0 && y % 100 != 0 || y % 400 == 0 ? 29 : 28;
    } else {
      return this.solarMonth[ms];
    }
  },

  /**
      * 农历年份转换为干支纪年
      * @param  lYear 农历年的年份数
      * @return Cn string
      */
  toGanZhiYear: function toGanZhiYear(lYear) {
    var ganKey = (lYear - 3) % 10;
    var zhiKey = (lYear - 3) % 12;
    if (ganKey == 0) ganKey = 10; //如果余数为0则为最后一个天干
    if (zhiKey == 0) zhiKey = 12; //如果余数为0则为最后一个地支
    return this.Gan[ganKey - 1] + this.Zhi[zhiKey - 1];

  },

  /**
      * 公历月、日判断所属星座
      * @param  cMonth [description]
      * @param  cDay [description]
      * @return Cn string
      */
  toAstro: function toAstro(cMonth, cDay) {
    var s = "\u9B54\u7FAF\u6C34\u74F6\u53CC\u9C7C\u767D\u7F8A\u91D1\u725B\u53CC\u5B50\u5DE8\u87F9\u72EE\u5B50\u5904\u5973\u5929\u79E4\u5929\u874E\u5C04\u624B\u9B54\u7FAF";
    var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
    return s.substr(cMonth * 2 - (cDay < arr[cMonth - 1] ? 2 : 0), 2) + "\u5EA7"; //座
  },

  /**
       * 传入offset偏移量返回干支
       * @param offset 相对甲子的偏移量
       * @return Cn string
       */
  toGanZhi: function toGanZhi(offset) {
    return this.Gan[offset % 10] + this.Zhi[offset % 12];
  },

  /**
       * 传入公历(!)y年获得该年第n个节气的公历日期
       * @param y公历年(1900-2100)；n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起
       * @return day Number
       * @eg:var _24 = calendar.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
       */
  getTerm: function getTerm(y, n) {
    if (y < 1900 || y > 2100) {return -1;}
    if (n < 1 || n > 24) {return -1;}
    var _table = this.sTermInfo[y - 1900];
    var _info = [
    parseInt('0x' + _table.substr(0, 5)).toString(),
    parseInt('0x' + _table.substr(5, 5)).toString(),
    parseInt('0x' + _table.substr(10, 5)).toString(),
    parseInt('0x' + _table.substr(15, 5)).toString(),
    parseInt('0x' + _table.substr(20, 5)).toString(),
    parseInt('0x' + _table.substr(25, 5)).toString()];

    var _calday = [
    _info[0].substr(0, 1),
    _info[0].substr(1, 2),
    _info[0].substr(3, 1),
    _info[0].substr(4, 2),

    _info[1].substr(0, 1),
    _info[1].substr(1, 2),
    _info[1].substr(3, 1),
    _info[1].substr(4, 2),

    _info[2].substr(0, 1),
    _info[2].substr(1, 2),
    _info[2].substr(3, 1),
    _info[2].substr(4, 2),

    _info[3].substr(0, 1),
    _info[3].substr(1, 2),
    _info[3].substr(3, 1),
    _info[3].substr(4, 2),

    _info[4].substr(0, 1),
    _info[4].substr(1, 2),
    _info[4].substr(3, 1),
    _info[4].substr(4, 2),

    _info[5].substr(0, 1),
    _info[5].substr(1, 2),
    _info[5].substr(3, 1),
    _info[5].substr(4, 2)];

    return parseInt(_calday[n - 1]);
  },

  /**
       * 传入农历数字月份返回汉语通俗表示法
       * @param lunar month
       * @return Cn string
       * @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
       */
  toChinaMonth: function toChinaMonth(m) {// 月 => \u6708
    if (m > 12 || m < 1) {return -1;} //若参数错误 返回-1
    var s = this.nStr3[m - 1];
    s += "\u6708"; //加上月字
    return s;
  },

  /**
       * 传入农历日期数字返回汉字表示法
       * @param lunar day
       * @return Cn string
       * @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
       */
  toChinaDay: function toChinaDay(d) {//日 => \u65e5
    var s;
    switch (d) {
      case 10:
        s = "\u521D\u5341";break;
      case 20:
        s = "\u4E8C\u5341";break;
        break;
      case 30:
        s = "\u4E09\u5341";break;
        break;
      default:
        s = this.nStr2[Math.floor(d / 10)];
        s += this.nStr1[d % 10];}

    return s;
  },

  /**
       * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
       * @param y year
       * @return Cn string
       * @eg:var animal = calendar.getAnimal(1987) ;//animal='兔'
       */
  getAnimal: function getAnimal(y) {
    return this.Animals[(y - 4) % 12];
  },

  /**
       * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
       * @param y  solar year
       * @param m  solar month
       * @param d  solar day
       * @return JSON object
       * @eg:console.log(calendar.solar2lunar(1987,11,01));
       */
  solar2lunar: function solar2lunar(y, m, d) {//参数区间1900.1.31~2100.12.31
    y = parseInt(y);
    m = parseInt(m);
    d = parseInt(d);
    //年份限定、上限
    if (y < 1900 || y > 2100) {
      return -1; // undefined转换为数字变为NaN
    }
    //公历传参最下限
    if (y == 1900 && m == 1 && d < 31) {
      return -1;
    }
    //未传参  获得当天
    if (!y) {
      var objDate = new Date();
    } else {
      var objDate = new Date(y, parseInt(m) - 1, d);
    }
    var i,leap = 0,temp = 0;
    //修正ymd参数
    var y = objDate.getFullYear(),
    m = objDate.getMonth() + 1,
    d = objDate.getDate();
    var offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
    for (i = 1900; i < 2101 && offset > 0; i++) {
      temp = this.lYearDays(i);
      offset -= temp;
    }
    if (offset < 0) {
      offset += temp;i--;
    }

    //是否今天
    var isTodayObj = new Date(),
    isToday = false;
    if (isTodayObj.getFullYear() == y && isTodayObj.getMonth() + 1 == m && isTodayObj.getDate() == d) {
      isToday = true;
    }
    //星期几
    var nWeek = objDate.getDay(),
    cWeek = this.nStr1[nWeek];
    //数字表示周几顺应天朝周一开始的惯例
    if (nWeek == 0) {
      nWeek = 7;
    }
    //农历年
    var year = i;
    var leap = this.leapMonth(i); //闰哪个月
    var isLeap = false;

    //效验闰月
    for (i = 1; i < 13 && offset > 0; i++) {
      //闰月
      if (leap > 0 && i == leap + 1 && isLeap == false) {
        --i;
        isLeap = true;temp = this.leapDays(year); //计算农历闰月天数
      } else
      {
        temp = this.monthDays(year, i); //计算农历普通月天数
      }
      //解除闰月
      if (isLeap == true && i == leap + 1) {isLeap = false;}
      offset -= temp;
    }
    // 闰月导致数组下标重叠取反
    if (offset == 0 && leap > 0 && i == leap + 1)
    {
      if (isLeap) {
        isLeap = false;
      } else {
        isLeap = true;--i;
      }
    }
    if (offset < 0)
    {
      offset += temp;--i;
    }
    //农历月
    var month = i;
    //农历日
    var day = offset + 1;
    //天干地支处理
    var sm = m - 1;
    var gzY = this.toGanZhiYear(year);

    // 当月的两个节气
    // bugfix-2017-7-24 11:03:38 use lunar Year Param `y` Not `year`
    var firstNode = this.getTerm(y, m * 2 - 1); //返回当月「节」为几日开始
    var secondNode = this.getTerm(y, m * 2); //返回当月「节」为几日开始

    // 依据12节气修正干支月
    var gzM = this.toGanZhi((y - 1900) * 12 + m + 11);
    if (d >= firstNode) {
      gzM = this.toGanZhi((y - 1900) * 12 + m + 12);
    }

    //传入的日期的节气与否
    var isTerm = false;
    var Term = null;
    if (firstNode == d) {
      isTerm = true;
      Term = this.solarTerm[m * 2 - 2];
    }
    if (secondNode == d) {
      isTerm = true;
      Term = this.solarTerm[m * 2 - 1];
    }
    //日柱 当月一日与 1900/1/1 相差天数
    var dayCyclical = Date.UTC(y, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
    var gzD = this.toGanZhi(dayCyclical + d - 1);
    //该日期所属的星座
    var astro = this.toAstro(m, d);

    var solarDate = y + '-' + m + '-' + d;
    var lunarDate = year + '-' + month + '-' + day;

    var festival = this.festival;
    var lfestival = this.lfestival;

    var festivalDate = m + '-' + d;
    var lunarFestivalDate = month + '-' + day;

    return {
      date: solarDate,
      lunarDate: lunarDate,
      festival: festival[festivalDate] ? festival[festivalDate].title : null,
      lunarFestival: lfestival[lunarFestivalDate] ? lfestival[lunarFestivalDate].title : null,
      'lYear': year,
      'lMonth': month,
      'lDay': day,
      'Animal': this.getAnimal(year),
      'IMonthCn': (isLeap ? "\u95F0" : '') + this.toChinaMonth(month),
      'IDayCn': this.toChinaDay(day),
      'cYear': y,
      'cMonth': m,
      'cDay': d,
      'gzYear': gzY,
      'gzMonth': gzM,
      'gzDay': gzD,
      'isToday': isToday,
      'isLeap': isLeap,
      'nWeek': nWeek,
      'ncWeek': "\u661F\u671F" + cWeek,
      'isTerm': isTerm,
      'Term': Term,
      'astro': astro };

  },

  /**
       * 传入农历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
       * @param y  lunar year
       * @param m  lunar month
       * @param d  lunar day
       * @param isLeapMonth  lunar month is leap or not.[如果是农历闰月第四个参数赋值true即可]
       * @return JSON object
       * @eg:console.log(calendar.lunar2solar(1987,9,10));
       */
  lunar2solar: function lunar2solar(y, m, d, isLeapMonth) {//参数区间1900.1.31~2100.12.1
    y = parseInt(y);
    m = parseInt(m);
    d = parseInt(d);
    var isLeapMonth = !!isLeapMonth;
    var leapOffset = 0;
    var leapMonth = this.leapMonth(y);
    var leapDay = this.leapDays(y);
    if (isLeapMonth && leapMonth != m) {return -1;} //传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
    if (y == 2100 && m == 12 && d > 1 || y == 1900 && m == 1 && d < 31) {return -1;} //超出了最大极限值
    var day = this.monthDays(y, m);
    var _day = day;
    //bugFix 2016-9-25
    //if month is leap, _day use leapDays method
    if (isLeapMonth) {
      _day = this.leapDays(y, m);
    }
    if (y < 1900 || y > 2100 || d > _day) {return -1;} //参数合法性效验

    //计算农历的时间差
    var offset = 0;
    for (var i = 1900; i < y; i++) {
      offset += this.lYearDays(i);
    }
    var leap = 0,isAdd = false;
    for (var i = 1; i < m; i++) {
      leap = this.leapMonth(y);
      if (!isAdd) {//处理闰月
        if (leap <= i && leap > 0) {
          offset += this.leapDays(y);isAdd = true;
        }
      }
      offset += this.monthDays(y, i);
    }
    //转换闰月农历 需补充该年闰月的前一个月的时差
    if (isLeapMonth) {offset += day;}
    //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
    var stmap = Date.UTC(1900, 1, 30, 0, 0, 0);
    var calObj = new Date((offset + d - 31) * 86400000 + stmap);
    var cY = calObj.getUTCFullYear();
    var cM = calObj.getUTCMonth() + 1;
    var cD = calObj.getUTCDate();

    return this.solar2lunar(cY, cM, cD);
  } };exports.calendar = calendar;

/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map