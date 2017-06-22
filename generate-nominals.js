var path = require('path');
var fs = require('fs');
var faker = require('faker');
var genderGuess = require('gender-guess');
var unique = require('array-unique');
var dummyAliases = require('./app/sources/aliases.json');
var mugshots = require('./app/assets/data/mugshot.js');
var quantities = require('./app/sources/quantities.json');

// Check if node_modules folder exists
const nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'));
if (!nodeModulesExists) {
  console.error('ERROR: Node module folder missing. Try running `npm install`');
  process.exit(0);
}




var data = {
  nominals: []
};
var numNominals = quantities.nominals;
var rootOffenderId = Math.floor(Math.random() * 100) + 100; // suitably random looking

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
    nominal.offender_id = rootOffenderId + x;
    nominal.nomis_id = generateNomisId();
    nominal.pnc_id = generatePncId();
    nominal.aliases = generateAliases(nominal.given_names);
    nominal.affiliations = generateAffiliations();

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

      dob = {
        day: day,
        month: month,
        year: year
      };

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

function generateNomisId() {
  // e.g. A1417AE
  var str = rndLetters(1) + rndDigits(4) + rndLetters(2);
  return str;
}

function generatePncId() {
  // e.g. 76/198452G
  var str = rndDigits(2) + '/' + rndDigits(6) + rndLetters(1);
  return str;
}

function generateAffiliations() {
  var affiliations = [];

  affiliations.push(Math.floor(Math.random() * quantities.ocgs));

  if(Math.random() < 0.2) {
    affiliations.push(Math.floor(Math.random() * quantities.ocgs));
  }

  return unique(affiliations);
};

function leadingZero(n) {
  return (parseInt(n, 10) < 10 ? '0' + n : n);
}

function rnd(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function rndDigits(chars) {
  var str = '';
  for(var x = 0; x < chars; x++) {
    str += Math.floor(Math.random() * 10);
  }
  return str;
}
function rndLetters(chars) {
  var str = '';
  for(var x = 0; x < chars; x++) {
    var rndLetter = Math.floor(Math.random() * 26);
    str += String.fromCharCode(65 + rndLetter);
  }
  return str;
}


init();

console.log(data.nominals);
