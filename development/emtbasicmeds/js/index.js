//Get random int function
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

$(function()
	{

		var counter = 0;
		var qcounter = 1;
		var start = false;
		var start2 = false;
		var random = false;
		var prevcounter = [];

	    $('._1').click(function()
	    	{
		    	random = false;
		    	//If card clicked was a question
		    	if($('._1').hasClass('current'))
			  		{
			  			//Remove animation classes to prep for swipe. Put front card to the back and show back card.
					  	$(this).removeClass('current');
					  	$(this).find('.front').removeClass('fadeOutRight');
					  	$(this).find('.front').css("z-index", 0);
						$(this).find('#back2').removeClass('fadeOutRight');

				     	//Check to see if we have reached the end of the keys in obj...
				     	if(qcounter === questions.length-1)
				     		{
				     			counter++; qcounter = 0;
				     		}

				     	//Move through question loop
				     	else
				     		{
				     			qcounter ++;
				     		}

				     	//Check to see if we are at end of obj array
				     	if(counter >= answers.length)
				     		{
								counter = 0;
								qcounter = 0;
							}

						//Start with picture if qcounter is at beginning
						if(qcounter === 0)
							{
								$(".front").html("<img src = 'img/"+answers[counter].name+".jpg'/>");
								qcounter = 1;
							}

						//Change comment key to make a statement and not a question
						else if(questions[qcounter]==="comments")
							{
								$(".front").html("<p>"+answers[counter].name +" "+ questions[qcounter]+": "+"</p>");
							}

						//Display question data based on keys from questions[]
						else
							{
								$(".front").html("<p>"+answers[counter].name +" "+ questions[qcounter]+"?"+"</p>");
							}
			 		}

			 	//If card clicked was an answer...Hide answer. Show question.
				else
			 		{
			 			//if we are on starting card and not clicking random...hide front show back but don't add current class...
					 	if(start === false)
							{
								$(this).find('.front').removeClass('fadeOutRight');
				     			$(this).find('.front').css("z-index", 0);
				     			$(this).find('#back2').removeClass('fadeOutRight');
				     			start = true;
				     			$(".front").html("<img src = 'img/"+answers[0].name+".jpg'/>");
							}

						//If we are on second start screen add current class and animate "Answers are green." swipe.
						else if(start2 === false)
							{
								$(this).addClass('current');
								$(this).find('.front').css("z-index", 1);
								$(this).find('#back2').addClass('fadeOutRight visible');
								$(".back").html("<p>"+answers[counter][questions[qcounter]]+"</p>");
								$("#back2").html("<p>Answers are green.</p>");
								start2 = true;
							}

						//Normal loop when clicking on answer. Hide answer. Show question.
						else
							{
								$(this).addClass('current');
								$(this).find('.front').css("z-index", 1);
								$(this).find('#back2').addClass('fadeOutRight visible');
								$(".back").html("<p>"+answers[counter][questions[qcounter]]+"</p>");
								$("#back2").html("<p>"+answers[counter][questions[qcounter-1]]+"</p>");

								//Changes #back2 animation to match what .back was previously.
								if(qcounter-1 === 0)
									{
										if(counter === 0)
											{
												$("#back2").html("<p>"+answers[answers.length-1][questions[questions.length-1]]+"</p>");
											}
										else
											{
												$("#back2").html("<p>"+answers[counter-1][questions[questions.length-1]]+"</p>");
											}
									}
							}
			 		}

				$('#front2').removeClass('fadeOutRight visible');
			});




  
  		//randombutton
		$('#randombtn').click(function()
			{	
				//temp variables for sliding anims
				var tempq = qcounter;
		  		var tempcounter = counter;

		  		//make sure random button doesn't repeat meds and doesn't repeat previous med
		  		var ranstart = getRandomInt(0,answers.length);
		  		while(ranstart === tempcounter || ranstart === prevcounter[0])
		  			{
		  				ranstart = getRandomInt(0,answers.length);
		  			}
		  		prevcounter.push(ranstart);

		  		//store prev and current random value. Only stores two most recent values
		  		if(prevcounter.length > 2)
		  			{
		  				prevcounter = prevcounter.splice(1,2);
		  			}
		  		console.log(prevcounter);

		  		//start loop at random starting point
		  		qcounter = 1;
			    counter = ranstart;
			    random = true;

			    //remove all animation classes
			    $('.front').removeClass('fadeOutRight');
			    $('#back2').removeClass('fadeOutRight visible');
			    $('#front2').removeClass('fadeOutRight visible');

			    //Animation setup for front card if random is clicked when it is showing.
			    if($('._1').hasClass('current'))
			    	{
			    		$("#front2").html("<p>"+answers[tempcounter].name +" "+ questions[tempq]+"?"+"</p>")
			    		$('#front2').addClass('visible fadeOutRight');
			    		if(tempq === 1)
			    			{
			    				$("#front2").html("<img src = 'img/"+answers[tempcounter].name+".jpg'/>");
			    			}
			    	}

			    //Animation setup for front card if user is on start screen.
			    else if(start === false)
					{
						$("#front2").html("<p>Basic EMT Medications</p>");
						$('#front2').addClass('visible fadeOutRight');
					}

				//Animation setup. Uses temp variables to display swipe animations of previous cards.
			    else
			    	{
			    		$("#back2").html("<p>"+answers[tempcounter][questions[tempq-1]]+"</p>");
			    		$('#back2').addClass('visible fadeOutRight');
			    	}

			    //Set the new starting point with the current class. Show front card. Initiate correct front and back data.
				$('._1').addClass('current');
				$('.front').css("z-index", 1);
				$(".front").html("<img src = 'img/"+answers[counter].name+".jpg'/>");
				$(".back").html("<p>"+answers[counter][questions[qcounter]]+"</p>");

				//Prevent random data spam
				document.getElementById("randombtn").disabled = true;
				setTimeout(
					function()
						{
						$('#front2').removeClass('fadeOutRight visible');
						document.getElementById("randombtn").disabled = false;
						}, 900);

				//Prevent start screen logic.
				start = true;
				start2 = true;

  			});	
	});