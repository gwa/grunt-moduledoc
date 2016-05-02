'use strict';

var path = require('path');
var FileParser = require('../tasks/FileParser');

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

exports.FileParser = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  import: function(test) {
    test.expect(1);

    test.equal(typeof FileParser, 'function', 'FileParser can be imported.');

    test.done();
  },

  parseTitle: function(test) {
    var filepath, parser, parsed;

    test.expect(4);

    // ----

    filepath = path.join(__dirname, './fixtures/docs/button_group.yml');
    parser = new FileParser(filepath);
    parsed = parser.parse();

    test.equal(parsed.title, 'BUTTON_GROUP', 'Can parse the title.');
    test.equal(parsed.can_contain[0], 'BUTTON', 'Can parse the can_contain list.');
    test.equal(parsed.can_contain.length, 1, 'Can parse the can_contain list.');

    // ----

    filepath = path.join(__dirname, './fixtures/docs/button.yml');
    parser = new FileParser(filepath);
    parsed = parser.parse();

    test.equal(parsed.title, 'BUTTON', 'Can parse the title.');

    // ----

    test.done();
  },
};
