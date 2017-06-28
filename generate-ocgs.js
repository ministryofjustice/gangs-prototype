var path = require('path');
var fs = require('fs');
var ocgNameParts = require('./app/sources/ocgnames.json');
var quantities = require('./app/sources/quantities.json');
var ocgIdentifyingFeatures = require('./app/sources/ocgidentifyingfeatures.json');
var randomPicker = require('./app/modules/randompicker.js');

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
    ocg.identifying_features = generateIdentifyingFeatures(name);
    ocg.pnd_id = generatePNDID();
    ocg.grits_id = generateGRITSID();
    ocg.ocgm_urn = generateOCGMURN();
    data.ocgs.push(ocg);
  }

  fs.writeFile('./app/assets/data/dummyOcgs.json', JSON.stringify(data, null, 2), 'utf-8');
}

function featureTypes(){
  return [
    ['garment'],
    ['style_of_wear', 'garment'],
    ['colour', 'garment'],
    ['style_of_wear', 'colour', 'garment',],
    ['accessory'],
    ['hair', 'hair_suffix'],
    ['tattoo', 'tattoo_location_prefix', 'tattoo_location']
  ];
}

function generateIdentifyingFeatures(name){
  var features = [], types = featureTypes();

  for( i=0; i < types.length; i++ ){
    if( Math.random() > 0.75 ){
      features.push( generateFeatureOfType(types[i]) );
    }
  }
  return features;
}

function generateFeatureOfType(featureType){
  return featureType.map(randomFeatureSegment).join(' ');
}

function randomFeatureSegment(segment) {
  var options = ocgIdentifyingFeatures[segment];
  var index = Math.floor(Math.random() * options.length);
  return options[index];
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

function generateGRITSID() {
  // e.g. A1417AE
  var str = randomPicker.rndLetters(1) + randomPicker.rndDigits(4) + randomPicker.rndLetters(2);
  return str;
}

function generatePNDID() {
  // e.g. 76/198452G
  var str = randomPicker.rndDigits(2) + '/' + randomPicker.rndDigits(6) + randomPicker.rndLetters(1);
  return str;
}

function generateOCGMURN() {
  var str = randomPicker.rndDigits(8);
  return str;
}

init();

console.log(data.ocgs);
