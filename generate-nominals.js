var path = require('path');
var fs = require('fs');
var faker = require('faker');
var genderGuess = require('gender-guess');
var unique = require('array-unique');
var dummyAliases = require('./app/sources/aliases.json');
var mugshots = require('./app/assets/data/mugshot.js');

// Check if node_modules folder exists
const nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'));
if (!nodeModulesExists) {
  console.error('ERROR: Node module folder missing. Try running `npm install`');
  process.exit(0);
}




var data = {
  nominals: []
},
    numNominals = 100;

function init() {
  // generate nominals
  for(x = 0; x < numNominals; x++) {
    var nominal = {};
    nominal.given_names = faker.name.firstName();
    nominal.family_name = faker.name.lastName();
    nominal.gender = guessGenderFromName(nominal.given_names);
    nominal.mugshot = mugshots.getImage(nominal.gender.toLowerCase() === 'm' ? 'male' : 'female');
    nominal.dob = generateDob();
    nominal.identifying_marks = generateIdentifyingMarks();
    nominal.offender_id = generateOffenderId();
    nominal.nomis_id = generateNomisId();
    nominal.pnc_id = generatePncId();
    nominal.aliases = generateAliases(nominal.given_names);

    data.nominals.push(nominal);
  }

  fs.writeFile('./app/assets/data/dummyNominals.json', JSON.stringify(data, null, 2), 'utf-8');
}

function generateDob() {
  var yearRangeLow = 1960,
      yearRangeHigh = 2003,
      yearRange = yearRangeHigh - yearRangeLow,
      year = Math.floor(Math.random() * yearRange) + yearRangeLow,
      month = Math.floor(Math.random() * 12) + 1,
      day = Math.floor(Math.random() * 28) + 1,

      dob = year + '-' + leadingZero(month) + '-' + leadingZero(day);

  return dob;
}

function generateIdentifyingMarks() {
  var marks = ['scar', 'birthmark', 'celtic tattoo', 'tattoo of a spiderweb'],
      sides = ['left', 'right'],
      locations = ['shoulder', 'forearm', 'wrist', 'cheek'],
      nominalMarks = [],
      maxMarks = 3,
      numMarks = Math.floor(Math.random() * maxMarks);

  for(var x = 0; x < numMarks; x++) {
    var mark = rnd(marks) + ' on ' + rnd(sides) + ' ' + rnd(locations);
    nominalMarks.push(mark);
  }

  return unique(nominalMarks);
}

function generateAliases(firstname) {
  var numAliases = Math.floor(Math.random() * 3),
      nominalAliases = [];

  for(var x = 0; x < numAliases; x++) {
    var alias = rnd(dummyAliases);

    alias = alias.replace(/firstname/g, firstname);
    alias = alias.replace(/firstinitial/g, firstname.slice(0, 1));

    nominalAliases.push(alias);
  }

  return unique(nominalAliases);
}

function guessGenderFromName(name) {
  var guess = genderGuess.guess(name),
      gender;

  if(guess.confidence) {
    gender = guess.gender;
  } else {
    gender = (Math.random() > 0.5 ? 'F' : 'M');
  }

  return gender;
}

function generateOffenderId() {
  return faker.finance.iban().slice(0, 12);
}
function generateNomisId() {
  var letter = faker.random.word().slice(0, 1).toUpperCase(),
      numbers = faker.address.zipCode().slice(0, 5);

  return letter + numbers;
}
function generatePncId() {
  return faker.finance.bic();
}

function leadingZero(n) {
  return (parseInt(n, 10) < 10 ? '0' + n : n);
}

function rnd(array) {
  return array[Math.floor(Math.random() * array.length)];
}


init();

console.log(data.nominals);
