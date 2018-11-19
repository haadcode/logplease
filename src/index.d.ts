import * as fs from "fs";
import { format}  from 'util';
import { EventEmitter }  from 'events';

declare let Colors: Color;
declare let isElectronRenderer: boolean;
declare let isNodejs: boolean;
declare let GlobalLogLevel: string;
declare let GlobalLogfile: string;
declare let GlobalEvents: EventEmitter;
declare const defaultOptions: Options;

export interface Color {
  'Black':   any,
  'Red':     any,
  'Green':   any,
  'Yellow':  any,
  'Blue':    any,
  'Magenta': any,
  'Cyan':    any,
  'Grey':    any,
  'White':   any,
  'Default': any,
}

export enum LogLevels {
  'DEBUG'= 'DEBUG',
  'INFO'=  'INFO',
  'WARN'=  'WARN',
  'ERROR'= 'ERROR',
  'NONE'=  'NONE',
}

export interface Options {
  useColors?: boolean,
  color?: any,
  showTimestamp?: boolean,
  useLocalTime?: boolean,
  showLevel?: boolean,
  filename?: string,
  appendFile?: boolean,
}

interface Format {
  timestamp: string,
  level: string,
  category: string,
  text: string,
}

declare class Logger{
  constructor(category: string, options: Options);

  options: Options;
  debug(text: string): void;
  log(text: string): void;
  info(text: string): void;
  warn(text: string): void;
  error(text: string): void;

  _write(level: string, text: string): void;
  _format(level: string, text: string): Format;
  _createLogMessage(level: string, text: string, timestampFormat: string, levelFormat: string, categoryFormat: string, textFormat: string): string;
  _shouldLog(level: string): boolean;
}

declare const setLogLevel: (level: string) => void;
declare const setLogfile: (filename: string) => void;
declare const create: (category: string, options: Options) => Logger;
declare const forceBrowserMode: (force: boolean) => void;
declare var events: EventEmitter;
