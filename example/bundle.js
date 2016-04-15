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
	const Logger = __webpack_require__(1);

	const logger1  = Logger.create('daemon',  { filename: 'debug.log', useColors: false, appendFile: true });
	const logger2  = Logger.create('utils');
	const logger3  = Logger.create('logger3', { color: Logger.Colors.Magenta, showTimestamp: false, showLevel: false });

	const red     = Logger.create('red', { color: Logger.Colors.Red, showTimestamp: false, showLevel: false });
	const green   = Logger.create('green', { color: Logger.Colors.Green, showTimestamp: false, showLevel: false });
	const yellow  = Logger.create('yellow', { color: Logger.Colors.Yellow, showTimestamp: false, showLevel: false });
	const blue    = Logger.create('blue', { color: Logger.Colors.Blue, showTimestamp: false, showLevel: false });
	const magenta = Logger.create('magenta', { color: Logger.Colors.Magenta, showTimestamp: false, showLevel: false });
	const cyan    = Logger.create('cyan', { color: Logger.Colors.Cyan, showTimestamp: false, showLevel: false });

	Logger.setLogLevel(Logger.LogLevel.DEBUG)

	// CAVEAT: log functions can't take any parameters, if you need params, use interpolated strings
	const number = 5;
	logger1.debug(`This is a log message #${number}`);
	logger1.info(`This is a log message #${number}`);
	logger1.warn(`This is a log message #${number}`);
	logger1.error(`This is a log message #${number}`);

	logger2.debug(`This is a log message #${number}`);
	logger2.info(`This is a log message #${number}`);
	logger2.warn(`This is a log message #${number}`);
	logger2.error(`This is a log message #${number}`);

	logger3.debug(`This is a log message #${number}`);
	logger3.info(`This is a log message #${number}`);
	logger3.warn(`This is a log message #${number}`);
	logger3.error(`This is a log message #${number}`);

	red.debug(`Red log message`);
	green.debug(`Green log message`);
	yellow.debug(`Yellow log message`);
	blue.debug(`Blue log message`);
	magenta.debug(`Magenta log message`);
	cyan.debug(`Cyan log message`);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	const fs = __webpack_require__(4);

	const isNodejs = process.version ? true : false;

	const LogLevels = {
	  'DEBUG': 'DEBUG',
	  'INFO':  'INFO',
	  'WARN':  'WARN',
	  'ERROR': 'ERROR',
	  'NONE':  'NONE',
	};

	// Default log level
	let GlobalLogLevel = LogLevels.DEBUG;

	// ANSI colors
	let Colors = {
	  'Black':   0,
	  'Red':     1,
	  'Green':   2,
	  'Yellow':  3,
	  'Blue':    4,
	  'Magenta': 5,
	  'Cyan':    6,
	  'Grey':    7,
	  'White':   9,
	  'Default': 9,
	};

	// CSS colors
	if(!isNodejs) {
	  Colors = {
	    'Black':   'Black',
	    'Red':     'IndianRed',
	    'Green':   'LimeGreen',
	    'Yellow':  'Orange',
	    'Blue':    'RoyalBlue',
	    'Magenta': 'Orchid',
	    'Cyan':    'SkyBlue',
	    'Grey':    'DimGrey',
	    'White':   'White',
	    'Default': 'Black',
	  };
	}

	const loglevelColors = [Colors.Cyan, Colors.Green, Colors.Yellow, Colors.Red, Colors.Default];

	const defaultOptions = {
	  useColors: true,
	  color: Colors.Default,
	  showTimestamp: true,
	  showLevel: true,
	  filename: null,
	  appendFile: true,
	};

	class Logger {
	  constructor(category, options) {
	    this.category = category;

	    let opts = {};
	    Object.assign(opts, defaultOptions);
	    Object.assign(opts, options);
	    this.options = opts;

	    if(this.options.filename) {
	      const flags = this.options.appendFile ? 'a' : 'w'
	      this.fileWriter = fs.createWriteStream(this.options.filename, { flags: flags });
	    }
	  }

	  debug(text) {
	    this._write(LogLevels.DEBUG, text);
	  }

	  log(text) {
	    this.debug(text);
	  }

	  info(text) {
	    this._write(LogLevels.INFO, text);
	  }

	  warn(text) {
	    this._write(LogLevels.WARN, text);
	  }

	  error(text) {
	    this._write(LogLevels.ERROR, text);
	  }

	  _write(level, text) {
	    if(!this._shouldLog(level))
	      return;

	    let format = this._format(level, text);
	    let unformattedText = this._createLogMessage(level, text);
	    let formattedText = this._createLogMessage(level, text, format.timestamp, format.level, format.category, format.text);

	    if(this.fileWriter)
	      this.fileWriter.write(unformattedText + '\n');

	    if(isNodejs) {
	      console.log(formattedText)
	    } else {
	      // TODO: clean this up
	      if(level === LogLevels.ERROR) {
	        if(this.options.showTimestamp && this.options.showLevel) {
	          console.error(formattedText, format.timestamp, format.level, format.category, format.text)
	        } else if(this.options.showTimestamp && !this.options.showLevel) {
	          console.error(formattedText, format.timestamp, format.category, format.text)
	        } else if(!this.options.showTimestamp && this.options.showLevel) {
	          console.error(formattedText, format.level, format.category, format.text)
	        } else {
	          console.error(formattedText, format.category, format.text)
	        }
	      } else {
	        if(this.options.showTimestamp && this.options.showLevel) {
	          console.log(formattedText, format.timestamp, format.level, format.category, format.text)
	        } else if(this.options.showTimestamp && !this.options.showLevel) {
	          console.log(formattedText, format.timestamp, format.category, format.text)
	        } else if(!this.options.showTimestamp && this.options.showLevel) {
	          console.log(formattedText, format.level, format.category, format.text)
	        } else {
	          console.log(formattedText, format.category, format.text)
	        }
	      }
	    }
	  }

	  _format(level, text) {
	    let timestampFormat = '';
	    let levelFormat     = '';
	    let categoryFormat  = '';
	    let textFormat      = ': ';

	    if(this.options.useColors) {
	        const levelColor    = Object.keys(LogLevels).map((f) => LogLevels[f]).indexOf(level);
	        const categoryColor = this.options.color;

	      if(isNodejs) {
	        if(this.options.showTimestamp)
	          timestampFormat = '\u001b[3' + Colors.Grey + 'm';

	        if(this.options.showLevel)
	          levelFormat = '\u001b[3' + loglevelColors[levelColor] + ';22m';

	        categoryFormat = '\u001b[3' + categoryColor + ';1m';
	        textFormat = '\u001b[0m: ';
	      } else {
	        if(this.options.showTimestamp)
	          timestampFormat = 'color:' + Colors.Grey;

	        if(this.options.showLevel)
	          levelFormat = 'color:' + loglevelColors[levelColor];

	        categoryFormat = 'color:' + categoryColor + '; font-weight: bold';

	          // textFormat = 'background:' + Colors.Red;
	      }
	    }

	    return {
	      timestamp: timestampFormat,
	      level: levelFormat,
	      category: categoryFormat,
	      text: textFormat
	    };
	  }

	  _createLogMessage(level, text, timestampFormat, levelFormat, categoryFormat, textFormat) {
	    timestampFormat = timestampFormat || '';
	    levelFormat     = levelFormat     || '';
	    categoryFormat  = categoryFormat  || '';
	    textFormat      = textFormat      || ': ';

	    if(!isNodejs) {
	      if(this.options.showTimestamp)
	        timestampFormat = '%c';

	      if(this.options.showLevel)
	        levelFormat = '%c';

	      categoryFormat  = '%c';
	      textFormat = ': %c';
	    }

	    let result = '';

	    if(this.options.showTimestamp)
	      result += '' + new Date().toISOString() + ' ';

	    result = timestampFormat + result;

	    if(this.options.showLevel)
	      result += levelFormat + '[' + level +']' + (level === LogLevels.INFO || level === LogLevels.WARN ? ' ' : '') + ' ';

	    result += categoryFormat + this.category;
	    result += textFormat + text;
	    return result;
	  }

	  _shouldLog(level) {
	    const levels   = Object.keys(LogLevels).map((f) => LogLevels[f]);
	    const index    = levels.indexOf(level);
	    const levelIdx = levels.indexOf(GlobalLogLevel);
	    return index >= levelIdx;
	  }
	};

	/* Public API */
	module.exports = {
	  Colors: Colors,
	  LogLevel: LogLevels,
	  setLogLevel: (level) => {
	    GlobalLogLevel = level
	  },
	  create: (category, options) => new Logger(category, options),
	};

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
/***/ function(module, exports) {

	module.exports = {
	  createWriteStream: function(filename, options) {
	    return;
	  },
	  writeFileSync: function() {
	    return;
	  }
	}


/***/ }
/******/ ]);