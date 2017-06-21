//Module to return random offender image URL

exports.getImage = function(gender){

	//Create 2 objects, one with 5 male mugshots, one with 5 female.
	var imageDataMale =
		[{
				"gender":"male"
			,	"url":"https://s3-eu-west-1.amazonaws.com/gangmatronimages/male-1.png"
		},
		{
				"gender":"male"
			,	"url":"https://s3-eu-west-1.amazonaws.com/gangmatronimages/male-2.png"
		},	{
				"gender":"male"
			,	"url":"https://s3-eu-west-1.amazonaws.com/gangmatronimages/male-3.png"
		},	{
				"gender":"male"
			,	"url":"https://s3-eu-west-1.amazonaws.com/gangmatronimages/male-4.png"
		},	{
				"gender":"male"
			,	"url":"https://s3-eu-west-1.amazonaws.com/gangmatronimages/male-5.png"
		}];

	var imageDataFemale =
		[{
				"gender":"female"
			,	"url":"https://s3-eu-west-1.amazonaws.com/gangmatronimages/female-1.png"
		},
		{
				"gender":"female"
			,	"url":"https://s3-eu-west-1.amazonaws.com/gangmatronimages/female-2.png"
		},
		{
				"gender":"female"
			,	"url":"https://s3-eu-west-1.amazonaws.com/gangmatronimages/female-3.png"
		},
		{
				"gender":"female"
			,	"url":"https://s3-eu-west-1.amazonaws.com/gangmatronimages/female-4.png"
		},
		{
				"gender":"female"
			,	"url":"https://s3-eu-west-1.amazonaws.com/gangmatronimages/female-5.png"
		}];

		var eitherGender = imageDataMale.concat(imageDataFemale);

	//Return random image, given gender. If no gender given, return random image of either gender
	switch (gender){
		case "male":
			return imageDataMale[Math.floor(Math.random()*imageDataMale.length)];
			break;
		case "female":
			return imageDataFemale[Math.floor(Math.random()*imageDataFemale.length)];
			break;
		default:
			return eitherGender[Math.floor(Math.random()*eitherGender.length)];
			break;
	}



}
