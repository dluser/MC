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
		changePos("previous");
	    $("#wrapper").removeClass("toggled");
	});

	$("#next").click(function(){
		changePos("next");
		$("#wrapper").removeClass("toggled");
	});

	//monitor iframe height
	var myInterval = setInterval(function(){
		try{
			if($('#idIframe')){
				var iFrame = $('#idIframe');
				var h = iFrame[0].contentWindow.document.body.clientHeight;
				if(h !== iFrame.height())
				{
					iFrame.css({'height':h + 'px'});
				}
			}
		}
		catch(err){
			//console.log(err);
		}
	},1000);
});
//function to call on iframe load. wait half a second for inside content to load and calculate inner height. still messing with this one.
function iFrameLoad(){
	var iFrame = $('#idIframe');
	var h = iFrame[0].contentWindow.document.body.clientHeight + 20 + "px";
	var iframea = iFrame.contents().find("a");
	iFrame.height = "";
	iFrame.css({'opacity':'1','height':h});
	$.each(iframea, function(i,val){
		var href = $(val).attr('href');
		if(href !== undefined){
			if(href[0] !== '.' || href[3] === 'g'){
				$(val).attr('target','_blank');
			}
		}
	});
	$('.loader').hide();
}

//navigate book with next and previous buttons by changing chPos and pgPos variables
function changePos(direc){
	//find the current link in book obj and update ch and pg positions
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

//find the link within the book TOC
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

//insert page content iframe
function loadPageHTML(lin){
	$('.loader').show();
	lin = 'eng_export/OPS/' + lin;
	$('#book-content').html('<iframe onload = "iFrameLoad()" scrolling = "no" id = "idIframe" src ="'+lin+'"></iframe>');

	//show list and highlight current position
	$('.chapter a').css('color','#999999');
	var place = $($('.chapter')[chPos]);
	$(place).find('ol').slideDown(300);
	$(place).children('.glyphicon').removeClass('glyphicon-chevron-left');
	$(place).children('.glyphicon').addClass('glyphicon-chevron-down');
	$($(place).find('ol li')[pgPos]).children('a').css('color','#439CC8');
}

//if localStorage is supported. update local with temporary variables
function updateLocStorage(){
	if (typeof(Storage) !== "undefined") {
		localStorage.EngpgPos = pgPos;
		localStorage.EngchPos = chPos;
	}
}

//get TOC, inject TOC, add listeners. Create book obj for tracking navigation.
function setUpTOC(){
	$.get( "eng_export/OPS/index.html","html", function(data) {	
  		//parse into html
  		toc = $.parseHTML(data);
  		//find the list of all chapters and pages and add to the sidbar navigation
  		$(toc[10]).find('ol li ol li ol ol').remove();
  		$('.sidebar-nav').html($(toc[10]).children().children().children().children());

  		//cycle through each chapter
  		$.each($('.sidebar-nav > li'),function(i,val){ 
  			//create array of links in book obj
  			var obj = {chlink:$(val).children('a').attr('href'),pglinks:[]};
  			book.chapters.push(obj);

  			$.each($(val).find('ol li *'),function(j,valu){
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

  		$(".chapter a").on('click',function(e){
			$(this).siblings('ol').slideDown(300);
			if($(this).siblings('span').hasClass('glyphicon-chevron-left')){
				$(this).siblings('span').removeClass('glyphicon-chevron-left');
				$(this).siblings('span').addClass('glyphicon-chevron-down');
			}
		});

  		//give arrows an event to drop down chapter pages
		$(".chapter .glyphicon").on('click',function(e){
			$(this).siblings('ol').slideToggle(300);
			if($(this).hasClass('glyphicon-chevron-left')){
				$(this).removeClass('glyphicon-chevron-left');
				$(this).addClass('glyphicon-chevron-down');
			}
			else{
				$(this).removeClass('glyphicon-chevron-down');
				$(this).addClass('glyphicon-chevron-left');
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

		$($('.chapter')[0]).before("<li class = 'ch-divide'>Part 1: Introduction to College Writing</li>");
		$($('.chapter')[3]).after("<li class = 'ch-divide'>Part 2: Writing Processes</li>");
		$($('.chapter')[10]).after("<li class = 'ch-divide'>Part 3: 1101 Genres</li>");
		$($('.chapter')[18]).after("<li class = 'ch-divide'>Part 4: Analysis and Critical Thinking</li>");
		$($('.chapter')[25]).after("<li class = 'ch-divide'>Part 5: Argumentative Writing</li>");
		$($('.chapter')[29]).after("<li class = 'ch-divide'>Part 6: Research Process, MLA and APA</li>");

		//check for local storage and create/load local storage page
		if (typeof(Storage) !== "undefined") {
    	// Code for localStorage/sessionStorage.
    		if(localStorage.EngchPos && localStorage.EngpgPos){
    			console.log('Local variables available');
    			chPos = localStorage.EngchPos;
    			pgPos = localStorage.EngpgPos;
    		}
    		else{
    			console.log('Made local variables');
    			localStorage.EngchPos = chPos;
    			localStorage.EngpgPos = pgPos;
    		}
    		//after loading TOC open first chapter
			loadPageHTML(book.chapters[localStorage.EngchPos].pglinks[localStorage.EngpgPos]);
		} 
		else {
    		// Sorry! No Web Storage support..
    		console.log("No Web storage support");
    		//after loading TOC open first chapter
			loadPageHTML(book.chapters[chPos].pglinks[pgPos]);
		}

	});
}