/**
 * @fileoverview base utility which provides common functionality
 */


var pali = pali || {}; // Identifies this file as the base.


/**
 * Do nothing. Only to show the dependency.
 *
 * @param {string} name The namespace to include.
 */
pali.require = function(name) {};


/**
 * Cross-browser addEventListener function.
 *
 * @param {DOM element} element The element to add event listener.
 * @param {string} evt The event to be listened.
 * @param {function} fn The callback function when event occurs.
 */
pali.addEventListener = function(element, evt, fn) {
  if (window.addEventListener) {
    /* W3C compliant browser */
    element.addEventListener(evt, fn, false);
  } else {
    /* IE */
    element.attachEvent('on' + evt, fn);
  }
};


/**
 * Cross-browser removeEventListener function.
 *
 * @param {DOM element} element The element to remove event listener.
 * @param {string} evt The event to be un-listened.
 * @param {function} fn The callback function when event occurs.
 */
pali.removeEventListener = function(element, evt, fn) {
  if (window.removeEventListener) {
    /* W3C compliant browser */
    element.removeEventListener(evt, fn, false);
  } else {
    /* IE */
    element.detachEvent('on' + evt, fn);
  }
};


/**
 * Cross-browser get DOM element position function.
 *
 * @param {DOM element} el The element of which to get the position
 * @return {Object} The top and left position of DOM element
 * @see Dynamically retrieve Html element (X,Y) position with JavaScript
 *      http://stackoverflow.com/questions/442404/dynamically-retrieve-html-element-x-y-position-with-javascript
 * @see Window size and scrolling
 *      http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
 * @see scrollLeft property
 *      http://help.dottoro.com/ljcjgrml.php
 * @see jQuery source code: src/offset.js
 *      https://github.com/jquery/jquery/blob/master/src/offset.js
 * @see How to get iframe scroll position in IE using Java Script?
 *      http://stackoverflow.com/questions/2347491/how-to-get-iframe-scroll-position-in-ie-using-java-script
 */
pali.getOffset = function(el) {
  var oriEl = el;
  var _x = 0;
  var _y = 0;
  var offsetX = 0;
  var offsetY = 0;
  var scrollX = 0;
  var scrollY = 0;

  while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
    offsetX += el.offsetLeft;
    offsetY += el.offsetTop;
    scrollX += el.scrollLeft;
    scrollY += el.scrollTop;
    el = el.offsetParent;
  }

  /**
   * getBoundingClientRect method
   * @see http://help.dottoro.com/ljvmcrrn.php
   */
  if (oriEl.getBoundingClientRect) {
    /* FIXME: should take margin-left and margin-top into consideration */
    var body = document.documentElement || document.body;
    scrollX = window.pageXOffset || body.scrollLeft;
    scrollY = window.pageYOffset || body.scrollTop;
    _x = oriEl.getBoundingClientRect().left + scrollX;
    _y = oriEl.getBoundingClientRect().top + scrollY;
  } else {
    /* FIXME: code in this else clause maybe not correct? */
    _x = offsetX - scrollX;
    _y = offsetY - scrollY;
  }
  return { top: _y, left: _x };
};


/**
 * For browsers without built-in bind
 * code snippet from the following link:
 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}


/**
 * Generate random string
 * @param {number} length The length of the random string
 * @return {string} String of 5 random characters
 * @private
 */
pali.randomString = function(length) {
  /**
   * Referece:
   * @see http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
   */
  if (typeof length != 'number') throw "pali.randomString: length is not number";
  var string = '';
  /**
   * javascript function name cannot start with number
   * so do NOT use number in chars if the random string is used for JavaScript
   * function name.
   */
  //var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  for( var i=0; i < length; i++ )
    string += chars.charAt(Math.floor(Math.random() * chars.length));
  return string;
};


/**
 * Give a name to object in global scope, i.e., window[name] = object.
 * @param {object} obj The object to be given a global name
 * @return {string} The global name of the object
 */
pali.setObjectGlobalName = function(obj) {
  if (typeof obj != 'object')
    throw "pali.pali.setObjectGlobalName: input is not object";
  // get a random name string with length of 5
  var globalName = pali.randomString(5);
  // check if this name is already in global scope. if already exists, get
  // another name.
  while (window[globalName]) {
    globalName = pali.randomString(5);
  }
  // put this object instance in global scope
  window[globalName] = obj;

  return globalName;
};


/*                              width: 80                                     */
