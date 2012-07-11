/**
 * @fileoverview Class to make DOM element draggable.
 *
 * References:
 * @see http://www.quirksmode.org/js/dragdrop.html
 * @see http://luke.breuer.com/tutorial/javascript-drag-and-drop-tutorial.aspx
 * @see http://help.dottoro.com/ljwcseaq.php
 * @see http://help.dottoro.com/ljlrboji.php
 * @see http://help.dottoro.com/ljsjcrav.php
 */


pali.require("base");


/**
 * Class to make DOM element draggable.
 *
 * @param {string} id The id of DOM element to be draggable.
 * @constructor
 */
pali.Draggable = function(id) {
  /**
   * The DOM element to be made draggable.
   * @type {DOM Element}
   * @private
   */
  this.draggedElement_ = document.getElementById(id);

  if (!this.draggedElement_) {
    throw "pali.Draggable.NoElement";
    console.log("In pali.Draggable constructor: No Dragged Element!");
  }

  /**
   * The initial X position of draggable DOM element.
   * @type {number}
   * @private
   */
  this.startX_ = undefined;

  /**
   * The initial Y position of draggable DOM element.
   * @type {number}
   * @private
   */
  this.startY_ = undefined;

  /**
   * The initial X position of mouse cursor of mouse down event.
   * @type {number}
   * @private
   */
  this.initialMouseX_ = undefined;

  /**
   * The initial Y position of mouse cursor of mouse down event.
   * @type {number}
   * @private
   */
  this.initialMouseY_ = undefined;

  // start to listen to mouse down event of draggable element
  pali.addEventListener(this.draggedElement_, 'mousedown',
                        this.startMouseDraggable.bind(this));
};


/**
 * start DOM element draggable mouse event.
 * @param {Object} e The event object passed by browser automatically in W3C-
 *                   compliant browser. For IE, use 'e || window.event'.
 * @private
 */
pali.Draggable.prototype.startMouseDraggable = function(e) {
  // In case mouse move and up event have been previously registered
  this.releaseElement();

  // Set current position of dragged element
  this.startX_ = this.draggedElement_.offsetLeft;
  this.startY_ = this.draggedElement_.offsetTop;

  var evt = e || window.event; // For IE compatible

  // Set current position of mouse cursor
  this.initialMouseX_ = evt.clientX;
  this.initialMouseY_ = evt.clientY;

  /**
   * From 'Drag and drop - QuirksMode':
   * However, the mousemove and mouseup event should be set not on the element,
   * but on the entire document. The reason is that the user may move the mouse
   * wildly and quickly, and he might leave the dragged element behind. If the
   * mousemove and mouseup functions were defined on the dragged element, the
   * user would now lose control because the mouse is not over the element any
   * more. That's bad usability.
   */
  pali.addEventListener(document, 'mousemove',
                        this.mouseDrag.bind(this));
  pali.addEventListener(document, 'mouseup',
                        this.releaseElement.bind(this));

  /**
   * From 'Drag and drop - QuirksMode':
   * suppress the default action of the mouse event: start selecting text.
   *
   * return false = evt.preventDefault + evt.stopPropagation
   * @see http://stackoverflow.com/questions/1357118/event-preventdefault-vs-return-false 
   */
  return false;
};


/**
 * drag DOM element by mouse (mouse move event callback)
 * @param {Object} e The event object passed by browser automatically in W3C-
 *                   compliant browser. For IE, use 'e || window.event'.
 * @private
 */
pali.Draggable.prototype.mouseDrag = function(e) {
  var evt = e || window.event; // For IE compatible

  // calculate the delta of mouse cursor movement
  var dX = evt.clientX - this.initialMouseX_;
  var dY = evt.clientY - this.initialMouseY_;

  this.setPosition(dX,dY);

  // suppress the default action of mouse event
  return false;
};


/**
 * Set new position of dragged element by mouse dragging.
 * @param {number} dX The delta-X of mouse cursor movement
 * @param {number} dY The delta-Y of mouse cursor movement
 * @private
 */
pali.Draggable.prototype.setPosition = function(dx, dy) {
  this.draggedElement_.style.left = this.startX_ + dx + 'px';
  this.draggedElement_.style.top  = this.startY_ + dy + 'px';
};


/**
 * stop listening to mouse Move and Up event.
 * @param {Object} e The event object passed by browser automatically in W3C-
 *                   compliant browser. For IE, use 'e || window.event'.
 * @private
 */
pali.Draggable.prototype.releaseElement = function(e) {
  pali.removeEventListener(document, 'mousemove',
                           this.mouseDrag);
  pali.removeEventListener(document, 'mouseup',
                           this.releaseElement);
};
