console.log("Taysend Gallego");
var result = document.getElementById("result");
function person(title, entry, position) {
    this.title = title;
    this.entry = entry;
    this.position = position; 
}

//inkling should be able to manipulate this array...not sure how edit screen will work
var answers = 
[{title:"1",entry:"sample entry",position:"left"},
{title:"2",entry:"sample entry",position:"right"},
{title:"3",entry:"sample entry",position:"left"},
{title:"4",entry:"sample entry",position:"right"},
{title:"5",entry:"sample entry",position:"left"},
{title:"6",entry:"sample entry",position:"right"}];

//shuffle function
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//shuffle answers to keep it random...
shuffle(answers);

//check if puzzle figured itself out...
while(answers[0].position === "left" && answers[2].position === "left" && answers[4].position === "left")
{
  shuffle(answers);
  console.log("running");
}

//add items to DOM...
for(var i = 0; i < answers.length; i++)
{
  $("#list").append("<div class='drag-item ui-state-default'><div class = "+answers[i].position+"><h1 class = 'bar'>"+answers[i].title+"</h1><p align='left'>"+answers[i].entry+"</p></div></div>");
}

  $(document).ready(function(){
    $("#list").sortable({
placeholder: "drag-item",
update: function( event, ui ) {check();},
tolerance: "pointer",
scroll:false
    });
    $("#list").disableSelection();
    
  });

function check(){

//get list element
  var list = document.getElementById("list");
  var win = 0;

// cycle through every other element starting with 2. Cycles through odds.
    for(var i = 0; i < list.children.length; i+=2){
      var answer = list.children[i].children;

//go to the last child of every child in list. 
      for(var j = (answer.length - 1); j < answer.length; j++){

//check if titles are on the right side
    if($(answer[j]).hasClass("left")){
      win++;
    }
  }
  }
   if(win === 3){
    result.innerHTML = "<h1>Correct</h1>";
    result.classList.add('correct');
    var bars = document.querySelectorAll(".bar");
    [].forEach.call(bars, function (bars) {
      bars.style.background = "green";
  });
    return true;
    }
    else{
      result.classList.remove('correct');
      result.innerHTML = "";
       var bars = document.querySelectorAll(".bar");
    [].forEach.call(bars, function (bars) {
      bars.style.background = "#780000";
  });
    return false;
    }
}