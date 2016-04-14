'use strict';

const fs = require('fs');

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
