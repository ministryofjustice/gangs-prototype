// nominal tools module
var ocgs = require('../assets/data/dummy-ocgs.json').ocgs;
var nominals = require('../assets/data/dummy-nominals.json').nominals;
var nominalRoles = require('../../app/sources/roles.json').roles;
var search = require('./search.js');
var ocg = require('./ocg-tools.js');

var nominal = {
  getAge: function(dob) {
    var now = new Date(),
        then = new Date(dob.year, dob.month - 1, dob.day),
        elapsed = now.getTime() - then.getTime(),
        yearInMs = 1000 * 60 * 60 * 24 * 365.25,
        elapsedYears = Math.floor(elapsed / yearInMs);

    return elapsedYears;
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

  getTensionsInList: function(givenNominals) {
    var tensions = [];

    for( var i=0; i < givenNominals.length; i++ ){
      var thisNominal = nominals[givenNominals[i]];
      console.log('thisNominal = ' + JSON.stringify(thisNominal))

      for( var j=i+1; j < givenNominals.length; j++ ){
        var otherNominal = nominals[givenNominals[j]];
        console.log('  otherNominal = ' + JSON.stringify(otherNominal))

        tensions.concat( this.getTensionsBetween(thisNominal, otherNominal) );
      }
    }
    return tensions;
  },

  getTensionsBetween: function(nominal1, nominal2) {
    var nominal1_ocgs = this.ocgIds(nominal1);
    var nominal2_ocgs = this.ocgIds(nominal2);
    var ocgTensions = [];

    for( var ocgId1 in nominal1_ocgs ){
      for( var ocgId2 in nominal2_ocgs ){
        ocgTensions.push(ocg.getTensionsBetween(ocgId1, ocgId2));
      }
    }

    return ocgTensions;
  },

  ocgIds: function(nominal){
    return nominal.affiliations.map(function(affiliation){ 
      return [].concat(affiliation)[0]; 
    });
  },

  search: function(params) {
    // note: search is basic sub-string match only
    var filteredNominals = search.filter(nominals, params);
    return filteredNominals;
  }
};

module.exports = nominal;
