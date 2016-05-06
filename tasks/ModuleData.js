'use strict';

var utils = require('./utils');

module.exports = ModuleData;

/**
 * @param {array} moduledata
 */
function ModuleData(moduledata) {
  this.moduledata = moduledata;

  // Extract module names
  this.modulenames = [];
  this.indexmap = [];

  this.options = undefined;
  this.optionsindex = [];

  this.toplevel = undefined;
  this.tree = undefined;

  var i = 0, l = this.moduledata.length;
  for (; i < l; i++) {
    this.modulenames.push(this.moduledata[i].title);
    this.indexmap[this.moduledata[i].title] = i;
  }
}

/**
 * @return {array}
 */
ModuleData.prototype.getModules = function() {
  return this.moduledata;
}

/**
 * @return {array}
 */
ModuleData.prototype.getModuleNames = function() {
  return this.modulenames;
}

/**
 * @param {string} name - name of the module
 * @return {object}
 */
ModuleData.prototype.getModule = function(name) {
  return this.moduledata[
    this.indexmap[name]
  ];
}

/**
 * @todo refactor
 * @return {array}
 */
ModuleData.prototype.getOptions = function() {
  var i, l, j, m, opts, index;

  if (typeof this.options === 'undefined') {
    this.options = [];
    for (i = 0, l = this.moduledata.length; i < l ;i++) {
      var opts = this.moduledata[i].options;
      if (!opts) {
        continue;
      }
      for (j = 0, m = opts.length; j < m; j++) {
        if (typeof this.optionsindex[opts[j].class] === 'undefined') {
          index = this.options.length;
          this.options.push({class: opts[j].class, modules: []});
          this.optionsindex[opts[j].class] = index;
        }
        this.options[this.optionsindex[opts[j].class]].modules.push(this.moduledata[i].title);
      }
    }

    // sort
    this.options = this.options.sort(function(a, b) {
      if(a.class < b.class) return -1;
      if(a.class > b.class) return 1;
      return 0;
    });
  }

  return this.options;
}

/**
 * Returns a list of modules that are not contained by any other module.
 */
ModuleData.prototype.getTopLevelModules = function() {
  var i,
    l,
    j,
    m,
    contained = [],
    notcontained = [],
    mod;

  if (!this.toplevel) {
    // get list of all "contained" modules
    for (i = 0, l = this.moduledata.length; i < l; i++) {
      mod = this.moduledata[i];
      if (mod.contains) {
        for (j = 0, m = mod.contains.length; j < m; j++) {
          if (mod.contains[j].module === true) {
            contained.push(mod.contains[j].data);
          }
        }
      }
    }

    // get modules that are NOT contained
    for (i = 0, l= this.moduledata.length; i < l; i++) {
      if (!utils.inArray(contained, this.moduledata[i].title)) {
        notcontained.push(this.moduledata[i]);
      }
    }

    this.toplevel = notcontained;
  }

  return this.toplevel;
};

/**
 * @return {array}
 */
ModuleData.prototype.getTree = function() {
  var tl, toplevel, i, l;

  if (!this.tree) {
    this.tree = [];

    tl = this.getTopLevelModules();
    for (i = 0, l = tl.length; i < l; i++) {
      this.tree.push(getContainedBranch(tl[i], this));
    }
  }

  return this.tree;
}

function getContainedBranch(module, moduledata) {
  var i, l, contained = [], name, mod;

  if (!module) {
    return;
  }

  if (module.contains) {
    for (i = 0, l = module.contains.length; i < l; i++) {
      if (module.contains[i].module === true) {
        name = module.contains[i].data;
        mod = moduledata.getModule(name);

        if (mod) {
          contained.push(
            getContainedBranch(
              mod,
              moduledata
            )
          );
        }
      }
    }
  }

  return {
    title: module.title,
    contains: contained
  }
}
