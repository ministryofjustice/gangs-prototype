// nominal tools module
var ocgs = require('../assets/data/dummy-ocgs.json').ocgs;
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

  getOcgCentricTensionsInList: function(givenNominalIds) {
    var nominalsInList = this.getList(givenNominalIds);
    var affiliationsInList = arrayUtils.flatten(
      nominalsInList.map(function(e){ 
        return e.affiliations; 
      })
    );
    var ocgIdsInList = arrayUtils.uniquify(
      affiliationsInList.map( function(e){ return e[0]; } )
    );

    var ocgTensions = [];

    for( var ocgId1 of ocgIdsInList ){
      for( var ocgId2 of ocgIdsInList ){
        var tensions = ocg.getTensionsBetween(ocgId1, ocgId2);

        if( tensions.length ){
          ocgTensions.push({
            ocg1: ocgTools.get(ocgId1),
            ocg1_nominals: this.filterNominalsArrayByOcgId(nominalsInList, ocgId1),
            ocg2: ocgTools.get(ocgId2),
            ocg2_nominals: this.filterNominalsArrayByOcgId(nominalsInList, ocgId2),
            tensionLevel: tensions[0].tensionLevel            
          });
        }
      }
    }

    return ocgTensions;
  },

  /*
    Given an array of nominal objects, return a new array
    containing only those who are affiliated with the
    given ocgId
  */
  filterNominalsArrayByOcgId: function(nominals, ocgId){
    return nominals.filter(function(e){ 
      return e.affiliations.map(function(a){
        return a[0]
      }).includes(ocgId) 
    });
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
        var tensions = ocg.getTensionsBetween(ocgId1, ocgId2);
        if( tensions.length ){
          tensions[0].nominal1_ocg = ocgs[ocgId1];
          tensions[0].nominal2_ocg = ocgs[ocgId2];

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
