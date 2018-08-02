'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha');
  grunt.initConfig({

    mocha: {
      browserTests: {
        src: ['test/index.html'],
        options: {
          log: true,
          reporter: 'spec',
          growlOnFail: false,
          growlOnSuccess: false
        }
      }
    }
  });

  grunt.task.registerTask('browser-tests', ['mocha']);
};