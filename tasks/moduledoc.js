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

      var arr = [],
        moduledata,
        i,
        l,
        generator,
        filepath;

      f.src.filter(function(filepath) {
        return grunt.file.isFile(filepath);
      }).map(function(filepath) {
        var parser, data, markup;
        parser = new FileParser(filepath);
        data = parser.parse();

        arr.push(data);
      });

      if (!arr.length) {
        return;
      }

      moduledata = new ModuleData(arr);

      createModulePages(grunt, moduledata, options.templatepath, f.dest);
      createIndexPage(grunt, moduledata, options.templatepath, f.dest);

      // copy assets
      fse.copySync(options.assetspath, path.join(f.dest, './assets'));
    });

  });

};

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

/**
 * Returns a list of modules that are not contained by any other module.
 */
function getTopLevel(moduledata) {
  var i,
    l,
    contained = [],
    notcontained = [];

  // get list of all "contained" modules
  for (i = 0, l= moduledata.length; i < l; i++) {
    contained = arrayMerge(contained, moduledata[i].must_contain);
    contained = arrayMerge(contained, moduledata[i].can_contain);
  }
  // get modules that are NOT contained
  for (i = 0, l= moduledata.length; i < l; i++) {
    if (!inArray(contained, moduledata[i].title)) {
      notcontained.push(moduledata[i]);
    }
  }

  return notcontained;
}

function arrayMerge(target, source) {
  var i = 0, l;

  if (!source) {
    return target;
  }

  l = source.length;

  for (; i < l; i++) {
    if (!inArray(target, source[i])) {
      target.push(source[i]);
    }
  }

  return target;
}

function inArray(target, value) {
  var i = 0, l = target.length;
  for (; i < l; i++) {
    if (target[i] === value) {
      return true;
    }
  }
  return false;
}
