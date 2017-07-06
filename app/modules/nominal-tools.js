// nominal tools module
var ocgs = require('../assets/data/dummy-ocgs.json').ocgs;
var nominals = require('../assets/data/dummy-nominals.json').nominals;
var nominalRoles = require('../../app/sources/roles.json').roles;

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

  filter: function(array, params) {
    var results = [];
    for( var i=0; i < array.length; i++ ){
      if( this.matches(array[i], params) ){
        results.push(array[i]);
      }
    }
    return results;
  },

  search: function(params) {
    // note: search is basic sub-string match only
    var filteredNominals = this.filter(this.ensureIndex(nominals), params);
    return filteredNominals;
  },


  matches: function(object, params) {
    for( key in params ){
      if( params[key] && key in object ){
        var tokens = params[key].toLowerCase().split(/[ ,]+/);
        var value = object[key].toString().toLowerCase();

        for( var i=0; i < tokens.length; i++ ){
          if( value.indexOf(tokens[i]) == -1 ){
            return false;
          }
        }
      }
    }
    return true;
  },

  ensureIndex: function(array) {
    return array.map( function(element, index){ 
      element['index'] = index; return element; 
    });
  }
};

module.exports = nominal;
