/*
 * grunt-moduledoc
 * https://github.com/gwa/grunt-moduledoc
 *
 * Copyright (c) 2016 Timothy Groves
 * Licensed under the MIT license.
 */

'use strict';

var path          = require('path');
var fse           = require('fs-extra');

var FileParser    = require('./FileParser');
var ModuleData    = require('./ModuleData');
var HTMLGenerator = require('./HTMLGenerator');
var utils = require('./utils');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('moduledoc', 'Creates a frontend module documentation', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var
      options = this.options({
        templatepath: path.join(__dirname, '../templates'),
        assetspath:   path.join(__dirname, '../templates/assets'),
      });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var
        parsers = [],
        arr = [],
        i = 0,
        moduledata,
        generator,
        filepath;

      // Get a FileParser for each yml file.
      f.src.filter(function(filepath) {
        return grunt.file.isFile(filepath);
      }).map(function(filepath) {
        var parser;
        parser = new FileParser(filepath, parsers);
        parser.load();

        parsers[parser.getTitle()] = parser;
        i++;
      });

      if (i === 0) {
        return;
      }

      // Actually parse the data for each file.
      for (i in parsers) {
        arr.push(parsers[i].parse());
      }

      // Sort modules alphabetically by title.
      arr.sort(compare);

      moduledata = new ModuleData(arr);

      createModulePages(grunt, moduledata, options.templatepath, f.dest);
      createIndexPage(grunt, moduledata, options.templatepath, f.dest);

      // copy assets
      fse.copySync(options.assetspath, path.join(f.dest, './assets'));
    });

  });

};

// Used to sort module data array by title.
function compare(a,b) {
  if (a.title < b.title)
    return -1;
  if (a.title > b.title)
    return 1;
  return 0;
}

function createModulePages(grunt, moduledata, templatedir, targetdir) {
  var i,
    l,
    modules = moduledata.getModules(),
    templatepath = path.join(templatedir, 'module.mustache'),
    filepath;

  for (i = 0, l = modules.length; i < l; i++) {
    filepath = path.join(targetdir, './' + modules[i].title + '.html');
    createFile(grunt, modules[i], moduledata, filepath, templatepath);
  }
}

function createIndexPage(grunt, moduledata, templatedir, targetdir) {
  var templatepath = path.join(templatedir, 'module.mustache'),
    filepath = path.join(targetdir, './index.html');

  createFile(grunt, null, moduledata, filepath, templatepath);
}

function createFile(grunt, module, moduledata, filepath, templatepath) {
  var generator = new HTMLGenerator(module, moduledata);

  grunt.file.write(filepath, generator.generate(templatepath));
  grunt.log.writeln('File "' + filepath + '" created.');
}
