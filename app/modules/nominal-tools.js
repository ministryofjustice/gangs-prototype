// nominal tools module
var ocgTools = require('./ocg-tools.js');

var nominals = require('../assets/data/dummy-nominals.json').nominals;
var nominalRoles = require('../../app/sources/roles.json').roles;
var search = require('./search.js');
var ocg = require('./ocg-tools.js');
var arrayUtils = require('./array-utils.js');
var dateTools = require('./date-tools.js');
var nominalThreatAssessmentTools = require('./nominal-threat-assessment-tools.js');


var Promise = require('bluebird');

var AWS = require('aws-sdk');
const S3_BUCKET = process.env.S3_SOURCE_BUCKET_NAME,
      AWS_REGION = process.env.AWS_REGION,
      REKOGNITION_COLLECTION_ID = process.env.REKOGNITION_COLLECTION_ID;

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

  showReleaseDaysAgo: function(imprisonmentObject) {
    return dateTools.daysAgoString(imprisonmentObject.daysAgo);
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
      if(nominal.imprisonment.status === 'imprisoned' && nominal.imprisonment.prisonIndex == prisonIndex) {
        nominalsInPrison.push(nominal);
      }
    });

    return nominalsInPrison;
  },

  getProbationers: function() {
    var probationers = [];

    return nominals.filter( function(nominal){
      return nominal.imprisonment.status == null && nominal.nomis_id;
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

  facialMatchesAsync: function(key) {
    var rekognition = new AWS.Rekognition();
    var params = {
      CollectionId: REKOGNITION_COLLECTION_ID, 
      FaceMatchThreshold: 95, 
      Image: {
       S3Object: {
        Bucket: S3_BUCKET, 
        Name: key
       }
      }, 
      MaxFaces: 5
     };

     return new Promise(function(resolve,reject){
        rekognition.searchFacesByImage(params, function(err, data) {
          if (err) { 
            // an error occurred
            console.log(err, err.stack); 
            return reject(err);
          } else { 
            // successful response
            // NOTE: Rekognition enforces no slashes in externalImageId,
            // so we have to convert it back from '-' in order to match
            // against our local filenames
            var matches = data.FaceMatches.map(function(match){
              return {
                externalImageId: match.Face.ExternalImageId.replace('-','/'),
                confidence: match.Face.Confidence
              };
            });
            resolve(matches);
          }
        });
      
      
    });
  },

  searchByParams: function(params){
    // note: search is basic sub-string match only
    var filteredNominals = search.filter(nominals, params);

    if( params['assessment_fields'] ){
      var assessmentFilter = nominalThreatAssessmentTools.mapFieldsAndValuesToSearchParams(
                                params['assessment_fields'],
                                params['assessment_field_values'],
                                params['assessment_field_value_min'],
                                params['assessment_field_value_max'])

      filteredNominals = filteredNominals.filter( function(nominal){
        var nominalAssessments = nominalThreatAssessmentTools.search({"nominal_index": nominal.index});
        for( var assessment of nominalAssessments ){
          if( nominalThreatAssessmentTools.assessmentMatches(assessment, assessmentFilter) ){
            return true;
          } else {
            return false;
          }
        }
        return false;
      });
    }

    return filteredNominals;
  },

  search:  function(params) {
    // if we have an uploaded image, hit rekognition to get an array of
    // image filenames containing possible facial matches + confidence levels
    if( params['uploaded-image-key'] ){
      var searchFunc = this.searchByParams, module = this;
      var matchedNominals = this.facialMatchesAsync(params['uploaded-image-key']).then(
        function(matches){
          // console.log('then matches = ' + JSON.stringify(matches));
          params['mugshot_filename'] = matches.map(function(e){
            return e.externalImageId;
          });
          // console.log('then searchByParams, params = ' + JSON.stringify(params));  
          var results = searchFunc.call(module, params);
          // add on the confidence level to each result based on image filename
          for(var result of results){
            var match = matches.find(function(e){
              return e.externalImageId==result.mugshot_filename
            })
            if( match ){
              result.confidence = match.confidence;
            }
          }
          return results;
        }
      );
      return matchedNominals;
    } else {
      return this.searchByParams(params);
    }
  }
};

module.exports = nominal;
