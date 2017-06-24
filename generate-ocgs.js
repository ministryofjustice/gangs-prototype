var path = require('path');
var fs = require('fs');
var ocgNameParts = require('./app/sources/ocgnames.json');
var quantities = require('./app/sources/quantities.json');

// Check if node_modules folder exists
const nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'));
if (!nodeModulesExists) {
  console.error('ERROR: Node module folder missing. Try running `npm install`');
  process.exit(0);
}




var data = {
  ocgs: []
},
    numOcgs = quantities.ocgs;

function init() {
  // generate ocgs
  for(x = 0; x < numOcgs; x++) {
    var ocg = {},
        area = getOcgPart('areas'),
        prefix = getOcgPart('prefixes'),
        suffix = getOcgPart('suffixes');

    ocg.name = [area, prefix, suffix].join(' ');
    ocg.aliases = generateOCGAliases(name, area, prefix, suffix);
    data.ocgs.push(ocg);
  }

  fs.writeFile('./app/assets/data/dummyOcgs.json', JSON.stringify(data, null, 2), 'utf-8');
}


function generateOCGAliases(name, area, prefix, suffix) {
  var aliases = [];
  for( i = 0; i < 2; i++ ){
    var aliasPartIndex = 0
    if( Math.random > 0.9 ){
      aliasPartIndex = aliasPartIndex + 1;
      var aliasPart = ['areas', 'prefixes', 'suffixes'][aliasPartIndex];
      var newPart = getOcgPart(aliasPart);
      if( aliases.push(alias);
    }
  }

}

function getOcgPart(partType) {
  var index = Math.floor(Math.random() * ocgNameParts[partType].length),
      part = ocgNameParts[partType].splice(index, 1)[0];

  return part;
}


init();

console.log(data.ocgs);
