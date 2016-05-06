/**
 * Imports a YAML file and parses it as JSON.
 */

'use strict';

var fs = require('fs');
var yaml = require('js-yaml');

module.exports = FileParser;

function FileParser(path) {
  this.path = path;
}

FileParser.prototype.parse = function() {
  var yaml_data, json, data;

  yaml_data = fs.readFileSync(this.path, 'UTF-8');

  data = yaml.safeLoad(
    yaml_data,
    {
      filename: this.path
    }
  );

  data = parseDOM(data);
  data = parseContains(data);

  return data;
}

function parseDOM(data) {
  var dom = data.dom, arr;

  if (!dom) {
    data.dom = 'div';
    return data;
  }

  arr = data.dom.split('>');

  data.dom = arr[0];
  data.dom_inner = arr[1] ? arr[1] : null;

  return data;
}

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
