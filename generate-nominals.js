var path = require('path');
var fs = require('fs');
var faker = require('faker');
var genderGuess = require('gender-guess');
var unique = require('array-unique');
var dummyAliases = require('./app/sources/aliases.json');
var nominalRoles = require('./app/sources/roles.json').roles;
var prisons = require('./app/sources/prisons.json').prisons;

var mugshots = require('./app/modules/mugshot.js');
var quantities = require('./app/sources/quantities.json');
var randomPicker = require('./app/modules/random-picker.js');
var arrayUtils = require('./app/modules/array-utils.js');
var searchTools = require('./app/modules/search.js');

var updates = [];
if(fs.existsSync('./app/assets/data/updates.json')) {
  updates = require('./app/assets/data/updates.json');
}
var ocgs = [];
if(fs.existsSync('./app/assets/data/dummy-ocgs.json')) {
  ocgs = require('./app/assets/data/dummy-ocgs.json').ocgs;
}

// Check if node_modules folder exists
var nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'));
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
    nominal.index = x;
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
    
    // these fields are just here to make the mvp search easier
    // by providing a top-level attribute to filter on
    nominal.mugshot_filename = nominal.mugshot.filename;
    nominal.affiliated_ocg_names = nominal.affiliations.map(
        function(element){
          var id = arrayUtils.forceToArray(element)[0];
          return ocgs[id].name;
        }
      );
    nominal.imprisonment = getImprisonmentStatus(x);
    nominal.prison_name = ( nominal.imprisonment.status ? prisons[nominal.imprisonment.prisonIndex] : '' );

    nominal.search_text = searchTools.generateSearchText(nominal);

    data.nominals.push(nominal);
  }

  fs.writeFile('./app/assets/data/dummy-nominals.json', JSON.stringify(data, null, 2), 'utf-8');
}

function generateDob() {
  var yearRangeLow = 1960,
      yearRangeHigh = 2003,
      yearRange = yearRangeHigh - yearRangeLow,
      year = Math.floor(Math.random() * yearRange) + yearRangeLow,
      month = Math.floor(Math.random() * 12) + 1,
      day = Math.floor(Math.random() * 28) + 1,
      monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      dob = {
        day: day,
        month: month,
        year: year
      };

  dob.displayDob = dob.day + ' ' + monthNames[dob.month - 1] + ' ' + dob.year;

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
    var mark = randomPicker.rnd(marks) + ' on ' + randomPicker.rnd(sides) + ' ' + randomPicker.rnd(locations);
    nominalMarks.push(mark);
  }

  return unique(nominalMarks);
}

function generateAliases(firstname) {
  var numAliases = Math.floor(Math.random() * 3),
      nominalAliases = [];

  for(var x = 0; x < numAliases; x++) {
    var alias = randomPicker.rnd(dummyAliases);

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
  var str = randomPicker.rndLetters(1) + randomPicker.rndDigits(4) + randomPicker.rndLetters(2);
  return str;
}

function generatePncId() {
  // e.g. 76/198452G
  var str = randomPicker.rndDigits(2) + '/' + randomPicker.rndDigits(6) + randomPicker.rndLetters(1);
  return str;
}

function generateAffiliations() {
  var affiliations = [];

  affiliations.push(Math.floor(Math.random() * quantities.ocgs));

  if(Math.random() < 0.15) {
    affiliations.push(Math.floor(Math.random() * quantities.ocgs));
  }

  affiliations = unique(affiliations);

  affiliations.forEach(function(affiliation, n) {
    affiliations[n] = [affiliation];
    if(Math.random() < 0.3) {
      var roleIndex = Math.floor(Math.random() * nominalRoles.length);
      affiliations[n].push(roleIndex);
    }
  });

  return affiliations;
}

function getImprisonmentStatus(nominalIndex) {
  var imprisonmentUpdate = {
    status: null
  };

  if(Math.random() < 0.2) {
    imprisonmentUpdate.status = 'imprisoned';
    imprisonmentUpdate.prisonIndex = Math.floor(Math.random() * prisons.length);
  }

  // check updates file (if it exists yet) to see if nominal is listed as imprisoned or released

  if(updates && updates.release) {
    updates.release.forEach(function(update) {
      if(update.nominal == nominalIndex) {
        imprisonmentUpdate.prisonIndex = update.location;
        imprisonmentUpdate.status = 'released';
        imprisonmentUpdate.daysAgo = update.releaseDaysAgo;
      }
    });
  }

  if(updates && updates.imprisonment) {
    updates.imprisonment.forEach(function(update) {
      if(update.nominal == nominalIndex) {
        imprisonmentUpdate.prisonIndex = update.location;
        imprisonmentUpdate.status = 'imprisoned';
      }
    });
  }

  return imprisonmentUpdate;
}

function leadingZero(n) {
  return (parseInt(n, 10) < 10 ? '0' + n : n);
}

init();

console.log(data.nominals);
