var arrayUtils = {
  flatten: function(a) {
    return [].concat.apply([], a);
  },

  forceToArray: function(obj) {
    return this.flatten([].concat(obj));
  },

  uniquify: function(a) {
    return [...(new Set(a))]
  }
}

module.exports = arrayUtils;
