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

myloader.isDependencySatisfied = function(jsName) {
  if (myloader.dep[jsName] == null) {
    console.log(jsName + ' has no dependency.');
    console.log(jsName + ' dependency satisfied? true');
    console.log('---');
    return true;
  }

  var depJSFileArray = myloader.dep[jsName].split(',');

  for (var i=0; i < depJSFileArray.length; i++) {
    // Remove whitespace in the beginning and end of user input string
    depJSFileArray[i] = depJSFileArray[i].replace(/(^\s+)|(\s+$)/g, "");
  }

  console.log(jsName + ' depends on :');
  for (var i=0; i < depJSFileArray.length; i++) {
    console.log(depJSFileArray[i]);
  }

  var isAllDepSatisfied = true;
  for (var i=0; i < depJSFileArray.length; i++) {
    if (!myloader.isLoaded[depJSFileArray[i]]) {
      isAllDepSatisfied = false;
    }
  }

  if (isAllDepSatisfied) {
    console.log(jsName + ' dependency satisfied? true');
  } else {
    console.log(jsName + ' dependency satisfied? false');
  }
  console.log('---');
  return isAllDepSatisfied;
};

myloader.loadOthers = function() {
  var loadNew = false;
  for (var jsName in myloader.isLoaded) {
    if (!myloader.isLoaded[jsName] && myloader.isJSContentLoaded[jsName] && myloader.isDependencySatisfied(jsName)) {
      myloader.insertJS(jsName, myloader.jsContent[jsName]);
      myloader.isLoaded[jsName] = true;
      loadNew = true;
    }
  }
  if (loadNew) {
    myloader.loadOthers();
  }
};

myloader.handleDependency = function(jsName, jsContent) {
  if (myloader.isDependencySatisfied(jsName)) {
    myloader.insertJS(jsName, jsContent);
    myloader.isLoaded[jsName] = true;
    // load other script(s) dependent on this script if already completely downloaded
    myloader.loadOthers();
  } else {
    myloader.jsContent[jsName] = jsContent;
    myloader.isJSContentLoaded[jsName] = true;
  }
};

myloader.insertJS = function(jsName, jsContent) {
  console.log(jsName + ' loaded');
  console.log('---');
  var script = document.createElement('script');
  script.setAttribute("type","text/javascript");
  var textNode = document.createTextNode(jsContent);
  script.appendChild(textNode);
  document.getElementsByTagName("head")[0].appendChild(script);
};

myloader.modules = ['base.js', 'dropdown.js', 'draggable.js', 'inputsuggest.js', 'palidict.js'];
myloader.dep = {
  'base.js' : null,
  'dropdown.js': 'base.js',
  'draggable.js': 'base.js',
  'inputsuggest.js': 'base.js',
  'palidict.js': 'dropdown.js, draggable.js, inputsuggest.js'
};

myloader.isLoaded = function() {
  var loadedObj = {};
  for (var key in myloader.dep) {
    loadedObj[key] = false;
  }
  return loadedObj;
}();

myloader.jsContent = function() {
  var jsContentObj = {};
  for (var key in myloader.dep) {
    jsContentObj[key] = null;
  }
  return jsContentObj;
}();

myloader.isJSContentLoaded = function() {
  var jsContentLoadedObj = {};
  for (var key in myloader.dep) {
    jsContentLoadedObj[key] = false;
  }
  return jsContentLoadedObj;
}();

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
