/**
 * @fileoverview Look up word and show preview of words in AJAX way
 * TODO: pass i18n string as parameters?
 * FIXME: This file is not modulized because of i18n string function
 */

pali.require('base');
pali.require('customevent');
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

  /**
   * flag to enable word preview. disabled by default
   * @type {boolean}
   * @private
   */
  this.isWordPreviewEnabled_ = false;

  // close preview div when suggestion div closes
  PaliCustomEvent.addCustomEvent(
    PaliCustomEvent.CUSTOM_EVENT_TYPE.ON_SUGGESTION_MENU_CLOSED,
    function(){this.previewDiv_.style.display='none';}.bind(this));
};


/**
 * enable word preview
 * @private
 */
Lookup.prototype.enableWordPreview = function() {
  this.isWordPreviewEnabled_ = true;

  // start to periodically check whether preview should be shown
  this.previewCheck();
};


/**
 * disable word preview
 * @private
 */
Lookup.prototype.disableWordPreview = function() {
  this.isWordPreviewEnabled_ = false;
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
 * @param {string} url The url to looked up the word
 * @param {string} callback The callback function
 * @private
 */
Lookup.jsonp = function(word, url, callback) {
  var qry = '?word=' + encodeURIComponent(word) + '&callback=' + 
            encodeURIComponent(callback);
  var ext = document.createElement('script');
  ext.setAttribute('src', url + qry);
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
 * Get lookup data of a word from the server by HTTP Get
 * @param {string} word The word to be looked up
 * @param {function} callback The callback function
 * @param {function} failCallback The callback function if http get fails
 * @private
 */
Lookup.httpget = function(word, callback, failCallback) {
  /**
   * Resolve the URL of the word to issue HTTP Get by information provided by
   * groupInfo global variable.
   */

  // FIXME: bad practice: call of groupInfo
  if (!groupInfo) throw 'groupInfo not ready';

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
  if (version == -1) {
    setTimeout(failCallback, 0);
    console.log('no version (should not happen here)');
    return;
  }

  /**
   * example:
   * groupInfo['dir'] = {
   *   'a' : { ... },
   *   'b' : [],
   *   'c' : [],
   *   ...
   * }
   */
  var path = Lookup.getStaticPath(word, groupInfo['dir'], 'json/', 1);
  if (path == null) {
    this.result_.innerHTML = getStringNoSuchWord();
    throw 'no path (should not happen here)';
  }
  var encodedPath = path + encodeURIComponent(word) + '.json';
  encodedPath = encodedPath.replace(/%/g, 'Z');

  if (window.location.host == 'siongui.webfactional.com') {
    var url = 'http://siongui.webfactional.com/' +
              encodedPath + '?v=json' + version;
  } else if (window.location.host == 'siongui.pythonanywhere.com') {
    var url = 'http://siongui.pythonanywhere.com/' +
              encodedPath + '?v=json' + version;
  } else {
    var url = 'http://json' + version + '.palidictionary.appspot.com/'
              + encodedPath;
  }

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200 || xmlhttp.status == 304) {
        //this.result_.innerHTML = xmlhttp.status;
        //this.result_.innerHTML = xmlhttp.statusText;
        //this.result_.innerHTML = xmlhttp.responseText;
        setTimeout(callback(eval('(' + xmlhttp.responseText + ')')), 0);
      } else {
        setTimeout(failCallback, 0);
      }
    }
  }.bind(this);

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
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
Lookup.getStaticPath = function(word, dirInfo, prefix, digit) {
  if (dirInfo.length == 0) {
    // dirInfo is an empty array
    return prefix;
  } else if (typeof dirInfo == 'object') {
    // dirInfo is an object containing prefixes of words.
    for (var key in dirInfo) {
      // if word startswith key
      if (word.indexOf(key) == 0 && key.length == digit) {
        var suffix = encodeURIComponent(key) + '/';

        if (word.length == digit) {
          if (dirInfo[key].length == 0) return (prefix + suffix);
          return (prefix + suffix + suffix);
        }
        // recursively call self to resolve path
        return Lookup.getStaticPath(word, dirInfo[key],
                                  prefix + suffix, digit + 1);
      }
    }
    return null;
  } else {
    throw 'only {...} or [] is allowed!';
  }
};


/**
 * Check whether preview should be shown periodically
 * @private
 */
Lookup.prototype.previewCheck = function() {
  if (!this.isWordPreviewEnabled_) {
    this.previewDiv_.style.display = 'none';
    return;
  }

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
  if (this.lookupMethod_ == 'get') {
    Lookup.httpget(word, this.callbackPv.bind(this), function(){});
  } else if (this.lookupMethod_ == 'post') {
    this.httppost(word, 'callbackPv');
  } else {
    Lookup.jsonp(word, this.lookupUrl_, this.globalName_ + '["callbackPv"]');
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

  if (this.previewDiv_.style.display == 'block' ) {
    try {
      if (this.previewDiv_.firstChild.firstChild.innerHTML == jsonData['word'])
        return;
    } catch (err) {}
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

  if (this.lookupMethod_ == 'get') {
    var failCallback = function() {
      this.result_.innerHTML = getStringNoSuchWord();
    }.bind(this);
    Lookup.httpget(word, this.callback.bind(this), failCallback);
  } else if (this.lookupMethod_ == 'post') {
    this.httppost(word, 'callback');
  } else {
    Lookup.jsonp(word, this.lookupUrl_, this.globalName_ + '["callback"]');
  }
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
  this.textInput_.blur();
  window.scrollTo(0, pali.getOffset(
    document.getElementById('upperAD')).top);
};
