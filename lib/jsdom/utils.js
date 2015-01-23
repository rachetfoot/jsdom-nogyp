var path = require('path');

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

var isArray = exports.isArray = Array.isArray;

function isBuffer(arg) {
  return arg instanceof Buffer;
}
exports.isBuffer = isBuffer;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

/**
 * Intercepts a method by replacing the prototype's implementation
 * with a wrapper that invokes the given interceptor instead.
 *
 *     utils.intercept(core.Element, 'inserBefore',
 *       function(_super, args, newChild, refChild) {
 *         console.log('insertBefore', newChild, refChild);
 *         return _super.apply(this, args);
 *       }
 *     );
 */
exports.intercept = function(clazz, method, interceptor) {
  var proto = clazz.prototype,
      _super = proto[method],
      unwrapArgs = interceptor.length > 2;

  proto[method] = function() {
    if (unwrapArgs) {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(_super, arguments);
      return interceptor.apply(this, args);
    }
    else {
      return interceptor.call(this, _super, arguments);
    }
  };
};

exports.toFileUrl = function (fileName) {
  // Beyond just the `path.resolve`, this is mostly for the benefit of Windows,
  // where we need to convert '\' to '/' and add an extra '/' prefix before the
  // drive letter.
  var pathname = path.resolve(System.getProperty('user.dir'), fileName).replace(/\\/g, '/');
  if (pathname[0] !== '/') {
    pathname = '/' + pathname;
  }

  return 'file://' + pathname;
};


var executor = new java.util.concurrent.Executors.newScheduledThreadPool(1);
var counter = 1;
var ids = {};

exports.setTimeout = function (fn,delay) {
	var id = counter++;
	var runnable = new JavaAdapter(java.lang.Runnable, {run: fn});
	ids[id] = executor.schedule(runnable, delay, 
		java.util.concurrent.TimeUnit.MILLISECONDS);
	return id;
}

exports.clearInterval = exports.clearTimeout = function (id) {
	if (ids[id]) ids[id].cancel(false);
	executor.purge();
	delete ids[id];
}

exports.setInterval = function (fn,delay) {
	var id = counter++;
	var runnable = new JavaAdapter(java.lang.Runnable, {run: fn});
	ids[id] = executor.scheduleAtFixedRate(runnable, delay, delay, 
		java.util.concurrent.TimeUnit.MILLISECONDS);
	return id;
}