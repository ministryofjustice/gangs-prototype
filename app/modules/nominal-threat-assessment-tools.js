var nominalThreatAssessments = require('../assets/data/dummy-nominal-threat-assessments.json').nominalThreatAssessments;

var search = require('./search.js');

var nominalThreatAssessment = {
  get: function(index) {
    return nominalThreatAssessments[index];
  },

  getAll: function() {
    return nominalThreatAssessments;
  },

  search: function(params) {
    var filtered = search.filter(nominalThreatAssessments, params);
    return filtered.sort(function(a,b){
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  }
};

module.exports = nominalThreatAssessment;