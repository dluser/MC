var substances = [{"name":"Battery Acid","ph":0},{"name":"Human Stomach","ph":2},{"name":"Soda","ph":3},{"name":"Energy Drinks","ph":3},{"name":"Apple Juice","ph":4},{"name":"Coffee","ph":4},{"name":"Rain (acid)","ph":4},
{"name":"Iced Tea","ph":5},{"name":"Rain (normal)","ph":5},{"name":"Milk","ph":6},{"name":"Human Blood","ph":7},{"name":"Sea Water","ph":8},{"name":"Baking Soda","ph":8},{"name":"Window Cleaner","ph":12},{"name":"Bleach","ph":13}];
var colors = ["#821E25","#ED1C24","#EE7821","#F49C1E","#F2BB18","#F7DC09","#F6ED12","#CAD82B","#ABC645","#7AAEA2","#4495CC","#317ABE","#3E6DB5","#5E4FA2"];
var tubes = [];

$(function(){

for(var i = 0; i < substances.length; i++){
    var temp = Math.floor((Math.random()*substances.length));
    tubes.push(substances[temp]);
    substances.splice(temp,1);
    i--;
}
//
for(var i = 1; i <= 6; i++)
{
    $("#name_"+i).html("<b>"+i+"</b><br>"+tubes[i-1].name);
}

$("#wrongnoti").hide();
$("#correct").hide();
stageratio();

$("#correct span").click(function(){
    $("#correct").hide();
});

$("#strip").draggable({
         scroll: false,
         containment: "parent",
         drag:function(event,ui){
            $("#strip_tip").css("background-color","#f5f5f5");
             $("#start").hide();
         }
         });

$("#tube_1").droppable({
            drop: function(){
                $("#strip_tip").css("background-color",colors[tubes[0].ph]);
                $("#strip").css({"left":"46.5%","top":"50%"});
            }
         });

$("#tube_2").droppable({
            drop: function(){
                $("#strip_tip").css("background-color",colors[tubes[1].ph]);
                $("#strip").css({"left":"54.5%","top":"50%"});
            }
         });

$("#tube_3").droppable({
            drop: function(){
                $("#strip_tip").css("background-color",colors[tubes[2].ph]);
                $("#strip").css({"left":"62.5%","top":"50%"});
            }
         });

$("#tube_4").droppable({
            drop: function(){
                $("#strip_tip").css("background-color",colors[tubes[3].ph]);
                $("#strip").css({"left":"70.5%","top":"50%"});
            }
         });

$("#tube_5").droppable({
            drop: function(){
                $("#strip_tip").css("background-color",colors[tubes[4].ph]);
                $("#strip").css({"left":"78.5%","top":"50%"});
            }
         });

$("#tube_6").droppable({
            drop: function(){
                $("#strip_tip").css("background-color",colors[tubes[5].ph]);
                $("#strip").css({"left":"86.5%","top":"50%"});
            }
         });

});

function stageratio(){
    //$("#strip").draggable("disable");
    $("#strip").css({"top":"30%","left":"30%"});
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
        $("input").css("font-size","1.8vh");
    }
    else{
        $(".stage").css({"width":"100vw","height":"66vw"});
        $("#title").css("font-size","2.64vw");
        $("p").css("font-size","1vw");
        $(".butt").css("font-size","0.8vw");
        $("#correct").css("font-size","10vw");
        $("#correct h2").css("font-size","10vw");
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
            $("input").css("border","0.25rem solid red");
            $("#wrongnoti").hide().fadeIn(200);
            return false;
        }
    }
    $("#wrongnoti").hide();
    $("input").css("border","0.25rem solid #01DF00");
    $("#correct").hide().fadeIn(200);
    console.log("Correct.");
    return false;
}

function reset(){
    $("#wrongnoti").hide();
    $("input").css("border","0 solid red");
    $("#strip").css({"top":"30%","left":"30%"});
    $("#strip_tip").css("background-color","#f5f5f5");
    $(".tubeset").removeClass("fadeInUp");
    $(".tubeset").addClass("fadeOutDown").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
        $(".tubeset").removeClass("fadeOutDown");
        $(".tubeset").addClass("fadeInUp");
        substances = tubes;
        tubes = [];
        for(var i = 0; i < substances.length; i++){
            var temp = Math.floor((Math.random()*substances.length));
            tubes.push(substances[temp]);
            substances.splice(temp,1);
            i--;
        }

        for(var i = 1; i <= 6; i++){
            $("#name_"+i).html("<b>"+i+"</b><br>"+tubes[i-1].name);
        }
    })
    return false;
}
