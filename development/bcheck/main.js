var iframe = document.getElementsByTagName("iframe");

var interval = setInterval(navCheck,200);

function navCheck(){
	iframe[0].setAttribute("src","https://ret.browserhawk.com/bhtg/ret/browsercheck.aspx?acct=embanet&customtest=CNMBB9&TB_iframe=true&height=400&width=550");
	iframe[0].src = iframe[0].src;
	clearInterval(interval);
}