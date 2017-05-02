/**
 * Imports a YAML file and parses it as JSON.
 */

'use strict';

var fs = require('fs');
var yaml = require('js-yaml');

module.exports = FileParser;

function FileParser(path, parsers) {
  this.path = path;
  this.parsers = parsers;
  this.data = null;
}

FileParser.prototype.load = function() {
  var yaml_data, data;

  yaml_data = fs.readFileSync(this.path, 'UTF-8');

  this.data = yaml.safeLoad(
    yaml_data,
    {
      filename: this.path
    }
  );

  return this.data;
}

FileParser.prototype.parse = function() {
  this.data = parseDOM(this.data, this.parsers);
  this.data = parseContains(this.data);

  return this.data;
}

/**
 * @return {String}
 */
FileParser.prototype.getTitle = function() {
  return this.data.title;
}

/**
 * @return {String}
 */
FileParser.prototype.getDOM = function() {
  return this.data.dom;
}

/**
 * @return {String}
 */
FileParser.prototype.getClass = function() {
  return this.data.class;
}

function parseDOM(data, parsers) {
  var dom = data.dom, arr;

  if (!dom) {
    data.dom = 'div';
    return data;
  }

  arr = data.dom.split('>');

  data.dom = arr[0];
  data.dom_inner = parseDOMInner(arr, parsers);

  return data;
}

function parseDOMInner(arr, parsers) {
  var i = 1,
    l = arr.length,
    dom,
    indent = '  ',
    str = '%%';

  for (; i < l; i++) {
    str = parseDOMInnerElement(arr[i], str, indent, parsers);
    indent = indent + '  ';
  }

  return str.replace('%%', indent + '...');
}

/**
 * @param {String} dom
 * @param {String} str
 */
function parseDOMInnerElement(dom, str, indent, parsers) {
  var pattern = /^([A-Z_]+)$/,
    parser,
    open,
    close;

  if (dom.match(pattern)) {
    // It's a module!
    return parseModuleInnerElement(dom, str, indent, parsers);
  }

  return parseSimpleDOMInnerElement(dom, str, indent);
}

function parseModuleInnerElement(dom, str, indent, parsers) {
  var parser,
    open,
    close,
    parts = [];

  parser = parsers[dom];
  open = parser.getDOM() + ' class="' + parser.getClass() + '"';
  close = parser.getDOM();

  parts.push(indent + '&lt;' + open + '&gt;');
  parts.push('%%');
  parts.push(indent + '&lt;/' + close + '&gt;');

  return str.replace(
    '%%',
    parts.join('\n')
  );
}

function parseSimpleDOMInnerElement(dom, str, indent) {
  var open = dom,
    close = dom,
    ind = dom.indexOf('.'),
    arr,
    parts = [];

  if (ind === 0) {
    open = 'div class="' + dom.substring(1) + '"';
    close = 'div';
  } else if (ind > 0) {
    arr = dom.split('.');
    open = arr[0] + ' class="' + arr[1] + '"';
    close = arr[0];
  }

  parts.push(indent + '&lt;' + open + '&gt;');
  parts.push('%%');
  parts.push(indent + '&lt;/' + close + '&gt;');

  return str.replace(
    '%%',
    parts.join('\n')
  );
}

// --------

function parseContains(data) {
  var i,
    l,
    pattern = /^([A-Z_]+) ?([\*\+\?])?$/,
    contains = [],
    matched,
    moduledata,
    target;

  if (!data.contains) {
    return data;
  }

  for (i = 0, l = data.contains.length; i < l; i++) {
    target = data.contains[i];
    matched = target.match(pattern);
    if (matched) {
      moduledata = {
        module: true,
        data: matched[1]
      };
      moduledata = parseFrequency(moduledata, matched[2]);
      contains.push(moduledata);
    } else {
      contains.push(
        {data: target}
      );
    }
  }

  data.contains = contains;

  return data;
}

function parseFrequency(moduledata, match) {
  switch (match) {
    case '?':
      moduledata.frequency_str = 'opt.';
      break;
    case '+':
      moduledata.frequency_str = 'multiple';
      break;
    case '*':
      moduledata.frequency_str = 'opt. multiple';
      break;
    default:
      moduledata.frequency_str = null;
      break;
  }

  moduledata.frequency = match;

  return moduledata;
}
