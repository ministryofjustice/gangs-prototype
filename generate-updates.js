var path = require('path');
var fs = require('fs');
var quantities = require('./app/sources/quantities.json');
var prisons = require('./app/sources/prisons.json').prisons;
var nominals = require('./app/assets/data/dummy-nominals').nominals;

var randomPicker = require('./app/modules/random-picker.js');
var dateTools = require('./app/modules/date-tools.js');
var nominalTools = require('./app/modules/nominal-tools.js');

// Check if node_modules folder exists
const nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'));
if (!nodeModulesExists) {
  console.error('ERROR: Node module folder missing. Try running `npm install`');
  process.exit(0);
}



var updateTypes = ['tension', 'affiliation', 'imprisonment'],
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
  updates['release'] = generateReleases();

  fs.writeFile('./app/assets/data/updates.json', JSON.stringify(updates, null, 2), 'utf-8');
}

function generateReleases() {
  var releases = [];
  for( var nominal of nominals ){
    console.log('nominal.index = ' + nominal.index);
    console.log('nominal.imprisonment = ' + JSON.stringify(nominal.imprisonment));

    if(nominal.imprisonment.daysAgo){
      releases.push(generateRelease(nominal));
    }
  }
  return releases;
}

function generateUpdate(type) {
  var newUpdate = false;

  switch(type) {
    case 'imprisonment':
      newUpdate = generateImprisonment();
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
function generateImprisonment() {
  var update = {
    type: 'imprisonment',
    nominal: Math.floor(Math.random() * numNominals),
    location: Math.floor(Math.random() * numPrisons)
  };

  return update;
}
function generateRelease(nominal) {
  var update = {
        type: 'release',
        nominal: nominal.index,
        location: nominal.imprisonment.prisonIndex,
        releaseDaysAgo: nominal.imprisonment.daysAgo,
        releaseString: dateTools.daysAgoString(nominal.imprisonment.daysAgo)
  };

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
