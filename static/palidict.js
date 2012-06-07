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
function showAbout(){document.getElementById("result").innerHTML = document.getElementById("about").innerHTML;}
function showLink(){document.getElementById("result").innerHTML = document.getElementById("link").innerHTML;}
function showContact(){document.getElementById("result").innerHTML = document.getElementById("contact").innerHTML;}

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
