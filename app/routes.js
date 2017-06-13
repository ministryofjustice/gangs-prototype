var express = require('express');
var router = express.Router();

var data = require('./assets/data/dummyNominals.json'),
    nominals = data.nominals;

// Route index page
router.get('/', function (req, res) {
  res.render('index');
});



// add your routes here

// nominals
router.get('/test/nominal/rand/', function(req, res) {
  var n = Math.floor(Math.random() * data.nominals.length);
  res.redirect('/test/nominal/' + n);
});

router.get('/test/nominal/:index', function(req, res) {
  var nominal = nominals[req.params.index];
  res.render('test/nominal', {
    next: getNext(req.params.index),
    prev: getPrev(req.params.index),
    nominal: nominal
  });
});

router.get('/test/nominal/', function(req, res) {
  res.redirect('/test/nominal/0');
});




function getNext(n) {
  n = parseInt(n, 10) + 1;
  if(n > data.nominals.length - 1) {
    n = 0;
  }

  return n;
}

function getPrev(n) {
  n = parseInt(n, 10) - 1;
  if(n < 0) {
    n = data.nominals.length - 1;
  }

  return n;
}

module.exports = router;
