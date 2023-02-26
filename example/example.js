'use strict';

import { create, Colors, setLogLevel, LogLevels } from '../dist/index';

const logger1  = create('daemon',  { filename: 'debug.log', useColors: false, appendFile: true });
const logger2  = create('utils');
const logger3  = create('logger3', { color: Colors.Magenta, showTimestamp: false, showLevel: false });
const logger4  = create('logger4-local-time', { useLocalTime: true });

const red     = create('red', { color: Colors.Red, showTimestamp: false, showLevel: false });
const green   = create('green', { color: Colors.Green, showTimestamp: false, showLevel: false });
const yellow  = create('yellow', { color: Colors.Yellow, showTimestamp: false, showLevel: false });
const blue    = create('blue', { color: Colors.Blue, showTimestamp: false, showLevel: false });
const magenta = create('magenta', { color: Colors.Magenta, showTimestamp: false, showLevel: false });
const cyan    = create('cyan', { color: Colors.Cyan, showTimestamp: false, showLevel: false });

setLogLevel(LogLevels.DEBUG)

// CAVEAT: log functions can't take any parameters, if you need params, use interpolated strings
const number = 5;
logger1.debug(`This is a debug message #${number}`);
logger1.info(`This is an info message #${number}`);
logger1.warn(`This is a warning message #${number}`);
logger1.error(`This is an error message #${number}`);

logger2.debug(`This is a debug message #${number}`);
logger2.info(`This is an info message #${number}`);
logger2.warn(`This is a warning message #${number}`);
logger2.error(`This is an error message #${number}`);

logger3.debug(`This is a debug message #${number}`);
logger3.info(`This is an info message #${number}`);
logger3.warn(`This is a warning message #${number}`);
logger3.error(`This is an error message #${number}`);

logger4.debug(`This is a debug message #${number}`);
logger4.info(`This is an info message #${number}`);
logger4.warn(`This is a warning message #${number}`);
logger4.error(`This is an error message #${number}`);

red.log(`Red log message`); // log() is an alias for debug()
green.log(`Green log message`);
yellow.log(`Yellow log message`);
blue.log(`Blue log message`);
magenta.log(`Magenta log message`);
cyan.log(`Cyan log message`);
