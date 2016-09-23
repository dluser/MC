var questions = ["♂","♀","a&#772;","AMI","c/o","D/C","ET","FX, Fx, fx","HEENT","IDDM","IVPB","JVD","LLQ","mL","Na+","PEA","PERL","PMHx","q&#772;","R/O","RUQ","SL","Tx","-emia","-tomy","-algia","mast-","brady-","oste-","hyper-"];
var answers =   ["male","female","before","acute myocardial infarction","Complains of","discontinue","endotracheal","fracture","head, eyes, ears, nose, and throat","insulin-dependent diabetes mellitus","intravenous piggyback","jugular venous distention","left lower quadrant","milliliter","sodium","pulseless electrical activity","pupils equal and reactive to light","past medical history","every","rule out","right upper quadrant","sublingual","treatment","condition of the blood","surgical operation on, surgical cutting of","pain","breast","slow","bone","fast or rapid, in excess"];
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