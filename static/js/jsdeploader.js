// @see http://stackoverflow.com/questions/6946631/dynamically-creating-script-readystate-never-complete

function XHRLoadJS(url) {
  var xmlhttp;

  if (window.XMLHttpRequest) {
    xmlhttp=new XMLHttpRequest();
  }
  else {
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange = function(url) {
    if (xmlhttp.readyState == 4) {

      if (xmlhttp.status == 200) {
        LoadJS(xmlhttp.responseText);
      } else {
        console.log('cannot load external file :' + url);
      }

    }
  };

  xmlhttp.open("GET",url,true);
  xmlhttp.send();
}

function LoadJS(code) {
  var script = document.createElement('script');
  script.setAttribute("type","text/javascript");
  var text = document.createTextNode(code);
  script.appendChild(text);
  document.getElementsByTagName("head")[0].appendChild(script);
}

var host = 'http://pali.googlecode.com/git/';
var path = 'static/js/';
var modules = ['base.js', 'draggable.js', 'inputsuggest.js', 'palidict.js'];

var main = function() {
  for (var i=0; i < modules.length; i++) {
    XHRLoadJS(path+modules[i]);
  }
}();
