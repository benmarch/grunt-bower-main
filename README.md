[![Build Status](https://travis-ci.org/benmarch/grunt-bower-main.svg?branch=master)](https://travis-ci.org/benmarch/grunt-bower-main)

# grunt-bower-main

> Adds only the main files from Bower components to source code. Integrates seamlessly with grunt-wiredep.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bower-main --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bower-main');
```

## The "bower_main" task

### Overview
In your project's Gruntfile, add a section named `bower_main` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  bower_main: {
    copy: {
      options: {
        dest: 'src/resources/bower_components'
      }
    }
  }
})
```

### Options

#### options.method
Type: `String`
Default value: `'copy'`

Dictates whether the main files will be copied to a destination directory ('copy'), or if other files will be removed from the
bower_components directory ('prune').

The default location for the bower_components directory is the top level directory. Setting method to 'copy' will
allow you to keep the bower_components directory and copy the main files into your source code. This is useful if you
are not using a static frontend stack (like a Java webapp for example). If you don't care about keeping the original
component files then you can set your bower_components directory to live directly in the source code and prune away
unnecessary files. This method keeps the 'bower.json' and '.bower.json' files also so that `bower install` does not 
reinstall them every time.

#### options.dest
Type: `String`
Default value: null

This must be set if using method: 'copy', will be the top-level destination directory of the main files.

#### options.tmpDir
Type: `String`
Default value: '.tmp'

This is used with method: 'prune'. The plugin copies main files here, deletes the bower_components directory, and renames
this directory to 'bower_components' (or whatever the original bower components directory was named.) Change this if you
are using '.tmp' for any other plugin.

#### options.bowerrc
Type: `String`
Default value: '.bowerrc'

Points to your .bowerrc file if you have one.

### Usage Examples
This task is generally used in tandem with [grunt-wiredep](https://github.com/stephenplusplus/grunt-wiredep). Run this 
task first, and then configure wiredep as you normally would. This is possible because the directory structure of the 
output of this task is identical to the original. The motivation to create this task comes from working in a Java house
and we wanted to pull the bower_components out of the artifact, but still be able to use wiredep.

#### Copy
To get started quickly, just set a 'dest' directory:

```js
grunt.initConfig({
  bower_main: {
    copy: {
      options: {
        dest: 'src/resources/bower_components'
      }
    }  
  }
})
```

#### Prune
If you want to prune instead, just tell it to prune and change the temp directory if necessary:

```js
grunt.initConfig({
  bower_main: {
    prune: {
      options: {
        method: 'prune',
        tmpDir: 'pruneTmp'
      }
    }  
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.1.0 - Initial release

## License
Copyright (c) 2014 Ben March. Licensed under the MIT license.
