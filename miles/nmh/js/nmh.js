var toc;
var book = {chapters:[]};
var chPos = 0;
var pgPos = 0;

$(document).ready(function(){

	setUpTOC();

	//listener for sidebar menu button
	$("#menu-toggle").click(function(e) {
	    e.preventDefault();
	    $("#wrapper").toggleClass("toggled");
	});

	$("#previous").click(function(){
		changePos(book.chapters[chPos].pglinks[pgPos], "previous");
	    $("#wrapper").removeClass("toggled");
	});

	$("#next").click(function(){
		changePos(book.chapters[chPos].pglinks[pgPos], "next");
		$("#wrapper").removeClass("toggled");
	});

	//monitor iframe height
	var myInterval = setInterval(function(){
		if($('#idIframe')){
			var iFrame = $('#idIframe');
			var h = iFrame[0].contentWindow.document.body.clientHeight + 20 + "px";
			iFrame.css({'height':h});
		}
	},2000);
});

//function to call on iframe load. wait half a second for inside content to load and calculate inner height. still messing with this one.
function iFrameLoad(){
	var iFrame = $('#idIframe');
	iFrame.height = "";
	var h = iFrame[0].contentWindow.document.body.clientHeight + 20 + "px";
	iFrame.css({'opacity':'1','height':h});
	$('.loader').hide();
}

function changePos(link, direc){
	//find the current link in book obj and update ch and pg positions
	findPos(link);
	var chapters = book.chapters;
	var pages = book.chapters[chPos].pglinks;

	if(direc === 'previous'){
		if(chPos > 0){
			if(pgPos > 0){
				pgPos --;
				loadPageHTML(chapters[chPos].pglinks[pgPos]);
			}
			else{
				chPos--;
				pgPos = chapters[chPos].pglinks.length-1;
				console.log(pgPos);
				loadPageHTML(chapters[chPos].pglinks[pgPos]);
			}
		}
		else if(pgPos > 0){
			pgPos --;
			loadPageHTML(chapters[chPos].pglinks[pgPos]);
		}
	}

	else if(direc === 'next'){
		if(chPos < chapters.length-1){
			if(pgPos < chapters[chPos].pglinks.length -1){
				pgPos++;
				loadPageHTML(chapters[chPos].pglinks[pgPos]);
			}
			else{
				chPos++;
				pgPos = 0;
				loadPageHTML(chapters[chPos].pglinks[pgPos]);
			}
		}
		else if (pgPos < chapters[chPos].pglinks.length -1){
			pgPos++;
			loadPageHTML(chapters[chPos].pglinks[pgPos]);
		}
	}

	updateLocStorage();
	console.log("Chapter " +chPos + ", Page " + pgPos);
}

function findPos(lin){
	$.each(book.chapters,function(i,val){
		if(val.chlink === lin){
			chPos = i;
			pgPos = 0;
		}
		$.each(val.pglinks, function(j,valu){
			if(valu === lin){
				pgPos = j;
				chPos = i;
			}
		});
	});

	updateLocStorage();
	console.log("Chapter " +chPos + ", Page " + pgPos);
}

function loadPageHTML(lin){
	$('.loader').show();
	lin = 'nmh_export/OPS/' + lin;
	$('#book-content').html('<iframe onload = "iFrameLoad()" scrolling = "no" id = "idIframe" src ="'+lin+'"></iframe>');
}

function updateLocStorage(){
	if (typeof(Storage) !== "undefined") {
		localStorage.pgPos = pgPos;
		localStorage.chPos = chPos;
	}
}

//get TOC, inject TOC, add listeners. Create book obj for tracking navigation.
function setUpTOC(){
	$.get( "nmh_export/OPS/index.html","html", function(data) {	
  		//parse into html
  		toc = $.parseHTML(data);

  		//find the list of all chapters and pages and add to the sidbar navigation
  		$(toc[10]).find('ol li ol li ol').remove();
  		$('.sidebar-nav').html($(toc[10]).children().children());

  		//cycle through each chapter
  		$.each($('.sidebar-nav > li'),function(i,val){
  			//cycle through each chapter page
  			var chEle = val;
  			//create array of links in book obj
  			var obj = {chlink:$(val).children('a').attr('href'),pglinks:[]};
  			book.chapters.push(obj);

  			$.each($(chEle).find('ol li *'),function(j,valu){
  				//add chapter pages to array
  				book.chapters[i].pglinks.push($(valu).attr('href'));
  			});

  			//give every chapter a class and an arrow for drop down.
  			$(val).addClass('chapter');
  			$(val).prepend('<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>');

  			//give first link a ch-title  id for clicking at refresh
  			if(i === 0){
  				$(val).attr('id','ch-title');
  			}
  		});

  		//give arrows an event to drop down chapter pages
  		$(".glyphicon").on('click',function(e){
			$(this).siblings('ol').slideToggle(300);
			if($(this).hasClass('glyphicon-chevron-down')){
				$(this).removeClass('glyphicon-chevron-down');
				$(this).addClass('glyphicon-chevron-left');
			}
			else{
				$(this).addClass('glyphicon-chevron-down');
				$(this).removeClass('glyphicon-chevron-left');
			}
		});

		//give chapter and page links listeners that update iframe in page content area
		$(".sidebar-nav a").click(function(e){
			e.preventDefault();
			$('#menu-toggle').trigger('click');
			$('.loader').show();
			var link = $(this).attr("href");
			findPos(link);
			loadPageHTML(link);
		});

		if (typeof(Storage) !== "undefined") {
    	// Code for localStorage/sessionStorage.
    		if(localStorage.chPos && localStorage.pgPos){
    			console.log('Have local variables');
    		}
    		else{
    			console.log('Made local variables');
    			localStorage.chPos = chPos;
    			localStorage.pgPos = pgPos;
    		}
    		//after loading TOC open first chapter
			loadPageHTML(book.chapters[localStorage.chPos].pglinks[localStorage.pgPos]);
		} 
		else {
    		// Sorry! No Web Storage support..
    		console.log("No Web storage support");
    		//after loading TOC open first chapter
			loadPageHTML(book.chapters[chPos].pglinks[pgPos]);
		}

	});
}