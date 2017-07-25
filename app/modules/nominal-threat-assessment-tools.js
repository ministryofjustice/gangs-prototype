var nominalThreatAssessments = require('../assets/data/dummy-nominal-threat-assessments.json').nominalThreatAssessments;

var search = require('./search.js');
var arrayUtils = require('./array-utils.js');

var nominalThreatAssessment = {
  get: function(index) {
    return nominalThreatAssessments[index];
  },

  getAll: function() {
    return nominalThreatAssessments;
  },

  mapFieldsAndValuesToSearchParams: function(fields, values, min_values, max_values) {

    var params = {};
    var fieldNames = arrayUtils.forceToArray(fields),
        fieldValues = arrayUtils.forceToArray(values),
        minValues = arrayUtils.forceToArray(min_values),
        maxValues = arrayUtils.forceToArray(max_values);

    for( var i = 0; i < fieldNames.length; i++ ){
      if( min_values[i] || max_values[i] ){
        params[fieldNames[i]] = {'min': minValues[i], 'max': maxValues[i]};
      } else {
        params[fieldNames[i]] = {'eq': fieldValues[i] };
      }
    }
    return params;
  },

  search: function(params) {
    var filtered = search.filter(nominalThreatAssessments, params);
    return filtered.sort(function(a,b){
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  },

  assessmentMatches: function(assessment, params) {
    for( var field in params ){
      
      if( params[field]["eq"] ){
        if( assessment['assessment'][field] != params[field]['eq'] ){
          return false;
        }
      } else {
        if( params[field]['min'] ){
          var value = parseInt(assessment['assessment'][field]);
          if( isNaN(value) || value < params[field]['min'] ){
            return false;
          }
        }
        if( params[field]["max"] ){
          var value = parseInt(assessment['assessment'][field]);
          if( isNaN(value) || value > params[field]['max'] ){
            return false;
          }
        }
      }
    }
    return true;
  },
};

module.exports = nominalThreatAssessment;