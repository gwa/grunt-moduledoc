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
    this.context.modules     = moduledata.getModules();
    this.context.typeslist   = moduledata.getTypes();
    this.context.optionslist = moduledata.getOptions();
    this.context.tree        = renderTree(moduledata.getTree(), true);
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

/**
 * @param {array} tree
 * @param {boolean} isbase
 * @return string
 */
function renderTree(tree, isbase) {
  var i, l, markup;

  if (!tree || !tree.length) {
    return '';
  }

  markup = isbase ? '<ul class="ui-tree">' : '<ul>';
  for (i = 0, l = tree.length; i < l; i++) {
    markup += '<li>'
    markup += '<a href="' +tree[i].title+ '.html">' +tree[i].title+ '</a>'
    markup += renderTree(tree[i].contains);
    markup += '</li>';
  }
  markup += '</ul>';

  return markup;
}
