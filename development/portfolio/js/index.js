
var loc = 0;
$(document).ready(function(){

$("#right").click(function(){
  if(loc!==480){
    loc+=160;
  $("#slide").animate({
  right:"+=160%"
}, 400, "linear", function() {
});}
});
$("#left").click(function(){
  if(loc!==0){
    loc-=160;
  $("#slide").animate({
  right:"-=160%"
}, 400, "linear", function() {
});}
});



});
