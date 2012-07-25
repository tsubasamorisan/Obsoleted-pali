pali.require('base');
pali.require('dropdown');
pali.require('draggable');
pali.require('inputsuggest');
pali.require('lookup');


if (window.opera) {
  checkOpera();
} else {
  checkOtherBrowsers();
}

function checkOpera() {
  if (document.readyState == "complete") initService();
  else setTimeout(checkOpera, 50);
}

function checkOtherBrowsers() {
  if (document.getElementById('locale')) initService();
  else setTimeout(checkOtherBrowsers, 50);
}

function initService() {
  // start input suggest
  var suggest = new pali.InputSuggest("PaliInput", "suggest");

  // start dropdown menu
  var langDropdown = new pali.Dropdown('lang-dropdown', 'menuDiv-lang-dropdown');
  var siteDropdown = new pali.Dropdown('site-dropdown', 'menuDiv-site-dropdown');

  // start lookup object and callback
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

  // make keypad toggle-able
  document.getElementById('displayText').onclick = toggle;

  // make keypad draggable
  var drag = new pali.Draggable('keyboard');

  // bind the click function of input element inside keypad
  var keypad = document.getElementById('keyboard');
  var buttons = keypad.getElementsByTagName('input');
  for (var i=0; i<buttons.length; i++) {
    buttons[i].onclick = onKeypadButtonClick;
  }

  document.getElementById('linkHome').href = "javascript:window.location.reload();";
  document.getElementById('linkAbout').onclick = showAbout;
  document.getElementById('linkAbout').href = "javascript:void(0);";
  document.getElementById('linkLink').onclick = showLink;
  document.getElementById('linkLink').href = "javascript:void(0);";

  document.getElementById('siteItem1').onclick = onSiteClick;
  document.getElementById('siteItem1').href = "javascript:void(0);";
  document.getElementById('siteItem2').onclick = onSiteClick;
  document.getElementById('siteItem2').href = "javascript:void(0);";
  document.getElementById('siteItem3').onclick = onSiteClick;
  document.getElementById('siteItem3').href = "javascript:void(0);";

  document.getElementById('langItem1').onclick = onLocaleClick;
  document.getElementById('langItem1').href = "javascript:void(0);";
  document.getElementById('langItem2').onclick = onLocaleClick;
  document.getElementById('langItem2').href = "javascript:void(0);";
  document.getElementById('langItem3').onclick = onLocaleClick;
  document.getElementById('langItem3').href = "javascript:void(0);";

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

/**
 * @this {DOM Element}
 */
function onKeypadButtonClick() {
  document.getElementById("PaliInput").value += this.value;
  document.getElementById("PaliInput").focus();
}

// http://www.web-code.org/coding-tools/javascript-escape-unescape-converter-tool.html
function showAbout(){document.getElementById("result").innerHTML = document.getElementById("about").innerHTML;}
function showLink(){document.getElementById("result").innerHTML = document.getElementById("link").innerHTML;}

/**
 * @this {DOM Element}
 */
function onSiteClick() {
  var url = '';
  if (this.id == 'siteItem1') { url = 'http://palidictionary.appspot.com/'; }
  else if (this.id == 'siteItem2') { url = 'http://siongui.pythonanywhere.com/'; }
  else if (this.id == 'siteItem3') { url = 'http://siongui.webfactional.com/'; }
  else { url = 'http://palidictionary.appspot.com/'; }

  if (window.location.host == 'localhost:8080' || window.location.host == 'pali.googlecode.com') {
    queryURL['track'] = 'no';
  }

  var count = 0;
  for (var key in queryURL) {
    if (count == 0) { url += '?' + key + '=' + queryURL[key]; }
    else { url += '&' + key + '=' + queryURL[key]; }
    count ++;
  }

  window.location = url;
}

/**
 * @this {DOM Element}
 */
function onLocaleClick() {
  var locale = '';
  if (this.id == 'langItem1') { locale = 'en_US'; }
  else if (this.id == 'langItem2') { locale = 'zh_CN'; }
  else if (this.id == 'langItem3') { locale = 'zh_TW'; }
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
