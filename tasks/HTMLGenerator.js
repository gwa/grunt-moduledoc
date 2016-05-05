/**
 * Creates an HTML markup from JSON data.
 */

'use strict';

var fs = require('fs');
var handlebars = require('handlebars');

module.exports = HTMLGenerator;

function HTMLGenerator(module, moduledata) {
  this.module = module;
  this.moduledata = moduledata;

  this.context = {
    module:  this.module
  };

  if (this.moduledata) {
    this.context.modules = moduledata.getModules();
    this.context.optionslist = moduledata.getOptions();
  }
}

HTMLGenerator.prototype.generate = function(templatepath) {
  var template, source;

  source = fs.readFileSync(templatepath, 'UTF-8');
  template = handlebars.compile(source);

  return template(
    this.context
  );
}
