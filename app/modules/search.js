var search = {
  filter: function(array, params) {
    var results = [], indexedArray = this.ensureIndex(array);
    for( var i=0; i < indexedArray.length; i++ ){
      if( this.matches(indexedArray[i], params) ){
        results.push(indexedArray[i]);
      }
    }
    return results;
  },

  matches: function(object, params) {
    for( key in params ){
      if( params[key] ){
        if( key in object ){
          if( typeof(object[key]) == 'number') {
            if( params[key] != object[key] ){ 
              return false;
            }
          } else {
            var tokens = params[key].toLowerCase().split(/[ ,]+/);
            var value = object[key].toString().toLowerCase();

            for( var i=0; i < tokens.length; i++ ){
              if( value.indexOf(tokens[i]) == -1 ){
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  },

  ensureIndex: function(array) {
    return array.map( function(element, index){ 
      element['index'] = index; return element; 
    });
  },

  generateSearchText: function(object) {
    var search_text = [];
    for( var field in object ){
      if( typeof(object[field]) != 'number' ){
        var text = object[field].toString();
        if( text != '[object Object]' ){
          search_text.push( text );
        }
      }
    }
    return search_text.toString();
  }
}

module.exports = search;