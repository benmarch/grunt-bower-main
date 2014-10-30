/*
 * grunt-bower-main
 * https://github.com/benmarch/grunt-bower-main
 *
 * Copyright (c) 2014 Ben March
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    // load all npm grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        'bower-install-simple': {
            bower: {}
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['copyTmp', 'pruneTmp']
        },

        // Configuration to be run (and then tested).
        bower_main: {
            copy: {
                options: {
                    dest: 'copyTmp'
                }
            },
            prune: {
                options: {
                    method: 'prune',
                    tmpDir: 'pruneTmp'
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'bower-install-simple', 'bower_main', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
