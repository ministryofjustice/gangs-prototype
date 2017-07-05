//Module to return random offender image URL

exports.getImage = function(gender){

  var mugshots = {
    male: 15,
    female: 15
  };

  function makeFilename(gender) {
    gender = gender || (Math.random() < 0.5 ? 'male' : 'female');

    return {
      gender: gender,
      filename: gender + '/' + (Math.floor(Math.random() * mugshots[gender]) + 1) + '.png'
    };
  }

  //Return random image, given gender. If no gender given, return random image of either gender
  switch (gender){
    case "male":
      return makeFilename('male');
      break;
    case "female":
      return makeFilename('female');
      break;
    default:
      return makeFilename();
      break;
  }

}
