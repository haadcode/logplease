/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* Usage */

	var Logger = __webpack_require__(1);

	var logger1 = Logger.create('daemon', { filename: 'debug.log', useColors: false, appendFile: true });
	var logger2 = Logger.create('utils');
	var logger3 = Logger.create('logger3', { color: Logger.Colors.Magenta, showTimestamp: false, showLevel: false });

	var red = Logger.create('red', { color: Logger.Colors.Red, showTimestamp: false, showLevel: false });
	var green = Logger.create('green', { color: Logger.Colors.Green, showTimestamp: false, showLevel: false });
	var yellow = Logger.create('yellow', { color: Logger.Colors.Yellow, showTimestamp: false, showLevel: false });
	var blue = Logger.create('blue', { color: Logger.Colors.Blue, showTimestamp: false, showLevel: false });
	var magenta = Logger.create('magenta', { color: Logger.Colors.Magenta, showTimestamp: false, showLevel: false });
	var cyan = Logger.create('cyan', { color: Logger.Colors.Cyan, showTimestamp: false, showLevel: false });

	Logger.setLogLevel(Logger.LogLevels.DEBUG);

	// CAVEAT: log functions can't take any parameters, if you need params, use interpolated strings
	var number = 5;
	logger1.debug('This is a debug message #' + number);
	logger1.info('This is an info message #' + number);
	logger1.warn('This is a warning message #' + number);
	logger1.error('This is an error message #' + number);

	logger2.debug('This is a debug message #' + number);
	logger2.info('This is an info message #' + number);
	logger2.warn('This is a warning message #' + number);
	logger2.error('This is an error message #' + number);

	logger3.debug('This is a debug message #' + number);
	logger3.info('This is an info message #' + number);
	logger3.warn('This is a warning message #' + number);
	logger3.error('This is an error message #' + number);

	red.log('Red log message'); // log() is an alias for debug()
	green.log('Green log message');
	yellow.log('Yellow log message');
	blue.log('Blue log message');
	magenta.log('Magenta log message');
	cyan.log('Cyan log message');

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	var _assign = __webpack_require__(16);

	var _assign2 = _interopRequireDefault(_assign);

	var _classCallCheck2 = __webpack_require__(23);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(24);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var fs = __webpack_require__(27);

	var isNodejs = process.version ? true : false;

	var LogLevels = {
	  'DEBUG': 'DEBUG',
	  'INFO': 'INFO',
	  'WARN': 'WARN',
	  'ERROR': 'ERROR',
	  'NONE': 'NONE'
	};

	// Global log level
	var GlobalLogLevel = LogLevels.DEBUG;

	// Global log file name
	var GlobalLogfile = null;

	// ANSI colors
	var Colors = {
	  'Black': 0,
	  'Red': 1,
	  'Green': 2,
	  'Yellow': 3,
	  'Blue': 4,
	  'Magenta': 5,
	  'Cyan': 6,
	  'Grey': 7,
	  'White': 9,
	  'Default': 9
	};

	// CSS colors
	if (!isNodejs) {
	  Colors = {
	    'Black': 'Black',
	    'Red': 'IndianRed',
	    'Green': 'LimeGreen',
	    'Yellow': 'Orange',
	    'Blue': 'RoyalBlue',
	    'Magenta': 'Orchid',
	    'Cyan': 'SkyBlue',
	    'Grey': 'DimGrey',
	    'White': 'White',
	    'Default': 'Black'
	  };
	}

	var loglevelColors = [Colors.Cyan, Colors.Green, Colors.Yellow, Colors.Red, Colors.Default];

	var defaultOptions = {
	  useColors: true,
	  color: Colors.Default,
	  showTimestamp: true,
	  showLevel: true,
	  filename: GlobalLogfile,
	  appendFile: true
	};

	var Logger = function () {
	  function Logger(category, options) {
	    (0, _classCallCheck3.default)(this, Logger);

	    this.category = category;
	    var opts = {};
	    (0, _assign2.default)(opts, defaultOptions);
	    (0, _assign2.default)(opts, options);
	    this.options = opts;
	  }

	  (0, _createClass3.default)(Logger, [{
	    key: 'debug',
	    value: function debug(text) {
	      this._write(LogLevels.DEBUG, text);
	    }
	  }, {
	    key: 'log',
	    value: function log(text) {
	      this.debug(text);
	    }
	  }, {
	    key: 'info',
	    value: function info(text) {
	      this._write(LogLevels.INFO, text);
	    }
	  }, {
	    key: 'warn',
	    value: function warn(text) {
	      this._write(LogLevels.WARN, text);
	    }
	  }, {
	    key: 'error',
	    value: function error(text) {
	      this._write(LogLevels.ERROR, text);
	    }
	  }, {
	    key: '_write',
	    value: function _write(level, text) {
	      if (!this._shouldLog(level)) return;

	      if ((this.options.filename || GlobalLogfile) && !this.fileWriter) this.fileWriter = fs.openSync(this.options.filename || GlobalLogfile, this.options.appendFile ? 'a+' : 'w+');

	      var format = this._format(level, text);
	      var unformattedText = this._createLogMessage(level, text);
	      var formattedText = this._createLogMessage(level, text, format.timestamp, format.level, format.category, format.text);

	      if (this.fileWriter) fs.writeSync(this.fileWriter, unformattedText + '\n', null, 'utf-8');

	      if (isNodejs) {
	        console.log(formattedText);
	      } else {
	        // TODO: clean this up
	        if (level === LogLevels.ERROR) {
	          if (this.options.showTimestamp && this.options.showLevel) {
	            console.error(formattedText, format.timestamp, format.level, format.category, format.text);
	          } else if (this.options.showTimestamp && !this.options.showLevel) {
	            console.error(formattedText, format.timestamp, format.category, format.text);
	          } else if (!this.options.showTimestamp && this.options.showLevel) {
	            console.error(formattedText, format.level, format.category, format.text);
	          } else {
	            console.error(formattedText, format.category, format.text);
	          }
	        } else {
	          if (this.options.showTimestamp && this.options.showLevel) {
	            console.log(formattedText, format.timestamp, format.level, format.category, format.text);
	          } else if (this.options.showTimestamp && !this.options.showLevel) {
	            console.log(formattedText, format.timestamp, format.category, format.text);
	          } else if (!this.options.showTimestamp && this.options.showLevel) {
	            console.log(formattedText, format.level, format.category, format.text);
	          } else {
	            console.log(formattedText, format.category, format.text);
	          }
	        }
	      }
	    }
	  }, {
	    key: '_format',
	    value: function _format(level, text) {
	      var timestampFormat = '';
	      var levelFormat = '';
	      var categoryFormat = '';
	      var textFormat = ': ';

	      if (this.options.useColors) {
	        var levelColor = (0, _keys2.default)(LogLevels).map(function (f) {
	          return LogLevels[f];
	        }).indexOf(level);
	        var categoryColor = this.options.color;

	        if (isNodejs) {
	          if (this.options.showTimestamp) timestampFormat = '\u001b[3' + Colors.Grey + 'm';

	          if (this.options.showLevel) levelFormat = '\u001b[3' + loglevelColors[levelColor] + ';22m';

	          categoryFormat = '\u001b[3' + categoryColor + ';1m';
	          textFormat = '\u001b[0m: ';
	        } else {
	          if (this.options.showTimestamp) timestampFormat = 'color:' + Colors.Grey;

	          if (this.options.showLevel) levelFormat = 'color:' + loglevelColors[levelColor];

	          categoryFormat = 'color:' + categoryColor + '; font-weight: bold';
	        }
	      }

	      return {
	        timestamp: timestampFormat,
	        level: levelFormat,
	        category: categoryFormat,
	        text: textFormat
	      };
	    }
	  }, {
	    key: '_createLogMessage',
	    value: function _createLogMessage(level, text, timestampFormat, levelFormat, categoryFormat, textFormat) {
	      timestampFormat = timestampFormat || '';
	      levelFormat = levelFormat || '';
	      categoryFormat = categoryFormat || '';
	      textFormat = textFormat || ': ';

	      if (!isNodejs) {
	        if (this.options.showTimestamp) timestampFormat = '%c';

	        if (this.options.showLevel) levelFormat = '%c';

	        categoryFormat = '%c';
	        textFormat = ': %c';
	      }

	      var result = '';

	      if (this.options.showTimestamp) result += '' + new Date().toISOString() + ' ';

	      result = timestampFormat + result;

	      if (this.options.showLevel) result += levelFormat + '[' + level + ']' + (level === LogLevels.INFO || level === LogLevels.WARN ? ' ' : '') + ' ';

	      result += categoryFormat + this.category;
	      result += textFormat + text;
	      return result;
	    }
	  }, {
	    key: '_shouldLog',
	    value: function _shouldLog(level) {
	      var levels = (0, _keys2.default)(LogLevels).map(function (f) {
	        return LogLevels[f];
	      });
	      var index = levels.indexOf(level);
	      var levelIdx = levels.indexOf(GlobalLogLevel);
	      return index >= levelIdx;
	    }
	  }]);
	  return Logger;
	}();

	;

	/* Public API */
	module.exports = {
	  Colors: Colors,
	  LogLevels: LogLevels,
	  setLogLevel: function setLogLevel(level) {
	    GlobalLogLevel = level;
	  },
	  setLogfile: function setLogfile(filename) {
	    GlobalLogfile = filename;
	  },
	  create: function create(category, options) {
	    var logger = new Logger(category, options);
	    return logger;
	  },
	  forceBrowserMode: function forceBrowserMode(force) {
	    return isNodejs = !force;
	  } };
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports.nextTick = function nextTick(fn) {
		setTimeout(fn, 0);
	};

	exports.platform = exports.arch = 
	exports.execPath = exports.title = 'browser';
	exports.pid = 1;
	exports.browser = true;
	exports.env = {};
	exports.argv = [];

	exports.binding = function (name) {
		throw new Error('No such module. (Possibly not yet loaded)')
	};

	(function () {
	    var cwd = '/';
	    var path;
	    exports.cwd = function () { return cwd };
	    exports.chdir = function (dir) {
	        if (!path) path = __webpack_require__(3);
	        cwd = path.resolve(dir, cwd);
	    };
	})();

	exports.exit = exports.kill = 
	exports.umask = exports.dlopen = 
	exports.uptime = exports.memoryUsage = 
	exports.uvCounters = function() {};
	exports.features = {};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(5), __esModule: true };

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(6);
	module.exports = __webpack_require__(12).Object.keys;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(7);

	__webpack_require__(9)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(8);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(10)
	  , core    = __webpack_require__(12)
	  , fails   = __webpack_require__(15);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(11)
	  , core      = __webpack_require__(12)
	  , ctx       = __webpack_require__(13)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 11 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 12 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(14);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(17), __esModule: true };

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(18);
	module.exports = __webpack_require__(12).Object.assign;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(10);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(19)});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(20)
	  , toObject = __webpack_require__(7)
	  , IObject  = __webpack_require__(21);

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(15)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 20 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(22);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(25);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(26), __esModule: true };

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(20);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  createWriteStream: function createWriteStream(filename, options) {
	    return;
	  },
	  writeFileSync: function writeFileSync() {
	    return;
	  },
	  openSync: function openSync() {
	    return;
	  },
	  writeSync: function writeSync() {
	    return;
	  }
	};

/***/ }
/******/ ]);