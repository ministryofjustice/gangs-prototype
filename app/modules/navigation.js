// navigation tools module

var navigation = {
  next: function(current, max) {
    n = parseInt(current, 10) + 1;
    if(n > max - 1) {
      n = 0;
    }

    return n;
  },
  prev: function(current, max) {
    current = parseInt(n, 10) - 1;
    if(n < 0) {
      n = max - 1;
    }

    return n;
  }
};

module.exports = navigation;
