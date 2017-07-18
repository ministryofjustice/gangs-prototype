var ocgThreatAssessments = require('../assets/data/dummy-ocg-threat-assessments.json').ocgThreatAssessments;

var search = require('./search.js');

var ocgThreatAssessment = {
  get: function(index) {
    return ocgThreatAssessments[index];
  },

  getAll: function() {
    return ocgThreatAssessments;
  },

  search: function(params) {
    var filtered = search.filter(ocgThreatAssessments, params);
    return filtered.sort(function(a,b){
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  }
};

module.exports = ocgThreatAssessment;