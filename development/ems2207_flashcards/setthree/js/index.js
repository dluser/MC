var questions = ["BLS","c&#772;","Ca++","CPAP","DVT","ETT","GSW","HTN","IO","IVP","kg","L&D","mcg","MOI","NIDDM","NOI","per","PO","psi","ROM","RUE","s&#772;","UOA","-pathy","-cardium","osteo-","tachy-","phag-","lip-","hist-, histi-"];
var answers =   ["basic life support","with","calcium","continuous positive airway pressure","deep vein thrombosis","endotracheal tube","gun shot wound","hypertension","intraosseous","IV push","kilogram","labor and delivery","microgram","mechanism of injury","non-insulin-dependent diabetes mellitus","nature of illness","by","orally","per square inch","range of motion","right upper extremity","without","upon our arrival","disease","heart","bone","rapid, swift","to eat","fat","tissue"];
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