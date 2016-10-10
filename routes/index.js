var express = require('express');
var router = express.Router();
var request = require("request");

/* GET home page. */
router.get('/', function(req, res, next) {
  request.post({
    url: "http://localhost:3000/api/puzzles/",
    body: "puzzle=new"
  }, function(err, response, body){
    if (!err){
      var puzzle = JSON.parse(body);
      res.render('index', {puzzle: puzzle});
    } else {
      res.render('error', {error: err} );
    }
  })
});

module.exports = router;
