// nominal tools module
var gangs = require('../assets/data/dummyGangs.json').gangs;

var nominal = {
  displayDob: function(dob) {
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    return dob.day + ' ' + months[dob.month - 1] + ' ' + dob.year;
  },
  getAge: function(dob) {
    var now = new Date(),
        then = new Date(dob.year, dob.month - 1, dob.day),
        elapsed = now.getTime() - then.getTime(),
        yearInMs = 1000 * 60 * 60 * 24 * 365.25,
        elapsedYears = Math.floor(elapsed / yearInMs);

    return elapsedYears;
  },
  getAffiliations: function(affiliationIndexes) {
    var affiliations = [];

    affiliationIndexes.forEach(function(index) {
      var affiliation = {
        index: index,
        name: gangs[index].name
      };
      affiliations.push(affiliation);
    });

    return affiliations;
  }
};

module.exports = nominal;
