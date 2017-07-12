var path = require('path');
var fs = require('fs');
var quantities = require('./app/sources/quantities.json');
var prisons = require('./app/sources/prisons.json').prisons;

var randomPicker = require('./app/modules/random-picker.js');

// Check if node_modules folder exists
const nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'));
if (!nodeModulesExists) {
  console.error('ERROR: Node module folder missing. Try running `npm install`');
  process.exit(0);
}



var updateTypes = ['tension', 'affiliation', 'incarceration', 'release'],
    updates = {};

var data = {
  updateEvents: []
},
    numUpdates = quantities.updates,
    numOcgs = quantities.ocgs,
    numNominals = quantities.nominals,
    numPrisons = prisons.length;

function init() {
  // generate updates
  for(var type in updateTypes) {
    updates[updateTypes[type]] = [];

    for(var x = 0; x < quantities.updatesPerType; x++) {
      updates[updateTypes[type]].push(generateUpdate(updateTypes[type]));
    }
  }

  fs.writeFile('./app/assets/data/updates.json', JSON.stringify(updates, null, 2), 'utf-8');
}

function generateUpdate(type) {
  var newUpdate = false;

  switch(type) {
    case 'incarceration':
      newUpdate = generateIncarceration();
      break;
    case 'affiliation':
      newUpdate = generateNewAffiliation();
      break;
    case 'tension':
      newUpdate = generateTensionChange();
      break;
    case 'release':
      newUpdate = generateRelease();
      break;
  }

  if(newUpdate) {
    return newUpdate;
  } else {
    generateUpdate(type);
  }
}

function generateTensionChange() {
  var ocg1 = Math.floor(Math.random() * numOcgs);
  var ocg2 = Math.floor(Math.random() * numOcgs);
  var tensionLevels = ['high', 'medium', 'low'];

  if(ocg1 === ocg2) {
    return false;
  }

  var update = {
    type: 'tension-change',
    ocg1: ocg1,
    ocg2: ocg2,
    newTensionLevel: tensionLevels[Math.floor(Math.random() * tensionLevels.length)]
  };

  return update;
}
function generateNewAffiliation() {
  var update = {
    type: 'affiliation',
    nominal: Math.floor(Math.random() * numNominals),
    ocg: Math.floor(Math.random() * numOcgs)
  };

  return update;
}
function generateIncarceration() {
  var update = {
    type: 'incarceration',
    nominal: Math.floor(Math.random() * numNominals),
    location: Math.floor(Math.random() * numPrisons)
  };

  return update;
}
function generateRelease() {
  var update = {
    type: 'release',
    nominal: Math.floor(Math.random() * numNominals),
    location: Math.floor(Math.random() * numPrisons)
  };

  return update;
}


init();

console.log(updates);
