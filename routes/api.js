var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/monty')

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
var PuzzleSchema = new Schema({
  win_index : Number,
  first_selection: Number,
  switched: Boolean,
  won: Boolean,
});
var PuzzleModel = mongoose.model('Puzzle', PuzzleSchema)

/* GET puzzle with specific id */
router.get('/puzzles/:id', function(req, res, next) {
  PuzzleModel.findOne({'_id': req.params.id}, function(err, puzzle) {
    if(!err) {
      res.send(puzzle)
    } else {
      res.send("Error!!")
    }
  });
});

/* POST action for puzzle*/
router.post('/puzzles/:id', function(req, res, next) {
  var selection = req.body;
  if (selection.action == "choose"){
    PuzzleModel.findOne({'_id': req.params.id}, function(err, puzzle) {
      if(!err) {
        var shown_door = 3 - puzzle.win_index - selection.selected_index;
        res.send({'_id': puzzle._id, 'shown_door': shown_door})
      } else {
        res.send("Error!!")
      }
    });
  } else if (selection.action == "switch"){

  } else if (selection.action == "stay"){
  }
});

/* POST which creates a new puzzle */
router.post('/puzzles', function(req, res, next) {
  var puzzleInstance = new PuzzleModel();
  puzzleInstance.win_index = Math.floor((Math.random() * 3));
  puzzleInstance.save(function (err){
    console.log("Hello Puzzle: " + err);
    if(!err) {
      console.log(puzzleInstance);
     res.send(puzzleInstance);
   } else {
     res.send("Error!!")
   }
  });
});

module.exports = router;
