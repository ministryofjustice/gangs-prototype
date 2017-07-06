// ocg tools module
var ocgs = require('../assets/data/dummy-ocgs.json').ocgs;
var nominals = require('../assets/data/dummy-nominals.json').nominals;
var tensions = require('../assets/data/ocg-tensions.json').tensions;
var nominalRoles = require('../../app/sources/roles.json').roles;
var search = require('./search.js');

var ocg = {
  getNominals: function(ocgIndex) {
    var ocgNominals = [];

    nominals.forEach(function(nominal, n) {
      var ocgContainsNominal = false,
          role;

      nominal.affiliations.forEach(function(affiliation) {
        if(affiliation[0] === parseInt(ocgIndex, 10)) {
          ocgContainsNominal = true;
          role = nominalRoles[affiliation[1]];
        }
      });

      if(ocgContainsNominal) {
        ocgNominals.push({
          index: n,
          name: [nominal.given_names, nominal.family_name].join(' '),
          role: role
        });
      }
    });

    return ocgNominals;
  },
  getOcgTensions: function(ocgIndex) {
    var ocgTensions = [];

    tensions.forEach(function(tension) {
      var ocgIndexPosition = tension.indices.indexOf(parseInt(ocgIndex, 10));

      if(ocgIndexPosition !== -1) {
        // one of the parties in this tension is ocgIndex
        var otherOcg = parseInt((ocgIndexPosition === 0 ? tension.indices[1] : tension.indices[0]), 10);
        ocgTensions.push({
          ocg: {
            index: otherOcg,
            name: ocgs[otherOcg].name
          },
          tensionLevel: tension.tensionLevel
        });
      }
    });

    return ocgTensions;
  },

  search: function(params) {
    var filtered_ocgs = search.filter(ocgs, params);
    return filtered_ocgs;
  }

};

module.exports = ocg;
