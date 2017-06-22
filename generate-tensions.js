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
  tensions: []
},
    numOcgs = quantities.ocgs,
    numTensions = quantities.tensions,
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
    addtensionLevels();
  } else {
    // more tension required
    generateNewTension();
  }
}

function addtensionLevels() {
  data.tensions.forEach(function(tension, tensionIndex) {
    var indices = tension,
        tensionObject = {
          indices: indices,
          tensionLevel: tensionLevels[Math.floor(Math.random() * tensionLevels.length)]
        };

    data.tensions[tensionIndex] = tensionObject;
  });

  writeTensionsFile();
}

function writeTensionsFile() {
  fs.writeFile('./app/assets/data/ocgTensions.json', JSON.stringify(data, null, 2), 'utf-8');
}

function createTension() {
  var ocg1 = Math.floor(Math.random() * numOcgs),
      ocg2 = Math.floor(Math.random() * numOcgs);

  if(ocg1 === ocg2) {
    return false;
  }

  var beef = [ocg1, ocg2];
  beef.sort(function(a, b) {
    return a - b;
  });

  return beef;
}



init();

console.log(data.tensions);
