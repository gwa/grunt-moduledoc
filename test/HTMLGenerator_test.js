'use strict';

var fs = require('fs');
var path = require('path');
var HTMLGenerator = require('../tasks/HTMLGenerator');

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
    var moduledata, modules, templatepath, generator, markup, expected;

    test.expect(1);

    moduledata = {
      title: 'BUTTON_GROUP',
      description: 'A group that contains buttons',
      dom: 'div',
      class: 'ui-button-group',
      options: [
        {class: 'opt-foo', description: 'Adds that foo style!'}
      ],
      contains: [
        {module: true, data: 'BUTTON', frequency: '+', frequency_str: 'multiple'}
      ]
    };

    modules = ['BUTTON', 'BUTTON_GROUP', 'FULLWIDTH_HEADER', 'PAGE_CONTENT'];

    generator = new HTMLGenerator(moduledata, modules);
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
