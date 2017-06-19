var express = require('express');
var router = express.Router();

var data = {
  nominals: require('./assets/data/dummyNominals.json').nominals,
  gangs: require('./assets/data/dummyGangs.json').gangs
};
var nominals = data.nominals;
var gangs = data.gangs;
var mugshots = require('./assets/data/mugshot.js');

// Route index page
router.get('/', function (req, res) {
  res.render('index');
});



// add your routes here

// nominals
router.get('/nominal/rand/', function(req, res) {
  var n = Math.floor(Math.random() * nominals.length);
  res.redirect('/nominal/' + n);
});

router.get('/nominal/:index', function(req, res) {
  var nominal = nominals[req.params.index];
  res.render('nominal', {
    next: getNext(req.params.index, nominals.length),
    prev: getPrev(req.params.index, nominals.length),
    nominal: nominal,
    displayDob: displayDob(nominal.dob),
    age: getAge(nominal.dob),
    affiliations: getAffiliations(nominal.affiliations)
  });
});

router.get('/nominal/', function(req, res) {
  res.redirect('/nominal/0');
});


// gangs
router.get('/gang/rand/', function(req, res) {
  var n = Math.floor(Math.random() * gangs.length);
  res.redirect('/gang/' + n);
});

router.get('/gang/:index', function(req, res) {
  var gang = gangs[req.params.index];
  res.render('gang', {
    next: getNext(req.params.index, gangs.length),
    prev: getPrev(req.params.index, gangs.length),
    gang: gang
  });
});

router.get('/gang/', function(req, res) {
  res.redirect('/gang/0');
});




function getNext(n, max) {
  n = parseInt(n, 10) + 1;
  if(n > max - 1) {
    n = 0;
  }

  return n;
}

function getPrev(n, max) {
  n = parseInt(n, 10) - 1;
  if(n < 0) {
    n = max - 1;
  }

  return n;
}

function getAffiliations(affiliationIndexes) {
  var affiliations = [];

  affiliationIndexes.forEach(function(index) {
    var affiliation = {
      index: index,
      name: gangs[index].name
    };
    affiliations.push(affiliation);
  });

  return affiliations;
}

function displayDob(dob) {
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return dob.day + ' ' + months[dob.month - 1] + ' ' + dob.year;
}

function getAge(dob) {
  var now = new Date(),
      then = new Date(dob.year, dob.month - 1, dob.day),
      elapsed = now.getTime() - then.getTime(),
      yearInMs = 1000 * 60 * 60 * 24 * 365.25,
      elapsedYears = Math.floor(elapsed / yearInMs);

  return elapsedYears;
}

module.exports = router;
