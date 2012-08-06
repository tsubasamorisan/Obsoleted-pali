/**
 * @fileoverview Implement a simple custom event library.
 */

/**
 * A simple custom event object for add, dispatch, and remove custom events
 * @constructor
 */
PaliCustomEvent = function() {
  /**
   * type <-> handlers mapping object
   * example: object[type] = [handler1, handler2, ... ]
   * where type is defined in PaliCustomEvent.CUSTOM_EVENT_TYPE
   * @type {object}
   * @private
   */
   this.typeHandlers_ = {};
};

/**
 * Add custom event
 * @param {string} type The custom event type. The type should be defined in
                        PaliCustomEvent.CUSTOM_EVENT_TYPE before being used to
                        prevent conflicts.
 * @param {function} fn The handler function to be executed when event occurs.
 * @return {boolean} True if success. Otherwise false.
 */
PaliCustomEvent.prototype.addCustomEvent = function(type, fn) {
  // check whether type exist in PaliCustomEvent.CUSTOM_EVENT_TYPE
  if (!PaliCustomEvent.CUSTOM_EVENT_TYPE.hasOwnProperty(type)) {
    console.log('type is not defined in PaliCustomEvent.CUSTOM_EVENT_TYPE');
    return false;
  }
  if (typeof fn != 'function') {
    console.log('fn is not a function');
    //return false;
  }

  if (typeof this.typeHandlers_[type] == 'undefined') {
    // there is no event handler of this type, create empty array to store
    // functions
    this.typeHandlers_[type] = [];
  }
  this.typeHandlers_[type].push(fn);

  return true;
};

/**
 * Dispatch custom event(s)
 * @param {string} type The custom event type of which events to be executed.
 */
PaliCustomEvent.prototype.dispatchCustomEvent = function(type) {
  // check whether type exists in this.typeHandlers_
  if (!this.typeHandlers_.hasOwnProperty(type)) {
    console.log('type does not exist in this.typeHandlers_');
    return;
  }
  for (var i=0; i < this.typeHandlers_[type].length; i++) {
    // fire events of 'type'
    try {
      this.typeHandlers_[type][i];
    } catch {err}
  }
};

/**
 * Remove custom event
 * @param {string} type The custom event type. The type should be defined in
                        PaliCustomEvent.CUSTOM_EVENT_TYPE before being used to
                        prevent conflicts.
 * @param {function} fn The handler function to be removed.
 * @return {boolean} True if success. Otherwise false.
 */
PaliCustomEvent.prototype.removeCustomEvent = function(type, fn) {
  // check whether type exists in this.typeHandlers_
  if (!this.typeHandlers_.hasOwnProperty(type)) {
    console.log('type does not exist in this.typeHandlers_');
    return;
  }
  // iterate through all hanlder of the type
  for (var i=0; i < this.typeHandlers_[type].length; i++) {
    // remove the handler if matched with input function
    if (fn == this.typeHandlers_[type][i])
      this.typeHandlers_[type].splice(i, 1);
  }
};

PaliCustomEvent.CUSTOM_EVENT_TYPE = {
  ON_SUGGESTION_MENU_CLOSED: 1
};

var paliCustomEvtMgr = new PaliCustomEvent();
