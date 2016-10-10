function chooseDoor(puzzleId, index){
  console.log(puzzleId + " in Door " + index);
  //console.log("Door: " +firstDoor);
  var postBody = new Object();
  postBody.action = "choose"
  postBody.selected_index = index;
  $.post("/api/puzzles/" + puzzleId, postBody, function(data, status){
    if (status == "success"){
      console.log(data);
      if (data.finished){
        var result = data.won? "won":"lost";
        var decision = data.switched? "switch":"stay";
        window.location.href = "/finished?result=" + result + "&decision=" + decision;
        return;
      }
      var selectedDoor = $(".doors_tbl").find("td").eq(index).find("button");
      selectedDoor.text("Stay on door")

      var shownDoor = $(".doors_tbl").find("td").eq(data.shown_door).find("button");
      shownDoor.attr("disabled", true)
      shownDoor.text("Goat")

      var switchIndex = 3 - data.shown_door - index;
      var switchDoor = $(".doors_tbl").find("td").eq(switchIndex).find("button");
      switchDoor.text("Switch to this door")

    } else {
      //TODO show error
      console.log("Error!!");
    }
  })
}

function resolveDoor(puzzleId, action){
}
