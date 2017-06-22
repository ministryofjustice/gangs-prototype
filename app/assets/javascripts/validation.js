window.addEventListener("load", function(event) {
	var inputs = document.getElementsByTagName('input');
	for ( i = 0 ; i < inputs.length ; i++ ){
		inputs[i].addEventListener('input', function (evt) {
			validate(evt.target);
		});
	}
});

function validate(target){
	console.log(target.name);
	switch(target.name){ //Check which Type of ID we're validating, and either set as valid or invalid
		case "offender_id":
			var regex = /^[1-9]\d*$/;
			break;
		case "nomis_id":
			var regex = /^[A-Z][1-9]{4}[A-Z]{2}$/
			break;
		case "pnc_id":
			var regex = /^[1-9]{2}\/[1-9]{6}[A-Z]$/
			break;
		default:
			var regex = /a^/ //nothing matches this regex, so will always evaluate to false
			break; 
	}
	if (regex.test(target.value)){
		setValid(target.name);
	}else{
		setInvalid(target.name);
	};
}

function setValid(name){
	document.getElementsByClassName('validate '+name)[0].classList.remove('hidden');
	document.getElementsByClassName('validate '+name)[0].getElementsByClassName('trigger')[0].classList.add('drawn');
	document.getElementsByName(name)[0].classList.add('form-validated');
	//form
	
}

function setInvalid(name){
	// document.getElementsByClassName('validate '+name)[0].classList.add('hidden');
	var tickContainer = document.getElementsByClassName('validate '+name)[0];
	tickContainer.getElementsByClassName('trigger')[0].classList.remove('drawn');;
	document.getElementsByName(name)[0].classList.remove('form-validated');
}