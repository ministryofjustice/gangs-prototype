var express = require('express');
var router = express.Router();

var data = {
  nominals: require('./assets/data/dummyNominals.json').nominals,
  gangs: require('./assets/data/dummyGangs.json').gangs,
  tensions: require('./assets/data/gangTensions.json').tensions
};
var nominals = data.nominals;
var gangs = data.gangs;
var mugshots = require('./assets/data/mugshot.js');



// Temporarily route index page to default first nominal
router.get('/', function (req, res) {
  res.redirect('/nominal/0');
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
  var gang = gangs[req.params.index],
      gangNominals = getNominals(req.params.index),
      tensions = getGangTensions(req.params.index);

  res.render('gang', {
    next: getNext(req.params.index, gangs.length),
    prev: getPrev(req.params.index, gangs.length),
    gang: gang,
    nominals: gangNominals,
    tensions: tensions
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
function getNominals(gangIndex) {
  var gangNominals = [];

  nominals.forEach(function(nominal, n) {
    var gangContainsNominal = nominal.affiliations.indexOf(parseInt(gangIndex,10)) !== -1;

    if(gangContainsNominal) {
      gangNominals.push({
        index: n,
        name: [nominal.given_names, nominal.family_name].join(' ')
      });
    }
  });

  return gangNominals;
}

function getGangTensions(gangIndex) {
  var gangTensions = [];

  data.tensions.forEach(function(tension) {
    var gangIndexPosition = tension.indices.indexOf(parseInt(gangIndex, 10));

    if(gangIndexPosition !== -1) {
      // one of the parties in this tension is gangIndex
      var otherGang = parseInt((gangIndexPosition === 0 ? tension.indices[1] : tension.indices[0]), 10);
      gangTensions.push({
        gang: {
          index: otherGang,
          name: data.gangs[otherGang].name
        },
        tensionLevel: tension.tensionLevel
      });
    }
  });

  return gangTensions;
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
