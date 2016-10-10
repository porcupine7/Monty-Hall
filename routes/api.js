var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/monty')

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
var PuzzleSchema = new Schema({
  author    : ObjectId,
  win_index : Number,
});
var PuzzleModel = mongoose.model('Puzzle', PuzzleSchema)

/* GET puzzle with specific id */
router.get('/puzzles/:id', function(req, res, next) {
  var puzzleInstance = new PuzzleModel();
  puzzleInstance.win_index = 2;
  puzzleInstance.save(function (err){
    console.log("Hello Puzzle: " + err);
  });
  res.send(puzzleInstance)
});

module.exports = router;
