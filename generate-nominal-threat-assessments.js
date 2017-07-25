var path = require('path');
var fs = require('fs');
var faker = require('faker');
var unique = require('array-unique');
var humanize = require('humanize');
var quantities = require('./app/sources/quantities.json');
var randomPicker = require('./app/modules/random-picker.js');
var dateTools = require('./app/modules/date-tools.js');
var policeTools = require('./app/modules/police-tools.js');
var nominals = require('./app/assets/data/dummy-nominals.json').nominals;
var nominalAssessmentFields = require('./app/sources/nominal-assessment-fields.json');

// Check if node_modules folder exists
const nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'));
if (!nodeModulesExists) {
  console.error('ERROR: Node module folder missing. Try running `npm install`');
  process.exit(0);
}


var data = {
      nominalThreatAssessments: []
    },
    numNominalsWithThreatAssessments = quantities.nominalsWithThreatAssessments,
    maxThreatAssessmentsPerNominal = quantities.maxThreatAssessmentsPerNominal;

function init() {
  // generate nominal threats
  var nominalsToGenerateFor = randomPicker.randomNElements(nominals, numNominalsWithThreatAssessments);

  for(var nominal of nominalsToGenerateFor) {
    numAssessments = Math.ceil(Math.random() * maxThreatAssessmentsPerNominal);

    for( var i = 0; i <= numAssessments; i++ ){
      nominalThreatAssessment = generateRandomNominalThreatAssessment(nominal);
      data.nominalThreatAssessments.push(nominalThreatAssessment);
    }
  }

  fs.writeFile('./app/assets/data/dummy-nominal-threat-assessments.json', JSON.stringify(data, null, 2), 'utf-8');
}


function generateRandomNominalThreatAssessment(nominal){
  var assessment = randomAssessment(),
      timestamp = dateTools.dateWithinDaysOfNow(-1000);

  return {
    'nominal_index': nominal.index,
    'assessed_by': policeTools.generatePoliceOfficerTitle(),
    'police_force': policeTools.randomPoliceForce(),
    'timestamp': timestamp,
    'timestamp_for_display': humanize.date('jS M Y', timestamp),
    'assessment_type': assessment.type,
    'assessment': assessment.values
  }
}


function randomAssessment(){
  var types = ['drv', 'vat'];
  var labels = {
    "drv": 'Drug-Related Violence',
    "vat": 'Vulnerability And Threats'
  };

  var chosenType = types[Math.floor(Math.random() * 3)];

  return {
    'type': labels[chosenType],
    'values': generateAssessmentFields(chosenType)
  };
}

function generateAssessmentFields(type){
  var assessment = {};
  for( var field in nominalAssessmentFields[type] ){
    assessment[field] = randomValue(nominalAssessmentFields[type][field]);
  }
  return assessment;
}

function randomValue(values) {
  if( values[0] == "integer" ) {
    return randomPicker.randomIntegerBetween(values[1], values[2]);
  } else {
    return randomPicker.randomElement(values);
  }
}

init();

console.log(data.nominalThreatAssessments);
