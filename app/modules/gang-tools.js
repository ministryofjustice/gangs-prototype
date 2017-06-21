// gang tools module
var gangs = require('../assets/data/dummyGangs.json').gangs;
var nominals = require('../assets/data/dummyNominals.json').nominals;
var tensions = require('../assets/data/gangTensions.json').tensions;

var gang = {
  getNominals: function(gangIndex) {
    var gangNominals = [];

    nominals.forEach(function(nominal, n) {
      var gangContainsNominal = nominal.affiliations.indexOf(parseInt(gangIndex,10)) !== -1;

      if(gangContainsNominal) {
        gangNominals.push({
          index: n,
          name: [nominal.given_names, nominal.family_name].join(' ')
        });
      }
    });

    return gangNominals;
  },
  getGangTensions: function(gangIndex) {
    var gangTensions = [];

    tensions.forEach(function(tension) {
      var gangIndexPosition = tension.indices.indexOf(parseInt(gangIndex, 10));

      if(gangIndexPosition !== -1) {
        // one of the parties in this tension is gangIndex
        var otherGang = parseInt((gangIndexPosition === 0 ? tension.indices[1] : tension.indices[0]), 10);
        gangTensions.push({
          gang: {
            index: otherGang,
            name: gangs[otherGang].name
          },
          tensionLevel: tension.tensionLevel
        });
      }
    });

    return gangTensions;
  }
};

module.exports = gang;
