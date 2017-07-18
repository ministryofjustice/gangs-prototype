var path = require('path');
var fs = require('fs');
var faker = require('faker');
var unique = require('array-unique');
var humanize = require('humanize');
var quantities = require('./app/sources/quantities.json');
var randomPicker = require('./app/modules/random-picker.js');
var ocgs = require('./app/assets/data/dummy-ocgs.json').ocgs;;

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
      timestamp = dateWithinDaysOfNow(-1000);

  return {
    'ocg_index': ocg.index,
    'assessed_by': generatePoliceOfficerTitle(),
    'police_force': randomPoliceForce(),
    'timestamp': timestamp,
    'timestamp_for_display': humanize.date('jS M Y', timestamp),
    'assessment_type': assessment.type,
    'assessment': assessment.values 
  }
}

function generatePoliceOfficerTitle(){
  return [
    randomPicker.randomElement(['DS', 'DC', 'DCI', 'DI']),
    faker.name.firstName(),
    faker.name.lastName()
  ].join(' ');
}

function dateWithinDaysOfNow(days){
  var date = new Date();
  date.setDate(date.getDate() + (Math.random() * days));
  return date;
}

function randomPoliceForce() {
  var forces = [
    "Avon and Somerset Constabulary",
    "Bedfordshire Police",
    "Cambridgeshire Constabulary",
    "Cheshire Constabulary",
    "City of London Police",
    "Cleveland Police",
    "Cumbria Constabulary",
    "Derbyshire Constabulary",
    "Devon & Cornwall Police",
    "Dorset Police",
    "Durham Constabulary",
    "Essex Police",
    "Gloucestershire Constabulary",
    "Greater Manchester Police",
    "Hampshire Constabulary",
    "Hertfordshire Constabulary",
    "Humberside Police",
    "Kent Police",
    "Lancashire Constabulary",
    "Leicestershire Police",
    "Lincolnshire Police",
    "Merseyside Police",
    "Metropolitan Police Service",
    "Norfolk Constabulary",
    "North Yorkshire Police",
    "Northamptonshire Police",
    "Northumbria Police",
    "Nottinghamshire Police",
    "South Yorkshire Police",
    "Staffordshire Police",
    "Suffolk Constabulary",
    "Surrey Police",
    "Sussex Police",
    "Thames Valley Police",
    "Warwickshire Police",
    "West Mercia Police",
    "West Midlands Police",
    "West Yorkshire Police",
    "Wiltshire Police"
  ];
  return randomPicker.randomElement(forces);
}

function randomAssessment(){
  var types = ['OCGM', 'DRV', 'Gang Network Threat'];
  var assessments = [
    ocgmAssessment,
    drvAssessment,
    gangNetworkThreat
  ];
  var index = Math.floor(Math.random() * 3);
  return {
    'type': types[index],
    'values': assessments[index].call()
  };
}

function ocgmAssessment(){
  var values = ['High', 'Medium', 'Low'];
  return {
    "Violent criminal activity": randomPicker.randomElement(values),
    "Drug activity": randomPicker.randomElement(values),
    "Fraud and financial crime": randomPicker.randomElement(values),
    "Organised theft": randomPicker.randomElement(values),
    "Commodity importation, counterfeiting or illegal supply": randomPicker.randomElement(values),
    "Sexual offences": randomPicker.randomElement(values),
    "Organised immigration crime": randomPicker.randomElement(values),
    "Environmental crime": randomPicker.randomElement(values),
    "Cash flow/financial worth": randomPicker.randomElement(values),
    "Multiple enterprises (criminal or legitimate)": randomPicker.randomElement(values),
    "Links to other OCGs": randomPicker.randomElement(values),
    "Geographical scope": randomPicker.randomElement(values),
    "Cohesion": randomPicker.randomElement(values),
    "Infiltration": randomPicker.randomElement(values),
    "Expertise": randomPicker.randomElement(values),
    "Tactical awareness": randomPicker.randomElement(values) 
  }
}

function drvAssessment(){
  var values = ['Yes', 'No'];
  return {
    'Has access to weapons (uncorroborated within 18mths)': randomPicker.randomElement(values),
    'Has access to weapons (confirmed within 18mths)': randomPicker.randomElement(values),
    'Serious physical violence (evidenced within 8wks)': randomPicker.randomElement(values)
  }
}

function gangNetworkThreat(){
  var values = ['Yes', 'No'];
  return {
    'Multiple lines within county': randomPicker.randomElement(values),
    'Multiple lines within region': randomPicker.randomElement(values),
    'Multiple lines nationally': randomPicker.randomElement(values),
    'Confirmed link to mapped gang/OCG': randomPicker.randomElement(values),
    'Collaboration with other networks': randomPicker.randomElement(values),
    'Tactical awareness': randomPicker.randomElement(values),
    'Rival networks operating in force area': randomPicker.randomElement(values),
    'Has been subject to robbery (last 8 weeks)': randomPicker.randomElement(values)
  }
}

init();

console.log(data.ocgThreatAssessments);
