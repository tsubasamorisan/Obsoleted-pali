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
    dt.innerHTML = getStringShowKeypad();
  }
  else {
    kb.style.display = "inline";
    dt.innerHTML = getStringHideKeypad();
    kb.style.left = getOffset(dt).left +"px";
  }
}

// http://www.web-code.org/coding-tools/javascript-escape-unescape-converter-tool.html
function showAbout(){document.getElementById("result").innerHTML = document.getElementById("about").innerHTML;}
function showLink(){document.getElementById("result").innerHTML = document.getElementById("link").innerHTML;}

function onPaliInputSubmit() {
  if (queryURL.jsonp == "yes") {JSONPlookup(document.getElementById('PaliInput').value);}
  else {lookup();}
}

function lookup() {
  var xmlhttp;
  if (window.XMLHttpRequest) {xmlhttp=new XMLHttpRequest();}
  else {xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
  xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        //document.getElementById('').innerHTML=xmlhttp.status;
        //document.getElementById('').innerHTML=xmlhttp.statusText;
        document.getElementById('result').innerHTML=xmlhttp.responseText;
      } else {
        document.getElementById('result').innerHTML='XMLHttpRequest error!';
      }
    }
  }
  document.getElementById('result').innerHTML = getStringLookingUp();
  if (queryURL.lookup == "gae") {xmlhttp.open("POST","http://palidictionary.appspot.com/lookup",true);}
  else if (queryURL.lookup == "paw") {xmlhttp.open("POST","http://siongui.pythonanywhere.com/lookup",true);}
  else if (queryURL.lookup == "wfn") {xmlhttp.open("POST","http://siongui.webfactional.com/lookup",true);}
  else {xmlhttp.open("POST","/lookup",true);}
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send("word=" + encodeURI(document.getElementById('PaliInput').value));
}

// http://www.onlinesolutionsdevelopment.com/blog/web-development/javascript/jsonp-example/
// http://www.slideshare.net/andymckay/cross-domain-webmashups-with-jquery-and-google-app-engine
function JSONPlookup(paliword) {
  url = "/lookup?callback=JSONPlookupCallback&word=" + encodeURIComponent(paliword);
  var ext = document.createElement('script');
  ext.setAttribute('src', url);
  if (typeof ext != "undefined") {document.getElementsByTagName("head")[0].appendChild(ext);}
}

function JSONPlookupCallback(result) {
  document.getElementById('result').innerHTML = decodeURIComponent(result);
}

// Dynamically retrieve Html element (X,Y) position with JavaScript
// http://stackoverflow.com/questions/442404/dynamically-retrieve-html-element-x-y-position-with-javascript
function getOffset( el ) {
  var _x = 0;
  var _y = 0;
  while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
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
