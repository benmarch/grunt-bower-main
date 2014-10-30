/*
 * grunt-bower-main
 * https://github.com/benmarch/grunt-bower-main
 *
 * Copyright (c) 2014 Ben March
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    fs = require('fs');

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('bower_main', 'Adds only the main files from Bower components to source code.', function () {

        // Merge task-specific and/or target-specific options with these defaults.
        var done = this.async(),
            options = this.options({
                bowerrc: '.bowerrc'
            }),
            bowerrc = grunt.file.exists(options.bowerrc) ? grunt.file.readJSON(options.bowerrc) : null,
            bowerDir = path.resolve(options.bowerDir || (bowerrc && bowerrc.directory ? bowerrc.directory : 'bower_components')),
            mainFiles = [];

        if (!options.dest || options.remove) {
            grunt.fatal("No operation specified.");
        }

        fs.readdir(bowerDir, function (err, files) {
            if (err) {
                grunt.fatal('Could not read from bower directory: ' + bowerDir);
            }

            files.forEach(function (file) {
                if (fs.statSync(path.join(bowerDir, file)).isDirectory()) {
                    var bowerJsonFile = path.join(bowerDir, file, 'bower.json'),
                        main;

                    if (fs.existsSync(bowerJsonFile)) {
                        main = grunt.file.readJSON(bowerJsonFile).main;

                        if (main) {
                            if (main.forEach) {
                                main.forEach(function (mainFile) {
                                    mainFiles.push(path.join(bowerDir, file, mainFile));
                                });
                            }
                            else {
                                mainFiles.push(path.join(bowerDir, file, main));
                            }
                        }
                    }
                }
            });

            mainFiles.forEach(function (mainFile) {
                var dest = path.join(options.dest, mainFile.replace(bowerDir, ''));
                grunt.file.copy(mainFile, dest);
            });

            done();
        });
    });

};
