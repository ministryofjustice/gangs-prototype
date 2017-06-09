var express = require('express')
var router = express.Router()

var data = require('./data/test-person.json');

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/test/person/:index', function(req, res) {
  var person = data[req.params.index];
  res.render('test/person', {
    person: person
  });
})

// add your routes here

module.exports = router
