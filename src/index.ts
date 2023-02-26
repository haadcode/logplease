'use strict';

import * as fs from 'node:fs';
import { format } from 'node:util';
import { EventEmitter } from 'node:events';

// @ts-ignore
let isElectronRenderer = process.type && process.type === 'renderer';
let isNodejs = !isElectronRenderer && process.version ? true : false;

const LogLevels = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    NONE: 'NONE',
} as const;
export type LogLevel = keyof typeof LogLevels;

// Global log level
let GlobalLogLevel: LogLevel = LogLevels.DEBUG;

// Global log file name
let GlobalLogfile: string | undefined;

let GlobalEvents = new EventEmitter();

// ANSI colors
const Ansi_Colors = {
    Black: 0,
    Red: 1,
    Green: 2,
    Yellow: 3,
    Blue: 4,
    Magenta: 5,
    Cyan: 6,
    Grey: 7,
    White: 9,
    Default: 9,
} as const;

const Node_Color = {
    Black: 'Black',
    Red: 'IndianRed',
    Green: 'LimeGreen',
    Yellow: 'Orange',
    Blue: 'RoyalBlue',
    Magenta: 'Orchid',
    Cyan: 'SkyBlue',
    Grey: 'DimGrey',
    White: 'White',
    Default: 'Black',
} as const;

export let Colors: typeof Ansi_Colors | typeof Node_Color = Ansi_Colors;
export type Color = keyof typeof Colors;
// CSS colors
if (!isNodejs) {
    Colors = Node_Color;
}

const loglevelColors = [
    Colors.Cyan,
    Colors.Green,
    Colors.Yellow,
    Colors.Red,
    Colors.Default,
] as const;

export type Options = {
    useColors: boolean;
    color: typeof Colors[Color];
    showTimestamp: boolean;
    useLocalTime: boolean;
    showLevel: boolean;
    filename?: string;
    appendFile: boolean;
};

const defaultOptions: Options = {
    useColors: true,
    color: Colors.Default,
    showTimestamp: true,
    useLocalTime: false,
    showLevel: true,
    filename: GlobalLogfile,
    appendFile: true,
};

export class Logger {
    options: Options;
    fileWriter: any;
    constructor(public category: string, options: Options) {
        let opts = {} as Partial<Options>;
        Object.assign(opts, defaultOptions);
        Object.assign(opts, options);
        this.options = opts as Options;

        this.debug = this.debug.bind(this);
        this.log = this.log.bind(this);
        this.info = this.info.bind(this);
        this.warn = this.warn.bind(this);
        this.error = this.error.bind(this);
    }

    debug(...args: Parameters<typeof format>) {
        if (this._shouldLog(LogLevels.DEBUG))
            this._write(LogLevels.DEBUG, format(...args));
    }

    log(...args: Parameters<typeof format>) {
        if (this._shouldLog(LogLevels.DEBUG)) this.debug.apply(this, args);
    }

    info(...args: Parameters<typeof format>) {
        if (this._shouldLog(LogLevels.INFO))
            this._write(LogLevels.INFO, format(...args));
    }

    warn(...args: Parameters<typeof format>) {
        if (this._shouldLog(LogLevels.WARN))
            this._write(LogLevels.WARN, format(...args));
    }

    error(...args: Parameters<typeof format>) {
        if (this._shouldLog(LogLevels.ERROR))
            this._write(LogLevels.ERROR, format(...args));
    }

    private _write(level: LogLevel, text: string) {
        if (
            (this.options.filename || GlobalLogfile) &&
            !this.fileWriter &&
            isNodejs
        )
            this.fileWriter = fs.openSync(
                this.options.filename || GlobalLogfile!,
                this.options.appendFile ? 'a+' : 'w+'
            );

        let format = this._format(level);
        let unformattedText = this._createLogMessage(level, text);
        let formattedText = this._createLogMessage(
            level,
            text,
            format.timestamp,
            format.level,
            format.category,
            format.text
        );

        if (this.fileWriter && isNodejs)
            fs.writeSync(this.fileWriter, unformattedText + '\n', null, 'utf-8');

        if (isNodejs || !this.options.useColors) {
            console.log(formattedText);
            GlobalEvents.emit('data', this.category, level, text);
        } else {
            // TODO: clean this up
            if (level === LogLevels.ERROR) {
                if (this.options.showTimestamp && this.options.showLevel) {
                    console.error(
                        formattedText,
                        format.timestamp,
                        format.level,
                        format.category,
                        format.text
                    );
                } else if (this.options.showTimestamp && !this.options.showLevel) {
                    console.error(
                        formattedText,
                        format.timestamp,
                        format.category,
                        format.text
                    );
                } else if (!this.options.showTimestamp && this.options.showLevel) {
                    console.error(
                        formattedText,
                        format.level,
                        format.category,
                        format.text
                    );
                } else {
                    console.error(formattedText, format.category, format.text);
                }
            } else {
                if (this.options.showTimestamp && this.options.showLevel) {
                    console.log(
                        formattedText,
                        format.timestamp,
                        format.level,
                        format.category,
                        format.text
                    );
                } else if (this.options.showTimestamp && !this.options.showLevel) {
                    console.log(
                        formattedText,
                        format.timestamp,
                        format.category,
                        format.text
                    );
                } else if (!this.options.showTimestamp && this.options.showLevel) {
                    console.log(
                        formattedText,
                        format.level,
                        format.category,
                        format.text
                    );
                } else {
                    console.log(formattedText, format.category, format.text);
                }
            }
        }
    }

    private _format(
        level: LogLevel,
    ): {
        timestamp: string;
        level: string;
        category: string;
        text: string;
    } {
        // _text here for backward compatability
        let timestampFormat = '';
        let levelFormat = '';
        let categoryFormat = '';
        let textFormat = ': ';

        if (this.options.useColors) {
            const levelColor = Object.values(LogLevels).indexOf(level);
            const categoryColor = this.options.color;

            if (isNodejs) {
                if (this.options.showTimestamp)
                    timestampFormat = '\u001b[3' + Colors.Grey + 'm';

                if (this.options.showLevel)
                    levelFormat = '\u001b[3' + loglevelColors[levelColor] + ';22m';

                categoryFormat = '\u001b[3' + categoryColor + ';1m';
                textFormat = '\u001b[0m: ';
            } else {
                if (this.options.showTimestamp)
                    timestampFormat = 'color:' + Colors.Grey;

                if (this.options.showLevel)
                    levelFormat = 'color:' + loglevelColors[levelColor];

                categoryFormat = 'color:' + categoryColor + '; font-weight: bold';
            }
        }

        return {
            timestamp: timestampFormat,
            level: levelFormat,
            category: categoryFormat,
            text: textFormat,
        } as const;
    }

    private _createLogMessage(
        level: LogLevel,
        text: string,
        timestampFormat: string = '',
        levelFormat: string = '',
        categoryFormat: string = '',
        textFormat: string = ''
    ): string {
        if (!isNodejs && this.options.useColors) {
            if (this.options.showTimestamp) timestampFormat = '%c';

            if (this.options.showLevel) levelFormat = '%c';

            categoryFormat = '%c';
            textFormat = ': %c';
        }

        let result = '';

        if (this.options.showTimestamp && !this.options.useLocalTime)
            result += '' + new Date().toISOString() + ' ';

        if (this.options.showTimestamp && this.options.useLocalTime)
            result += '' + new Date().toLocaleString() + ' ';

        result = timestampFormat + result;

        if (this.options.showLevel)
            result +=
                levelFormat +
                '[' +
                level +
                ']' +
                (level === LogLevels.INFO || level === LogLevels.WARN ? ' ' : '') +
                ' ';

        result += categoryFormat + this.category;
        result += textFormat + text;
        return result;
    }

    private _shouldLog(level: LogLevel): boolean {
        let envLogLevel = (
            typeof process !== 'undefined' &&
                process.env !== undefined &&
                process.env.LOG !== undefined
                ? process.env.LOG.toUpperCase()
                : null
        ) as LogLevel | null;
        envLogLevel =
            // @ts-ignore
            typeof window !== 'undefined' && window.LOG
                // @ts-ignore
                ? window.LOG.toUpperCase()
                : envLogLevel;

        const logLevel = envLogLevel || GlobalLogLevel;
        const levels = Object.values(LogLevels);
        const index = levels.indexOf(level);
        const levelIdx = levels.indexOf(logLevel);
        return index >= levelIdx;
    }
}

export const setLogLevel = (level: LogLevel) => {
    GlobalLogLevel = level;
};
export const setLogfile = (filename: string) => {
    GlobalLogfile = filename;
};
export const create = (category: string, options: Options): Logger => {
    return new Logger(category, options);
};
export const forceBrowserMode = (force: boolean) => (isNodejs = !force); // for testing,

export const events = GlobalEvents;
