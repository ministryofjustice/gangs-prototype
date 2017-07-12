var nominals = require('../assets/data/dummy-nominals.json').nominals;
var lists = require('../assets/data/dummy-lists.json').lists;
var nominalTools = require('./nominal-tools.js');

var listTools = {
  getAll: function(){
    var listsWithNominals = lists;
    for( list of lists ){
      list.nominals = list.nominalIndexes.map(function(index){
        return nominals[index];
      });
    }
    return listsWithNominals;
  }
};

module.exports = listTools;