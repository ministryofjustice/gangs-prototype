var express = require('express')
var router = express.Router()

var data = require('./data/dataOutput.json'),
    nominals = data.nominals;

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/test/nominal/:index', function(req, res) {
  var nominal = nominals[req.params.index];
  res.render('test/nominal', {
    nominal: nominal
  });
})

// add your routes here

module.exports = router
