var faker = require('faker');
var randomPicker = require('./random-picker.js');
var policeForces = require('../sources/police-forces.json');

var policeTools = {
  randomPoliceForce: function(){
    return randomPicker.randomElement(policeForces);
  },

  generatePoliceOfficerTitle: function(){
    return [
      randomPicker.randomElement(['DS', 'DC', 'DCI', 'DI']),
      faker.name.firstName(),
      faker.name.lastName()
    ].join(' ');
  }
};

module.exports = policeTools;
