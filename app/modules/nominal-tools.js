// nominal tools module
var ocgs = require('../assets/data/dummyOcgs.json').ocgs;
var nominals = require('../assets/data/dummyNominals.json').nominals;

var nominal = {
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
        name: ocgs[index].name
      };
      affiliations.push(affiliation);
    });

    return affiliations;
  },

  search: function(params) {
    var filtered_nominals = nominals.map( function(element, index){ element['index'] = index; return element; } );
    return nominals;
  }
};

module.exports = nominal;
