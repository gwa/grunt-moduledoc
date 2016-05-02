/*
 * grunt-moduledoc
 * https://github.com/gwa/grunt-moduledoc
 *
 * Copyright (c) 2016 Timothy Groves
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var fse = require('fs-extra');
var FileParser = require('./FileParser');
var HTMLGenerator = require('./HTMLGenerator');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('moduledoc', 'Creates a frontend module documentation', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var
      modulenames = [],
      moduledata = [],
      options = this.options({
        templatepath: path.join(__dirname, '../templates/module.mustache'),
        assetspath:   path.join(__dirname, '../templates/assets'),
      }),
      i,
      l,
      generator,
      filepath;

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      f.src.filter(function(filepath) {
        return grunt.file.isFile(filepath);
      }).map(function(filepath) {
        var parser, data, markup;
        parser = new FileParser(filepath);
        data = parser.parse();
        modulenames.push(data.title);
        moduledata.push(data);
      });

      for (i = 0, l = moduledata.length; i < l; i++) {
        filepath = path.join(f.dest, './' + moduledata[i].title + '.html');
        createFile(grunt, moduledata[i], modulenames, filepath, options.templatepath);
      }

      // create index
      filepath = path.join(f.dest, './index.html');
      createFile(grunt, null, modulenames, filepath, options.templatepath);

      // copy assets
      fse.copySync(options.assetspath, path.join(f.dest, './assets'));
    });

  });

};

function createFile(grunt, moduledata, modules, filepath, templatepath) {
  var generator = new HTMLGenerator(moduledata, modules);
  grunt.file.write(filepath, generator.generate(templatepath));
  grunt.log.writeln('File "' + filepath + '" created.');
}
