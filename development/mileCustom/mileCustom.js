var bookData = {'The History of New Mexico':{description:'New Mexico has a deep and rich history, dating back thousands of years. Through life in a place defined by arid landscapes and relative isolation, New Mexico&#39;s peoples have developed a strong regional culture through recurring cycles of contact, violence, and accommodation. This CNM Multimedia Interactive Learning Experience (CNM MILE) provides a multifaceted look at New Mexico&#39;s past through many different perspectives, including those of ethnicity, culture, gender, and class. The complexities of the state&#39;s past suggest that there is no such thing as a single New Mexico History. Instead, this work invites readers to explore New Mexico&#39;s varied—and often conflicting—histories.',author:'Brandon Morgan',price:'$49.95',coverImage:'/media/nmh_final_cover_300px_dvuqbM2.png',mobileImage:'/media/nmh_mobile_400_1.jpeg',bgImage:'https://i.imgur.com/YGM07bu.jpg'},
'English 1101 and 1102':{description:'The English 1101 and 1102 textbook is a free open educational resource (OER) that functions as a reader for College Writing (ENG 1101) and Analytic Writing (ENG 1102). This textbook helps students navigate college reading and writing with sections on the writing process, genres, analytic writing, argumentative writing, research, MLA style, APA style, and grammar and mechanics.',author:'Schaller J. Wolf T.', price:'Free',coverImage:'/media/english_cover_thumbnail_lRElK9S.jpg',mobileImage:'/media/english_cover_thumbnailbanner_nk6IoZD.jpg',bgImage:'https://i.imgur.com/NCYCr5o.jpg'}};


$(function(){

	function preloadBGimg(){
		$('body').append('<div id = "preloadIMG"></div>');
		var titles = Object.keys(bookData);
		for(var i = 0; i < titles.length; i++){
			$('#preloadIMG').append('<img src = "'+bookData[titles[i]].bgImage+'"/>');
		}
		$('#preloadIMG').css('display','none');
	}

	function switchFeature(title){
		$("html, body").animate({scrollTop: 0}, 300); 
		$(".jumbotron").fadeOut(100,function(){
			$('.featured-copy').html("<h3>"+title+"</h3>");
			$('.featured-copy').append("<p>Author: "+bookData[title].author+"</p><p>Available to: CNM</p>"+"<p>"+bookData[title].price+"</p>"+"<p>"+bookData[title].description+"</p>");
			$('.featured-image .desktop-image').attr('src',bookData[title].coverImage);
			$('.featured-image .phone-image').attr('src',bookData[title].mobileImage);
			$('.row.featured').css({'background-image':"linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.2)), url("+bookData[title].bgImage+")"});
		});
		$('.jumbotron').fadeIn(300);
	}

	$('.product-list .cover-image').click(function(){
		switchFeature($(this).parent().find('h5').html());
	});
	$('.row .product-list .product .cover-image').css({'cursor':'pointer'});
	$('select').removeAttr('multiple');
	preloadBGimg();

});