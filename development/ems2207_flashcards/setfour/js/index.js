var questions = ["ARDS","BSA","CABG","CAD","CXR","ESRD","FBAO","gtt","h","Hx","IV","IVR","KCl","LUQ","MCI","mEq","NaHCO3","NKDA","PICU","PR","RLQ","RR","WBC","W/O","-ectomy","-ectasis","arthr-","encephal-","phleb-","ophthalm-"];
var answers =   ["adult respiratory distress syndrome","body surface area","coronary artery bypass graft","coronary artery disease","chest x-ray","end-stage renal disease","foreign body airway obstruction","drop(fluid - IV drop rates)","hour","history","intravenous","idioventricular rhythm","potassium chloride","left upper quadrant","mass casualty incident; multiple casualty incident","milliequivalent","sodium bicarbonate","no known drug allergies","pediatric intensive care unit","per rectal","right lower quadrant","respiratory rate","white blood count","without","surgical removal of","stretching, dilation","joint","brain","vein","eye"];
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