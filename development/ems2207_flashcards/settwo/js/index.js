var questions = ["Δ","1°","2°","COPD","DIC","ETOH","GSW","HPI","I&O","K+","LUE","mm Hg","NaCl","PEEP","pH","RLE","ROSC","Rx","sub-Q","TKO","-itis","-pnea","derma-","myo-","aden-","neuro-","hypo-","hydr(o)-","hepat-","glyc-"];
var answers =   ["change","primary","secondary to","chronic obstructive pulmonary disease","disseminated intravascular coagulopathy","ethyl alcohol","gunshot wound","history of present illness","intake and output","potassium","left upper extremity","millimeters of mercury","sodium chloride","positive end expiratory pressure","acidity or alkalinity","right lower extremity","return of spontaneous circulation","perscription; therapy","subcutaneous","to keep open","inflammation of, inflammatory disease of","breathing","skin","muscle","gland","nerve","slow or lacking","water","liver","sugar"];
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
var arraylength = answers.length;
$(function(){
  var maxCards = $('.card').length;
  var counter = -1;
  // turn card
  
    $('._1').click(function(){
		
	  
	  if($('._1').hasClass('flipped')){
		 $(this).addClass('flipped2');
		$(this).find('.front').addClass('hidingBack');
		
		$(this).removeClass('flipped');
		$(this).find('.front').removeClass('showingBack');
     	$(this).find('.front').css("z-index", 2);
		counter++;
		if(counter >= questions.length){
		counter = 0;	
		}
		$("#quest").html(questions[counter]);
	 }
	 
	 else{
		 
	 $(this).addClass('flipped');
      $(this).find('.front').addClass('showingBack');
	  
	  $(this).removeClass('flipped2');
		$(this).find('.front').removeClass('hidingBack');
      $(this).find('.front').css("z-index", 0);
	  
	  	
		$("#ans").html(answers[counter]);
	   
	 }
	 
	});
	
	//back button
	$('#backbtn').click(function(){
		 if($('._1').hasClass('flipped')){
		 $('._1').addClass('flipped2');
		$('._1').find('.front').addClass('hidingBack');
		
		$('._1').removeClass('flipped');
		$('._1').find('.front').removeClass('showingBack');
     	$('._1').find('.front').css("z-index", 2);
		
		if(counter >= questions.length){
		counter = 0;	
		}
		if(counter < 0)
		{
		counter = 0;	
		}
		$("#quest").html(questions[counter]);
	 }
	 
	 else{
		if(counter >0){ 
	 $('._1').addClass('flipped');
      $('._1').find('.front').addClass('showingBack');
	  counter--;
	  $('._1').removeClass('flipped2');
		$('._1').find('.front').removeClass('hidingBack');
      $('._1').find('.front').css("z-index", 0);
	  
	  	
		$("#ans").html(answers[counter]);
		}
	   
	 }
	  
   
  });
  
  //randombutton
  
  $('#randombtn').click(function(){
		 if($('._1').hasClass('flipped')){
		 $('._1').addClass('flipped2');
		$('._1').find('.front').addClass('hidingBack');
		counter = getRandomInt(0,arraylength);
		$('._1').removeClass('flipped');
		$('._1').find('.front').removeClass('showingBack');
     	$('._1').find('.front').css("z-index", 2);
		
		$("#quest").html(questions[counter]);
	 }
	 
	 else{	
	 	$('._1').addClass('flipped');
      	$('._1').find('.front').addClass('showingBack');
	  	$('._1').removeClass('flipped2');
		$('._1').find('.front').removeClass('hidingBack');
      	$('._1').find('.front').css("z-index", 0);
		$("#ans").html(answers[counter]);
	   
	 }
	  
   
  });
	
});