'use strict';

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

exports.ModuleData = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  doInit: function(test) {
    test.expect(2);

    var arr = [{
      title: 'FOO_MODULE'
    }];

    var data = new ModuleData(arr);

    var names = data.getModuleNames();

    test.equal(1, names.length, 'Extracts names of modules.');
    test.equal('FOO_MODULE', data.getModule('FOO_MODULE').title, 'Can return module by name.');

    test.done();
  },
};
