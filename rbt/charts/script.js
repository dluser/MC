var hash = (window.location.hash).replace('#', '');
google.charts.load('current', {'packages':['line', 'corechart']});
google.charts.setOnLoadCallback(drawChart);
var data;
var chart;
var options;
var showg = false;

function drawChart() {
    if (hash.length === 0) {
    	var elem = document.getElementById("myChart");
		elem.parentNode.removeChild(elem);
		var butt = document.getElementById("moregraphs");
		butt.parentNode.removeChild(butt);
		toggleGraphs();
    }
    else if(hash === 'linesample') {
    	lineChart();
    	data = new google.visualization.DataTable();
      	data.addColumn('string', 'sessions');
      	data.addColumn('number', 'Client #1');
      	data.addRows([
        ['Session 1',4],['Session 2',2],['Session 3',5],['Session 4',4],['Session 5',7],['Session 6',7]
      	]);
    	chart.draw(data, options);   
  }

    else if(hash === 'cumulativesample') {
    	lineChart();
    	data = new google.visualization.DataTable();
      	data.addColumn('string', 'days');
      	data.addColumn('number', 'Client #1');
      	data.addRows([
        ['Day 1',2],['Day 2',5],['Day 3',7],['Day 4',10],['Day 5',14]
     	 ]);
      	options.title = 'Cumulative Graph';
      	options.hAxis.title = 'Timeline';
      	options.vAxis.title = 'Cumulative Number of Correct Responses';
      	console.log(options);
		
		chart.draw(data, options);
    }
    else if(hash === 'j'){
    	lineChart();
    	data = new google.visualization.DataTable();
      	data.addColumn('string', 'sessions');
      	data.addColumn('number', 'Client #1');
      	data.addRows([
        ['Session 1',2],['Session 2',4],['Session 3',7],['Session 4',8],['Session 5',10],['Session 6',12]
      	]);
      	options.title = 'J.';
      	options.vAxis.title = 'Cumulative Number of Target Behaviors';
    	chart.draw(data, options); 
    }
    else if(hash === 'd'){
    	lineChart();
    	data = new google.visualization.DataTable();
      	data.addColumn('string', 'sessions');
      	data.addColumn('number', 'Client #1');
      	data.addRows([
        ['Session 1',10],['Session 2',9],['Session 3',10],['Session 4',8],['Session 5',9],['Session 6',10]
      	]);
      	options.title = 'D.';
      	options.vAxis.title = 'Number of Target Behaviors';
    	chart.draw(data, options); 
    }
    else if(hash === 'f'){
    	lineChart();
    	data = new google.visualization.DataTable();
      	data.addColumn('string', 'sessions');
      	data.addColumn('number', 'Client #1');
      	data.addRows([
        ['Session 1',2],['Session 2',2],['Session 3',1],['Session 4',2],['Session 5',2],['Session 6',2]
      	]);
      	options.title = 'F.';
      	options.vAxis.title = 'Number of Target Behaviors';
    	chart.draw(data, options); 
    }
    else if(hash === 'g'){
    	lineChart();
    	data = new google.visualization.DataTable();
      	data.addColumn('string', 'sessions');
      	data.addColumn('number', 'Client #1');
      	data.addRows([
        ['Session 1',5],['Session 2',6],['Session 3',4],['Session 4',6],['Session 5',5],['Session 6',6]
      	]);
      	options.title = 'G.';
      	options.vAxis.title = 'Number of Target Behaviors';
    	chart.draw(data, options); 
    }
    else if(hash === 'b'){
    	lineChart();
    	data = new google.visualization.DataTable();
      	data.addColumn('string', 'sessions');
      	data.addColumn('number', 'Client #1');
      	data.addRows([
        ['Session 1',10],['Session 2',9],['Session 3',7],['Session 4',4],['Session 5',2],['Session 6',0]
      	]);
      	options.title = 'B.';
      	options.vAxis.title = 'Number of Target Behaviors';
    	chart.draw(data, options); 
    }
    else if(hash === 'c'){
    	lineChart();
    	data = new google.visualization.DataTable();
      	data.addColumn('string', 'sessions');
      	data.addColumn('number', 'Client #1');
      	data.addRows([
        ['Session 1',2],['Session 2',7],['Session 3',1],['Session 4',9],['Session 5',3],['Session 6',12]
      	]);
      	options.title = 'C.';
      	options.vAxis.title = 'Number of Target Behaviors';
    	chart.draw(data, options); 
    }
     else if(hash === 'i'){
    	lineChart();
    	data = new google.visualization.DataTable();
      	data.addColumn('string', 'sessions');
      	data.addColumn('number', 'Client #1');
      	data.addRows([
        ['Session 1',5],['Session 2',10],['Session 3',15],['Session 4',18],['Session 5',22],['Session 6',29]
      	]);
      	options.vAxis.viewWindow.max = 30;
      	options.vAxis.gridlines.count = 31;
      	options.title = 'I.';
      	options.vAxis.title = 'Cumulative Number of Target Behaviors';
    	chart.draw(data, options); 
    }
    else if(hash === 'a'){
    	barChart();
    	data = new google.visualization.DataTable();
      	data.addColumn('string', 'sessions');
      	data.addColumn('number', 'Client #1');
      	data.addRows([
        ['Session 1',2],['Session 2',4],['Session 3',7],['Session 4',8],['Session 5',10],['Session 6',12]
      	]);
      	options.title = 'A.';
      	options.vAxis.title = 'Number of Target Behaviors';
    	chart.draw(data, options); 
    }
    else if(hash === 'h'){
    	barChart();
    	data = new google.visualization.DataTable();
      	data.addColumn('string', 'sessions');
      	data.addColumn('number', 'Client #1');
      	data.addRows([
        ['Session 1',2],['Session 2',7],['Session 3',1],['Session 4',9],['Session 5',3],['Session 6',12]
      	]);
      	options.title = 'H.';
      	options.vAxis.title = 'Number of Target Behaviors';
    	chart.draw(data, options); 
    }
    else if(hash === 'e'){
    	pieChart();
    	var data = google.visualization.arrayToDataTable([
          ['Task', 'Completed'],
          ['Session 1',2],
          ['Session 2',7],
          ['Session 3',1],
          ['Session 4',9],
          ['Session 5',3],
          ['Session 6',12]
        ]);

        options = {
          title: 'E.'
        };
        chart.draw(data, options);
    }
    else if(hash ==='rate'){
    	lineChart();
    	data = new google.visualization.DataTable();
      	data.addColumn('string', 'sessions');
      	data.addColumn('number', 'Client #1');
      	data.addRows([
        ['Session 1',28],['Session 2',24],['Session 3',24],['Session 4',24],['Session 5',30]
      	]);
      	options.vAxis.viewWindow.max = 30;
      	options.vAxis.gridlines.count = 31;
      	options.title = 'Rate of Target Behavior/Hour';
      	options.vAxis.title = 'Target Behavior Per Hour';
    	chart.draw(data, options);
    }
    else if(hash ==='duration'){
    	lineChart();
    	data = new google.visualization.DataTable();
      	data.addColumn('string', 'sessions');
      	data.addColumn('number', 'Client #1');
      	data.addRows([
        ['Session 1',40],['Session 2',33],['Session 3',33],['Session 4',47],['Session 5',47]
      	]);
      	options.vAxis.viewWindow.max = 50;
      	options.vAxis.gridlines.count = 51;
      	options.title = 'Duration of Target Behavior (Percent of Observation Time)';
      	options.vAxis.title = 'Percent of Observation Time';
    	chart.draw(data, options);
    }
}

function lineChart(){
	chart = new google.visualization.LineChart(document.getElementById('myChart'));
	options = {
      	title:'Line Graph',
      	animation:{
      		duration:600,
      		startup:true,
      		easing:'inAndOut'
      	},
        hAxis: {
          title: 'Session Number'
        },
        vAxis: {
          title: 'Number of Correct Responses',
          //viewWindowMode:'pretty',
           viewWindowMode:'explicit',
        	viewWindow:{
        		min:0,
        		max:15
        	},
          gridlines:{
          	count:16
          }
        },
        pointsVisible:true
      };
}

function barChart(){
	chart = new google.visualization.ColumnChart(document.getElementById('myChart'));
	options = {
      	title:'Line Graph',
      	animation:{
      		duration:600,
      		startup:true,
      		easing:'inAndOut'
      	},
        hAxis: {
          title: 'Session Number'
        },
        vAxis: {
          title: 'Number of Correct Responses',
          //viewWindowMode:'pretty',
           viewWindowMode:'explicit',
        	viewWindow:{
        		min:0,
        		max:15
        	},
          gridlines:{
          	count:16
          }
        },
        pointsVisible:true
      };
}
function pieChart(){
	chart = new google.visualization.PieChart(document.getElementById('myChart'));
	options = {
		title:'E.',
    	animation:{
    		duration:600,
    		startup:true,
    		easing:'inAndOut'
    	}
	}
}
function toggleGraphs(){
	if(showg === false){
		showg = true;
		document.getElementById('links').innerHTML = "<a href = '#linesample' onClick = 'refresh()'>Line Sample</a><a href = '#cumulativesample' onClick = 'refresh()'>Cumulative Sample</a><a href = '#a' onClick = 'refresh()'>Graph A</a><a href = '#b' onClick = 'refresh()'>Graph B</a><a href = '#c' onClick = 'refresh()'>Graph C</a><a href = '#d' onClick = 'refresh()'>Graph D</a><a href = '#e' onClick = 'refresh()'>Graph E</a><a href = '#f' onClick = 'refresh()'>Graph F</a><a href = '#g' onClick = 'refresh()'>Graph G</a><a href = '#h' onClick = 'refresh()'>Graph H</a><a href = '#i' onClick = 'refresh()'>Graph I</a><a href = '#j' onClick = 'refresh()'>Graph J</a>";
	}
	else{
		showg = false;
		document.getElementById('links').innerHTML='';
	}
}
function refresh() {
    location.reload();
}



