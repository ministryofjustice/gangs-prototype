var randomPicker = {
  rnd: function(array) {
    return array[this.rndIndex(array)];
  },

  rndIndex: function(array) {
    return Math.floor(Math.random() * array.length);
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

  randomElement: function(array) {
    return this.rnd(array);
  },

  // return a new array containing elements from 
  // the given array, with each element having 
  // the given probability of being added
  randomElements: function(arr, probability) {
    return arr.filter(function(e){
      return Math.random() < probability;
    });
  },

  // Populate an initial array of all the possible
  // indices, and then choose a random element from
  // that array N times, removing the element each time
  randomNElements: function(arr, n){
    var selectedIndices = [], possibleIndices = [];
    for(var i=0; i < arr.length; i++){ possibleIndices.push(i); }

    for(var count=0; count < n; count++){
      var thisIndex = this.rndIndex(possibleIndices);
      selectedIndices.push(possibleIndices[thisIndex]);
      possibleIndices.splice(thisIndex, 1);
    }

    return selectedIndices.map(function(i){ return arr[i]; });
  },

  randomIntegerBetween: function(min, max) {
    var range = max - min;
    return Math.floor( (Math.random() * (range+1)) ) + min;
  }
}

module.exports = randomPicker;