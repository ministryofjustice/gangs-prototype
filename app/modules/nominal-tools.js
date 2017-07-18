// nominal tools module
var ocgTools = require('./ocg-tools.js');

var nominals = require('../assets/data/dummy-nominals.json').nominals;
var nominalRoles = require('../../app/sources/roles.json').roles;
var search = require('./search.js');
var ocg = require('./ocg-tools.js');
var arrayUtils = require('./array-utils.js');

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

  showReleaseDaysAgo: function(incarcerationObject) {
    var string = '(' + incarcerationObject.daysAgo + ' days ago)';

    if(incarcerationObject.daysAgo === 1) {
      string = '(Yesterday)';
    }
    if(incarcerationObject.daysAgo === 0) {
      string = '(Today)';
    }

    return string;
  },

  getAffiliations: function(affiliationsIn) {
    var affiliations = [];

    affiliationsIn.forEach(function(affiliationIn) {
      var affiliation = {
        index: affiliationIn[0],
        name: ocgTools.get(affiliationIn[0]).name,
        role: nominalRoles[affiliationIn[1]]
      };
      affiliations.push(affiliation);
    });

    return affiliations;
  },

  getNominalsInPrison: function(prisonIndex) {
    var nominalsInPrison = [];

    nominals.forEach(function(nominal) {
      if(nominal.incarceration.status === 'incarcerated' && nominal.incarceration.prisonIndex == prisonIndex) {
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

  getTensionsInList: function(givenNominalIds) {
    var tensionsInList = {};

    for( var i=0; i < givenNominalIds.length; i++ ){
      var thisNominal = nominals[givenNominalIds[i]];
      var thisNominalsTensions = [];

      for( var j=i+1; j < givenNominalIds.length; j++ ){
        var otherNominal = nominals[givenNominalIds[j]];

        var tensionsBetweenNominals = arrayUtils.flatten(
          this.getTensionsBetween(thisNominal, otherNominal)
        );
        if( tensionsBetweenNominals.length ){
          thisNominalsTensions.push({
            otherNominal: otherNominal,
            tensions: tensionsBetweenNominals
          });
        }
      }
      tensionsInList[givenNominalIds[i]] = arrayUtils.uniquify(arrayUtils.flatten(thisNominalsTensions));
    }

    return tensionsInList;
  },

  get: function(index){
    return nominals[index];
  },

  getList: function(indexes) {
    return indexes.map( function(index){ return nominals[index]; } );
  },

  getTensionsBetween: function(nominal1, nominal2) {
    var nominal1_ocgs = this.ocgIds(nominal1);
    var nominal2_ocgs = this.ocgIds(nominal2);
    var ocgTensions = [];

    for( var ocgId1 of nominal1_ocgs ){
      for( var ocgId2 of nominal2_ocgs ){
        var tensions = ocgTools.getTensionsBetween(ocgId1, ocgId2);

        if( tensions.length ){
          tensions[0].nominal1_ocg = ocgTools.get(ocgId1);
          tensions[0].nominal2_ocg = ocgTools.get(ocgId2);

          ocgTensions.push(tensions[0]);
        }
      }
    }

    return ocgTensions;
  },

  ocgIds: function(nominal){
    return nominal.affiliations.map(function(affiliation){
      return arrayUtils.forceToArray(affiliation)[0];
    });
  },

  search: function(params) {
    // note: search is basic sub-string match only
    var filteredNominals = search.filter(nominals, params);
    return filteredNominals;
  }
};

module.exports = nominal;
