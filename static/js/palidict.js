pali.require('base');
pali.require('dropdown');
pali.require('draggable');
pali.require('inputsuggest');
pali.require('lookup');


var checkReady = (function() {
  if (window.opera) {
    window.onload = domReady;
    return;
  }
  if (document.getElementById('locale')) domReady();
  else setTimeout(checkAgain, 50);
})();

function checkAgain() {
  if (document.getElementById('locale')) domReady();
  else setTimeout(checkAgain, 50);
}

function domReady() {
  // start input suggest
  var suggest = new pali.InputSuggest("PaliInput", "suggest");

  // start dropdown menu
  var langDropdown = new pali.Dropdown('lang-dropdown', 'menuDiv-lang-dropdown');
  var siteDropdown = new pali.Dropdown('site-dropdown', 'menuDiv-site-dropdown');

  var lookUrl = "/lookup";
  var jsonp = true;
  if (queryURL['lookup'] == "gae") {
    lookUrl = "http://palidictionary.appspot.com" + lookUrl;
  }
  if (queryURL['lookup'] == "paw") {
    lookUrl = "http://siongui.pythonanywhere.com" + lookUrl;
  }
  if (queryURL['lookup'] == "wfn") {
    lookUrl = "http://siongui.webfactional.com" + lookUrl;
  }
  if (queryURL['jsonp'] == "no") {
    lookUrl = "/lookup";
    jsonp = false;
  }
  var myLookup = new Lookup('PaliInput', 'inputForm', 'result', lookUrl, jsonp);

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

  document.getElementById('PaliInput').focus();
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
window['onSiteClick'] = onSiteClick;
window['onLocaleClick'] = onLocaleClick;
