// http://www.enjoyxstudy.com/javascript/suggest/index.en.html
// http://www.phpied.com/3-ways-to-define-a-javascript-class/

Key = {
  TAB:     9,
  RETURN: 13,
  ESC:    27,
  UP:     38,
  DOWN:   40
};

Suggest = function() {
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

  keyEvent:function(event) {
    if (this.suggestedWordListSize == null) {return;}
    var code = this.getKeyCode(event);
    if (code == Key.UP) {
      if (this.suggestedWordPosition == null) {
        this.suggestedWordPosition = this.suggestedWordListSize;
        var currentWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        currentWord.style.background = "#00C";
        currentWord.style.color = "white";
      } else if (this.suggestedWordPosition == 1) {
        var currentWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        this.suggestedWordPosition = null;
        currentWord.style.background = "";
        currentWord.style.color = "";
      } else {
        var previousWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        previousWord.style.background = "";
        previousWord.style.color = "";
        this.suggestedWordPosition -= 1;
        var currentWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        currentWord.style.background = "#00C";
        currentWord.style.color = "white";
      }
    }
    if (code == Key.DOWN) {
      if (this.suggestedWordPosition == null) {
        this.suggestedWordPosition = 1;
        var currentWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        currentWord.style.background = "#00C";
        currentWord.style.color = "white";
      } else if (this.suggestedWordPosition == this.suggestedWordListSize) {
        var currentWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        this.suggestedWordPosition = null;
        currentWord.style.background = "";
        currentWord.style.color = "";
      } else {
        var previousWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        previousWord.style.background = "";
        previousWord.style.color = "";
        this.suggestedWordPosition += 1;
        var currentWord = document.getElementById("suggestedWord"+this.suggestedWordPosition);
        currentWord.style.background = "#00C";
        currentWord.style.color = "white";
      }
    }
  },

  updateSuggestion:function(matchedArray, userInputStr) {
    this.suggestedWordPosition = null;
    this.suggestedWordListSize = matchedArray.length;
    /* create dropdown input suggestion menu */
    this.suggestDiv.innerHTML = "";
    for (i=0; i<matchedArray.length; i++) {
      /* http://www.javascriptkit.com/javatutors/dom2.shtml */
      var word = document.createElement('span');
      word.id = ("suggestedWord" + (i+1));
      word.innerHTML = matchedArray[i].replace(userInputStr, "<b>" + userInputStr + "</b>");
      this.suggestDiv.appendChild(word);
      this.suggestDiv.innerHTML += '<br />';
    }
    this.suggestDiv.style.left = getOffset(document.getElementById('PaliInput')).left;
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
  },

};

if (!Suggest) {var Suggest = {};}
function startSuggest() {Suggest = new Suggest("PaliInput", "suggest");}

window.addEventListener ?
  window.addEventListener('load', startSuggest, false) :
  window.attachEvent('onload', startSuggest);
