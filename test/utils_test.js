'use strict';

var path = require('path');
var utils = require('../tasks/utils');

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

exports.utils = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  inArray: function(test) {
    test.expect(3);

    var arr = ['b', 'a'];

    test.equal(utils.inArray(arr, 'a'), true, 'is in array.');
    test.equal(utils.inArray(arr, 'b'), true, 'is in array.');
    test.equal(utils.inArray(arr, 'c'), false, 'is not in array.');

    test.done();
  },
};
