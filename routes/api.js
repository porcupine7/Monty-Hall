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
  finished: Boolean,
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
  PuzzleModel.findOne({'_id': req.params.id}, function(err, puzzle) {
    if(err) {
      res.send("Error!!")
      return;
    }
    if (puzzle.first_selection != -1){
      //Show solution
      var switched = puzzle.first_selection != selection.selected_index;
      puzzle.switched = switched;
      var won = selection.selected_index == puzzle.win_index;
      puzzle.won = won;
      puzzle.finished = true;
      puzzle.save(null)
      res.send({'_id': puzzle._id, 'finished': true, 'switched': switched, 'won': won})
      return;
    }
    var doorsToShow = [0, 1, 2];
    doorsToShow[puzzle.win_index] = -1;
    doorsToShow[selection.selected_index] = -1;
    var shownDoor = -1;
    while (shownDoor == -1){
      shownDoor = doorsToShow[Math.floor((Math.random() * 3))];
    }
    puzzle.first_selection = selection.selected_index;
    puzzle.save(null);
    res.send({'_id': puzzle._id, 'finished': false, 'shown_door': shownDoor})
   });
});

/* POST which creates a new puzzle */
router.post('/puzzles', function(req, res, next) {
  var puzzleInstance = new PuzzleModel();
  puzzleInstance.win_index = Math.floor((Math.random() * 3));
  puzzleInstance.first_selection = -1;
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

router.get('/puzzlestats', function(req, res, next) {
  var stats = new Object();
  PuzzleModel.find({finished: true}, function(err, puzzles) {
    if(!err) {
      var switchedPlayers = puzzles.filter(function(entry){return entry.switched})
      stats.switchedPlayers = switchedPlayers.length;
      stats.switchedWinners = switchedPlayers.filter(function(entry){return entry.won}).length;
      var stayedPlayers = puzzles.filter(function(entry){return !entry.switched})
      stats.stayedPlayers = stayedPlayers.length;
      stats.stayedWinners = stayedPlayers.filter(function(entry){return entry.won}).length;
      res.send(stats)
    } else {
      res.send("Error: " + err)
    }
  });
});
module.exports = router;
