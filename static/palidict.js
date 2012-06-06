$(document).ready(function() {
  <!-- make keypad draggable -->
  $("#keyboard").draggable();

  <!-- bind the click function of input element inside keypad -->
  $("#keyboard input").bind("click", function(e) {
    document.getElementById("PaliInput").value += this.value;
    document.getElementById("PaliInput").focus();
  });
});


//<!-- make keypad show if hidden, hide if shown -->
function toggle() {
  var kb = document.getElementById("keyboard");
  var dt = document.getElementById("displayText");
  if(kb.style.display == "inline") {
    kb.style.display = "none";
    dt.innerHTML = "Show Pāli Keypad";
  }
  else {
    kb.style.display = "inline";
    dt.innerHTML = "Hide Pāli Keypad";
  }
}
//<!-- http://www.web-code.org/coding-tools/javascript-escape-unescape-converter-tool.html -->
function showAbout() {
  var rt = document.getElementById("result");
  rt.innerHTML = unescape(
"%3Cbr%20/%3E%3Cbr%20/%3E%3Cp%20style%3D%22padding-left%3A30px%3B%20padding-right%3A30px%22%3EThe%20dictionary%20come%20from%20%3Ca%20href%3D%22http%3A//online-dhamma.net/anicca/pali-course/Pali-Chinese-English%2520Dictionary.html%22%3EPali-Chinese-English%20Dictionary%3C/a%3E.%20The%20version%20is%20%22Pali%20Dict%20Linux%20Web%20Ver%201.0%22.%20This%20site%20is%20still%20under%20development%20so%20errors%20may%20be%20encountered.%20If%20any%20questions%20or%20suggestions%2C%20please%20%3Ca%20href%3D%22/contact%22%3Econtact%20me%3C/a%3E.%3C/p%3E"
);
}
function showLink() {
  var rt = document.getElementById("result");
  rt.innerHTML = unescape(
"%3Cbr%20/%3E%3Cbr%20/%3E%0A%3Cdiv%20align%3D%22left%22%20style%3D%22padding-left%3A30px%3B%20padding-right%3A30px%22%3E%0ASource%20Code%20%3A%20%3Ca%20href%3D%22http%3A//code.google.com/p/pali/%22%3Epali%3C/a%3E%20project%20on%20Google%20Code%3Cbr%20/%3E%0ADictionary%20%3A%20from%20%22Pali%20Dict%20Linux%20Web%20Ver%201.0%22%20on%20%3Ca%20href%3D%22http%3A//online-dhamma.net/anicca/pali-course/Pali-Chinese-English%2520Dictionary.html%22%3EPali-Chinese-English%20Dictionary%3C/a%3E%3Cbr%20/%3E%0A%3Cbr%20/%3E%0AOther%20links%20about%20Buddhism%3A%3Cbr%20/%3E%0A%3Ca%20href%3D%22http%3A//www.theravadacn.org/DhammaIndex2.htm%22%3E%u89BA%u9192%u4E4B%u7FFC%3C/a%3E%3Cbr%20/%3E%0A%3Ca%20href%3D%22http%3A//www.wpp-branches.net/cn/index.php%22%3E%u5DF4%u84EC%u5BFA%u5206%u9662%3C/a%3E%3Cbr%20/%3E%0A%3Ca%20href%3D%22http%3A//www.dhamma.net.cn/%22%3E%u89BA%u609F%u4E4B%u8DEF%3C/a%3E%3Cbr%20/%3E%0A%3C/div%3E%0A"
);
}
function showContact() {
  var rt = document.getElementById("result");
  rt.innerHTML = unescape(
"%3Cbr%20/%3E%3Cbr%20/%3EMy%20Email%20%3A%20%3Cimg%20src%3D%22/static/mail.png%22%20/%3E"
);
}

function lookup() {
//document.getElementById('result').innerHTML = document.getElementById('PaliInput').value;
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    //document.getElementById('').innerHTML=xmlhttp.status;
    //document.getElementById('').innerHTML=xmlhttp.statusText;
    document.getElementById('result').innerHTML=xmlhttp.responseText;
    }
  }
xmlhttp.open("POST","/lookup",true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send("word=" + encodeURI(document.getElementById('PaliInput').value));
}
