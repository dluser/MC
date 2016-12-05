var substances = [{"name":"Battery Acid","ph":0,"color":"#4B1008"},{"name":"Human Stomach","ph":2,"color":"#EAD39F"},{"name":"Soda","ph":3,"color":"#551C0B"},{"name":"Energy Drinks","ph":3,"color":"#C0590C"},{"name":"Apple Juice","ph":4,"color":"#DAAD0C"},{"name":"Coffee","ph":4,"color":"#2C1E1D"},{"name":"Rain (acid)","ph":4,"color":"#9ACCD6"},
{"name":"Iced Tea","ph":5,"color":"#F8BD79"},{"name":"Rain (normal)","ph":5,"color":"#9ACCD6"},{"name":"Milk","ph":6,"color":"#F7F3EA"},{"name":"Human Blood","ph":7,"color":"#8E040A"},{"name":"Sea Water","ph":8,"color":"#447BB3"},{"name":"Baking Soda","ph":8,"color":"#E6E9F0"},{"name":"Window Cleaner","ph":12,"color":"#0BC7EC"},{"name":"Bleach","ph":13,"color":"#F4F5F0"}];
var colors = ["#821E25","#ED1C24","#EE7821","#F49C1E","#F2BB18","#F7DC09","#F6ED12","#CAD82B","#ABC645","#7AAEA2","#4495CC","#317ABE","#3E6DB5","#5E4FA2"];
var tubes = [];
var alpha = ["A","B","C","D","E","F"];
$(function(){

for(var i = 0; i < substances.length; i++){
    var temp = Math.floor((Math.random()*substances.length));
    tubes.push(substances[temp]);
    substances.splice(temp,1);
    i--;
}

for(var i = 1; i <= 6; i++)
{
    $("#name_"+i).html("<b>"+alpha[i-1]+"</b><br>"+tubes[i-1].name);
    $("#over_"+i).css("background-color",tubes[i-1].color);
}

$("#wrongnoti").hide();
$("#correct").hide();
stageratio();

$("#correct span").click(function(){
    $("#correct").hide().removeClass("rotateIn");
});

$(".strip").draggable({
         scroll: false,
         containment: "parent",
         drag:function(event,ui){
            //$("#strip_tip").css("background-color","#f5f5f5");
            $("#start").hide();
         }
         });

$("#tube_1").droppable({
            drop: function(event, ui){
                //$(".strip_tip").css("background-color",colors[tubes[0].ph]);
                //$(".strip").css({"left":"46.5%","top":"50%"});
                $(ui.draggable).children().css("background-color",colors[tubes[0].ph]);
                $(ui.draggable).css({"left":"46.5%","top":"50%"});
            }
         });

$("#tube_2").droppable({
            drop: function(event, ui){
                $(ui.draggable).children().css("background-color",colors[tubes[1].ph]);
                $(ui.draggable).css({"left":"54.5%","top":"50%"});
            }
         });

$("#tube_3").droppable({
            drop: function(event, ui){
                $(ui.draggable).children().css("background-color",colors[tubes[2].ph]);
               $(ui.draggable).css({"left":"62.5%","top":"50%"});
            }
         });

$("#tube_4").droppable({
            drop: function(event, ui){
                $(ui.draggable).children().css("background-color",colors[tubes[3].ph]);
                $(ui.draggable).css({"left":"70.35%","top":"50%"});
            }
         });

$("#tube_5").droppable({
            drop: function(event, ui){
                $(ui.draggable).children().css("background-color",colors[tubes[4].ph]);
                $(ui.draggable).css({"left":"78.35%","top":"50%"});
            }
         });

$("#tube_6").droppable({
            drop: function(event, ui){
                $(ui.draggable).children().css("background-color",colors[tubes[5].ph]);
                $(ui.draggable).css({"left":"86.25%","top":"50%"});
            }
         });

});

function stageratio(){
    //$("#strip").draggable("disable");
    $(".strip").css({"top":"30%","left":"30%"});
    //$("#strip").draggable("enable");
    var w = window.innerWidth;
    var h = window.innerHeight;
    var ratio = w/h;
    //console.log(w +":"+h);
    //console.log(ratio);
    if(ratio > 1.5){
        $(".stage").css({"height":"100vh","width":"150vh"});
        $("#title").css("font-size","4vh");
        $("p").css("font-size","1.5vh");
        $(".butt").css("font-size","1.2vh");
        $("#correct").css("font-size","15vh");
        $("#correct h2").css("font-size","15vh");
        $("#correct p").css("font-size","3vh");
        $("input").css("font-size","1.8vh");
    }
    else{
        $(".stage").css({"width":"100vw","height":"66vw"});
        $("#title").css("font-size","2.64vw");
        $("p").css("font-size","1vw");
        $(".butt").css("font-size","0.8vw");
        $("#correct").css("font-size","10vw");
        $("#correct h2").css("font-size","10vw");
        $("#correct p").css("font-size","2vw");
        $("input").css("font-size","1.2vw");

    }
}

function check(){
    var answers = [];
    for(var i = 0; i < 6; i++){
        answers[i] = parseInt(document.forms["phform"]["t"+(i+1)].value);
    }

    for(var i = 1; i <= 6; i ++){
        if(answers[i-1] === tubes[i-1].ph){
            console.log("Closer.");
            continue;
        }
        else{
            console.log("Wrong.");
            $("input").css("border","0.25em solid red");
            $("#wrongnoti").hide().fadeIn(200);
            return;
        }
    }
    $("#wrongnoti").hide();
    $("input").css("border","0.25em solid #01DF00");
    for(var i = 1; i <= 6; i++){
        $("#answer"+i).html(tubes[i-1].name +": "+tubes[i-1].ph+" pH");
    }
    $("#correct").show().addClass("rotateIn");
    console.log("Correct.");
    return;
}

function reset(){
    $(".overlay").css("opacity","0");
    $("#wrongnoti").hide();
    $("input").css("border","0 solid red");
    $(".strip").css({"top":"30%","left":"30%"});
    $(".strip_tip").css("background-color","#f5f5f5");
    $(".tubeset").removeClass("fadeInUp");
    substances = tubes;
    tubes = [];
    for(var i = 0; i < substances.length; i++){
        var temp = Math.floor((Math.random()*substances.length));
        tubes.push(substances[temp]);
        substances.splice(temp,1);
        i--;
    }
    for(var i = 1; i <= 6; i++){
        $("#name_"+i).html("<b>"+alpha[i-1]+"</b><br>"+tubes[i-1].name);
        $("#over_"+i).css("background-color",tubes[i-1].color);
    }
    $(".tubeset").addClass("fadeOutDown").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
        $(".overlay").css("opacity","0.9");
        $(".tubeset").removeClass("fadeOutDown");
        $(".tubeset").addClass("fadeInUp");
    });
    return;
}

function refresh(){
    $(".strip").css({"top":"30%","left":"30%"});
    $(".strip_tip").css("background-color","#f5f5f5");
}
