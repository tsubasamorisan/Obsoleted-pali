/* Reference: http://ntt.cc/2008/02/10/4-ways-to-dynamically-load-external-javascriptwith-source.html */
function AJAXLoad(type, loadByXMLHttp, url){
  var ext;
  if (type == "js") {
    ext = document.createElement('script');
    ext.setAttribute("type","text/javascript");
  }
  if (type == "css") {
    ext = document.createElement('link');
    ext.setAttribute("type", "text/css");
    ext.setAttribute("rel", "stylesheet");
  }
  if (!loadByXMLHttp) {
    if (type == "js") {
      ext.setAttribute("src", url);
      if (typeof ext != "undefined") {document.getElementsByTagName("head")[0].appendChild(ext);}
    }
    if (type == "css") {
      ext.setAttribute("href", url);
      if (typeof ext != "undefined") {document.getElementsByTagName("head")[0].appendChild(ext);}
    }
    return;
  }
  var xmlhttp;
  if (window.XMLHttpRequest) {xmlhttp=new XMLHttpRequest();}
  else {xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
  xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4) {
      if (xmlhttp.status == 200) {
        ext.innerHTML=xmlhttp.responseText;
        document.getElementsByTagName("head")[0].appendChild(ext);
      } else {
        console.log('cannot load external file :'+url);
      }
    }
  }
  xmlhttp.open("GET",url,true);
  xmlhttp.send();
}

function LoadFavicon(url) {
  var ext = document.createElement('link');
  ext.setAttribute("rel", "shortcut icon");
  ext.setAttribute("href", url);
  if (typeof ext != "undefined") {document.getElementsByTagName("head")[0].appendChild(ext);}
}

/*
keyword: javascript get url parameter 
http://stackoverflow.com/questions/979975/how-to-get-the-value-from-url-parameter
http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
http://papermashup.com/read-url-get-variables-withjavascript/
*/
var queryURL = function() {
  // This function is anonymous, is executed immediately and the return value is assigned to queryURL
  var queryPairs = {};
  if (!window.location.search) {return queryPairs;}
  var variables = window.location.search.substring(1).split("&");
  for (var i=0; i < variables.length; i++) {
    /* http://stackoverflow.com/questions/747641/what-is-the-difference-between-decodeuricomponent-and-decodeuri */
    var pair = decodeURIComponent(variables[i]).split("=");
    if (pair.length != 2) {console.log('strange query string: '+variables[i]);continue;}
    if (typeof pair[0] == "undefined") {
      continue;
    } else if (typeof pair[0] == null) {
      continue;
    } else {
      queryPairs[pair[0]] = pair[1];
    }
  }
  return queryPairs;
} ();

/* Load Google Web Fonts */
AJAXLoad("css", false, "http://fonts.googleapis.com/css?family=Gentium+Basic|Special+Elite&subset=latin,latin-ext");
/* Load favicon.ico */
if (queryURL.ugcfh == "yes") {LoadFavicon("http://pali.googlecode.com/git/static/favicon.ico");}
else if (window.location.host == 'localhost:8080')             {LoadFavicon("favicon.ico");}
else if (window.location.host == 'palidictionary.appspot.com') {LoadFavicon("favicon.ico");}
else {LoadFavicon("statics/favicon.ico");}
/* Load Index of Pāli Words */
if (queryURL.ugcfh == "yes") {AJAXLoad("js", false, "http://pali.googlecode.com/git/static/jsvarindex.js");}
else if (window.location.host == 'localhost:8080')             {AJAXLoad("js", false, "static/jsvarindex.js");}
else if (window.location.host == 'palidictionary.appspot.com') {AJAXLoad("js", false, "static/jsvarindex.js");}
else {AJAXLoad("js", false, "statics/jsvarindex.js");}
/* Load CSS */
if (queryURL.ugcfh == "yes") {AJAXLoad("css", false, "http://pali.googlecode.com/git/static/css/palidict.css");}
else if (window.location.host == 'localhost:8080')             {AJAXLoad("css", false, "static/css/palidict.css");}
else if (window.location.host == 'palidictionary.appspot.com') {AJAXLoad("css", false, "static/css/palidict.css");}
else {AJAXLoad("css", false, "statics/css/palidict.css");}
/* Load Input Suggestion Library */
if (queryURL.ugcfh == "yes") {AJAXLoad("js", false, "http://pali.googlecode.com/git/static/js/inputSuggest.js");}
else if (window.location.host == 'localhost:8080')             {AJAXLoad("js", false, "static/js/inputSuggest.js");}
else if (window.location.host == 'palidictionary.appspot.com') {AJAXLoad("js", false, "static/js/inputSuggest.js");}
else {AJAXLoad("js", false, "statics/js/inputSuggest.js");}
/* Load Helper Library */
if (queryURL.ugcfh == "yes") {AJAXLoad("js", false, "http://pali.googlecode.com/git/static/js/palidict.js");}
else if (window.location.host == 'localhost:8080')             {AJAXLoad("js", false, "static/js/palidict.js");}
else if (window.location.host == 'palidictionary.appspot.com') {AJAXLoad("js", false, "static/js/palidict.js");}
else {AJAXLoad("js", false, "statics/js/palidict.js");}

if (queryURL.track != "no") {
  if (window.location.host != 'localhost:8080') {
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-32179549-1']);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
  }
}
