var data = {
	browsers:{
		desktop:{
			chrome:36,
			msedge:20,
			firefox:31,
			msie:11,
			safari:6
		},
		mobile:{
			android:4,
			chrome:35,
			msedge:20,
			safari:6
		}
	},
	os:{
		mac:true,
		windows:true,
		windowsphone:true,
		chromeos:true,
		ios:true,
		android:true
	},
	jre:{
		chrome:45,
		firefox:52,
		msedge:0
	}
}

function checkBrowser(status, rec, statusEle, recEle, targetRow){
	var deskBrow = data.browsers.desktop;
	var mobBrow = data.browsers.mobile;
	targetRow.addClass("bad");
	if(bowser.mobile || bowser.tablet){
		status = "Mobile - " + status;
		rec = cycleBrow(mobBrow,true);
	}

	else{
		status = "Desktop - " + status;
		rec = cycleBrow(deskBrow,false);
	}

	function cycleBrow(obj,mobile){
		for(var i in obj){
			if(bowser[i] && bowser.version > obj[i]){
				targetRow.attr("class","good");
				return "Your browser is supported.";
			}
		}
		if(mobile){
			return "Your browser is not currently supported. Please download a current version of Chrome, Safari, Android Browser, or Microsoft Edge."; 
		}
		return "Your browser is not currently supported. Please download a current version of Chrome, Firefox, Safari, or Microsoft Edge.";
	}

	statusEle.html(status);
	recEle.html(rec);
}

function checkOS(status, rec, statusEle, recEle, targetRow){
	var os = data.os;
	targetRow.addClass("bad");

	for (var i in os){
		if(bowser[i]){
			status = i.toUpperCase() + " - " + status;
			targetRow.attr("class","good");
			rec = "Your operating system is supported.";
			break;
		}
	}
	statusEle.html(status);
	recEle.html(rec);
}

function checkCookies(status, rec, statusEle, recEle, targetRow){
	targetRow.addClass("bad");
	if(Modernizr.cookies){
		rec = "Cookies are enabled on this browser.";
		status = "Enabled";
		targetRow.attr("class","good");
	}
	statusEle.html(status);
	recEle.html(rec);
}

function checkFlash(status, rec, statusEle, recEle, targetRow){
	targetRow.addClass("bad");
	if(Modernizr.flash){
		status = "Enabled";
		rec = "Your browser is capable of running legacy Flash content.";
		targetRow.attr("class","good");
	}
	statusEle.html(status);
	recEle.html(rec);
}

function checkJava(status, rec, statusEle, recEle, targetRow){
	targetRow.addClass("bad");
	var versions = deployJava.getJREs();
	if(bowser.safari || bowser.msie){
		rec = "Your browser has either disabled the Java plugin or you are running an outdated version of the Java environment. Either enable Java in your browser or download version 7+.";
		status = "Disabled/Outdated";
	}
	versions.forEach(function(i){
		var v = parseInt(i[2]);
		if(v >= 7){
			targetRow.attr("class","good");
			status = "Enabled";
			rec = "You are running a current version of Java and will be able to use all Blackboard features.";
		}
	});
	statusEle.html(status);
	recEle.html(rec);
}

checkBrowser(bowser.name + " " + bowser.version, "" ,$("#browser td:nth-child(2)"),$("#browser td:nth-child(3)"),$("#browser"));
checkOS(bowser.osversion,"Your operating system has not been thoroughly tested with Blackboard.",$("#os td:nth-child(2)"),$("#os td:nth-child(3)"),$("#os"));
checkCookies("Disabled","Cookies are not enabled on this browser.",$("#cookies td:nth-child(2)"),$("#cookies td:nth-child(3)"),$("#cookies"));
checkFlash("Disabled","Your browser will not be able to run legacy Flash content. If you would like to access legacy content, enable Flash in your browser settings",$("#flash td:nth-child(2)"),$("#flash td:nth-child(3)"),$("#flash"));
checkJava("Unavailable","Your browser does not support NPAPI plugins and will not be able to run some features in Blackboard.",$("#java td:nth-child(2)"),$("#java td:nth-child(3)"),$("#java"));






