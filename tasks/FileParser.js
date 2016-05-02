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
  var yaml_data, json;

  yaml_data = fs.readFileSync(this.path, 'UTF-8');

  return yaml.safeLoad(
    yaml_data,
    {
      filename: this.path
    }
  );
}
