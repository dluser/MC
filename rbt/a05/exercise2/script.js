var chartindex = 0;
var chartlist = [
  {title:'Rate of Target Behavior/Hour',ytitle:'Behavior/Hour',data:[28,24,24,24,30],maxRange:35,interval:5,table:[['Frequency of Poking Friends','Session Length','Rate of Target Behavior (Bx/Hr)'],['14','30 min'],['24','60 min'],['18','45 min'],['12','30 min'],['15','30 min']]},
  {title:'Duration of Target Behavior (Percent Observation Time)',ytitle:'Percent of Observation Time',data:[40,33,33,47,47],maxRange:50,interval:5,table:[['Duration of Hand Flapping (minutes)','Session Length','Duration of Hand Flapping (percentage)'],['12','30 min'],['20','60 min'],['15','45 min'],['14','30 min'],['21','45 min']]},
  {title:'Cumulative Frequency of Self-Injurious Behaviors',ytitle:'Frequency',data:[2,3,5,8,10],maxRange:12,interval:2,table:[['Frequency of Self-Injurious Behavior','Session Length','Cumulative Total'],['2','30 min'],['1','30 min'],['2','30 min'],['3','30 min'],['2','30 min']]},
  {title:'Frequency of Poking',ytitle:'Frequency',data:[28,24,23,20,20],maxRange:30,interval:5,table:[['Frequency of Poking','Session Length','Rate of Poking'],['14','30 min'],['24','60 min'],['17','45 min'],['10','30 min'],['15','45 min']]},
  {title:'Duration of Screaming (Percentage of Observation Time)',ytitle:'Percentage of Observation Time',data:[47,40,38,33,33],maxRange:50,interval:5,table:[['Duration of Screaming (Minutes)','Session Length','Duration of Screaming (Percentage)'],['14','30 min'],['24','60 min'],['17','45 min'],['10','30 min'],['15','45 min']]},
  {title:'Cumulative Duration of Screaming (Minutes)',ytitle:'Minutes',data:[14,26,33,43,55],maxRange:60,interval:10,table:[['Duration of Screaming (Minutes)','Session Length','Cumulative Duration of Screaming (minutes)'],['14','30 min'],['12','30 min'],['7','30 min'],['10','30 min'],['10','30 min']]}];
var chart;
var myPoints = [0,0,0,0,0];

function createChart(index, dat){

    $('input').removeAttr('readonly');
    for(var i = 0; i < chartlist[chartindex].table.length; i++){
          for(var j = 0; j < chartlist[chartindex].table[i].length; j++){
            $('#row'+i+''+j).html(chartlist[chartindex].table[i][j]);
          }
        }
    chart = new Highcharts.Chart({

    chart: {
        renderTo: 'myChart'
    },
    
    title: {
        text: chartlist[chartindex].title
    },

    xAxis: {
        categories: ['Session 1', 'Session 2','Session 3','Session 4','Session 5']
    },

    yAxis:[{
      title:{
        text:chartlist[chartindex].ytitle
      },
      allowDecimals:false,
      minTickInterval:1,
      max:chartlist[chartindex].maxRange,
      min:0,
      tickInterval:chartlist[chartindex].interval,
      labels:{
        step:1
      }
    }],

    tooltip: {
        yDecimals: 1,
        pointFormat:'<b>{point.y} </b>Bx/Hr'
    },

    series: [{
        data:dat,
        type: 'line',
        minPointLength: 2
    }]
});
  }

createChart(chartindex,myPoints);

$('input').on('change',function(){
  var tempindex = $(this).attr('id');
  console.log(tempindex);
  myPoints[parseInt(tempindex[tempindex.length-1])] = parseInt($(this).val());
  createChart(chartindex,myPoints);
  console.log(myPoints);
});

  function checkAnswers(){
    var tempanswers = chartlist[chartindex].data;
  	$(".feedback").html('');
  	for(var i = 0; i < tempanswers.length; i++){
  		if(chart.series[0].data[i].y == tempanswers[i] && $('#input'+i).val() == tempanswers[i]){
  			continue;
  		}
  		else{
  			$("#correct").hide();
  			$("#incorrect").show();
  			return;
  		}

  	}
    if(chartindex === chartlist.length - 1){
      $('#correct').html('Correct!');
    }
    $('#incorrect').hide();
  	$("#correct").show();
  	$('input').attr('readonly', 'true');
  }

  	$('#correctnext').click(function(){
      console.log(chartindex);
  		$('#correct').hide();
      if(chartindex < chartlist.length - 1){
        chartindex++;
        createChart(chartindex,[0,0,0,0,0]);
        $.each($('input'),function(index,ele){ele.value = "0";console.log($(this).value);});
      }
  	});

    $('#incorrectclose').click(function(){
        $('#incorrect').hide();
    });