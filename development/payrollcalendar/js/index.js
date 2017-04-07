var toggle = false;

function setCalendarSize(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  if(w > h){
    if(h<300){h=300;}
    $('.calendar').css({width:h-10,height:h-10,'font-size':h*0.024});
  }
  else{
    if(w<300){w=300;}
    $('.calendar').css({width:w-10,height:w-10,'font-size':w*0.024});
  }  
}

function toggleKey(element,swtch){
  if(element === false){return;}
  var selected = $('#toggles .'+element);
  var year = $('#label').html();
  var month = $('#label').html();
  var row = $('#frame table tbody tr');
  month = month.slice(0,month.indexOf('2')-1);
  year = year.slice(year.indexOf('2'),year.indexOf('2')+5);
  toggle = element;
  try{
    var tempData = data[year][element][month];
  }
  catch(err){
    //console.log(err);
  }
  if(swtch){
    toggleColor();
  }
  else{
    toggleButton();
    toggleColor();
  }
  
  function toggleButton(){
    if(selected.hasClass('active')){
      $('#toggles .'+element).removeClass('active');
      toggle = false;
    }
    else{
      $('#toggles tbody tr').children().each(function(){$(this).removeClass('active');});
      $('#toggles .'+element).addClass('active');
    }
  }
  
  function toggleColor(){
    $(row).children().each(function(){
      if(!$(this).hasClass('today')){$(this).removeClass();}
      else{$(this).removeClass().addClass('today');}
      if(tempData !== undefined && toggle !== false){
        for(i = 0; i < tempData.length; i++){
          if(tempData[i].toString() === $(this).html()){
            $(this).addClass(element);
          }
        }
      }
    });
  }
  //console.log(toggle);  
}

//toggleKey();
var CALENDAR = function () { 
	    var wrap, label,  
	            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
  
  function init(newWrap) {
    wrap = $(newWrap || ".calendar"); 
    label = wrap.find("#label");
    wrap.find("#prev").bind("click.calendar", function () { switchMonth(false); });
    wrap.find("#next").bind("click.calendar", function () { switchMonth(true);  }); 
    label.bind("click", function () { switchMonth(null, new Date().getMonth(), new Date().getFullYear()); });
    label.click();
  } 
  
  function switchMonth(next, month, year) {
    var curr = label.text().trim().split(" ")
    var calendar;
    var tempYear =  parseInt(curr[1], 10);
    if (!month) {
      if (next) {
        if (curr[0] === "December") {
          month = 0;
        }
        else{
          month = months.indexOf(curr[0]) + 1; 
        }
      }
      else {
        if (curr[0] === "January") {
          month = 11;
        }
        else { 
          month = months.indexOf(curr[0]) - 1;
        } 
      }
    }
    if (!year) {
      if (next && month === 0) {
        year = tempYear + 1;
      }
      else if (!next && month === 11) {
        year = tempYear - 1;
      }
      else {
        year = tempYear;
      }
    }
    calendar =  createCal(year, month);
    $("#frame", wrap) 
	            .find(".curr") 
	                .removeClass("curr") 
	                .addClass("temp") 
	            .end() 
	            .prepend(calendar.calendar()) 
	            .find(".temp") 
	                .fadeOut("slow", function () {$(this).remove(); });
    $('#label').text(calendar.label);
    toggleKey(toggle,true);
  } 
  
  function createCal(year, month) {
    var day = 1, i, j, haveDays = true,startDay = new Date(year, month, day).getDay(),daysInMonths = [31, (((year%4==0)&&(year%100!=0))||(year%400==0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], calendar = [];
    if (createCal.cache[year]) {
      if (createCal.cache[year][month]) { 
        return createCal.cache[year][month];
      }
    }
    else {
      createCal.cache[year] = {};
    }
    i = 0;
    while (haveDays) {
      calendar[i] = [];
      for (j = 0; j < 7; j++) {
        if (i === 0) {
          if (j === startDay) {
            calendar[i][j] = day++;
            startDay++;
          }
        }
        else if (day <= daysInMonths[month]) {
          calendar[i][j] = day++;
        } 
        else {
          calendar[i][j] = "";
          haveDays = false;
        }
        if (day > daysInMonths[month]) {
          haveDays = false;
        }
      }
      i++;
    }
    if(calendar.length<6){calendar.push([undefined,undefined,undefined,undefined,undefined,undefined,undefined])};
    for (i = 0; i < calendar.length; i++) {
      calendar[i] = "<tr><td>" + calendar[i].join("</td><td>") + "</td></tr>";
    }
    calendar = $("<table>" + calendar.join("") + "</table>").addClass("curr");
    $("td:empty", calendar).addClass("nil");
    if (month === new Date().getMonth()) {
      $('td', calendar).filter(function () { return $(this).text() === new Date().getDate().toString(); }).addClass("today");
    }
    createCal.cache[year][month] = { calendar : function () { return calendar.clone() }, label : months[month] + " " + year };
    return createCal.cache[year][month];
  } 
  
  createCal.cache = {}; 
  return{ 
    init : init,
    switchMonth : switchMonth,
    createCal   : createCal
  }; 
};

setCalendarSize();
var cal = CALENDAR(); 
cal.init();