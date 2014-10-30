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
        var options = this.options({
                method: 'copy', //can be 'copy' or 'prune'
                bowerrc: '.bowerrc',
                tmpDir: '.tmp'
            }),
            bowerrc = grunt.file.exists(options.bowerrc) ? grunt.file.readJSON(options.bowerrc) : null,
            bowerDir = path.resolve(options.bowerDir || (bowerrc && bowerrc.directory ? bowerrc.directory : 'bower_components')),
            mainFiles = [],
            prune = options.method === 'prune';

        function addToMainList(mainFilePath) {
            mainFiles.push(mainFilePath);
            grunt.verbose.writeln('Added ' + mainFilePath + ' to main file list.');
        }

        if (options.method === 'copy' && !options.dest) {
            grunt.fatal("No destination specified.");
        }

        if (prune) {
            options.dest = options.tmpDir;
        }

        //find all the bower.json files and list the main files
        grunt.file.recurse(bowerDir, function (abspath, rootdir, subdir, filename) {
            var main;

            if (filename === 'bower.json') {
                grunt.verbose.writeln('Found bower.json in ' + subdir);
                main = grunt.file.readJSON(abspath).main;

                if (main) {
                    if (main.forEach) {
                        main.forEach(function (mainFile) {
                            addToMainList(path.join(rootdir, subdir, mainFile));
                        });
                    }
                    else {
                        addToMainList(path.join(rootdir, subdir, main));
                    }
                }
            }

            if (prune && (filename === 'bower.json' || filename === '.bower.json')) {
                addToMainList(abspath);
            }
        });

        //copy the main files to destination
        mainFiles.forEach(function (mainFile) {
            var dest = path.resolve(path.join(options.dest, mainFile.replace(bowerDir, '')));
            grunt.file.copy(mainFile, dest);
            grunt.log.ok("Copied " + mainFile + " -> " + dest);
        });

        if (prune) {
            grunt.verbose.writeln('Pruning bower components directory.');
            grunt.file.delete(bowerDir);
            fs.rename(options.tmpDir, bowerDir);
        }
    });

};
