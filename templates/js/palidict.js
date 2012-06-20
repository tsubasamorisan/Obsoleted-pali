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
    dt.innerHTML = {{_("'Show Pāli Keypad'")|safe}};
  }
  else {
    kb.style.display = "inline";
    dt.innerHTML = {{_("'Hide Pāli Keypad'")|safe}};
    kb.style.left = getOffset(dt).left +"px";
  }
}

// http://www.web-code.org/coding-tools/javascript-escape-unescape-converter-tool.html
function showAbout(){document.getElementById("result").innerHTML = document.getElementById("about").innerHTML;}
function showLink(){document.getElementById("result").innerHTML = document.getElementById("link").innerHTML;}

function lookup() {
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
document.getElementById('result').innerHTML={{_("'Looking Up...'")|safe}};
xmlhttp.open("POST","/lookup",true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send("word=" + encodeURI(document.getElementById('PaliInput').value));
}

// Dynamically retrieve Html element (X,Y) position with JavaScript
// http://stackoverflow.com/questions/442404/dynamically-retrieve-html-element-x-y-position-with-javascript
function getOffset( el ) {
  var _x = 0;
  var _y = 0;
  while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    if (navigator.userAgent.indexOf('WebKit') >= 0) {el = el.parentNode;}
    else {el = el.offsetParent;}
  }
  return { top: _y, left: _x };
}

// hide popup div when clicking outside the div
// http://www.webdeveloper.com/forum/showthread.php?t=98973
document.onclick = check;
// Event accessing
// http://www.quirksmode.org/js/events_access.html
// Event properties
// http://www.quirksmode.org/js/events_properties.html
function check(e){
  var target = (e && e.target) || (event && event.srcElement); 
  var langDropdownMenuDiv = document.getElementById("menuDiv-lang-dropdown"); 
  var langDropdown = document.getElementById("lang-dropdown"); 

  if (!checkParent(target, "menuDiv-lang-dropdown")) {
    if (checkParent(target, "lang-dropdown")) {
      if (langDropdownMenuDiv.style.display == "none") {
        langDropdownMenuDiv.style.left = getOffset(langDropdown).left +"px";
        langDropdownMenuDiv.style.top = (getOffset(langDropdown).top + langDropdown.offsetHeight +3) +"px";
        langDropdownMenuDiv.style.display = "";
      } else {langDropdownMenuDiv.style.display = "none";}
    } else {
      langDropdownMenuDiv.style.display = "none";
    }
  }
}
function checkParent(t,id) {
  /* Chrome and Firefox use parentNode, while Opera use offsetParent */
  while(t.parentNode) { 
    if( t == document.getElementById(id) ) {return true;} 
    t = t.parentNode;
  } 
  while(t.offsetParent) { 
    if( t == document.getElementById(id) ) {return true;} 
    t = t.offsetParent;
  } 
  return false;
}
