var myVar = setInterval(myTimer ,0);
function myTimer() {
  var date = new Date();
  var month = new Array(12);
  month[0] = "1";
  month[1] = "2";
  month[2] = "3";
  month[3] = "4";
  month[4] = "5";
  month[5] = "6";
  month[6] = "7";
  month[7] = "8";
  month[8] = "9";
  month[9] = "10";
  month[10] = "11";
  month[11] = "12";
  document.getElementById("year").innerHTML = date.getFullYear();
  document.getElementById("month").innerHTML = month[date.getMonth()];
  document.getElementById("day").innerHTML = date.getDate();
  document.getElementById("hours").innerHTML = date.getHours();
  document.getElementById("minutes").innerHTML = date.getMinutes();
  document.getElementById("seconds").innerHTML = date.getSeconds(); document.getElementById("milliseconds").innerHTML= date.getMilliseconds();
}