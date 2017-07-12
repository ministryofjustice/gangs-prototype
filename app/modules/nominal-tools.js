// nominal tools module
var ocgs = require('../assets/data/dummy-ocgs.json').ocgs;
var nominals = require('../assets/data/dummy-nominals.json').nominals;
var nominalRoles = require('../../app/sources/roles.json').roles;
var search = require('./search.js');

var nominal = {
  getAge: function(dob) {
    var now = new Date(),
        then = new Date(dob.year, dob.month - 1, dob.day),
        elapsed = now.getTime() - then.getTime(),
        yearInMs = 1000 * 60 * 60 * 24 * 365.25,
        elapsedYears = Math.floor(elapsed / yearInMs);

    return elapsedYears;
  },

  expandGender: function(abbreviatedGender) {
    if(abbreviatedGender.toLowerCase() === 'f') {
      return 'Female';
    }
    if(abbreviatedGender.toLowerCase() === 'm') {
      return 'Male';
    }
    return '';
  },

  getAffiliations: function(affiliationsIn) {
    var affiliations = [];

    affiliationsIn.forEach(function(affiliationIn) {
      var affiliation = {
        index: affiliationIn[0],
        name: ocgs[affiliationIn[0]].name,
        role: nominalRoles[affiliationIn[1]]
      };
      affiliations.push(affiliation);
    });

    return affiliations;
  },

  getNominalsInPrison: function(prisonIndex) {
    var nominalsInPrison = [];

    nominals.forEach(function(nominal) {
      if(nominal.incarceration && nominal.incarceration == prisonIndex) {
        nominalsInPrison.push(nominal);
      }
    });

    return nominalsInPrison;
  },

  getProbationers: function() {
    var probationers = [];

    return nominals.filter( function(nominal){
      return nominal.incarceration == false && nominal.nomis_id;
    });
  },

  search: function(params) {
    // note: search is basic sub-string match only
    var filteredNominals = search.filter(nominals, params);
    return filteredNominals;
  }
};

module.exports = nominal;
