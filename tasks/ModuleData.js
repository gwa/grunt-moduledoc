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
