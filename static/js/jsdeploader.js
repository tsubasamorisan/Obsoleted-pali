// @see http://stackoverflow.com/questions/6946631/dynamically-creating-script-readystate-never-complete

var myloader = myloader || {};

myloader.xhrLoadJS = function(url_p, name_p) {
  var xmlhttp;
  var url = url_p;
  var name = name_p;

  if (window.XMLHttpRequest) {
    xmlhttp=new XMLHttpRequest();
  }
  else {
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        myloader.handleDependency(name, xmlhttp.responseText);
      } else {
        console.log('cannot load external file :' + url);
      }

    }
  };

  xmlhttp.open("GET",url,true);
  xmlhttp.send();
};

myloader.handleDependency = function(jsName, jsContent) {
  if (myloader.dep[jsName] == null) {
    myloader.insertJS(jsName, jsContent);
    console.log('dep of ' + jsName + ' : ' + myloader.dep[jsName]);
  } else {
    myloader.insertJS(jsName, jsContent);
    console.log('dep of ' + jsName + ' : ' + myloader.dep[jsName]);
  }
};

myloader.insertJS = function(jsName, jsContent) {
  var script = document.createElement('script');
  script.setAttribute("type","text/javascript");
  var textNode = document.createTextNode(jsContent);
  script.appendChild(textNode);
  document.getElementsByTagName("head")[0].appendChild(script);
};

myloader.modules = ['base.js', 'draggable.js', 'inputsuggest.js', 'palidict.js'];
myloader.dep = {
  'base.js' : null,
  'draggable.js': 'base.js',
  'inputsuggest.js': 'base.js',
  'palidict.js': 'base.js',
};

myloader.main = function() {
  var host = 'http://pali.googlecode.com/git/';
  var path = 'static/js/';
  var prefix = path;
  if (window.location.host == 'pali.googlecode.com') {
    prefix = host + path;
  }
  for (var i=0; i < myloader.modules.length; i++) {
    myloader.xhrLoadJS( prefix + myloader.modules[i],
                       myloader.modules[i] );
  }
}();
