'use strict';

const fs     = require('fs');
const stream = require('stream');

const LogLevels = {
  'DEBUG': 'DEBUG',
  'INFO':  'INFO',
  'WARN':  'WARN',
  'ERROR': 'ERROR',
  'NONE':  'NONE',
};

const Colors = {
  'Black':   0,
  'Red':     1,
  'Green':   2,
  'Yellow':  3,
  'Blue':    4,
  'Magenta': 5,
  'Cyan':    6,
  'White':   7,
  'Default': 9,
};

const defaultOptions = {
  useColors: true,
  color: Colors.Default,
  showTimestamp: true,
  showLevel: true,
  filename: null,
  appendFile: true,
  output: process.stdout
};

const loglevelColors = [Colors.Cyan, Colors.Green, Colors.Yellow, Colors.Red, Colors.Black];
let GlobalLogLevel   = LogLevels.DEBUG;

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

    this.out = this.options.output;
  }

  debug(text) {
    this._write(LogLevels.DEBUG, text);
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
      this.fileWriter.write(unformattedText);

    if(this.out)
      this.out.write(formattedText)
  }

  _format(level, text) {
    let timestampFormat = '';
    let levelFormat     = '';
    let categoryFormat  = '';
    let textFormat      = ': ';

    if(this.options.useColors) {
      const levelColor    = Object.keys(LogLevels).map((f) => LogLevels[f]).indexOf(level);
      const categoryColor = this.options.color;

      timestampFormat = '\u001b[3' + loglevelColors[levelColor] + 'm';
      levelFormat     = '\u001b[3' + loglevelColors[levelColor] + ';22m';
      categoryFormat  = '\u001b[3' + categoryColor + ';1m';
      textFormat      = '\u001b[0m: ';
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

    let final = '';

    if(this.options.showTimestamp)
      final += '[' + new Date().toISOString() + '] ';

    final =  timestampFormat + final;

    if(this.options.showLevel)
      final += levelFormat + '[' + level +']' + (level === LogLevels.INFO || level === LogLevels.WARN ? ' ' : '') + ' ';

    final += categoryFormat + this.category;
    final += textFormat + text;
    final = final + '\n';
    return final;
  }

  _shouldLog(level) {
    const levels   = Object.keys(LogLevels).map((f) => LogLevels[f]);
    const index    = levels.indexOf(level);
    const levelIdx = levels.indexOf(GlobalLogLevel);
    return index >= levelIdx;
  }
};

/* Public API */
exports.Colors = Colors;
exports.LogLevel = LogLevels;
exports.setLogLevel = (level) => GlobalLogLevel =  level;
exports.create = (category, options) => new Logger(category, options);
