'use strict';

/* Usage */
const Logger = require('../src/index');

const logger1  = Logger.create('daemon',  { filename: 'debug.log', useColors: false, appendFile: true });
const logger2  = Logger.create('utils',   { color: Logger.Colors.Yellow });
const logger3  = Logger.create('logger3', { color: Logger.Colors.Magenta, showTimestamp: false, showLevel: false, output: process.stderr });

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
