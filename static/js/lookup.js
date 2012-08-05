/**
 * @fileoverview Look up word and show preview of words in AJAX way
 * TODO: pass i18n string as parameters?
 * FIXME: This file is not modulized because of i18n string function
 */

pali.require('base');
pali.require('data2dom');

/**
 * Class to look up word and show preview of words in AJAX way.
 *
 * @param {string} textInputId The id of DOM element which is the text input of
 *                             word to be lookup
 * @param {string} formId The id of DOM element which contains above text input
 *                        of word to be looked up.
 * @param {string} resultId The id of DOM element to show the result of the word
 *                          lookup. (should be empty DIV or SPAN)
 * @param {string} previewDivId The id of DOM element to show the preview of
 *                              user input or selected word
 * @param {string} suggestDivId element id for suggestion Div Menu
 * @param {string} lookupUrl The URL to look up word
 * @param {string} lookupMethod The method to look up word
 * @constructor
 */
Lookup = function(textInputId, formId, resultId, previewDivId, suggestDivId,
                  lookupUrl, lookupMethod) {
  /**
   * The DOM element which is the text input of word to be looked up.
   * @const
   * @type {DOM Element}
   * @private
   */
  this.textInput_ = document.getElementById(textInputId);
  if (!this.textInput_) throw "Lookup.NoTextInput";

  /**
   * The DOM element which contains above text input of word to be looked up.
   * @const
   * @type {DOM Element}
   * @private
   */
  this.form_ = document.getElementById(formId);
  if (!this.form_) throw "Lookup.NoForm";

  this.form_.action = "javascript:void(0);";
  this.form_.onsubmit = this.lookup.bind(this);

  /**
   * The DOM element to show the result of the word lookup.
   * (should be empty DIV or SPAN)
   * @const
   * @type {DOM Element}
   * @private
   */
  this.result_ = document.getElementById(resultId);
  if (!this.result_) throw "Lookup.NoResult";

  /**
   * The DOM element to show preview of the word.
   * @const
   * @type {DOM Element}
   * @private
   */
  this.previewDiv_ = document.getElementById(previewDivId);
  if (!this.previewDiv_) throw "Lookup.NoWordPreviewDiv";

  /**
   * DOM element of suggestion menu of words
   * @const
   * @type {DOM Element}
   * @private
   */
  this.suggestDiv_ = document.getElementById(suggestDivId);
  if (!this.suggestDiv_) throw "Lookup.NoSuggestDiv";

  /**
   * The URL to look up word.
   * @const
   * @type {string}
   * @private
   */
  if (typeof lookupUrl != 'string')
    throw 'Lookup.BadLookupUrlFormat'
  this.lookupUrl_ = lookupUrl;

  /**
   * The method to look up word.
   * {'jsonp' | 'post' | 'get'}
   * @const
   * @type {string}
   * @private
   */
  if (typeof lookupMethod != 'string')
    throw 'Lookup.BadLookupMethodFormat'
  this.lookupMethod_ = lookupMethod;

  if (this.lookupMethod_ == 'jsonp') {
    /**
     * The name of this object in global scope, i.e.,
     * window[this.globalName_] = this;
     * @const
     * @type {string}
     * @private
     */
    this.globalName_ = pali.setObjectGlobalName(this);

    // for closure compiler advance optimization
    if (!this['callback']) this['callback'] = this.callback;
    if (!this['callbackPv']) this['callbackPv'] = this.callbackPv;
  }

  /**
   * Cache for the json-format data of words
   * this.cache_[word] = jsonData;
   * @const
   * @type {object}
   * @private
   */
  this.cache_ = {};

  // start to periodically check whether preview should be shown
  this.previewCheck();
};


/**
 * Before looking up the word, the word needs to be processed. For example,
 * strip beginning and ending white spaces of the word, and validity of the
 * word.
 * @return {string|null} The processed word to be looked up, or null if invalid
 *                       word
 * @private
 */
Lookup.prototype.getProcessedUserInput = function() {
  /**
   * Remove whitespace in the beginning and end of user input string
   * @const
   * @type {string}
   * @private
   */
  var userInputStr = this.textInput_.value.replace(/(^\s+)|(\s+$)/g, '');
  if (userInputStr.length == 0) return null;

  // FIXME: bad practice: call of dicPrefixWordLists
  // check if dicPrefixWordLists exists
  if (!dicPrefixWordLists) return null;

  // check if user input is a valid word
  var prefix = '';
  for (var key in dicPrefixWordLists) {
    if (userInputStr[0] == key) {
      prefix = key;
      break;
    }
  }
  // if no words start with 'prefix'
  if (prefix == '') return null;

  var matchedWord = '';
  for (var index in dicPrefixWordLists[prefix]) {
    if (dicPrefixWordLists[prefix][index] == userInputStr) {
      matchedWord = dicPrefixWordLists[prefix][index];
      break;
    }
  }
  // if no matched word
  if (matchedWord == '') return null;

  return matchedWord;
};


/**
 * Get lookup data of a word from the server by JSONP
 * @param {string} word The word to be looked up
 * @param {string} callbackName The name of callback function
 * @private
 */
Lookup.prototype.jsonp = function(word, callbackName) {
  var qry = '?word=' + encodeURIComponent(word) + '&callback=' +
            encodeURIComponent(this.globalName_ + '[' + callbackName + ']');
  var ext = document.createElement('script');
  ext.setAttribute('src', this.lookupUrl_ + qry);
  document.getElementsByTagName("head")[0].appendChild(ext);
};


/**
 * Get lookup data of a word from the server by HTTP Post
 * @param {string} word The word to be looked up
 * @param {string} callbackName The name of callback function
 * @private
 */
Lookup.prototype.httppost = function(word, callbackName) {
  var xmlhttp;

  if (window.XMLHttpRequest) {
    xmlhttp=new XMLHttpRequest();
  } else {
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        //this.result_.innerHTML = xmlhttp.status;
        //this.result_.innerHTML = xmlhttp.statusText;
        //this.result_.innerHTML = xmlhttp.responseText;
        this[callbackName](eval('(' + xmlhttp.responseText + ')'));
      } else {
        this.result_.innerHTML = 'XMLHttpRequest Post Err!';
        throw "XMLHttpRequest Post Err!";
      }
    }
  }.bind(this);

  xmlhttp.open("POST", this.lookupUrl_, true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("word=" + encodeURIComponent(word));
};


/**
 * Check whether preview should be shown periodically
 * @private
 */
Lookup.prototype.previewCheck = function() {
  // check if suggestion menu exists
  if (this.suggestDiv_.style.display == 'none') {
    this.previewDiv_.style.display = 'none';
    // check again in 1000 ms
    setTimeout(this.previewCheck.bind(this), 1000);
    return;
  }

  var word = this.getProcessedUserInput();
  if (word == null) {
    this.previewDiv_.style.display = 'none';
    // check again in 1000 ms
    setTimeout(this.previewCheck.bind(this), 1000);
    return;
  }

  /**
   * Check whether there is already json data of this word in the cache,
   * if yes, use the cached data.
   */
  if (this.cache_.hasOwnProperty(word)) {
    var jsonData = this.cache_[word];
    if (jsonData['data'] == null) {
      this.previewDiv_.style.display = 'none';
    }
    else {
      this.callbackPv(jsonData);
    }
    // check again in 1000 ms
    setTimeout(this.previewCheck.bind(this), 1000);
    return;
  }

  // start to look up the word
  if (this.lookupMethod_ == 'jsonp') {
    this.jsonp(word, 'callbackPv');
  } else if (this.lookupMethod_ == 'post') {
    this.httppost(word, 'callbackPv');
  } else {
    // get lookup data of a word from the server by HTTP Get (Default)
  }

  // check again in 1000 ms
  setTimeout(this.previewCheck.bind(this), 1000);
};

/**
 * Common preview callback function
 * @param {object} jsonData The JSON-format data which contains the result of
 *                          word lookup. "list of 3-tuple" in Python
 * @private
 */
Lookup.prototype.callbackPv = function(jsonData) {
  if (!this.cache_.hasOwnProperty(jsonData['word'])) {
    // add lookup json data to cache
    this.cache_[jsonData['word']] = jsonData;
  }

  if (jsonData['data'] == null) {
    this.previewDiv_.style.display = 'none';
    return;
  }

  if (jsonData['word'] != 
      this.textInput_.value.replace(/(^\s+)|(\s+$)/g, '')) {
    this.previewDiv_.style.display = 'none';
    return;
  }

  // Show preview of the word
  this.previewDiv_.style.left = (pali.getOffset(this.textInput_).left +
    this.suggestDiv_.offsetWidth + 3) + "px";
  this.previewDiv_.style.width = '30em';
  this.previewDiv_.style.display = 'block';
  this.previewDiv_.style.textAlign = 'left';
  this.previewDiv_.innerHTML = '';
  this.previewDiv_.appendChild(Data2dom.createPreview(jsonData));
};


/**
 * Look up word
 * @private
 */
Lookup.prototype.lookup = function() {
  this.result_.innerHTML = getStringLookingUp();

  var word = this.getProcessedUserInput();
  if (word == null) {
    this.result_.innerHTML = getStringNoSuchWord();
    return;
  }

  /**
   * Check whether there is already json data of this word in the cache,
   * if yes, use the cached data.
   */
  if (this.cache_.hasOwnProperty(word)) {
    this.callback(this.cache_[word])
    return;
  }

  if (this.lookupMethod_ == 'jsonp') {
    this.jsonp(word, 'callback');
    return;
  }

  if (this.lookupMethod_ == 'post') {
    this.httppost(word, 'callback');
    return;
  }

  // get lookup data of a word from the server by HTTP Get (Default)

  /**
   * Resolve the URL of the word to issue HTTP Get by information provided by
   * groupInfo global variable.
   */

  // FIXME: bad practice: call of groupInfo
  if (!groupInfo) return;

  /**
   * example:
   * groupInfo['version'] = {
   *   'a' : 0,
   *   'b' : 0,
   *   'c' : 1,
   *   ...
   * }
   */
  var version = -1;
  for (var prefix in groupInfo['version']) {
    if (prefix == word[0]) {
      version = groupInfo['version'][prefix];
      break;
    }
  }
  if (version == -1) throw 'no version (should not happen here)';

  /**
   * example:
   * groupInfo['dir'] = {
   *   'a' : { ... },
   *   'b' : [],
   *   'c' : [],
   *   ...
   * }
   */
  var path = this.getStaticPath(word, groupInfo['dir'], 'json/', 1);
  if (path == null) {
    this.result_.innerHTML = getStringNoSuchWord();
    return;
  }
  var encodedPath = path + encodeURIComponent(word) + '.json';
  encodedPath = encodedPath.replace(/%/g, 'Z');

  if (window.location.host == 'localhost:8080' ||
      window.location.host == 'pali.googlecode.com' ||
      window.location.host == 'siongui.webfactional.com') {
    var url = 'http://siongui.webfactional.com/' +
              encodedPath + '?v=json' + version;
  } else if (window.location.host == 'siongui.pythonanywhere.com') {
    var url = 'http://siongui.pythonanywhere.com/' +
              encodedPath + '?v=json' + version;
  } else {
    var url = 'http://json' + version + '.palidictionary.appspot.com/'
              + encodedPath;
  }

  var xmlhttp;

  if (window.XMLHttpRequest) {
    xmlhttp=new XMLHttpRequest();
  } else {
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200 || xmlhttp.status == 304) {
        //this.result_.innerHTML = xmlhttp.status;
        //this.result_.innerHTML = xmlhttp.statusText;
        //this.result_.innerHTML = xmlhttp.responseText;
        this.callback(eval('(' + xmlhttp.responseText + ')'));
      } else {
        this.result_.innerHTML = getStringNoSuchWord();
      }
    }
  }.bind(this);

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
};


/**
 * Common callback function
 * @param {object} jsonData The JSON-format data which contains the result of
 *                          word lookup. "list of 3-tuple" in Python
 * @private
 */
Lookup.prototype.callback = function(jsonData) {
  if (!this.cache_.hasOwnProperty(jsonData['word'])) {
    // add lookup json data to cache
    this.cache_[jsonData['word']] = jsonData;
  }

  this.result_.innerHTML = "";
  // Show lookup data
  this.result_.appendChild(Data2dom.createLookupTable(jsonData));
};


/**
 * Recursive function to resolve the path of the URL of the word.
 * @param {string} word The word to resolve the path of the URL
 * @param {object|array} dirInfo
 * @param {string} prefix
 * @param {number} digit
 * @return
 * @private
 */
Lookup.prototype.getStaticPath = function(word, dirInfo, prefix, digit) {
  if (dirInfo.length == 0) {
    return prefix;
  } else if (typeof dirInfo == 'object') {
    for (var key in dirInfo) {
      // if word startswith key
      if (word.indexOf(key) == 0 && key.length == digit) {
        if (word.length == digit) {
          if (dirInfo[key].length == 0) {
            return (prefix + encodeURIComponent(key) + '/');
          }
          return (prefix + encodeURIComponent(key) + '/' +
                           encodeURIComponent(key) + '/');
        }

        return this.getStaticPath(word, dirInfo[key],
                                  prefix + encodeURIComponent(key) + '/',
                                  digit + 1);
      }
    }
    return null;
  } else {
    throw 'only object or empty array is allowed!';
  }
};
