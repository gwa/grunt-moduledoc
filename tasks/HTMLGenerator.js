/**
 * Creates an HTML markup from JSON data.
 */

'use strict';

var fs = require('fs');
var handlebars = require('handlebars');

module.exports = HTMLGenerator;

function HTMLGenerator(data, modules) {
  this.data = data;
  this.modules = modules;
}

HTMLGenerator.prototype.generate = function(templatepath) {
  var template, source;

  source = fs.readFileSync(templatepath, 'UTF-8');
  template = handlebars.compile(source);

  return template(
    {
      module: this.data,
      modules: this.modules
    }
  );
}
