/**
 * @fileoverview Class to auto-suggest pāli words according to user input.
 *
 * References:
 * @see http://www.enjoyxstudy.com/javascript/suggest/index.en.html
 * @see http://www.phpied.com/3-ways-to-define-a-javascript-class/
 * @see http://blog.anselmbradford.com/2009/04/09/object-oriented-javascript-tip-creating-static-methods-instance-methods/
 */


pali.require('base');


/**
 * Class to auto-suggest prefix-matched pāli Words
 *
 * @param {string} inputId element id for text input
 * @param {string} suggestDivId element id for suggestion Div Menu
 * @constructor
 */
pali.InputSuggest = function(inputId, suggestDivId) {
  /**
   * DOM element of pāli text input
   * @type {DOM Element}
   * @private
   */
  this.input_ = document.getElementById(inputId);

  /**
   * DOM element of suggestion menu of pāli words
   * @type {DOM Element}
   * @private
   */
  this.suggestDiv_ = document.getElementById(suggestDivId);


  /**
   * References:
   * @see http://stackoverflow.com/questions/5597060/detecting-arrow-keys-in-javascript
   * @see http://www.quirksmode.org/js/keys.html
   * @see http://unixpapa.com/js/key.html
   */

  // cannot use keyword 'this' directly because of context change
  var this_ = this;

  // monitor arrow keys event of text input
  pali.addEventListener(this.input_, 'keydown',
                           function(e){this_.handleKeyEvent(e);});

  // start to monitor user input periodically once text input get focused
  pali.addEventListener(this.input_, 'focus',
                           function(){this_.checkInput();});

  // stop to monitor user input once text input loses focus
  pali.addEventListener(this.input_, 'blur',
                           function(){this_.stopCheckInput();});


  /**
   * Array which contains prefix-match pāli words
   * @type {Array}
   * @private
   */
  this.prefixMatchedPaliWords_ = new Array();

  /**
   * size of prefixMatchedPaliWords_, i.e.,
   * number of prefix-match pāli words in suggestion menu.
   * This value can not be larger than MAX_WORDS_IN_SUGGESTION_MENU.
   * FIXME: remove this variable. use prefixMatchedPaliWords_.length
   * @type {number|null}
   * @private
   */
  this.numberOfPrefixMatchedPaliWords_ = null;

  /**
   * The position of user selection in suggestion menu
   * @type {number|null}
   * @private
   */
  this.suggestedWordPosition_ = null;

  /**
   * id returned by JavaScript built-in setTimeout() function
   * @type {number|null}
   * @private
   */
  this.checkInputTimingEventVar_ = null;

  /**
   * When user selects suggested word in suggestion menu by arrow key,
   * the original user input must be kept. This variable keeps the original
   * user input.
   * @type {string}
   * @private
   */
  this.originalUserPaliInput_ = "";

  /**
   * Keep track of usr input in this variable everytime user presses keys.
   * This variable keeps user input everytime user presses keys.
   * @type {string}
   * @private
   */
  this.oldInput_ = "";

  /**
   * TODO: use "this.self_" instead of "var _this = this"?
   * @const
   * @type {Object}
   * @private
   */
  this.self_ = this;
};


/**
 * max number of pāli words shown in suggestion menu
 * @define {number}
 */
pali.InputSuggest.MAX_WORDS_IN_SUGGESTION_MENU = 25;


/**
 * interval for polling user input, in ms
 * @define {number}
 */
pali.InputSuggest.CHECK_INPUT_EVENT_INTERVAL_IN_MS = 500;


/**
 * Map romanized pāli letters to English name.
 * @enum {string}
 * @private
 */
pali.InputSuggest.PrefixMapping = {
//  "°" : "uc",
//  "-" : "dash",
  "a" : "a",
  "ā" : "aa",
  "b" : "b",
  "c" : "c",
  "d" : "d",
  "ḍ" : "dotd",
  "e" : "e",
  "g" : "g",
  "h" : "h",
  "i" : "i",
  "ī" : "ii",
  "j" : "j",
  "k" : "k",
  "l" : "l",
  "ḷ" : "dotl",
  "m" : "m",
//  "ṃ" : "dotm",
  "n" : "n",
  "ñ" : "tilden",
//  "ṇ" : "dotn",
//  "ṅ" : "ndot",
//  "ŋ" : "ngng",
  "o" : "o",
  "p" : "p",
  "r" : "r",
  "s" : "s",
  "t" : "t",
  "ṭ" : "dott",
  "u" : "u",
  "ū" : "uu",
  "v" : "v",
  "y" : "y"
};


/**
 * Keys code numbers.
 * @enum {number}
 * @private
 */
pali.InputSuggest.KeyCode = {
  TAB:     9,
  RETURN: 13,
  ESC:    27,
  UP:     38,
  DOWN:   40
};


/**
 * Check user input periodically.
 * (oninput or onpropertychange is not usable because browser incompatibility)
 * @private
 */
pali.Inputsuggest.prototype.checkInput = function() {
  if (this.input_.value != this.oldInput_) { // user input changes
    if (this.suggestedWordPosition_ == null) {
      this.prefixMatch();
    } else {
      if( this.prefixMatchedPaliWords_[this.suggestedWordPosition_ - 1]
          != this.input_.value) {
	this.prefixMatch();
      }
    }
    this.oldInput_ = this.input_.value; // keep new value of user input
  }

  // set this function to be executed once again
  var _this = this;
  this.checkInputTimingEventVar_ = setTimeout(
    function(){_this.checkInput();},
    pali.InputSuggest.CHECK_INPUT_EVENT_INTERVAL_IN_MS
  );
};


/**
 * Stop checking user input periodically.
 * @private
 */
pali.InputSuggest.prototype.stopCheckInput = function() {
  clearTimeout(this.checkInputTimingEventVar_);
  this.clearSuggestionMenu();
};


/**
 * Prefix-match user input to pāli words.
 * @private
 */
pali.InputSuggest.prototype.prefixMatch = function() {
  /**
   * Remove whitespace in the beginning and end of user input string
   * @const
   * @type {string}
   * @private
   */
  var userInputStr = this.input_.value.replace(/(^\s+)|(\s+$)/g, "");

  /**
   * References:
   * search keyword: javascript string prefix match
   * @see http://stackoverflow.com/questions/457160/the-most-efficient-algorithm-to-find-first-prefix-match-from-a-sorted-string-arr
   */

  /* TODO: should we convert the string to lower case here? */

  /* Here we give simple implementation for prefix matching */
  if (userInputStr.length == 0) {
    this.clearSuggestionMenu();
    return;
  }

  //if the first letter in user input string is invalid, return
  if (!pali.InputSuggest.PrefixMapping[userInputStr[0]]) {
    return;
  }

  /**
   * Get the name of arrays which contains pāli words
   * with the same first prefix letter as user input string
   * @const
   * @type {string}
   * @private
   */
  var arrayName = "prefix_" + pali.InputSuggest.PrefixMapping[userInputStr[0]];

  /**
   * number of prefix-matched words
   * @type {number}
   * @private
   */
  var matchedCount = 0;

  if (this.prefixMatchedPaliWords_) {
    delete this.prefixMatchedPaliWords_;
  }
  this.prefixMatchedPaliWords_ = new Array();

  /**
   * search keyword: javascript evaluate string as variable
   * in this case, eval(arrayName)
   */
  for (var i=0; i < eval(arrayName).length; i++ ) {
    // If the pāli word starts with user input string
    if (eval(arrayName)[i].indexOf(userInputStr) == 0) {
      this.prefixMatchedPaliWords_.push(eval(arrayName)[i]);
      matchedCount += 1;
    }

    if (matchedCount == pali.InputSuggest.MAX_WORDS_IN_SUGGESTION_MENU) {
      break;
    }
  }

  if (matchedCount == 0) {
    this.clearSuggestionMenu();
    return;
  }

  /**
   * References:
   * http://www.javascriptkit.com/javatutors/arraysort.shtml
   * http://www.w3schools.com/jsref/jsref_sort.asp
   */
  this.prefixMatchedPaliWords_.sort();

  this.suggestionMenu(userInputStr);
};


/**
 * Show suggestion menu if no menu exits, or update suggestion menu if menu
 * already exists.
 * @param {string} userInputStr The user input string
 * @private
 */
pali.InputSuggest.prototype.suggestionMenu = function(userInputStr) {
  this.suggestedWordPosition_ = null;
  this.numberOfPrefixMatchedPaliWords_ = this.prefixMatchedPaliWords_.length;
  this.originalUserPaliInput_ = userInputStr;

  // create dropdown input suggestion menu
  this.suggestDiv_.innerHTML = "";
  var _this = this;
  for (var i=0; i < this.prefixMatchedPaliWords_.length; i++) {
    /**
     * create DOM element of suggested word
     * Reference: http://www.javascriptkit.com/javatutors/dom2.shtml
     */
    var word = document.createElement('div');
    word.id = this.getWordElementIdString((i+1));
    word.title = this.prefixMatchedPaliWords_[i];
    word.innerHTML = this.prefixMatchedPaliWords_[i].replace(
                       userInputStr, "<b>" + userInputStr + "</b>");

    // add mouse event listener for DOM element of suggested word
    pali.addEventListener(word, 'click',
                          function(e){_this.onItemClick(e);});
    pali.addEventListener(word, 'mouseover',
                          function(e){_this.onItemMouseOver(e);});
    pali.addEventListener(word, 'mouseout',
                          function(e){_this.onItemMouseOut(e);});

    // append the DOM element of the suggested word to suggestion menu
    this.suggestDiv_.appendChild(word);
  }
  // set the CSS style of suggestion menu
  this.suggestDiv_.style.left = pali.getOffset(this.input_).left + "px";
  this.suggestDiv_.style.minWidth = this.input_.offsetWidth + "px";
  this.suggestDiv_.style.textAlign = 'left';
  this.suggestDiv_.style.fontFamily = 'Gentium Basic, arial, serif';
  this.suggestDiv_.style.fontSize = '100%';
  this.suggestDiv_.style.display = 'block';
};


/**
 * Handle user keyboard event of text input
 * @param {Object} event The keyboard event
 * @private
 */
pali.InputSuggest.prototype.handleKeyEvent = function(event) {
  /**
   * If not check user input periodically, 
   * start to check user input periodically
   */
  if (!this.checkInputTimingEventVar_) {
    /**
     * References:
     * search keyword: javascript object settimeout
     */
    var _this = this;
    this.checkInputTimingEventVar_ = setTimeout(
      function(){_this.checkInput();},
      pali.InputSuggest.CHECK_INPUT_EVENT_INTERVAL_IN_MS
    );
  }

  /**
   * The code of the key pressed by user
   * @const
   * @type {number}
   * @private
   */
  var code = this.getKeyCode(event);

  // If there is no suggestion menu
  if (this.suggestDiv_.style.display == "none") {
    // If user press down arrow key and user input is not empty
    if ( (code == pali.InputSuggest.KeyCode.DOWN) &&
         (this.input_.value != "")) {
      this.prefixMatch();
    }
    // If user press up arrow key and user input is not empty
    if ( (code == pali.InputSuggest.KeyCode.UP) &&
         (this.input_.value != "")) {
      this.prefixMatch();
    }

    return;
  }

  // If user presses UP arrow key
  if (code == pali.InputSuggest.KeyCode.UP) {
    /**
     * If user does not choose any suggested word in the suggestion menu
     * before pressing UP key, highlight the last word in the menu. Set user
     * selection position to the last word in the suggestion menu
     */
    if (this.suggestedWordPosition_ == null) {
      this.suggestedWordPosition_ = this.numberOfPrefixMatchedPaliWords_;
      var currentWord = this.getWordElementByIndexNumber(
                               this.suggestedWordPosition_);
      this.setItemStyle(currentWord);
      this.input_.value = currentWord.title;
    /**
     * Else if user chooses first suggested word in the suggestion menu before
     * pressing UP key, remove the highlight of the first word in the suggestion
     * menu. Set user selction position to null.
     */
    } else if (this.suggestedWordPosition_ == 1) {
      var currentWord = this.getWordElementByIndexNumber(
                               this.suggestedWordPosition_);
      this.suggestedWordPosition_ = null;
      this.removeItemStyle(currentWord);
      this.input_.value = this.originalUserPaliInput_;
    /**
     * Else user chooses some suggested word (not first word) in the suggestion
     * menu before pressing UP key, remove the highlight of the previous
     * selected word in the suggestion menu. Highlight the word on top of
     * previous word. Set user selction position = previous position - 1.
     */
    } else {
      var previousWord = this.getWordElementByIndexNumber(
                                this.suggestedWordPosition_);
      this.removeItemStyle(previousWord);
      this.suggestedWordPosition_ -= 1;
      var currentWord = this.getWordElementByIndexNumber(
                               this.suggestedWordPosition_);
      this.setItemStyle(currentWord);
      this.input_.value = currentWord.title;
    }
  }

  // If user presses DOWN arrow key
  if (code == pali.InputSuggest.KeyCode.DOWN) {
    /**
     * If user does not choose any suggested word in the suggestion menu
     * before pressing DOWN key, highlight the first word in the menu. Set user
     * selection position to the first word in the suggestion menu
     */
    if (this.suggestedWordPosition_ == null) {
      this.suggestedWordPosition_ = 1;
      var currentWord = this.getWordElementByIndexNumber(
                               this.suggestedWordPosition_);
      this.setItemStyle(currentWord);
      this.input_.value = currentWord.title;
    /**
     * Else if user chooses last suggested word in the suggestion menu before
     * pressing DOWN key, remove the highlight of the last word in the 
     * suggestion menu. Set user selction position to null.
     */
    } else if (this.suggestedWordPosition_ == 
               this.numberOfPrefixMatchedPaliWords_) {
      var currentWord = this.getWordElementByIndexNumber(
                               this.suggestedWordPosition_);
      this.suggestedWordPosition_ = null;
      this.removeItemStyle(currentWord);
      this.input_.value = this.originalUserPaliInput_;
    /**
     * Else user chooses some suggested word (not last word) in the suggestion
     * menu before pressing DOWN key, remove the highlight of the previous
     * selected word in the suggestion menu. Highlight the word on bottom of
     * previous word. Set user selction position = previous position + 1.
     */
    } else {
      var previousWord = this.getWordElementByIndexNumber(
                                this.suggestedWordPosition_);
      this.removeItemStyle(previousWord);
      this.suggestedWordPosition_ += 1;
      var currentWord = this.getWordElementByIndexNumber(
                                this.suggestedWordPosition_);
      this.setItemStyle(currentWord);
      this.input_.value = currentWord.title;
    }
  }

  // If user presses ENTER key
  if (code == pali.InputSuggest.KeyCode.RETURN) {
    this.clearSuggestionMenu();
    this.oldInput_ = this.input_.value;
  }

  // If user presses ESC key
  if (code == pali.InputSuggest.KeyCode.ESC) {
    this.input_.value = this.originalUserPaliInput_;
    this.clearSuggestionMenu();
    this.oldInput_ = this.input_.value;
  }
};


/**
 * Retrieve the key code number of key event.
 * @param {DOM event} e The DOM event object, in W3C compliant browser, this is
 *                      passed by browser implicitly. For IE, we have to use
 *                      window.event manually. Please see the code. 
 * @return {number} The key code number.
 * @private
 */
pali.InputSuggest.prototype.getKeyCode = function(e) {
  if (!e) {e = window.event;} // for IE compatible
  var keycode = e.keyCode || e.which; // also for browser compatibility
  return keycode;
};


/**
 * Convert key code number to corresponding character.
 * @param {number} keycode The key code number
 * @return {string} The character corresponding to the input key code
 * @private
 * @deprecated Not used in the code.
 */
pali.InputSuggest.prototype.getKeyCodeChar = function(keycode) {
  return String.fromCharCode(keycode);
};


/**
 * Create id string of DOM element of the suggested word according to index
 * number.
 * @param {number} number The index number representing the suggested word
 * @return {string} id string of the DOM element of suggested word
 * @private
 */
pali.InputSuggest.prototype.getWordElementIdString = function(number) {
  if (typeof number != "number") {
    console.log('in getWordElementIdString: input is not of type number');
  }
  return ("suggestedWord" + number.toString());
};


/**
 * Each word in the suggestion menu is included in a DOM element. Give the index
 * number of the DOM element of suggested word to this function. This function
 * will return the DOM element which contains the word.
 * @param {number} number The index number representing the suggested word.
 * @return {DOM Element} DOM Element The DOM element representing the suggested
 *                                   word.
 * @private
 */
pali.InputSuggest.prototype.getWordElementByIndexNumber = function(number) {
  if (typeof number != "number") {
    console.log('in getWordElementByIndexNumber: input is not of type number');
  }
  return document.getElementById( "suggestedWord" + number.toString() );
};


/**
 * Get the index number which represents the suggested word.
 * @param {DOM Element} element The DOM element of suggested word
 * @return {number} The index number representing the suggested word
 * @private
 */
pali.InputSuggest.prototype.getWordElementIndexNumber = function(element) {
  if (typeof element.id != "string") {
    console.log('in getWordElementIndexNumber: ' +
                'input element.id is not of type string');
  }
  return parseInt(element.id.replace("suggestedWord", ""));
};


/**
 * Highlight the word in the suggestion menu.
 * @param {DOM element} element The DOM element object to be highlighted.
 * @private
 */
pali.InputSuggest.prototype.setItemStyle = function(element) {
  element.style.background = "#00C";
  element.style.color = "white";
};


/**
 * Remove the highlight the word in the suggestion menu.
 * @param {DOM element} element The DOM element object to be removed highlight.
 * @private
 */
pali.InputSuggest.prototype.removeItemStyle = function(element) {
  element.style.background = "";
  element.style.color = "";
};


/*                              width: 80                                     */

/**
 * Here is un-used example code
 * Reference:
 * http://stackoverflow.com/questions/6006763/set-style-with-hover-javascript
 * http://stackoverflow.com/questions/707565/how-do-you-add-css-with-javascript
 * code example:
  var style = document.createElement('style');
  var declarations = document.createTextNode(
    'div.suggestedItem:hover {background:#00C;color:white;}');

  if (style.styleSheet) { style.styleSheet.cssText = declarations.nodeValue; }
  else { style.appendChild(declarations); }

  document.getElementsByTagName("head")[0].appendChild(style);
 */


Suggest.prototype = {
  onItemClick:function(event) {
    this.clearSuggestionMenu();
    this.oldInput_ = this.input_.value;
  },

  onItemMouseOver:function(event) {
    var targetElement = event.target || event.srcElement;
    currentWord = this._checkParent(targetElement);
    var currentWordPosition = this.getWordElementIndexNumber(currentWord);
    if (this.suggestedWordPosition_ == null) {
      this.suggestedWordPosition_ = currentWordPosition;
      this.setItemStyle(currentWord);
      this.input_.value = currentWord.title;
    } else {
      if (this.suggestedWordPosition_ != currentWordPosition) {
        var previousWord = this.getWordElementByIndexNumber(this.suggestedWordPosition_);
        this.removeItemStyle(previousWord);
        this.suggestedWordPosition_ = currentWordPosition;
        this.setItemStyle(currentWord);
        this.input_.value = currentWord.title;
      }
    }
  },

  onItemMouseOut:function(event) {
    var targetElement = event.target || event.srcElement;
    currentWord = this._checkParent(targetElement);
    this.removeItemStyle(currentWord);
  },

  _checkParent: function(element) {
    /* sometimes muose event return the child element of actual element we need, so we need to check parent element */
    /* Chrome and Firefox use parentNode, while Opera uses offsetParent */
    while(element.parentNode) { 
      if( element.id.indexOf('suggest') == 0 ) {return element;}
      element = element.parentNode;
    }
    while(element.offsetParent) { 
      if( element.id.indexOf('suggest') == 0 ) {return element;}
      element = element.offsetParent;
    }
    console.log('in _checkParent: cannot find element with proper id!'); 
    return null;
  },

  clearSuggestionMenu: function() {
    this.suggestDiv_.innerHTML = "";
    this.suggestDiv_.style.display = "none";
    this.suggestedWordPosition_ = null;
    this.numberOfPrefixMatchedPaliWords_ = null;
    this.originalUserPaliInput_ = "";
    this.oldInput_ = "";
    delete this.prefixMatchedPaliWords_;
  },

};

function startSuggest() {Suggest = new Suggest("PaliInput", "suggest");}

window.addEventListener ?
  window.addEventListener('load', startSuggest, false) :
  window.attachEvent('onload', startSuggest);
