'use strict';

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
  }

  return this.options;
}

/**
 * Replace with utils.inArray when merged
 */
function inArray(target, value) {
    var i = 0, l = target.length;
    for (; i < l; i++) {
      if (target[i] === value) {
        return true;
      }
    }
    return false;
}
