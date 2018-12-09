webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(2);
var isBuffer = __webpack_require__(18);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(0);
var normalizeHeaderName = __webpack_require__(21);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(3);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(3);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var settle = __webpack_require__(22);
var buildURL = __webpack_require__(24);
var parseHeaders = __webpack_require__(25);
var isURLSameOrigin = __webpack_require__(26);
var createError = __webpack_require__(4);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(27);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ("production" !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(28);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(23);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_indexCarousel_scss__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_indexCarousel_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_indexCarousel_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_header_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_nav_bar_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_index_crousel_js__ = __webpack_require__(15);
if (false) {
  require('../view/index.html');
}





new Vue({
  el: "#compact",
  data: function () {
    return {};
  },
  components: {
    'v-header': __WEBPACK_IMPORTED_MODULE_1__common_header_js__["a" /* default */],
    'v-nav-bar': __WEBPACK_IMPORTED_MODULE_2__common_nav_bar_js__["a" /* default */],
    'v-carousel': __WEBPACK_IMPORTED_MODULE_3__components_index_crousel_js__["a" /* default */]
  }
});
$(document).ready(function () {
  var item = $(".carousel-item")[0];
  console.log(item);
  item.classList.add("active");
  $("[data-slide-to=0]")[0].classList.add("active");
}); // import './lib/bootstrap.min.js'

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__function_drawCanvas__ = __webpack_require__(10);

var header = {
  template: "<div id='header'> <canvas id = 'canvas'></canvas><div></div> </div>",
  data: function () {
    window.onload = __WEBPACK_IMPORTED_MODULE_0__function_drawCanvas__["a" /* default */];
    return {};
  }
};
/* harmony default export */ __webpack_exports__["a"] = (header);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__class_canvas_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__class_wave_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__valueMapping__ = __webpack_require__(13);



/* harmony default export */ __webpack_exports__["a"] = (drawCanvas);

function drawCanvas() {
  console.log(1);
  var Cava = new __WEBPACK_IMPORTED_MODULE_0__class_canvas_js__["a" /* default */]("canvas");
  let canvas = Cava.init();
  console.log(Cava);
  const gradients = [['#b7472a', '#88d3ce'], ['#de6262', '#ffb88c'], ['#64b3f4', '#ff482c'], ['#0fd850', '#f9f047'], ['#007adf', '#e84e68'], ['#B6CEE8', '#F578DC'], ['#9be15d', '#f731fe']];
  let waves = [];

  const init = () => {
    waves = [];

    for (let i = 0; i < 5; i++) {
      const [start, stop] = gradients[Math.floor(Math.random() * gradients.length)];
      waves.push(new __WEBPACK_IMPORTED_MODULE_1__class_wave_js__["a" /* default */](Cava, {
        start,
        stop,
        lineWidth: 0.25,
        xSpeed: Object(__WEBPACK_IMPORTED_MODULE_2__valueMapping__["a" /* default */])(Math.random(), 0, 1, -0.05, -0.08),
        amplitude: Object(__WEBPACK_IMPORTED_MODULE_2__valueMapping__["a" /* default */])(Math.random(), 0, 1, 0.05, 0.5),
        offset: Math.random() * 100
      }));
    }
  };

  init();
  Cava.run(canvas => {
    canvas.clearRect(0, 0, Cava.width, Cava.height);
    waves.forEach(wave => {
      wave.draw(canvas);
    });
  });
}

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class canvas {
  constructor(id) {
    this.id = id;
  }

  init() {
    window.addEventListener('resize', () => this.resize(), false);
    var canvas = document.getElementById(this.id);
    this.ele = canvas;

    if (canvas.getContext) {
      this.context = canvas.getContext("2d");
    }

    this.resize();
    return this.context;
  }

  resize() {
    this.width = this.ele.width; // console.log(this.ele.height)

    this.height = this.ele.height;
  }

  run(callback) {
    requestAnimationFrame(() => {
      this.run(callback);
    });
    callback(this.context);
  }

}

/* harmony default export */ __webpack_exports__["a"] = (canvas);

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Wave {
  constructor(cavans, options) {
    this.canvas = cavans;
    this.options = options;
    this.xMove = this.options.offset;
    this.xSpeed = this.options.xSpeed;
    this.resize();
  }

  resize() {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.amplitude = this.canvas.height * this.options.amplitude;
  }

  draw(ctx) {
    ctx.beginPath();
    this.xMove += this.xSpeed;
    ctx.moveTo(0, this.height / 2);
    ctx.createLinearGradient(0, 0, 1280, 0);
    var grad = ctx.createLinearGradient(0, 0, this.width, 0);
    grad.addColorStop(0, this.options.start);
    grad.addColorStop(1, this.options.stop);
    ctx.strokeStyle = grad;
    ctx.lineWidth = this.options.lineWidth;

    for (var x = 0; x < this.width; x++) {
      const radians = x / this.width * Math.PI * 2;
      const scale = (Math.sin(radians - Math.PI * 0.5) + 1) * 0.5;
      const y = Math.sin(x * 0.02 + this.xMove) * this.amplitude * scale + this.height / 2;
      ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.closePath();
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Wave);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function valueMapping(x, inMin, inMax, outMin, outMax) {
  return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

/* harmony default export */ __webpack_exports__["a"] = (valueMapping);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var NavBar = {
  template: "<div id='nav-bar'><ul><li class='first'> <a href='#'>技术博客</a><ul><li><a href='#'>Java</a></li><li><a href='#'>spring</a></li><li><a href='#'>xxx</a></li></ul></li><li class='first'> <a href='#'>生活点滴</a><ul><li><a href='#'>xxx</a></li><li><a href='#'>xxx</a></li><li><a href='#'>xxx</a></li></ul></li><li> <a href='#'>关于我</a></li><li> <a href='#'>时间线</a></li></ul></div>",
  data: function () {
    return {};
  }
};
/* harmony default export */ __webpack_exports__["a"] = (NavBar);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_url_js__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_url_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__common_url_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__assests_img_index_no1_jpg__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__assests_img_index_no1_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__assests_img_index_no1_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__assests_img_index_ellipse_jpg__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__assests_img_index_ellipse_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__assests_img_index_ellipse_jpg__);



 // import  '../../lib/jquery-3.3.1.min.js';

var carousel = {
  template: '<div id="demo" class="carousel slide" data-ride="carousel"><ul class="carousel-indicators"> <li v-for="i in imgList" data-target="#demo" v-bind:data-slide-to="i.id-1"></li> </ul><div class="carousel-inner"> <div v-for="j in imgList" class="carousel-item"><a class="test" href="http://www.baidu.com"></a> <img v-bind:src="j.location"/> </div> </div><a class="carousel-control-prev" href="#demo" data-slide="prev"><span class="carousel-control-prev-icon"></span></a><a class="carousel-control-next" href="#demo" data-slide="next"><span class="carousel-control-next-icon"></span></a></div>',
  data: function () {
    return {
      list: 0,
      imgList: [{
        id: 1,
        location: "../assests/img/index/no1.jpg"
      }, {
        id: 2,
        location: "../assests/img/index/ellipse.jpg"
      }]
    };
  }
};
/* harmony default export */ __webpack_exports__["a"] = (carousel);

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var bind = __webpack_require__(2);
var Axios = __webpack_require__(19);
var defaults = __webpack_require__(1);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(6);
axios.CancelToken = __webpack_require__(34);
axios.isCancel = __webpack_require__(5);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(35);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(1);
var utils = __webpack_require__(0);
var InterceptorManager = __webpack_require__(29);
var dispatchRequest = __webpack_require__(30);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(4);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var transformData = __webpack_require__(31);
var isCancel = __webpack_require__(5);
var defaults = __webpack_require__(1);
var isAbsoluteURL = __webpack_require__(32);
var combineURLs = __webpack_require__(33);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(6);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 36 */
/***/ (function(module, exports) {

const url = {
  'url': '/blog'
};
module.exports = url;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "../assests/img/index/no1.jpg";

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ })
],[7]);