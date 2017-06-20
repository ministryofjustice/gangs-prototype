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
    next: getNext(req.params.index, nominals.length),
    prev: getPrev(req.params.index, nominals.length),
    nominal: nominal,
    affiliations: getAffiliations(nominal.affilliations)
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

  if(typeof(affiliationIndexes) != 'undefined') {
    affiliationIndexes.forEach(function(index) {
      var affiliation = {
        index: index,
        name: gangs[index].name
      };
      affiliations.push(affiliation);
    });
  }

  return affiliations;
}

function nominal_search(params) {
  var filtered_nominals = nominals.map( function(element, index){ element['index'] = index; return element; } );
  return nominals;
}

function paginate(array, page, per_page) {
  page=page || 1;
  per_page=per_page || 20;

  var start=(page - 1) * per_page;
  var end=start + per_page;

  return array.slice(start, end);
}

module.exports = router;
