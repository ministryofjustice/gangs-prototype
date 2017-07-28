var fileUtils = {
  fileExt: function(string) {
    return (string.includes('.') ? string.split('.').pop() : null) 
  }
}

module.exports = fileUtils;
