/* Reference: http://ntt.cc/2008/02/10/4-ways-to-dynamically-load-external-javascriptwith-source.html */
function LoadJS(url) {
  var ext = document.createElement('script');
  ext.setAttribute("type","text/javascript");
  ext.setAttribute("src", url);
  if (typeof ext != "undefined") {document.getElementsByTagName("head")[0].appendChild(ext);}
}

function LoadCSS(url) {
  var ext = document.createElement('link');
  ext.setAttribute("type", "text/css");
  ext.setAttribute("rel", "stylesheet");
  ext.setAttribute("href", url);
  if (typeof ext != "undefined") {document.getElementsByTagName("head")[0].appendChild(ext);}
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
LoadCSS("http://fonts.googleapis.com/css?family=Gentium+Basic|Special+Elite&subset=latin,latin-ext");
/* Load JS, CSS and Favicon */
if (queryURL.ugcfh == "yes") {
  /* use google code to serve files */
  prefix = 'http://pali.googlecode.com/git/';
  LoadFavicon(prefix + "static/favicon.ico");
  LoadJS(prefix + "static/jsvarindex.js");
  LoadJS(prefix + "static/js/inputSuggest.js");
  LoadJS(prefix + "static/js/palidict.js");
  LoadCSS(prefix + "static/css/palidict.css");
} else if (window.location.host == 'localhost:8080') {
  /*
  * NOT use google code to serve files
  * host is "localhost:8080"
  */
  LoadFavicon("favicon.ico");
  LoadJS("static/jsvarindex.js");
  if (queryURL.compiledjs == 'yes') {
    LoadJS("static/js/pali-spo.js");
  }
  else {
    LoadJS("static/js/inputSuggest.js");
    LoadJS("static/js/palidict.js");
  }
  LoadCSS("static/css/palidict.css");
} else if (window.location.host == 'palidictionary.appspot.com') {
  /*
  * NOT use google code to serve files
  * host is NOT "localhost:8080"
  * host is "palidictionary.appspot.com"
  */
  LoadFavicon("favicon.ico");
  LoadJS("static/jsvarindex.js");
  LoadJS("static/js/pali-spo.js");
  LoadCSS("static/css/palidict.css");
} else {
  /*
  * NOT use google code to serve files
  * host is NOT "localhost:8080"
  * host is NOT "palidictionary.appspot.com"
  */
  LoadFavicon("statics/favicon.ico");
  LoadJS("statics/jsvarindex.js");
  LoadJS("statics/js/pali-spo.js");
  LoadCSS("statics/css/palidict.css");
}

if (queryURL.track != "no") {
  if (window.location.host != 'localhost:8080') {
  /* Load Google Analytics Code */
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
