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
        name = generateOcgName();

    ocg.name = nameAsString(name);
    ocg.aliases = generateOCGAliases(name).map(nameAsString);
    ocg.territory = generateTerritory(name);
    data.ocgs.push(ocg);
  }

  fs.writeFile('./app/assets/data/dummyOcgs.json', JSON.stringify(data, null, 2), 'utf-8');
}


function generateOCGAliases(name) {
  var aliases = [];
  for( let part of ['prefixes', 'suffixes'] ){
    if( Math.random() > 0.9 ){
      aliases.push( generateAliasFor(name, part) );
    }
  }
  return aliases;
}

function getOcgPart(partType) {
  var part, values;
  values = (partType == 'areas' ? Object.keys(ocgNameParts['areas']) : ocgNameParts[partType]);

  var index = Math.floor(Math.random() * values.length);  
  part = values.splice(index, 1)[0];

  return part;
}

function generateOcgName() {
  return {
    'areas': getOcgPart('areas'),
    'prefixes': getOcgPart('prefixes'),
    'suffixes': getOcgPart('suffixes'),
  };
}

function generateAliasFor(name, part) {
  var alias = {
    'areas': name['areas'],
    'prefixes': name['prefixes'],
    'suffixes': name['suffixes'],
  }, attempts = 0;

  while( alias[part] == name[part] ){
    alias[part] = getOcgPart(part);
    attempts += 1;
  }
  return alias;
}

function nameAsString(name) {
  return [name['areas'], name['prefixes'], name['suffixes']].join(' ');
}

function generateTerritory(name) { 
  if( Math.random() > 0.6 ) {
    return ocgNameParts['areas'][name['areas']];
  }
}

init();

console.log(data.ocgs);
