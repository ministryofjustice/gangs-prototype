var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');

var mugshots = require('./modules/mugshot.js');
var nav = require('./modules/navigation.js');
var nominalTools = require('./modules/nominal-tools.js');
var ocgTools = require('./modules/ocg-tools.js');
var ocgThreatAssessmentTools = require('./modules/ocg-threat-assessment-tools.js');
var nominalThreatAssessmentTools = require('./modules/nominal-threat-assessment-tools.js');
var updateTools = require('./modules/update-tools.js');
var listTools = require('./modules/list-tools.js');
var paginator = require('./modules/paginator.js');
var fileUtils = require('./modules/file-utils.js');

var nominals = require('./assets/data/dummy-nominals.json').nominals;
var ocgs = require('./assets/data/dummy-ocgs.json').ocgs;
var prisons = require('./sources/prisons.json').prisons;
var roles = require('./sources/roles.json').roles;

var ocgAssessmentTypes = require('./sources/ocg-assessment-types');
var ocgAssessmentFields = require('./sources/ocg-assessment-fields');
var nominalAssessmentTypes = require('./sources/nominal-assessment-types');
var nominalAssessmentFields = require('./sources/nominal-assessment-fields');

const S3_BUCKET = process.env.S3_SOURCE_BUCKET_NAME;
const S3_UPLOAD_PREFIX = process.env.S3_UPLOAD_PREFIX;
var aws = require('aws-sdk');
const SHOW_FACIAL_RECOGNITION_SEARCH = (S3_BUCKET && process.env.REKOGNITION_COLLECTION_ID);

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
  var updatesToDisplay = updateTools.updatesForDisplay(3);
  res.render('home/index', {
    updatesToDisplay: updatesToDisplay
  });
});



// updates pages per type
router.get('/updates/:type', function (req, res) {
  var updateType = req.params.type;
  var updatesToDisplay = updateTools.updatesForDisplay();

  res.render('updates/show', {
    updateType: updateType,
    updatesToDisplay: updatesToDisplay
  });
});


// PoC facial recognition routes
router.get('/sign-s3', function (req, res) {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'], fileExt = fileUtils.fileExt(fileName);
  const targetFilename = [uuidv4(), fileExt].filter(Boolean).join('.');
  const targetKey = [S3_UPLOAD_PREFIX, targetFilename].filter(Boolean).join('/')
  const targetUrl = `https://${S3_BUCKET}.s3.amazonaws.com/${targetKey}`;
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: targetKey,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  console.log('s3Params = ' + JSON.stringify(s3Params));
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: targetUrl,
      key: targetKey
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

// nominals
router.get('/nominal/', function(req, res) {
  res.redirect('/nominal/search/new');
});

router.get('/nominal/rand/', function(req, res) {
  var n = Math.floor(Math.random() * nominals.length);
  res.redirect('/nominal/' + n);
});

router.get('/nominal/tensions', function(req, res){
  var indexes = req.query.indexes.split(',').map(Number);
  var nominalsInList = nominalTools.getList(indexes);
  var nominals = nominals;
  var tensions = nominalTools.getTensionsInList(indexes || []);

  res.render('nominal/tensions', {
    nominalsInList: nominalsInList,
    ocgs: ocgs,
    tensions: tensions
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
  res.render('nominal/search/new', {

    nominalAssessmentFields: nominalAssessmentFields,
    nominalAssessmentTypes: nominalAssessmentTypes,
    nominalAssessmentValues: ["High", "Med", "Low", "Yes", "No"],
    showFacialRecognitionSearch: SHOW_FACIAL_RECOGNITION_SEARCH,

    lists: listTools.getAll(),
    search: {}
  });
});



router.get('/nominal/search/results', function(req, res) {
  if( req.session.data['uploaded-image-key'] ){
    var results = nominalTools.search(req.session.data).then( function success(data){
        var allData = buildSearchResultTemplateParams(data, req);
        return allData;
      }).then( function success(data){
        renderSearchResults(res, data);
      });
  } else {
    var results = nominalTools.search(req.session.data);
    var allData = buildSearchResultTemplateParams(results, req);
    renderSearchResults(res, allData);
  }
});

// Factored these bits out to make it easier to wrap them in .then() calls
function buildSearchResultTemplateParams(results, req){
  var refData = {
    nominalAssessmentFields: nominalAssessmentFields,
    nominalAssessmentTypes: nominalAssessmentTypes,
    nominalAssessmentValues: ["High", "Med", "Low", "Yes", "No"],
    roles: roles,
    showFacialRecognitionSearch: SHOW_FACIAL_RECOGNITION_SEARCH
  };
  var paginationParams = paginator.paginationParamsWithDefaults(req.query, {});
  var pages=results.length / (paginationParams['per_page'] > 0 ? paginationParams['per_page'] : 1);

  var paginated_results = paginator.visibleElements(results, paginationParams['page'], paginationParams['per_page']);
  
  var data = Object.assign( 
      {search_results: paginated_results, pages: pages},
      paginationParams
    )
  data = Object.assign(
      data,
      refData
    );
  return data;
}

function renderSearchResults(response, params) {
  response.render('nominal/search/results', params);
}





router.get('/simple_search_action', function(req,res){
  res.redirect( '/' + req.session.data['search-scope'] + '/search/results');
});

// put this last, so that it doesn't try to find
// nominals with index 'search', etc
router.get('/nominal/:index', function(req, res) {
  var nominal = nominals[req.params.index];
  var nominalThreatAssessments = nominalThreatAssessmentTools.search({nominal_index: req.params.index});

  res.render('nominal/show', {
    next: nav.next(req.params.index, nominals.length),
    prev: nav.prev(req.params.index, nominals.length),
    nominal: nominal,
    gender: nominalTools.expandGender(nominal.gender),
    age: nominalTools.getAge(nominal.dob),
    affiliations: nominalTools.getAffiliations(nominal.affiliations),
    releaseDaysAgo: nominalTools.showReleaseDaysAgo(nominal.imprisonment),
    prisonName: nominal.prison_name,
    threatAssessments: nominalThreatAssessments
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
      tensions = ocgTools.getOcgTensions(req.params.index),
      ocgThreatAssessments = ocgThreatAssessmentTools.search({ocg_index: req.params.index});

  res.render('ocg/show', {
    next: nav.next(req.params.index, ocgs.length),
    prev: nav.prev(req.params.index, ocgs.length),
    ocg: ocg,
    nominals: ocgNominals,
    tensions: tensions,
    threatAssessments: ocgThreatAssessments
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
  res.render('ocg/search/new', {
    ocgAssessmentFields: ocgAssessmentFields,
    ocgAssessmentTypes: ocgAssessmentTypes,
    ocgAssessmentValues: ["High", "Med", "Low", "Yes", "No"]
  });
});
router.get('/ocg/search/results', function(req, res) {
  var results = ocgTools.search(req.session.data);
  var page=req.query['page'] || 1;
  var per_page=req.query['per_page'] || 20;
  var pages=results.length / (per_page > 0 ? per_page : 1);

  var paginated_results = paginator.visibleElements(results, page, per_page);

  res.render('ocg/search/results', {
    ocgAssessmentFields: ocgAssessmentFields,
    ocgAssessmentTypes: ocgAssessmentTypes,
    ocgAssessmentValues: ["High", "Med", "Low", "Yes", "No"],
    search_results: paginated_results,
    roles: roles,
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

// lists
router.get('/lists', function(req, res) {
  var lists = listTools.getAll();
  res.render('lists/index', {
    lists: lists
  });
});
router.get('/lists/create', function(req, res) {
  res.render('lists/create_action', {
    name: req.session.data.name
  });
});
router.get('/lists/:index', function(req, res) {
  var lists = listTools.getAll();
  res.render('lists/show', {
    lists: lists,
    list: lists[req.params.index],
    roles: roles
  });
});
router.get('/lists/:index/nominals/delete', function(req, res) {
  res.render('lists/delete_action', {
    index: req.params.index
  });
});
router.get('/lists/:index/tensions', function(req, res) {
  var lists = listTools.getAll();
  var list = lists[req.params.index];
  var tensions = nominalTools.getTensionsInList(list.nominalIndexes);

  res.render('lists/tensions', {
    list: list,
    lists: lists,
    tensions: tensions
  });
});

module.exports = router;
