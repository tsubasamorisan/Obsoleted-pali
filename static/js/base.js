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
    element.attachEvent( 'on' + evt, fn);
  }
};


/*                              width: 80                                     */
