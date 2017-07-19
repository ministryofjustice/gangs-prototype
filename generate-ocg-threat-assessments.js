var path = require('path');
var fs = require('fs');
var faker = require('faker');
var unique = require('array-unique');
var humanize = require('humanize');
var quantities = require('./app/sources/quantities.json');
var randomPicker = require('./app/modules/random-picker.js');
var dateTools = require('./app/modules/date-tools.js');
var policeTools = require('./app/modules/police-tools.js');
var ocgs = require('./app/assets/data/dummy-ocgs.json').ocgs;
var ocgmAssessmentFields = require('./app/sources/ocg-assessment-fields.json');

// Check if node_modules folder exists
const nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'));
if (!nodeModulesExists) {
  console.error('ERROR: Node module folder missing. Try running `npm install`');
  process.exit(0);
}


var data = {
      ocgThreatAssessments: []
    },
    numOcgsWithThreatAssessments = quantities.ocgsWithThreatAssessments,
    maxThreatAssessmentsPerOcg = quantities.maxThreatAssessmentsPerOcg;

function init() {
  // generate ocgs
  var ocgsToGenerateFor = randomPicker.randomNElements(ocgs, numOcgsWithThreatAssessments);

  for(var ocg of ocgsToGenerateFor) {
    numAssessments = Math.ceil(Math.random() * maxThreatAssessmentsPerOcg);

    for( var i = 0; i <= numAssessments; i++ ){
      ocgThreatAssessment = generateRandomOcgThreatAssessment(ocg);
      data.ocgThreatAssessments.push(ocgThreatAssessment);
    }
  }

  fs.writeFile('./app/assets/data/dummy-ocg-threat-assessments.json', JSON.stringify(data, null, 2), 'utf-8');
}


function generateRandomOcgThreatAssessment(ocg){
  var assessment = randomAssessment(),
      timestamp = dateTools.dateWithinDaysOfNow(-1000);

  return {
    'ocg_index': ocg.index,
    'assessed_by': policeTools.generatePoliceOfficerTitle(),
    'police_force': policeTools.randomPoliceForce(),
    'timestamp': timestamp,
    'timestamp_for_display': humanize.date('jS M Y', timestamp),
    'assessment_type': assessment.type,
    'assessment': assessment.values
  }
}

function randomAssessment(){
  var types = ['ocgm', 'drv', 'gangNetworkThreat'];
  var labels = {
    "ocgm": 'OCGM',
    "drv": 'DRV',
    "gangNetworkThreat": 'Gang Network Threat'
  };

  var chosenType = types[Math.floor(Math.random() * 3)];

  return {
    'type': labels[chosenType],
    'values': generateAssessmentFields(chosenType)
  };
}

function generateAssessmentFields(type){
  var assessment = {};
  for( var field in ocgmAssessmentFields[type] ){
    console.log('field = ' + field)
    assessment[field] = randomPicker.randomElement(ocgmAssessmentFields[type][field]);
  }
  return assessment;
}

init();

console.log(data.ocgThreatAssessments);
