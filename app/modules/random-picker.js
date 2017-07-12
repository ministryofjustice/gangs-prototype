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
  },

  // return a new array containing elements from 
  // the given array, with each element having 
  // the given probability of being added
  randomElements: function(arr, probability) {
    return arr.filter(function(e){
      return Math.random() < probability;
    });
  }
}

module.exports = randomPicker;