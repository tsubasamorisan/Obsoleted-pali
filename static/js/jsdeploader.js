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
    // this js file is not dependent on other js file
    console.log('dependency of ' + jsName + ' : ' + myloader.dep[jsName]);
    //console.log('loaded? ' + myloader.loaded[jsName]);
    console.log(jsName + ' has no dependency. insert directly.');
    myloader.insertJS(jsName, jsContent);
    myloader.loaded[jsName] = 'yes';
    //console.log('loaded? ' + myloader.loaded[jsName]);
    for (var key in myloader.loaded) {
      if (myloader.loaded[key] == 'no' &&
          myloader.jsContentLoaded[key] == 'yes' &&
          myloader.loaded[myloader.dep[key]] == 'yes') {
        console.log('dependency of ' + key + ' : ' + myloader.dep[key]);
        console.log('the dependent file '+ myloader.dep[key] +' is already loaded.');
        myloader.insertJS(key, myloader.jsContent[key]);
        myloader.loaded[key] = 'yes';
      }
    }
    console.log('---');
  } else {
    // this js file is dependent on other js file
    console.log('dependency of ' + jsName + ' : ' + myloader.dep[jsName]);
    if (myloader.loaded[myloader.dep[jsName]] == 'no') {
      // The dependent file is not loaded
      console.log(myloader.dep[jsName] + ' is not loaded.');
      myloader.jsContent[jsName] = jsContent;
      myloader.jsContentLoaded[jsName] = 'yes';
    } else {
      // The dependent file is loaded
      console.log('the dependent file '+ myloader.dep[jsName] +' is already loaded.');
      myloader.insertJS(jsName, jsContent);
      myloader.loaded[jsName] = 'yes';
    }
    console.log('---');
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

myloader.loaded = function() {
  var loadedObj = {};
  for (var key in myloader.dep) {
    loadedObj[key] = 'no';
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

myloader.jsContentLoaded = function() {
  var jsContentLoadedObj = {};
  for (var key in myloader.dep) {
    jsContentLoadedObj[key] = 'no';
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
