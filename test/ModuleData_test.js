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

  getOptionsList: function(test) {
    test.expect(1);

    var arr = [
      {
        title: 'FOO_MODULE',
        options: [
          {class: 'opt-foo', description: 'foo'}
        ]
      },
      {
        title: 'BAZ_MODULE',
        options: [
          {class: 'opt-foo', description: 'bar'}
        ]
      }
    ];

    var data = new ModuleData(arr);

    var options = data.getOptions();

    test.equal(2, options[0].modules.length, 'Extracts options from modules.');

    test.done();
  },

  getTopLevelModules: function(test) {
    test.expect(3);

    var arr = [
      {
        title: 'FOO_MODULE',
        contains: [
          {module: true, data: 'BAZ_MODULE'},
          {module: false, data: 'simple markup'},
        ]
      },
      {
        title: 'BAZ_MODULE',
        contains: [
          {module: true, data: 'BAR_MODULE'},
        ]
      },
      {
        title: 'TOP_MODULE'
      }
    ];

    var data = new ModuleData(arr);

    var toplevel = data.getTopLevelModules();

    test.equal(2, toplevel.length, 'Extracts the top level modules.');
    test.equal('FOO_MODULE', toplevel[0].title, 'Extracts the top level modules.');
    test.equal('TOP_MODULE', toplevel[1].title, 'Extracts the top level modules.');

    test.done();
  },

  getTree: function(test) {
    test.expect(3);

    var arr = [
      {
        title: 'FOO_MODULE',
        contains: [
          {module: true, data: 'BAZ_MODULE'},
          {module: false, data: 'simple markup'},
        ]
      },
      {
        title: 'BAZ_MODULE',
        contains: [
          {module: true, data: 'BAR_MODULE'},
        ]
      },
      {
        title: 'TOP_MODULE'
      },
      {
        title: 'BAR_MODULE'
      }
    ];

    var data = new ModuleData(arr);

    var tree = data.getTree();

    test.equal(2, tree.length, 'Extracts the top level modules.');
    test.equal('FOO_MODULE', tree[0].title, 'Extracts the top level modules.');
    test.equal(1, tree[0].contains.length);

    test.done();
  },
};
