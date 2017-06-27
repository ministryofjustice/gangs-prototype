var path = require('path');
var fs = require('fs');
var quantities = require('./app/sources/quantities.json');

// Check if node_modules folder exists
const nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'));
if (!nodeModulesExists) {
  console.error('ERROR: Node module folder missing. Try running `npm install`');
  process.exit(0);
}




var data = {
  updateEvents: []
},
    numUpdates = quantities.updates,
    numOcgs = quantities.ocgs,
    numNominals = quantities.nominals;

function init() {
  // generate updates
  generateUpdates();
}

function generateUpdates() {
  if(data.updateEvents.length < numUpdates) {
    // generate a new update
    generateUpdate();
  } else {
    // got enough updates, so write file
    fs.writeFile('./app/assets/data/updates.json', JSON.stringify(data, null, 2), 'utf-8');
  }
}

function generateUpdate() {
  var updateType = Math.floor(Math.random() * 3),
      newUpdate;

  switch(updateType) {
    case 0:
      newUpdate = generateTensionChange();
      break;
    case 1:
      newUpdate = generateNewAffiliation();
      break;
    case 2:
      newUpdate = generateIncarceration();
      break;
  }

  if(newUpdate) {
    data.updateEvents.push(newUpdate);
  }

  generateUpdates();
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
  var dummyPrisons = ['Feltham', 'Lewis', 'Brixton', 'Pentonville', 'The Mount', 'Belmarsh', 'Dartmoor', 'Gartree', 'Kirkham', 'Wormwood Scrubs', 'Wandsworth', 'Whitemoor', 'Wetherby', 'Oakwood', 'Leyhill'];
  var update = {
    type: 'incarceration',
    nominal: Math.floor(Math.random() * numNominals),
    location: dummyPrisons[Math.floor(Math.random() * dummyPrisons.length)]
  };

  return update;
}


init();

console.log(data.updateEvents);
