var path = require('path');
var fs = require('fs');
var gangNameParts = require('./app/sources/gangnames.json');
var quantities = require('./app/sources/quantities.json');

// Check if node_modules folder exists
const nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'));
if (!nodeModulesExists) {
  console.error('ERROR: Node module folder missing. Try running `npm install`');
  process.exit(0);
}




var data = {
  gangs: []
},
    numGangs = quantities.gangs;

function init() {
  // generate gangs
  for(x = 0; x < numGangs; x++) {
    var gang = {},
        area = getGangPart('areas'),
        prefix = getGangPart('prefixes'),
        suffix = getGangPart('suffixes');

    gang.name = [area, prefix, suffix].join(' ');

    data.gangs.push(gang);
  }

  fs.writeFile('./app/assets/data/dummyGangs.json', JSON.stringify(data, null, 2), 'utf-8');
}

function getGangPart(partType) {
  var index = Math.floor(Math.random() * gangNameParts[partType].length),
      part = gangNameParts[partType].splice(index, 1)[0];

  return part;
}


init();

console.log(data.gangs);
