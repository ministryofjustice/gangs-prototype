// ocg tools module
var ocgs = require('../assets/data/dummy-ocgs.json').ocgs;
var nominals = require('../assets/data/dummy-nominals.json').nominals;
var tensions = require('../assets/data/ocg-tensions.json').tensions;
var nominalRoles = require('../../app/sources/roles.json').roles;

var search = require('./search.js');
var ocgThreatAssessmentTools = require('./ocg-threat-assessment-tools.js');

var ocg = {
  get: function(index) {
    return ocgs[index];
  },

  getAll: function() {
    return ocgs;
  },
  
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

  getTensionsBetween: function(ocgIndex1, ocgIndex2) {
    var matches = tensions.filter(function(tension){
      return (tension.indices[0] == ocgIndex1 && tension.indices[1] == ocgIndex2) || 
        (tension.indices[0] == ocgIndex2 && tension.indices[1] == ocgIndex1);
    });
    
    return matches;
  },

  search: function(params) {
    var filtered_ocgs = search.filter(ocgs, params);

    if( params['assessment_fields'] ){
      var assessmentFilter = ocgThreatAssessmentTools.mapFieldsAndValuesToSearchParams(params['assessment_fields'], params['assessment_field_values'])
      filtered_ocgs = filtered_ocgs.filter( function(ocg){
        var ocgAssessments = ocgThreatAssessmentTools.search({"ocg_index": ocg.index});
        for( var assessment of ocgAssessments ){
          if( ocgThreatAssessmentTools.assessmentMatches(assessment, assessmentFilter) ){
            return true;
          } else {
            return false;
          }
        }
        return false;
      });
    }
    return filtered_ocgs;
  }

};

module.exports = ocg;
