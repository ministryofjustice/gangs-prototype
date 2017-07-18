var path = require('path');
var fs = require('fs');
var faker = require('faker');
var unique = require('array-unique');
var humanize = require('humanize');
var quantities = require('./app/sources/quantities.json');
var policeForces = require('./app/sources/police-forces.json');
var randomPicker = require('./app/modules/random-picker.js');
var nominals = require('./app/assets/data/dummy-nominals.json').nominals;

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
      timestamp = dateWithinDaysOfNow(-1000);

  return {
    'nominal_index': nominal.index,
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
  return randomPicker.randomElement(policeForces);
}

function randomAssessment(){
  var types = ['DRV', 'VAT'];
  var assessments = [
    drvAssessment,
    vatAssessment
  ];
  var index = Math.floor(Math.random() * types.length);
  return {
    'type': types[index],
    'values': assessments[index].call()
  };
}


function drvAssessment(){
  var values = ['Yes', 'No'];
  return {
    'Carries/has access to weapons (excluding firearms last 6 months)': randomPicker.randomElement(values),
    'Threats of physical violence (last 8 weeks)': randomPicker.randomElement(values),
    'Weapon referenced in threats excluding firearm (last 8 weeks)': randomPicker.randomElement(values),
    'Serious physical violence evidenced (last 8 weeks)': randomPicker.randomElement(values),
    'Currently on bail for serious violence': randomPicker.randomElement(values)
  }
}

function vatAssessment(){
  var values = ['Yes', 'No'];
  return {
    'Appears on MPS gang matrix?': randomPicker.randomElement(values),
    'MPS Gang Matrix harm score': Math.floor(Math.random() * 100),
    'MPS Gang Matrix victim score': Math.floor(Math.random() * 100),
    'Appears on any other force gang matrix?': randomPicker.randomElement(values),
    'Associated, through family or otherwise, to known gangs?': randomPicker.randomElement(values),
    'How many times has the nominal been missing?': Math.floor(Math.random() * 20),
    'How many days in total has the nominal been missing?': Math.floor(Math.random() * 20 * 30),
    'Currently wanted or missing?': randomPicker.randomElement(values),
    'Victim of sexual crime (including CRIS)?': randomPicker.randomElement(values),
    'Flagged on PNC as at risk of CSE?': randomPicker.randomElement(values),
    'Been witness to sexual crime or serious violence?': randomPicker.randomElement(values),
    'Is there domestic abuse in their household?': randomPicker.randomElement(values),
    'Suspected/accused of sexual offences or serious violence?': randomPicker.randomElement(values),
    'Suspected/accused of other crimes?': randomPicker.randomElement(values),
    'Suspected/accused of PWITS?': randomPicker.randomElement(values),
    'Suspected/accused of posession of a weapon?': randomPicker.randomElement(values),
    'Been identified as part of county lines activity following a stop-check?': randomPicker.randomElement(values),
    'Been arrested as part of county lines activity?': randomPicker.randomElement(values),
    '(if under 18) Currently looked after?': randomPicker.randomElement(values),
    '(if under 18) Has older boyfriend?': randomPicker.randomElement(values),
    '(if under 18) Displays sexually inappropriate behaviour?': randomPicker.randomElement(values),
    '(if under 18) Regular truant or excluded from school?': randomPicker.randomElement(values),
    'Any suicidal or self-harming markers?': randomPicker.randomElement(values),
    'Any mental health warning markers?': randomPicker.randomElement(values),
    '(if over 18) Known to adult social services?': randomPicker.randomElement(values),
    'Known for substance abuse (including alcohol)?': randomPicker.randomElement(values),
    'Associates with others who are being exploited (sexually or otherwise)?': randomPicker.randomElement(values),
    'Linked to county line intelligence?': randomPicker.randomElement(values),
    'Linked to firearms/knife intelligence?': randomPicker.randomElement(values),
    'Linked to intelligence relating to sexual offences?': randomPicker.randomElement(values)
  }
}

init();

console.log(data.nominalThreatAssessments);
