# logplease
Simple Javascript logger for Node.js and Browsers

![Screenshot](https://raw.githubusercontent.com/haadcode/logplease/master/screenshot.png)

## Features
- Log messages to stdout or a file in Node.js or Browsers
- Log levels
- Customize the log messages
- Colors!

## Install
```
npm install logplease
```

### Examples
#### Node.js
```
npm run example
```

#### Browser
*NOTE: Requires webpack to be installed globally! `npm install webpack -g`*

```
npm run example:browser
```

And open `example/index.html` in your browser.

## Usage
```javascript
const Logger = require('logplease');

// Create loggers, see 'options' below for details
const logger1  = Logger.create('daemon',  { filename: 'debug.log', useColors: false, appendFile: true });
const logger2  = Logger.create('utils',   { color: Logger.Colors.Yellow });
const logger3  = Logger.create('logger3', { color: Logger.Colors.Magenta, showTimestamp: false, showLevel: false });

// Set global log level
Logger.setLogLevel(Logger.LogLevel.INFO)

// CAVEAT: log functions can't take any parameters. If you need params, use string interpolation.
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
```

### Log level
You can set a global log level to display only the wanted log messages.

```javascript
const Logger = require('logplease');
Logger.setLogLevel(Logger.LogLevel.ERROR) // Show only ERROR messages
```

Log levels:
```
DEBUG
INFO
WARN
ERROR
NONE
```

### Colors
You can set a color per logger.

```javascript
const Logger = require('logplease');
const logger = Logger.create("logger name", { color: Logger.Colors.Yellow });
```

Colors:
```
Black, Red, Green, Yellow, Blue, Magenta, Cyan, Grey, White
```

### Options
You can customize your logger.

```javascript
const Logger = require('logplease');
const logger = Logger.create("logger name", options);
```

Available options and defaults:
```javascript
const options = {
  useColors: true,     // Enable colors
  color: Colors.White, // Set the color of the logger
  showTimestamp: true, // Display timestamp in the log message
  showLevel: true,     // Display log level in the log message
  filename: null,      // Set file path to log to a file
  appendFile: true,    // Append logfile instead of overwriting
};
```

### Build
*NOTE: Requires webpack to be installed globally! `npm install webpack -g`*

The build command will build the browser distributable. Note that for Node.js it is not needed to run the build command.
```
npm run dist
```

The distributable file will be located in `dist/index.js`
