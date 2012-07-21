pali.require('base');
pali.require('dropdown');
pali.require('draggable');
pali.require('inputsuggest');

/**
 * simple dom ready
 * @see http://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery
 * @see http://www.javascriptkit.com/dhtmltutors/domready.shtml
 * @see https://github.com/jquery/jquery/blob/master/src/core.js
 * @see https://github.com/ded/domready/
 * @see http://code.google.com/p/domready/
 */

var domIsReady = false;


if ( document.readyState === "complete" || ( document.readyState !== "loading" && document.addEventListener ) ) {
  if (!domIsReady) {domIsReady = true;domReady();}
} else if ( document.addEventListener ) {
document.addEventListener( "DOMContentLoaded", function(){if (!domIsReady) {domIsReady = true;domReady();}}, false );
window.addEventListener( "load", function(){if (!domIsReady) {domIsReady = true;domReady();}}, false );
// If IE event model is used
} else {
document.attachEvent( "onreadystatechange", function(){if (!domIsReady) {domIsReady = true;domReady();}} );
window.attachEvent( "onload", function(){if (!domIsReady) {domIsReady = true;domReady();}} );
}

function domReady() {
  document.getElementById('PaliInput').focus();

  // start input suggest
  var suggest = new pali.InputSuggest("PaliInput", "suggest");

  // start dropdown menu
  var langDropdown = new pali.Dropdown('lang-dropdown', 'menuDiv-lang-dropdown');
  var siteDropdown = new pali.Dropdown('site-dropdown', 'menuDiv-site-dropdown');

  // check users are now at which site, and fill site innerHTML
  if (window.location.host == 'siongui.pythonanywhere.com')
    {document.getElementById('site').innerHTML = getStringBackupSite1();}
  else if (window.location.host == 'siongui.webfactional.com')
    {document.getElementById('site').innerHTML = getStringBackupSite2();}
  else {document.getElementById('site').innerHTML = getStringMainSite();}
  document.getElementById('site').style.wordSpacing = "normal";

  // check user's locale, and fill lang innerHTML
  var locale = document.getElementById('locale').innerHTML;
  if (locale == 'zh_CN') {document.getElementById('lang').innerHTML = '中文 (简体)';}
  else if (locale == 'zh_TW') {document.getElementById('lang').innerHTML = '中文 (繁體)';}
  else {document.getElementById('lang').innerHTML = 'English';}
  document.getElementById('lang').style.wordSpacing = "normal";

  // make keypad draggable
  var drag = new pali.Draggable('keyboard');

  // bind the click function of input element inside keypad
  var keypad = document.getElementById('keyboard');
  var buttons = keypad.getElementsByTagName('input');
  for (var i=0; i<buttons.length; i++) {
    buttons[i].onclick = function(e) {
      document.getElementById("PaliInput").value += this.value;
      document.getElementById("PaliInput").focus();
    };
  }
}


//<!-- make keypad show if hidden, hide if shown -->
function toggle() {
  var kb = document.getElementById("keyboard");
  var dt = document.getElementById("displayText");
  if(kb.style.display == "block") {
    kb.style.display = "none";
    dt.innerHTML = getStringShowKeypad();
  }
  else {
    kb.style.display = "block";
    dt.innerHTML = getStringHideKeypad();
    kb.style.left = pali.getOffset(dt).left + "px";
  }
}

// http://www.web-code.org/coding-tools/javascript-escape-unescape-converter-tool.html
function showAbout(){document.getElementById("result").innerHTML = document.getElementById("about").innerHTML;}
function showLink(){document.getElementById("result").innerHTML = document.getElementById("link").innerHTML;}

function onPaliInputSubmit() {
  if (queryURL['jsonp'] == "no") {lookup();}
  else {JSONPlookup(document.getElementById('PaliInput').value);}
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
  if (queryURL['lookup'] == "gae") {xmlhttp.open("POST","http://palidictionary.appspot.com/lookup",true);}
  else if (queryURL['lookup'] == "paw") {xmlhttp.open("POST","http://siongui.pythonanywhere.com/lookup",true);}
  else if (queryURL['lookup'] == "wfn") {xmlhttp.open("POST","http://siongui.webfactional.com/lookup",true);}
  else {xmlhttp.open("POST","/lookup",true);}
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send("word=" + encodeURI(document.getElementById('PaliInput').value));
}

// http://www.onlinesolutionsdevelopment.com/blog/web-development/javascript/jsonp-example/
// http://www.slideshare.net/andymckay/cross-domain-webmashups-with-jquery-and-google-app-engine
function JSONPlookup(paliword) {
  document.getElementById('result').innerHTML = getStringLookingUp();
  url = "/lookup?callback=JSONPlookupCallback&word=" + encodeURIComponent(paliword);
  if (queryURL['lookup'] == "gae") {url="http://palidictionary.appspot.com"+url;}
  if (queryURL['lookup'] == "paw") {url="http://siongui.pythonanywhere.com"+url;}
  if (queryURL['lookup'] == "wfn") {url="http://siongui.webfactional.com"+url;}
  var ext = document.createElement('script');
  ext.setAttribute('src', url);
  if (typeof ext != "undefined") {document.getElementsByTagName("head")[0].appendChild(ext);}
}

function JSONPlookupCallback(result) {
  // input value is "list of 3-tuple" in Python
  document.getElementById('result').innerHTML = "";
  if (result == null) {
    document.getElementById('result').innerHTML = getStringNoSuchWord();
    return;
  }
  var resultOuterTable = document.createElement("table");
  resultOuterTable.className = "resultCurvedEdges";
  //result = eval(result);
  for (var index1 in result) {
    var dictWordExp = eval(result[index1]);
    var resultInnerTable = document.createElement("table");
    var count = 0;
    resultInnerTable.className = "dicTable";
    for (var index2 in dictWordExp) {
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      var th = document.createElement("th");
      if (count == 0) {th.innerHTML = getStringDictionary();}
      else if (count == 1) {th.innerHTML = getStringPaliWord();}
      else {th.innerHTML = getStringExplain();}
      td.innerHTML = dictWordExp[index2];
      tr.appendChild(th);
      tr.appendChild(td);
      resultInnerTable.appendChild(tr);
      if (count > 2) {console.log("in JSONPlookupCallback: something strange. count > 2");}
      count += 1;
    }
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.appendChild(resultInnerTable);

    var backToTop = document.createElement("a");
    backToTop.href = '/';
    backToTop.onclick = function(e){window.scrollTo(0,0);return false;};
//    backToTop.href = "javascript:window.scrollTo(0,0);";
    backToTop.style.textDecoration = "none";
    backToTop.style.color = "#00C";
    backToTop.style.fontSize = "small";
    backToTop.style.cursor = "pointer";
    backToTop.innerHTML = '<span style="text-decoration:underline">' + getStringBackToTop() + '</span><span style="font-size:.75em;">&#9650;</span>';
    td.appendChild(backToTop);

    tr.appendChild(td);
    resultOuterTable.appendChild(tr);
  }
  document.getElementById('result').appendChild(resultOuterTable);
}

function onSiteClick(element, flag) {
  var url = '';
  if (flag == '1') { url = 'http://palidictionary.appspot.com/'; }
  else if (flag == '2') { url = 'http://siongui.pythonanywhere.com/'; }
  else if (flag == '3') { url = 'http://siongui.webfactional.com/'; }
  else { url = 'http://palidictionary.appspot.com/'; }

  var count = 0;
  for (var key in queryURL) {
    if (count == 0) { url += '?' + key + '=' + queryURL[key]; }
    else { url += '&' + key + '=' + queryURL[key]; }
    count ++;
  }

  if (window.location.host == 'localhost:8080') {
    if (queryURL['track'] != 'no') {
      if (count == 0) { url += '?track=no'; }
      else { url += '&track=no'; }
      count ++;
    }
  }

  window.location = url;
}

function onLocaleClick(element, flag) {
  var locale = '';
  if (flag == '1') { locale = 'en_US'; }
  else if (flag == '2') { locale = 'zh_CN'; }
  else if (flag == '3') { locale = 'zh_TW'; }
  else { locale = 'en_US'; }

  queryURL['locale'] = locale;
  var count = 0;
  var url = '/';
  for (var key in queryURL) {
    if (count == 0) { url += '?' + key + '=' + queryURL[key]; }
    else { url += '&' + key + '=' + queryURL[key]; }
    count ++;
  }

  window.location = url;
}

// Store the function in a global property referenced by a string:
window['toggle'] = toggle;
window['showAbout'] = showAbout;
window['showLink'] = showLink;
window['onPaliInputSubmit'] = onPaliInputSubmit;
window['lookup'] = lookup;
window['JSONPlookup'] = JSONPlookup;
window['JSONPlookupCallback'] = JSONPlookupCallback;
window['onSiteClick'] = onSiteClick;
window['onLocaleClick'] = onLocaleClick;
