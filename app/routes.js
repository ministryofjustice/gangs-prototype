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
router.get('/test/nominal/rand/', function(req, res) {
  var n = Math.floor(Math.random() * nominals.length);
  res.redirect('/test/nominal/' + n);
});

router.get('/test/nominal/:index', function(req, res) {
  var nominal = nominals[req.params.index];
  res.render('test/nominal', {
    next: getNext(req.params.index, nominals.length),
    prev: getPrev(req.params.index, nominals.length),
    nominal: nominal
  });
});

router.get('/test/nominal/', function(req, res) {
  res.redirect('/test/nominal/0');
});


// gangs
router.get('/test/gang/rand/', function(req, res) {
  var n = Math.floor(Math.random() * gangs.length);
  res.redirect('/test/gang/' + n);
});

router.get('/test/gang/:index', function(req, res) {
  var gang = gangs[req.params.index];
  res.render('test/gang', {
    next: getNext(req.params.index, gangs.length),
    prev: getPrev(req.params.index, gangs.length),
    gang: gang
  });
});

router.get('/test/gang/', function(req, res) {
  res.redirect('/test/gang/0');
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

module.exports = router;
