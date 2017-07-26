var path = require('path');
var fs = require('fs');
var unique = require('array-unique');

var quantities = require('./app/sources/quantities.json');

var nominals = require('./app/assets/data/dummy-nominals.json').nominals;
var ocgs = require('./app/assets/data/dummy-ocgs.json').ocgs;
var prisons = require('./app/sources/prisons.json').prisons;

var nominalTools = require('./app/modules/nominal-tools.js');
var randomPicker = require('./app/modules/random-picker.js');

// Check if node_modules folder exists
const nodeModulesExists = fs.existsSync(path.join(__dirname, '/node_modules'));
if (!nodeModulesExists) {
  console.error('ERROR: Node module folder missing. Try running `npm install`');
  process.exit(0);
}

var data = {
  lists: []
}

function init() {
  data.lists.push(generatePrisonersList());
  data.lists.push(generateProbationersList());
  data.lists.push(generateMixedList());
  for( var i = 0; i < data.lists.length; i++ ){
    data.lists[i].index = i;
  }

  fs.writeFile('./app/assets/data/dummy-lists.json', JSON.stringify(data, null, 2), 'utf-8');
}


function generateProbationersList(){
  var probationers = randomPicker.randomElements(nominalTools.getProbationers(), 0.1);

  var list = {
    name: 'My Probationers',
    nominalIndexes: probationers.map(function(e){ return e.index; })
  }
  return list;
}

function generatePrisonersList(){
  var prisonsWithNominals = unique( 
    nominals.filter(function(e){ 
      return e.imprisonment.prisonIndex;
    }).map(function(a){
      return a.imprisonment.prisonIndex;
    }) );
  var randomPrisonIndex = Math.floor(Math.random() * prisonsWithNominals.length);
  var prisoners = nominalTools.getNominalsInPrison(randomPrisonIndex);

  var list = {
    name: 'Prisoners In ' + prisons[randomPrisonIndex],
    nominalIndexes: prisoners.map(function(e){ return e.index; })
  }
  return list;
}

function generateMixedList(){
  var randomNominals = randomPicker.randomElements(nominals, 0.1);

  var list = {
    name: 'List 1',
    nominalIndexes: randomNominals.map(function(e){ return e.index; })
  }
  return list;
}


init();

console.log(data.lists);