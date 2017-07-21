var path = require('path');
var fs = require('fs');
var quantities = require('./app/sources/quantities.json');
var dateTools = require('./app/modules/date-tools.js');
var policeTools = require('./app/modules/police-tools.js');

// Check if node_modules folder exists
const nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'));
if (!nodeModulesExists) {
  console.error('ERROR: Node module folder missing. Try running `npm install`');
  process.exit(0);
}




var data = {
  tensions: []
},
    numOcgs = quantities.ocgs,
    numTensions = (quantities.tensions > quantities.updatesPerType ? quantities.tensions : quantities.updatesPerType),
    tensionLevels = ['high', 'medium', 'low'];

function init() {
  // generate tensions
  generateNewTension();
}

function generateNewTension() {
  var newTension = createTension();

  if(newTension && data.tensions.indexOf(newTension) === -1) {
    data.tensions.push(newTension);
  }

  if(data.tensions.length === numTensions) {
    // that's enough tension for now
    addtensionDetails();
  } else {
    // more tension required
    generateNewTension();
  }
}

function addtensionDetails() {
  data.tensions.forEach(function(tension, tensionIndex) {
    var indices = tension,
        daysAgo = Math.floor(Math.random() * 30),
        tensionObject = {
          indices: indices,
          tensionLevel: tensionLevels[Math.floor(Math.random() * tensionLevels.length)],
          updatedBy: policeTools.generatePoliceOfficerTitle(),
          updateDaysAgo: daysAgo,
          updateDaysAgoString: dateTools.daysAgoString(daysAgo)
        };

    data.tensions[tensionIndex] = tensionObject;
  });

  writeTensionsFile();
}

function writeTensionsFile() {
  fs.writeFile('./app/assets/data/ocg-tensions.json', JSON.stringify(data, null, 2), 'utf-8');
}

function createTension() {
  var ocg1 = Math.floor(Math.random() * numOcgs),
      ocg2 = ocg1 + (Math.floor(Math.random() * 5) + 5);

  if(ocg2 >= numOcgs) {
    ocg2 -= numOcgs;
  }

  var beef = [ocg1, ocg2];
  beef.sort(function(a, b) {
    return a - b;
  });

  return beef;
}



init();

console.log(data.tensions);
