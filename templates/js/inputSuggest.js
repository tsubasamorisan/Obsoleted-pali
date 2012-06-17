var prefix_code = {
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

// http://www.enjoyxstudy.com/javascript/suggest/index.en.html
// http://www.phpied.com/3-ways-to-define-a-javascript-class/

var Key = {
  TAB:     9,
  RETURN: 13,
  ESC:    27,
  UP:     38,
  DOWN:   40
};

var Suggest = function() {
  this.initialize.apply(this, arguments);
};

Suggest.prototype = {
  initialize: function(inputId, suggestId) {
    //console.log(inputId);
    //console.log(suggestId);
    this.input = document.getElementById(inputId);
    this.suggestDiv = document.getElementById(suggestId);

    // http://stackoverflow.com/questions/5597060/detecting-arrow-keys-in-javascript
    // http://www.quirksmode.org/js/keys.html
    // http://unixpapa.com/js/key.html
    var _this = this;
    this._addEventListener(this.input, 'keydown', function(){var e=event||window.event;_this.keyEvent(e);});

    this._addEventListener(this.input, 'focus', function(){_this.checkInput();})
    this._addEventListener(this.input, 'blur', function(){_this.stopCheckInput();})
  },

  prefixMatchedArray : [],
  prefixMatchedWordMaxCount : 25,
  suggestedWordPosition : null,
  suggestedWordListSize : null,
  checkInputTimingEventVar : null,
  checkInputEventInterval : 500,//ms
  originalUserPaliInput : "",
  oldInput : "",

  checkInput:function() {
  /* check user input periodically (oninput or onpropertychange is not usable because browser incompatibility) */
    if (this.input.value != this.oldInput) {
      if (this.suggestedWordPosition == null) {
        this.match();
      }
      this.oldInput = this.input.value;
    }
    var _this = this;
    this.checkInputTimingEventVar = setTimeout(function(){_this.checkInput();}, this.checkInputEventInterval);
  },

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
    if (userInputStr.length == 0){
      document.getElementById("result").innerHTML = "";//FIXME: bad practice
      this.flush();
      return;
    }

    //if the first letter in user input string is invalid, return
    if (!prefix_code[userInputStr[0]]) {
      document.getElementById("result").innerHTML = {{_("'No Such Word'")|safe}};//FIXME: bad practice
      return;
    }

    var arrayName = "prefix_" + prefix_code[userInputStr[0]];

    var matched_count = 0;
    var matched_array = new Array();//FIXME: use prefixMatchedArray
    /* keyword: javascript evaluate string as variable
       in this case, eval(arrayName) */
    for (var i=0; i < eval(arrayName).length; i++ ) {
      if (eval(arrayName)[i].indexOf(userInputStr) == 0) {// If the Pali word starts with user input string
        matched_array.push(eval(arrayName)[i]);
        matched_count += 1;
      }
      if (matched_count == this.prefixMatchedWordMaxCount) {break;}
    }
    /* http://www.javascriptkit.com/javatutors/arraysort.shtml */
    /* http://www.w3schools.com/jsref/jsref_sort.asp */
    matched_array.sort();
    this.updateSuggestion(matched_array, userInputStr);
  },

  keyEvent:function(event) {
    if (!this.checkInputTimingEventVar) {
      // Google Search Keyword: javascript object settimeout
      var _this = this;
      this.checkInputTimingEventVar = setTimeout(function(){_this.checkInput();}, this.checkInputEventInterval);
    }

    if (this.suggestedWordListSize == null) {return;}
    var code = this.getKeyCode(event);
    if (code == Key.UP) {
      if (this.suggestedWordPosition == null) {
        this.suggestedWordPosition = this.suggestedWordListSize;
        var currentWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        currentWord.style.background = "#00C";
        currentWord.style.color = "white";
        this.input.value = currentWord.title;
      } else if (this.suggestedWordPosition == 1) {
        var currentWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        this.suggestedWordPosition = null;
        currentWord.style.background = "";
        currentWord.style.color = "";
        this.input.value = this.originalUserPaliInput;
      } else {
        var previousWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        previousWord.style.background = "";
        previousWord.style.color = "";
        this.suggestedWordPosition -= 1;
        var currentWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        currentWord.style.background = "#00C";
        currentWord.style.color = "white";
        this.input.value = currentWord.title;
      }
    }
    if (code == Key.DOWN) {
      if (this.suggestedWordPosition == null) {
        this.suggestedWordPosition = 1;
        var currentWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        currentWord.style.background = "#00C";
        currentWord.style.color = "white";
        this.input.value = currentWord.title;
      } else if (this.suggestedWordPosition == this.suggestedWordListSize) {
        var currentWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        this.suggestedWordPosition = null;
        currentWord.style.background = "";
        currentWord.style.color = "";
        this.input.value = this.originalUserPaliInput;
      } else {
        var previousWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        previousWord.style.background = "";
        previousWord.style.color = "";
        this.suggestedWordPosition += 1;
        var currentWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        currentWord.style.background = "#00C";
        currentWord.style.color = "white";
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
    }
  },

  updateSuggestion:function(matchedArray, userInputStr) {
    this.suggestedWordPosition = null;
    this.suggestedWordListSize = matchedArray.length;
    this.originalUserPaliInput = userInputStr;
    /* create dropdown input suggestion menu */
    this.suggestDiv.innerHTML = "";
    for (var i=0; i<matchedArray.length; i++) {
      /* http://www.javascriptkit.com/javatutors/dom2.shtml */
      var word = document.createElement('span');
      word.id = ("suggestedWord" + (i+1));
      word.title = matchedArray[i];
      word.innerHTML = matchedArray[i].replace(userInputStr, "<b>" + userInputStr + "</b>");
      this.suggestDiv.appendChild(word);
      this.suggestDiv.innerHTML += '<br />';
    }
    this.suggestDiv.style.left = getOffset(document.getElementById('PaliInput')).left + "px";
    this.suggestDiv.style.textAlign = 'left';
    this.suggestDiv.style.fontFamily = 'Gentium Basic, arial, serif';
    this.suggestDiv.style.fontSize = '100%';
    this.suggestDiv.style.display = '';
  },

  flush: function() {
    this.suggestDiv.innerHTML = "";
    this.suggestDiv.style.display = "none";
    this.suggestedWordPosition = null;
    this.suggestedWordListSize = null;
    this.originalUserPaliInput = "";
    this.oldInput = "";
  },

  _addEventListener:function(e, evt, fn) {
    if (window.addEventListener) {
      e.addEventListener(evt, fn, false);
    } else {
      e.attachEvent('on'+evt, fn);
    }
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
