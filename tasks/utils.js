'use strict';

module.exports = {
  inArray: function(target, value) {
    var i = 0, l = target.length;
    for (; i < l; i++) {
      if (target[i] === value) {
        return true;
      }
    }
    return false;
  },

  arrayMerge: function(target, source) {
    var i = 0, l;

    if (!source) {
      return target;
    }

    l = source.length;

    for (; i < l; i++) {
      if (!utils.inArray(target, source[i])) {
        target.push(source[i]);
      }
    }

    return target;
  }
};
