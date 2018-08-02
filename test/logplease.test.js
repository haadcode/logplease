'use strict';

var isBrowser = false;

if (typeof window !== 'undefined') {
  isBrowser = true;
}

var assert = isBrowser ? chai.assert : require('assert');
var fs = isBrowser ? {} : require('fs');
var Logger = isBrowser ? Logger : require('../src/index');
var logfile = 'test123.log'

describe('logplease', function() {
  this.timeout(1000)

  before(function(done) {
    done()
  })

  afterEach(function() {
    if (!isBrowser) {
      try {
        fs.statSync(logfile)
        fs.unlinkSync(logfile)
      } catch(e) {
      }
    }
  })

  describe('Public API', function() {
    it('Colors', function() {
      assert(Logger.Colors)
    })

    it('LogLevels', function() {
      assert(Logger.Colors)
    })

    it('setLogLevel', function() {
      assert(Logger.Colors)
    })

    it('setLogfile', function() {
      assert(Logger.Colors)
    })

    it('create', function() {
      assert(Logger.create)
    })
  })

  describe('create', function() {
    it('creates a logger', function(done) {
      var log = Logger.create('test1')
      assert(log)
      assert.equal(log.category, 'test1')
      done()
    })

    it('uses default options', function(done) {
      var log = Logger.create('test1')
      assert(log)
      assert.equal(log.options.useColors, true)
      assert.equal(log.options.color, Logger.Colors.Default)
      assert.equal(log.options.showTimestamp, true)
      assert.equal(log.options.showLevel, true)
      assert.equal(log.options.filename, null)
      assert.equal(log.options.appendFile, true)
      done()
    })

    it('sets options', function(done) {
      var options = {
        useColors: false,
        color: Logger.Colors.Yellow,
        showTimestamp: false,
        useLocalTime: true,
        showLevel: false,
        filename: 'test.log',
        appendFile: false,
      }

      var log = Logger.create('test1', options)
      assert(log)
      assert.equal(log.options.useColors, false)
      assert.equal(log.options.color, Logger.Colors.Yellow)
      assert.equal(log.options.showTimestamp, false)
      assert.equal(log.options.useLocalTime, true)
      assert.equal(log.options.showLevel, false)
      assert.equal(log.options.filename, 'test.log')
      assert.equal(log.options.appendFile, false)
      done()
    })

    it('sets some options', function(done) {
      var options = {
        useColors: false,
        color: Logger.Colors.Yellow,
      }

      var log = Logger.create('test1', options)
      assert(log)
      assert.equal(log.options.useColors, false)
      assert.equal(log.options.color, Logger.Colors.Yellow)
      assert.equal(log.options.showTimestamp, true)
      assert.equal(log.options.useLocalTime, false)
      assert.equal(log.options.showLevel, true)
      assert.equal(log.options.filename, null)
      assert.equal(log.options.appendFile, true)
      done()
    })
  })

  describe('_write', function() {
    it('logs according to global log level: DEBUG', function(done) {
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      var log = Logger.create('test1', { showTimestamp: false, useColors: false })
      Logger.setLogLevel(Logger.LogLevels.DEBUG)
      log.debug("hi")
      console.log = old
      assert.equal(out, '[DEBUG] test1: hi')
      Logger.setLogLevel(Logger.LogLevels.DEBUG)
      done()
    })

    it('logs according to global log level: INFO', function(done) {
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      var log = Logger.create('test1', { showTimestamp: false, useColors: false })
      Logger.setLogLevel(Logger.LogLevels.INFO)
      log.debug("hi")
      log.info("hi2")
      console.log = old
      assert.equal(out, '[INFO]  test1: hi2')
      Logger.setLogLevel(Logger.LogLevels.DEBUG)
      done()
    })

    it('logs according to global log level: WARN', function(done) {
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      var log = Logger.create('test1', { showTimestamp: false, useColors: false })
      Logger.setLogLevel(Logger.LogLevels.WARN)
      log.debug("hi")
      log.info("hi2")
      log.warn("hi3")
      console.log = old
      assert.equal(out, '[WARN]  test1: hi3')
      Logger.setLogLevel(Logger.LogLevels.DEBUG)
      done()
    })

    it('logs according to global log level: ERROR', function(done) {
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      var log = Logger.create('test1', { showTimestamp: false, useColors: false })
      Logger.setLogLevel(Logger.LogLevels.ERROR)
      log.debug("hi")
      log.info("hi2")
      log.warn("hi3")
      log.error("hi4")
      console.log = old
      assert.equal(out, '[ERROR] test1: hi4')
      Logger.setLogLevel(Logger.LogLevels.DEBUG)
      done()
    })

    it('logs according to global log level: NONE', function(done) {
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      var log = Logger.create('test1', { showTimestamp: false, useColors: false })
      Logger.setLogLevel(Logger.LogLevels.NONE)
      log.debug("hi")
      log.info("hi2")
      log.warn("hi3")
      log.error("hi4")
      console.log = old
      assert.equal(out, '')
      Logger.setLogLevel(Logger.LogLevels.DEBUG)
      done()
    })

    it('writes timestamp in iso time', function(done) {
      var out = ''
      var old = console.log
      // ignore seconds when comparing times
      var isoTime = new Date().toISOString().slice(0, 19)
      console.log = function(d) { out += d; }
      var log = Logger.create('test1')
      log.debug("hi")
      console.log = old
      var hi = isBrowser ? '%chi' : 'hi';
      var colorPrefix = isBrowser ? '%c' : '\u001b[37m';
      assert.equal(out.split(" ").length, 4)
      assert.equal(out.split(" ")[3], hi)
      var loggedTime = out.split(" ")[0].replace(colorPrefix, '').slice(0, 19)
      assert.equal(isoTime, loggedTime)
      done()
    })

    it('writes timestamp in local time', function(done) {
      var out = ''
      var old = console.log
      var localTime = new Date().toLocaleString()
      console.log = function(d) { out += d; }
      var log = Logger.create('test1', {useLocalTime: true})
      log.debug("hi")
      console.log = old
      var logArray = out.split(" ")
      var hi = isBrowser ? '%chi' : 'hi';
      var colorPrefix = isBrowser ? '%c' : '\u001b[37m';
      assert.equal(logArray[logArray.length - 1], hi)
      var loggedTime = logArray.slice(0, logArray.length - 3).join(' ').replace(colorPrefix, '')
      assert.equal(localTime, loggedTime)
      done()
    })

    it('doesn\'t write timestamp', function(done) {
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      var log = Logger.create('test1', { showTimestamp: false })
      log.debug("hi")
      console.log = old
      var hi = isBrowser ? '%chi' : 'hi';
      assert.equal(out.split(" ").length, 3)
      assert.equal(out.split(" ")[2], hi)
      done()
    })

    it('writes log level', function(done) {
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      var log = Logger.create('test1', { useColors: false })
      log.debug("hi")
      console.log = old
      assert.equal(out.split(" ").length, 4)
      assert.equal(out.split(" ")[1], '[DEBUG]')
      done()
    })

    it('doesn\'t write log level', function(done) {
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      var log = Logger.create('test1', { showLevel: false, useColors: false })
      log.debug("hi")
      console.log = old
      assert.equal(out.split(" ").length, 3)
      assert.notEqual(out.split(" ")[1], '[DEBUG]')
      done()
    })

    it('uses colors in terminal', function(done) {
      if (isBrowser) { this.skip(); }
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      var log = Logger.create('test1', { useColors: true, showTimestamp: false })
      log.debug("hi")
      console.log = old
      assert.equal(out, '\u001b[36;22m[DEBUG] \u001b[39;1mtest1\u001b[0m: hi')
      done()
    })

    it('uses colors in browser', function(done) {
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      if (!isBrowser) { Logger.forceBrowserMode(true); }
      var log = Logger.create('test1', { useColors: true, showTimestamp: false })
      log.debug("hi")
      console.log = old
      assert.equal(out, '%c[DEBUG] %ctest1: %chi')
      if (!isBrowser) { Logger.forceBrowserMode(false); }
      done()
    })

    it('doesn\'t use colors in terminal', function(done) {
      if (isBrowser) { this.skip(); }
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      var log = Logger.create('test1', { useColors: false, showTimestamp: false })
      log.debug("hi")
      console.log = old
      assert.equal(out, '[DEBUG] test1: hi')
      done()
    })

    it('doesn\'t use colors in browser', function(done) {
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      Logger.forceBrowserMode(true)
      var log = Logger.create('test1', { useColors: false, showTimestamp: false })
      log.debug("hi")
      console.log = old
      assert.equal(out, '[DEBUG] test1: hi')
      Logger.forceBrowserMode(false)
      done()
    })

    it('sets the logger name', function(done) {
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      var log = Logger.create('test1234', { useColors: false })
      log.debug("hi")
      console.log = old
      assert.equal(out.split(" ").length, 4)
      assert.equal(out.split(" ")[2], 'test1234:')
      done()
    })

    it('formats strings using %d, %s', function(done) {
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      var log = Logger.create('test1234', { useColors: false })
      log.debug('hi %d %s', 314, 'THISISASTRING')
      console.log = old
      var result = out.split(' ').slice(3).join(' ')
      assert.equal(result, 'hi 314 THISISASTRING')
      done()
    })
  })

  describe('_write', function() {
    it('creates a log file', function(done) {
      if (isBrowser) { this.skip(); }
      var log = Logger.create('test1', { filename: logfile, appendFile: false, showTimestamp: false })
      assert(!fs.existsSync(logfile))
      log.debug('hello')
      assert(fs.existsSync(logfile))
      done()
    })

    it('writes to a log file', function(done) {
      if (isBrowser) { this.skip(); }
      var log = Logger.create('test1', { filename: logfile, appendFile: false, showTimestamp: false })
      assert(!fs.existsSync(logfile))
      log.debug('hello')
      assert(fs.existsSync(logfile))
      var f = fs.readFileSync(logfile, 'utf-8')
      assert.equal(f, '[DEBUG] test1: hello\n')
      done()
    })

    it('appends to a log file', function(done) {
      if (isBrowser) { this.skip(); }
      var log = Logger.create('test1', { filename: logfile, appendFile: true, showTimestamp: false })
      assert(!fs.existsSync(logfile))
      log.debug('hello')
      log.debug('hello2')
      assert(fs.existsSync(logfile))
      var f = fs.readFileSync(logfile, 'utf-8')
      assert.equal(f, '[DEBUG] test1: hello\n[DEBUG] test1: hello2\n')
      done()
    })

    it('writes to a global log file', function(done) {
      if (isBrowser) { this.skip(); }
      var log1 = Logger.create('test1', { showTimestamp: false })
      var log2 = Logger.create('test2', { showTimestamp: false })
      Logger.setLogfile(logfile)
      log1.debug('hello1')
      log2.debug('hello2')
      assert(fs.existsSync(logfile))
      var f = fs.readFileSync(logfile, 'utf-8')
      assert.equal(f, '[DEBUG] test1: hello1\n[DEBUG] test2: hello2\n')
      done()
    })

  })

  describe('LOG environment variable', function() {

    before(function() {
      if (isBrowser) { this.skip(); }
    })

    it('logs according to LOG environment variable', function(done) {
      var out = ''
      var old = console.log
      console.log = function(d) { out += d; }
      var log = Logger.create('test1', { showTimestamp: false, useColors: false })
      Logger.setLogLevel(Logger.LogLevels.NONE)
      process.env.LOG = 'debug'
      log.warn("hi")
      console.log = old
      assert.equal(out, '[WARN]  test1: hi')
      delete process.env.LOG
      done()
    })
  })

  describe('emits events', function() {
    var log = Logger.create('test1', { showTimestamp: false, useColors: false })

    it('emits \'data\'', function(done) {
      Logger.setLogLevel(Logger.LogLevels.WARN)
      Logger.events.on('data', function(source, level, text) {
        assert.equal(source, 'test1')
        assert.equal(level, 'WARN')
        assert.equal(text, 'hi')
        Logger.events.removeAllListeners('data')
        done()
      });
      log.warn("hi")
    })

    it('doesn\'t emit \'data\' when below log level', function(done) {
      Logger.setLogLevel(Logger.LogLevels.NONE)
      Logger.events.on('data', function(source, level, text) {
        console.log(source)
        assert.equal('Should not fire data event', null)
      })
      log.warn("hi")
      setTimeout(function() {
        Logger.events.removeAllListeners('data')
        done()
      }, 100)
    })
  })

})
