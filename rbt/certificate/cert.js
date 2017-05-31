var userId = document.getElementById("cert_studentId").textContent;
var course_ID = document.getElementById("cert_courseId").textContent; 
var dateDisplay = document.getElementById("cert_date");
var studentNameDisplay = document.getElementById("cert_student");
var studentName = studentNameDisplay.textContent;
var studentData;
var studentStartDate;
var xhr = new XMLHttpRequest();

studentName = formatName(studentName);
studentNameDisplay.textContent = studentName;
xhr.onreadystatechange = processRequest;
xhr.open("GET", "/learn/api/public/v1/courses/"+course_ID+"/users/"+userId, true);
xhr.send();

function processRequest(){
	try{
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status === 200){
                studentData = JSON.parse(xhr.response);
                writeStartDate();
            }
            else{
                console.log(xhr.status);
            }
        }
	}
    catch( e ){
        console.log("Error of: "+e.description);
    }
}

function writeStartDate(){
	studentData.created = studentStartDate;
    studentStartDate = new Date();
    studentStartDate = studentStartDate.toDateString();
    studentStartDate = studentStartDate.slice(4);
    dateDisplay.textContent = studentStartDate;
	console.log(studentStartDate);
}

function formatName(str){
	var nameArr;
	nameArr = str.split(" ");
	for(var i = 0; i < nameArr.length; i++){
		nameArr[i] = nameArr[i].toLowerCase();
		nameArr[i] = nameArr[i].charAt(0).toUpperCase() + nameArr[i].slice(1);
	}
	return nameArr.join(" ");
}