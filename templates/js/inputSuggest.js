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
    this._addEvent(this.input, 'keydown', this._bindEvent(this.keyEvent));
  },

  prefixMatchedArray : [],
  suggestedWordPosition : null,
  suggestedWordListSize : null,
  originalUserPaliInput : null,

  keyEvent:function(event) {
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
    for (i=0; i<matchedArray.length; i++) {
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
    this.originalUserPaliInput = null;
  },

  _addEvent:function(element, type, func) {
    if (window.addEventListener) {
      element.addEventListener(type, func, false);
    } else {
      element.attachEvent('on' + type, func);
    }
  },

  _bindEvent: function(func) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    return function(event){ event = event || window.event; func.apply(self, [event].concat(args)); };
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
