// http://www.enjoyxstudy.com/javascript/suggest/index.en.html
// http://www.phpied.com/3-ways-to-define-a-javascript-class/

if (!Suggest) {var Suggest = {};}

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

  keyEvent:function(event) {
    var code = this.getKeyCode(event);
    if (code == Key.UP) {
      console.log('up');
    }
    if (code == Key.DOWN) {
      console.log('down');
    }
  },

  createSuggestion:function() {
    /* create dropdown input suggestion menu */
    this.suggest.innerHTML = "";
    //suggest.position.left = getOffset(document.getElementById('PaliInput')).left;
    for (i=0; i<matched_array.length; i++) {
      /* http://www.javascriptkit.com/javatutors/dom2.shtml */
      var word = document.createElement('span');
      word.innerHTML = matched_array[i].replace(userInputStr, "<b>" + userInputStr + "</b>");
      this.suggest.appendChild(word);
      this.suggest.innerHTML += '<br />';
    }
    this.suggest.style.left = getOffset(document.getElementById('PaliInput')).left;
    this.suggest.style.textAlign = 'left';
    this.suggest.style.fontFamily = 'Gentium Basic, arial, serif';
    this.suggest.style.fontSize = '100%';
    this.suggest.style.display = '';
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

function startSuggest() {new Suggest("PaliInput", "suggest");}

window.addEventListener ?
  window.addEventListener('load', startSuggest, false) :
  window.attachEvent('onload', startSuggest);
