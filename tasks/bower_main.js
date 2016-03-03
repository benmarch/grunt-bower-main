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

function simpleExtend(destination, source) {
    if (!destination) {
        return source;
    }
    if (!source) {
        return destination;
    }

    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            destination[key] = source[key];
        }
    }

    return destination;
 }

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('bower_main', 'Adds only the main files from Bower components to source code.', function () {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
                method: 'copy', //can be 'copy' or 'prune'
                bowerrc: '.bowerrc',
                tmpDir: '.tmp',
                bowerFile: './bower.json'
            }),
            bowerrc = grunt.file.exists(options.bowerrc) ? grunt.file.readJSON(options.bowerrc) : null,
            bowerDir = path.resolve(options.bowerDir || (bowerrc && bowerrc.directory ? bowerrc.directory : 'bower_components')).replace(/\\/g, '/'),
            mainFiles = [],
            prune = options.method === 'prune',
            bowerFile = grunt.file.exists(options.bowerFile) ? grunt.file.readJSON(options.bowerFile) : null,
            overrides = simpleExtend(options.overrides, bowerFile ? bowerFile.overrides : null);

        function addToMainList(mainFilePath) {
            var files = grunt.file.expand(mainFilePath);

            files.forEach(function (file) {
                if (!~mainFiles.indexOf(file)) {
                    mainFiles.push(file);
                }
                grunt.verbose.writeln('Added ' + mainFilePath + ' to main file list.');
            });
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

            if (filename === 'bower.json' || filename === '.bower.json') {
                grunt.verbose.writeln('Found bower.json in ' + subdir);

                //check for main files overrides
                if (overrides && overrides[subdir] && overrides[subdir].main) {
                    grunt.verbose.writeln('Found override for: ' + subdir);
                    main = overrides[subdir].main;
                } else {
                    main = grunt.file.readJSON(abspath).main;
                }

                //if we have a main files
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
