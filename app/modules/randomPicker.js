var randomPicker = {
  rnd: function(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  rndDigits: function(chars) {
    var str = '';
    for(var x = 0; x < chars; x++) {
      str += Math.floor(Math.random() * 10);
    }
    return str;
  },
  rndLetters: function(chars) {
    var str = '';
    for(var x = 0; x < chars; x++) {
      var rndLetter = Math.floor(Math.random() * 26);
      str += String.fromCharCode(65 + rndLetter);
    }
    return str;
  }
}

module.exports = randomPicker;