var ocgThreatAssessments = require('../assets/data/dummy-ocg-threat-assessments.json').ocgThreatAssessments;

var search = require('./search.js');
var arrayUtils = require('./array-utils.js');


var ocgThreatAssessment = {
  get: function(index) {
    return ocgThreatAssessments[index];
  },

  getAll: function() {
    return ocgThreatAssessments;
  },

  mapFieldsAndValuesToSearchParams: function(fields, values) {
    var params = {};
    var fieldNames = arrayUtils.forceToArray(fields),
        fieldValues = arrayUtils.forceToArray(values);

    for( var i = 0; i < fieldNames.length; i++ ){
      params[fieldNames[i]] = fieldValues[i];
    }
    return params;
  },

  search: function(params) {
    var filtered = search.filter(ocgThreatAssessments, params);
    return filtered.sort(function(a,b){
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  },

  assessmentMatches: function(assessment, params) {
    for( field in params ){
      if( assessment['assessment'][field] != params[field] ){
        return false
      }
    }
    return true;
  },
};

module.exports = ocgThreatAssessment;