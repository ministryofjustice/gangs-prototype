var express = require('express');
var router = express.Router();

var mugshots = require('./modules/mugshot.js');
var nav = require('./modules/navigation.js');
var nominalTools = require('./modules/nominal-tools.js');
var ocgTools = require('./modules/ocg-tools.js');
var updateTools = require('./modules/update-tools.js');

var nominals = require('./assets/data/dummy-nominals.json').nominals;
var ocgs = require('./assets/data/dummy-ocgs.json').ocgs;
var prisons = require('./sources/prisons.json').prisons;

var paginator = require('./modules/paginator.js')


// root - login page
router.get('/', function (req, res) {
  res.render('index');
});


// signout route
router.get('/signout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});



// home page with updates
router.get('/home', function (req, res) {
  var updatesToDisplay = updateTools.updatesForDisplay(10);
  res.render('home/index', {
    updates: updatesToDisplay
  });
});

// all updates page
router.get('/updates', function (req, res) {
  var updatesToDisplay = updateTools.updatesForDisplay();
  res.render('updates/index', {
    updates: updatesToDisplay
  });
});



// nominals
router.get('/nominal/rand/', function(req, res) {
  var n = Math.floor(Math.random() * nominals.length);
  res.redirect('/nominal/' + n);
});

router.get('/nominal/tensions', function(req, res){
  var indexes = req.query.indexes.split(',').map(Number);
  var nominalsInList = nominalTools.getList(indexes);
  var nominals = nominals;
  var tensions = nominalTools.getTensionsInList(indexes || []);

  console.log('nominalsInList = ' + nominalsInList)
  console.log('tensions = ' + JSON.stringify(tensions))

  res.render('nominal/tensions', {
    nominalsInList: nominalsInList,
    ocgs: ocgs,
    tensions: tensions
  });
});

router.get('/nominal/:index', function(req, res) {
  var nominal = nominals[req.params.index];
  res.render('nominal/show', {
    next: nav.next(req.params.index, nominals.length),
    prev: nav.prev(req.params.index, nominals.length),
    nominal: nominal,
    age: nominalTools.getAge(nominal.dob),
    affiliations: nominalTools.getAffiliations(nominal.affiliations),
    prisonName: prisons[nominal.incarceration]
  });
});

router.get('/nominal/', function(req, res) {
  res.redirect('/nominal/search/new');
});

// nominal search-related routes
router.get('/nominal/search/', function(req, res) {
  res.redirect('/nominal/search/new');
});
router.get('/nominal/search/new', function(req, res) {
  res.render('nominal/search/new', {search: {}});
});
router.get('/nominal/search/results', function(req, res) {
  var results = nominalTools.search(req.session.data);
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
  res.redirect('/ocg/search/new');
});

// ocg search-related routes
router.get('/ocg/search/', function(req, res) {
  res.redirect('/ocg/search/new');
});
router.get('/ocg/search/new', function(req, res) {
  res.render('ocg/search/new', {search: {}});
});
router.get('/ocg/search/results', function(req, res) {
  var results = ocgTools.search(req.session.data);
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



// prisons
router.get('/prison/:index', function(req, res) {
  var prison = prisons[req.params.index];
  var nominalsInPrison = nominalTools.getNominalsInPrison(req.params.index);

  res.render('prison/show', {
    prison: prison,
    nominalsInPrison: nominalsInPrison,
    ocgs: ocgs
  });
});



module.exports = router;
