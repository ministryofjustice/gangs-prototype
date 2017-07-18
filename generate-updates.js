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
    updates = {},
    numUpdates = quantities.updates,
    numOcgs = quantities.ocgs,
    numNominals = quantities.nominals,
    numPrisons = prisons.length;

function init() {
  // generate updates
  for(var type in updateTypes) {
    var typeString = updateTypes[type];
    updates[typeString] = [];

    for(var x = 0; x < quantities.updatesPerType; x++) {
      updates[typeString].push(generateUpdate(typeString));
    }

    // add timeStamps to updates
    addTimeStamps(type);
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
  var ocg1 = Math.floor(Math.random() * numOcgs),
      ocg2 = ocg1 + (Math.floor(Math.random() * 5) + 5),
      tensionLevels = ['high', 'medium', 'low'];

  if(ocg2 >= numOcgs) {
    ocg2 -= numOcgs;
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
    location: Math.floor(Math.random() * numPrisons),
    releaseDaysAgo: Math.floor(Math.random() * 7)
  };

  if(update.releaseDaysAgo === 0) {
    update.releaseString = 'today';
  } else if(update.releaseDaysAgo === 1) {
    update.releaseString = 'yesterday';
  } else {
    update.releaseString = update.releaseDaysAgo + ' days ago';
  }

  return update;
}

function addTimeStamps(type) {
  var typeString = updateTypes[type],
      minutesArray = [],
      minMinutes = 1,
      maxMinutes = 2000;

  for(var x = 0; x < updates[typeString].length; x++) {
    minutesArray.push(Math.floor(Math.random() * (maxMinutes - minMinutes)) + minMinutes);
  }

  minutesArray.sort(function(a, b) {
    return a - b;
  });

  for(var x = 0; x < updates[typeString].length; x++) {
    updates[typeString][x].minutesAgo = minutesArray[x];
    updates[typeString][x].timeAgo = getTimeAgo(minutesArray[x]);
  }
}

function getTimeAgo(minutesAgo) {
  if(minutesAgo < 60) {
    return minutesAgo + 'm';
  } else if(minutesAgo < 1440) {
    return Math.floor(minutesAgo / 60) + 'h';
  } else {
    return Math.floor(minutesAgo / 1440) + 'd';
  }
}


init();

console.log(updates);
