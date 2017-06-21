var express = require('express');
var router = express.Router();

var mugshots = require('./modules/mugshot.js');
var nav = require('./modules/navigation.js');
var nominalTools = require('./modules/nominal-tools.js');
var gangTools = require('./modules/gang-tools.js');

var nominals = require('./assets/data/dummyNominals.json').nominals;
var gangs = require('./assets/data/dummyGangs.json').gangs;



// Temporarily route index page to default first nominal
router.get('/', function (req, res) {
  res.redirect('/nominal/0');
});


// nominals
router.get('/nominal/rand/', function(req, res) {
  var n = Math.floor(Math.random() * nominals.length);
  res.redirect('/nominal/' + n);
});

// search-related routes
router.get('/nominal/search/', function(req, res) {
  res.redirect('/nominal/search/new');
});
router.get('/nominal/search/new', function(req, res) {
  res.render('nominal/search/new', {search: {}});
});
router.get('/nominal/search/results', function(req, res) {
  var results = nominal_search(req.params);
  var page=req.query['page'] || 1;
  var per_page=req.query['per_page'] || 20;

  var paginated_results = paginate(results, page, per_page);

  res.render('nominal/search/results', {
    search_results: paginated_results,
    page: page,
    per_page: page
  });
});

router.get('/nominal/:index', function(req, res) {
  var nominal = nominals[req.params.index];
  res.render('nominal/show', {
    next: nav.next(req.params.index, nominals.length),
    prev: nav.prev(req.params.index, nominals.length),
    nominal: nominal,
    displayDob: nominalTools.displayDob(nominal.dob),
    age: nominalTools.getAge(nominal.dob),
    affiliations: nominalTools.getAffiliations(nominal.affiliations)
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
  var gang = gangs[req.params.index],
      gangNominals = gangTools.getNominals(req.params.index),
      tensions = gangTools.getGangTensions(req.params.index);

  res.render('gang', {
    next: nav.next(req.params.index, gangs.length),
    prev: nav.prev(req.params.index, gangs.length),
    gang: gang,
    nominals: gangNominals,
    tensions: tensions
  });
});

router.get('/gang/', function(req, res) {
  res.redirect('/gang/0');
});



module.exports = router;
