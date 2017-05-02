'use strict';

var fs = require('fs');
var path = require('path');
var FileParser = require('../tasks/FileParser');
var HTMLGenerator = require('../tasks/HTMLGenerator');
var ModuleData = require('../tasks/ModuleData');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.HTMLGenerator = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  import: function(test) {
    test.expect(1);

    test.equal(typeof HTMLGenerator, 'function', 'HTMLGenerator can be imported.');

    test.done();
  },

  generate: function(test) {
    var filepath, parsers = [], parser, mod, moduledata, templatepath, generator, markup, expected;

    test.expect(1);

    filepath = path.join(__dirname, './fixtures/docs/wrapper.yml');
    parser = new FileParser(filepath, parsers);
    parser.load();
    parser.parse();
    parsers[parser.getTitle()] = parser;

    // ----

    filepath = path.join(__dirname, './fixtures/docs/button_group.yml');
    parser = new FileParser(filepath, parsers);
    parser.load();
    mod = parser.parse();

    moduledata = new ModuleData([
      {title: 'BUTTON'},
      {title: 'BUTTON_GROUP'},
      {title: 'FULLWIDTH_HEADER'},
      {title: 'PAGE_CONTENT'},
      {title: 'WRAPPER'}
    ]);

    generator = new HTMLGenerator(mod, moduledata);
    templatepath = path.join(__dirname, '../templates/module.mustache');
    markup = generator.generate(templatepath);
    expected = fs.readFileSync(
      path.join(__dirname, './expected/BUTTON_GROUP.html'),
      'UTF-8'
    );

    // ----

    test.equal(markup, expected, 'Can render HTML.');

    // ----

    test.done();
  },
};
