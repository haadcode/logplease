'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var format = require('util').format;
var EventEmitter = require('events').EventEmitter;

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

var GlobalEvents = new EventEmitter();

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
    _classCallCheck(this, Logger);

    this.category = category;
    var opts = {};
    Object.assign(opts, defaultOptions);
    Object.assign(opts, options);
    this.options = opts;
  }

  _createClass(Logger, [{
    key: 'debug',
    value: function debug() {
      if (this._shouldLog(LogLevels.DEBUG)) this._write(LogLevels.DEBUG, format.apply(null, arguments));
    }
  }, {
    key: 'log',
    value: function log() {
      if (this._shouldLog(LogLevels.DEBUG)) this.debug.apply(this, arguments);
    }
  }, {
    key: 'info',
    value: function info() {
      if (this._shouldLog(LogLevels.INFO)) this._write(LogLevels.INFO, format.apply(null, arguments));
    }
  }, {
    key: 'warn',
    value: function warn() {
      if (this._shouldLog(LogLevels.WARN)) this._write(LogLevels.WARN, format.apply(null, arguments));
    }
  }, {
    key: 'error',
    value: function error() {
      if (this._shouldLog(LogLevels.ERROR)) this._write(LogLevels.ERROR, format.apply(null, arguments));
    }
  }, {
    key: '_write',
    value: function _write(level, text) {
      if ((this.options.filename || GlobalLogfile) && !this.fileWriter && isNodejs) this.fileWriter = fs.openSync(this.options.filename || GlobalLogfile, this.options.appendFile ? 'a+' : 'w+');

      var format = this._format(level, text);
      var unformattedText = this._createLogMessage(level, text);
      var formattedText = this._createLogMessage(level, text, format.timestamp, format.level, format.category, format.text);

      if (this.fileWriter && isNodejs) fs.writeSync(this.fileWriter, unformattedText + '\n', null, 'utf-8');

      if (isNodejs || !this.options.useColors) {
        console.log(formattedText);
        GlobalEvents.emit('data', this.category, level, text);
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
        var levelColor = Object.keys(LogLevels).map(function (f) {
          return LogLevels[f];
        }).indexOf(level);
        var categoryColor = this.options.color;

        if (isNodejs) {
          if (this.options.showTimestamp) timestampFormat = '\x1B[3' + Colors.Grey + 'm';

          if (this.options.showLevel) levelFormat = '\x1B[3' + loglevelColors[levelColor] + ';22m';

          categoryFormat = '\x1B[3' + categoryColor + ';1m';
          textFormat = '\x1B[0m: ';
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

      if (!isNodejs && this.options.useColors) {
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
      var envLogLevel = typeof process !== "undefined" && process.env !== undefined && process.env.LOG !== undefined ? process.env.LOG.toUpperCase() : null;
      envLogLevel = typeof window !== "undefined" && window.LOG ? window.LOG.toUpperCase() : envLogLevel;

      var logLevel = envLogLevel || GlobalLogLevel;
      var levels = Object.keys(LogLevels).map(function (f) {
        return LogLevels[f];
      });
      var index = levels.indexOf(level);
      var levelIdx = levels.indexOf(logLevel);
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
  }, // for testing,
  events: GlobalEvents
};
