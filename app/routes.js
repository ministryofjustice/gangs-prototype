var express = require('express');
var router = express.Router();

var mugshots = require('./modules/mugshot.js');
var nav = require('./modules/navigation.js');
var nominalTools = require('./modules/nominal-tools.js');
var ocgTools = require('./modules/ocg-tools.js');

var nominals = require('./assets/data/dummyNominals.json').nominals;
var ocgs = require('./assets/data/dummyOcgs.json').ocgs;

var paginator = require('./modules/paginator.js')


// root - login page
router.get('/', function (req, res) {
  res.render('index');
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
  var results = nominalTools.search(req.params);
  var page=req.query['page'] || 1;
  var per_page=req.query['per_page'] || 20;
  var pages=results.length / (per_page > 0 ? per_page : 1);

  var paginated_results = paginator.visibleElements(results, page, per_page);

  res.render('nominal/search/results', {
    search_results: paginated_results,
    page: page,
    pages: pages,
    per_page: per_page
  });
});

router.get('/ocg/search/', function(req, res) {
  res.redirect('/ocg/search/new');
});
router.get('/ocg/search/new', function(req, res) {
  res.render('ocg/search/new', {search: {}});
});
router.get('/ocg/search/results', function(req, res) {
  var results = ocgTools.search(req.params);
  var page=req.query['page'] || 1;
  var per_page=req.query['per_page'] || 20;
  var pages=results.length / (per_page > 0 ? per_page : 1);

  var paginated_results = paginator.visibleElements(results, page, per_page);

  res.render('ocg/search/results', {
    search_results: paginated_results,
    page: page,
    pages: pages,
    per_page: per_page
  });
});

router.get('/nominal/:index', function(req, res) {
  var nominal = nominals[req.params.index];
  res.render('nominal/show', {
    next: nav.next(req.params.index, nominals.length),
    prev: nav.prev(req.params.index, nominals.length),
    nominal: nominal,
    age: nominalTools.getAge(nominal.dob),
    affiliations: nominalTools.getAffiliations(nominal.affiliations)
  });
});

router.get('/nominal/', function(req, res) {
  res.redirect('/nominal/0');
});


// ocgs
router.get('/ocg/rand/', function(req, res) {
  var n = Math.floor(Math.random() * ocgs.length);
  res.redirect('/ocg/' + n);
});

router.get('/ocg/:index', function(req, res) {
  var ocg = ocgs[req.params.index],
      ocgNominals = ocgTools.getNominals(req.params.index),
      tensions = ocgTools.getOcgTensions(req.params.index);

  res.render('ocg/show', {
    next: nav.next(req.params.index, ocgs.length),
    prev: nav.prev(req.params.index, ocgs.length),
    ocg: ocg,
    nominals: ocgNominals,
    tensions: tensions
  });
});

router.get('/ocg/', function(req, res) {
  res.redirect('/ocg/0');
});



module.exports = router;
