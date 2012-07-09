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
 * @param {string=} inputId element id for text input
 * @param {string=} suggestDivId element id for suggestion Div Menu
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
   References:
   http://stackoverflow.com/questions/5597060/detecting-arrow-keys-in-javascript
   http://www.quirksmode.org/js/keys.html
   http://unixpapa.com/js/key.html
   */

  // cannot use keyword 'this' directly because of context change
  var this_ = this;

  // monitor arrow keys event of text input
  pali.addEventListener(this.input_, 'keydown',
                           function(e){this_.keyEvent(e);});

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
   * The position of user selection in suggestion menu
   * @type {number|null}
   * @private
   */
  this.suggestedWordPosition_ = null;

  /**
   * size of prefixMatchedPaliWords_, i.e.,
   * number of prefix-match pāli words in suggestion menu.
   * This value can not be larger than MAX_WORDS_IN_SUGGESTION_MENU.
   * @type {number|null}
   * @private
   */
  this.suggestedPaliWordsArraySize_ = null;

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
 * check user input periodically.
 * (oninput or onpropertychange is not usable because browser incompatibility)
 * @private
 */
pali.Inputsuggest.prototype.checkInput = function() {
  if (this.input_.value != this.oldInput_) { // user input changes
    if (this.suggestedWordPosition_ == null) {
      this.match();
    } else {
      if( this.prefixMatchedPaliWords_[this.suggestedWordPosition_ - 1]
          != this.input_.value) {
	this.match();
      }
    }
    this.oldInput_ = this.input_.value; // keep new value of user input
  }

  // set this function to be executed once again
  var _this = this;
  this.checkInputTimingEventVar_ = setTimeout(
    function(){_this.checkInput_();},
    pali.InputSuggest.CHECK_INPUT_EVENT_INTERVAL_IN_MS
  );
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


  stopCheckInput:function() {
    clearTimeout(this.checkInputTimingEventVar);
    this.flush();
  },

  match:function() {
    // remove whitespace in the beginning and end of the string
    var userInputStr = this.input.value.replace(/(^\s+)|(\s+$)/g, "");

/*
  keyword: javascript string prefix match
  http://stackoverflow.com/questions/457160/the-most-efficient-algorithm-to-find-first-prefix-match-from-a-sorted-string-arr
*/
    /* TODO: should we convert the string to lower case here? */

    /* Here we give simple implementation for prefix matching */
    if (userInputStr.length == 0) {this.flush();return;}

    //if the first letter in user input string is invalid, return
    if (!prefix_code[userInputStr[0]]) {return;}

    var arrayName = "prefix_" + prefix_code[userInputStr[0]];

    var matched_count = 0;
    this.prefixMatchedArray = new Array();
    /* keyword: javascript evaluate string as variable
       in this case, eval(arrayName) */
    for (var i=0; i < eval(arrayName).length; i++ ) {
      if (eval(arrayName)[i].indexOf(userInputStr) == 0) {// If the Pali word starts with user input string
        this.prefixMatchedArray.push(eval(arrayName)[i]);
        matched_count += 1;
      }
      if (matched_count == this.prefixMatchedWordMaxCount) {break;}
    }
    if (matched_count == 0) {this.flush();return;}
    /* http://www.javascriptkit.com/javatutors/arraysort.shtml */
    /* http://www.w3schools.com/jsref/jsref_sort.asp */
    this.prefixMatchedArray.sort();
    this.updateSuggestion(userInputStr);
  },

  keyEvent:function(event) {
    if (!this.checkInputTimingEventVar) {
      // Google Search Keyword: javascript object settimeout
      var _this = this;
      this.checkInputTimingEventVar = setTimeout(function(){_this.checkInput();}, this.checkInputEventInterval);
    }

    var code = this.getKeyCode(event);
    if (this.suggestedWordListSize == null) {
      if ((code == Key.DOWN) && (this.input.value != "")){this.match();}
      if ((code == Key.UP) && (this.input.value != "")){this.match();}
      return;
    }
    if (code == Key.UP) {
      if (this.suggestedWordPosition == null) {
        this.suggestedWordPosition = this.suggestedWordListSize;
        var currentWord = this._getWordElementByNumberIndex(this.suggestedWordPosition);
        this._setItemStyle(currentWord);
        this.input.value = currentWord.title;
      } else if (this.suggestedWordPosition == 1) {
        var currentWord = this._getWordElementByNumberIndex(this.suggestedWordPosition);
        this.suggestedWordPosition = null;
        this._removeItemStyle(currentWord);
        this.input.value = this.originalUserPaliInput;
      } else {
        var previousWord = this._getWordElementByNumberIndex(this.suggestedWordPosition);
        this._removeItemStyle(previousWord);
        this.suggestedWordPosition -= 1;
        var currentWord = this._getWordElementByNumberIndex(this.suggestedWordPosition);
        this._setItemStyle(currentWord);
        this.input.value = currentWord.title;
      }
    }
    if (code == Key.DOWN) {
      if (this.suggestedWordPosition == null) {
        this.suggestedWordPosition = 1;
        var currentWord = this._getWordElementByNumberIndex(this.suggestedWordPosition);
        this._setItemStyle(currentWord);
        this.input.value = currentWord.title;
      } else if (this.suggestedWordPosition == this.suggestedWordListSize) {
        var currentWord = this._getWordElementByNumberIndex(this.suggestedWordPosition);
        this.suggestedWordPosition = null;
        this._removeItemStyle(currentWord);
        this.input.value = this.originalUserPaliInput;
      } else {
        var previousWord = this._getWordElementByNumberIndex(this.suggestedWordPosition);
        this._removeItemStyle(previousWord);
        this.suggestedWordPosition += 1;
        var currentWord = this._getWordElementByNumberIndex(this.suggestedWordPosition);
        this._setItemStyle(currentWord);
        this.input.value = currentWord.title;
      }
    }
    if (code == Key.RETURN) {
      this.flush();
      this.oldInput = this.input.value;
    }
    if (code == Key.ESC) {
      this.input.value = this.originalUserPaliInput;
      this.flush();
      this.oldInput = this.input.value;
    }
  },

  onItemClick:function(event) {
    this.flush();
    this.oldInput = this.input.value;
  },

  onItemMouseOver:function(event) {
    var targetElement = event.target || event.srcElement;
    currentWord = this._checkParent(targetElement);
    var currentWordPosition = this._getWordElementNumberIndex(currentWord);
    if (this.suggestedWordPosition == null) {
      this.suggestedWordPosition = currentWordPosition;
      this._setItemStyle(currentWord);
      this.input.value = currentWord.title;
    } else {
      if (this.suggestedWordPosition != currentWordPosition) {
        var previousWord = this._getWordElementByNumberIndex(this.suggestedWordPosition);
        this._removeItemStyle(previousWord);
        this.suggestedWordPosition = currentWordPosition;
        this._setItemStyle(currentWord);
        this.input.value = currentWord.title;
      }
    }
  },

  onItemMouseOut:function(event) {
    var targetElement = event.target || event.srcElement;
    currentWord = this._checkParent(targetElement);
    this._removeItemStyle(currentWord);
  },

  updateSuggestion:function(userInputStr) {
    this.suggestedWordPosition = null;
    this.suggestedWordListSize = this.prefixMatchedArray.length;
    this.originalUserPaliInput = userInputStr;
    /* create dropdown input suggestion menu */
    this.suggestDiv.innerHTML = "";
    var _this = this;
    for (var i=0; i < this.prefixMatchedArray.length; i++) {
      /* http://www.javascriptkit.com/javatutors/dom2.shtml */
      var word = document.createElement('div');
      word.id = this._getWordElementIdString((i+1));
      word.title = this.prefixMatchedArray[i];
      word.innerHTML = this.prefixMatchedArray[i].replace(userInputStr, "<b>" + userInputStr + "</b>");

      this._addEventListener(word, 'click', function(e){_this.onItemClick(e);});
      this._addEventListener(word, 'mouseover', function(e){_this.onItemMouseOver(e);});
      this._addEventListener(word, 'mouseout', function(e){_this.onItemMouseOut(e);});

      this.suggestDiv.appendChild(word);
    }
    this.suggestDiv.style.left = getOffset(this.input).left + "px";
    this.suggestDiv.style.minWidth = this.input.offsetWidth + "px";
    this.suggestDiv.style.textAlign = 'left';
    this.suggestDiv.style.fontFamily = 'Gentium Basic, arial, serif';
    this.suggestDiv.style.fontSize = '100%';
    this.suggestDiv.style.display = 'block';
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

  _getWordElementByNumberIndex: function(number) {
    if (typeof number != "number") {console.log('in _getWordElementByNumberIndex: input is not of type number');}
    return document.getElementById("suggestedWord"+number.toString());
  },

  _getWordElementNumberIndex: function(element) {
    if (typeof element.id != "string") {console.log('in _getWordElementNumberIndexById: input element.id is not of type string');}
    return parseInt(element.id.replace("suggestedWord", ""));
  },

  _getWordElementIdString: function(number) {
    if (typeof number != "number") {console.log('in _getWordElementIdString: input is not of type number');}
    return ("suggestedWord" + number.toString());
  },

  _setItemStyle: function(e) {
    e.style.background = "#00C";
    e.style.color = "white";
  },

  _removeItemStyle: function(e) {
    e.style.background = "";
    e.style.color = "";
  },

  flush: function() {
    this.suggestDiv.innerHTML = "";
    this.suggestDiv.style.display = "none";
    this.suggestedWordPosition = null;
    this.suggestedWordListSize = null;
    this.originalUserPaliInput = "";
    this.oldInput = "";
    delete this.prefixMatchedArray;
  },

  getKeyCode : function(e) {
    if (!e) {e = window.event;}
    var keycode = e.keyCode || e.which;
    return keycode;
  },

  getKeyCodeChar : function(keycode) {
    return String.fromCharCode(keycode);
  }

};

function startSuggest() {Suggest = new Suggest("PaliInput", "suggest");}

window.addEventListener ?
  window.addEventListener('load', startSuggest, false) :
  window.attachEvent('onload', startSuggest);
