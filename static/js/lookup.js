/**
 * @fileoverview Look up word in AJAX way
 * TODO: pass i18n string as parameters?
 * FIXME: This file is not modulized because of i18n string function
 */

pali.require('base');

/**
 * Class to look up word in AJAX way.
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
 * @param {string} lookupURL The URL to look up word
 * @param {boolean} useJSONP Use JSONP if true. use HTTP Post if false.
 * @constructor
 */
Lookup = function(textInputId, formId, resultId, previewDivId, suggestDivId,
                  lookupURL, useJSONP) {
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
  this.wordPvDiv_ = document.getElementById(previewDivId);
  if (!this.wordPvDiv_) throw "Lookup.NoWordPreviewDiv";

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
  this.url_ = lookupURL;

  if (useJSONP) {
    this.form_.action = "javascript:void(0);";
    this.form_.onsubmit = this.lookupByJSONP.bind(this);
  } else {
    this.form_.action = "javascript:void(0);";
    this.form_.onsubmit = this.lookupByHTTPPost.bind(this);
  }

  /**
   * The name of this object in global scope, i.e.,
   * window[this.globalName_] = this;
   * @const
   * @type {string}
   * @private
   */
  this.globalName_ = pali.setObjectGlobalName(this);

  if (!this['JSONPCallback']) this['JSONPCallback'] = this.JSONPCallback;

  /**
   * Cache for the json-format data of words
   * this.wordCache_[word] = jsonData;
   * @const
   * @type {object}
   * @private
   */
  this.wordCache_ = {};

  // start to check whether preview should be shown periodically
  this.previewCheck();
};


/**
 * Check whether preview should be shown periodically
 * @private
 */
Lookup.prototype.previewCheck = function() {
  // check if suggestion menu exists
  if (this.suggestDiv_.style.display == 'none') {
    this.wordPvDiv_.style.display = 'none';
    // check again in 1000 ms
    setTimeout(this.previewCheck.bind(this), 1000);
    return;
  }

  /**
   * Remove whitespace in the beginning and end of user input string
   * @const
   * @type {string}
   * @private
   */
  var userInputStr = this.textInput_.value.replace(/(^\s+)|(\s+$)/g, '');
  if (userInputStr.length == 0) {
    this.wordPvDiv_.style.display = 'none';
    // check again in 1000 ms
    setTimeout(this.previewCheck.bind(this), 1000);
    return;
  }

  /**
   * Check whether there is already json data of this word in the cache,
   * if yes, use the cached data.
   */
  if (this.wordCache_.hasOwnProperty(userInputStr)) {
    this.showPreview(this.wordCache_[userInputStr]);
    // check again in 1000 ms
    setTimeout(this.previewCheck.bind(this), 1000);
    return;
  }

  // check if dicPrefixWordLists exists
  if (!dicPrefixWordLists) {
    this.wordPvDiv_.style.display = 'none';
    console.log('No dicPrefixWordLists');
    // check again in 1000 ms
    setTimeout(this.previewCheck.bind(this), 1000);
    return;
  }

  // suggestion menu exists & dicPrefixWordLists exists &
  // stripped user input string != ''. check if user input is a valid word
  var prefix = '';
  for (var key in dicPrefixWordLists) {
    if (userInputStr[0] == key) {
      prefix = key;
      break;
    }
  }
  if (prefix == '') {
    this.wordPvDiv_.style.display = 'none';
    // check again in 1000 ms
    setTimeout(this.previewCheck.bind(this), 1000);
    return;
  }

  var matchedWord = '';
  for (var index in dicPrefixWordLists[prefix]) {
    if (dicPrefixWordLists[prefix][index] == userInputStr) {
      matchedWord = dicPrefixWordLists[prefix][index];
      break;
    }
  }
  if (matchedWord == '') {
    this.wordPvDiv_.style.display = 'none';
    // check again in 1000 ms
    setTimeout(this.previewCheck.bind(this), 1000);
    return;
  }

  this.wordPvDiv_.style.left = pali.getOffset(this.textInput_).left +
    this.suggestDiv_.offsetWidth + 5 + "px";
  this.wordPvDiv_.style.width = '20em';
  this.wordPvDiv_.style.textAlign = 'left';
  this.wordPvDiv_.innerHTML = matchedWord;
  this.wordPvDiv_.style.display = 'block';

  // check again in 1000 ms
  setTimeout(this.previewCheck.bind(this), 1000);
};


/**
 * Show preview of a word
 * @param {object} jsonData The json format lookup data of word
 * @private
 */
Lookup.prototype.showPreview = function(jsonData) {
  this.wordPvDiv_.style.left = pali.getOffset(this.textInput_).left +
    this.suggestDiv_.offsetWidth + 5 + "px";
  this.wordPvDiv_.style.width = '20em';
  this.wordPvDiv_.style.display = 'block';
  this.wordPvDiv_.style.textAlign = 'left';
  this.wordPvDiv_.innerHTML = '';

  for (var index in jsonData['data']) {
    if (this.dicCheckShow(jsonData['data'][index], 'パーリ语辞典》',
          '《パーリ语辞典》', ' -')) continue;
    if (this.dicCheckShow(jsonData['data'][index], '巴汉词典》 Mahāñāṇo',
          '《巴汉词典》', '~')) continue;
    if (this.dicCheckShow(jsonData['data'][index], '巴汉词典》 明法',
          '《巴汉词典》', '。')) continue;
    if (this.dicCheckShow(jsonData['data'][index], '《巴利语字汇》',
          '《巴利语字汇》', '。')) continue;
    if (this.dicCheckShow(jsonData['data'][index], '巴利文-汉文',
          '《巴利文-汉文佛学名相辞汇》', '。')) continue;
    if (this.dicCheckShow(jsonData['data'][index], 'Buddhist Dictionary',
          '《Buddhist Dictionary》', '<br>')) continue;
    if (this.dicCheckShow(jsonData['data'][index], 'Concise Pali-English',
          '《Concise Pali-English Dictionary》', '<br>')) continue;
    if (this.dicCheckShow(jsonData['data'][index], 'PTS Pali-English',
          '《PTS Pali-English Dictionary》', '<i>')) continue;
    if (this.dicCheckShow(jsonData['data'][index], '汉译パーリ',
          '《汉译パーリ语辞典》', ' -')) continue;
    if (this.dicCheckShow(jsonData['data'][index], 'パーリ语辞典 增补',
          '《パーリ语辞典 增补改订》', ' -')) continue;
    if (this.dicCheckShow(jsonData['data'][index], '巴英术语汇编',
          '《巴英术语汇编》', '。')) continue;
    if (this.dicCheckShow(jsonData['data'][index], '巴利新音译',
          '《巴利语汇解》与《巴利新音译》', '。')) continue;
    if (this.dicCheckShow(jsonData['data'][index], '巴利语入门',
          '《巴利语入门》', '。')) continue;
  }
};


/**
 * Test dictionary name and show shorter explanation of the word if test passes.
 * @param {object} dicWordExp The dictionary-word-explanation tuple of word
 * @param {string} dicTestStr The string used to test dictionary name
 * @param {string} dicNameStr The dictionary name to be shown in the preview
 * @param {string} separator Use to break longer explanation to shorter one
 * @private
 */
Lookup.prototype.dicCheckShow = function(dicWordExp, dicTestStr,
                                         dicNameStr, separator) {
  if (dicWordExp[0].indexOf(dicTestStr) > 0) {
    if (this.wordPvDiv_.innerHTML != '')
      this.wordPvDiv_.innerHTML += '<br />';
    // show dictionary name in the preview
    this.wordPvDiv_.innerHTML += '<span style="color: red;">'+ dicNameStr +
                                 '</span>' + '<br />';
    // show shorter explanation in the preview
    var breakPos = dicWordExp[2].indexOf(separator);
    if (breakPos == -1) {
      this.wordPvDiv_.innerHTML += dicWordExp[2] + '<br />';
    } else {
      this.wordPvDiv_.innerHTML += dicWordExp[2].slice(0, breakPos) + '<br />';
    }
    return true;
  }
  return false;
};


/**
 * Look up word by HTTP Post method
 * @private
 */
Lookup.prototype.lookupByHTTPPost = function() {
  this.result_.innerHTML = getStringLookingUp();
  /**
   * Check whether there is already json data of this word in the cache,
   * if yes, use the cached data.
   */
  var word = this.textInput_.value;
  if (this.wordCache_.hasOwnProperty(word)) {
    this.JSONPCallback(this.wordCache_[word])
    return;
  }

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
        this.JSONPCallback(eval('(' + xmlhttp.responseText + ')'));
      } else {
        this.result_.innerHTML = 'In lookupByHTTPPost: XMLHttpRequest error!';
        throw "In lookupByHTTPPost: XMLHttpRequest error!";
      }
    }
  }.bind(this);

  xmlhttp.open("POST", this.url_, true);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send("word=" + encodeURIComponent(word));
};


/**
 * Look up word by JSOP
 * @private
 * References:
 * @see http://www.onlinesolutionsdevelopment.com/blog/web-development/javascript/jsonp-example/
 * @see http://www.slideshare.net/andymckay/cross-domain-webmashups-with-jquery-and-google-app-engine
 */
Lookup.prototype.lookupByJSONP = function() {
  this.result_.innerHTML = getStringLookingUp();
  /**
   * Check whether there is already json data of this word in the cache,
   * if yes, use the cached data.
   */
  var word = this.textInput_.value;
  if (this.wordCache_.hasOwnProperty(word)) {
    this.JSONPCallback(this.wordCache_[word])
    return;
  }

  var qry = '?word=' + encodeURIComponent(word) +
            '&callback=' + encodeURIComponent(this.globalName_ + '["JSONPCallback"]');
//            '&callback=' + encodeURIComponent('(function(jsonData){console.log(jsonData);})');
  var ext = document.createElement('script');
  ext.setAttribute('src', this.url_ + qry);
  if (typeof ext != "undefined") {
    document.getElementsByTagName("head")[0].appendChild(ext);
  }
};


/**
 * Callback function of JSONP lookup
 * @param {string} result The JSON-format data which contains the result of word
 *                        lookup. "list of 3-tuple" in Python
 * @private
 */
Lookup.prototype.JSONPCallback = function(jsonData) {
  if (!this.wordCache_.hasOwnProperty(jsonData['word'])) {
    // add to cache
    this.wordCache_[jsonData['word']] = jsonData;
  }

  this.result_.innerHTML = "";
  if (jsonData['data'] == null) {
    this.result_.innerHTML = getStringNoSuchWord();
    return;
  }

  // Show lookup data
  var resultOuterTable = document.createElement("table");
  resultOuterTable.className = "resultCurvedEdges";

  var titleWord = document.createElement('span');
  titleWord.innerHTML = jsonData['word'];
  titleWord.style.fontSize = '2em';
  titleWord.style.fontWeight = 'bold';
  titleWord.style.color = 'GoldenRod';
  resultOuterTable.appendChild(titleWord);

  for (var index in jsonData['data']) {
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.appendChild(this.createDictionaryWordExplanationTable(
                     jsonData['data'][index]));
    td.appendChild(this.createBackToTop());

    tr.appendChild(td);
    resultOuterTable.appendChild(tr);
  }
  this.result_.appendChild(resultOuterTable);
};


/**
 * Create a DOM element which contains a table for dictionary-word-explanation.
 * @param {Array} dictWordExp Array which contains data to be processed.
 * @return {DOM Element} HTML table of dictionary-word-explanation.
 * @private
 */
Lookup.prototype.createDictionaryWordExplanationTable = function(dictWordExp) {
  // check data sanity
  if (Object.prototype.toString.apply(dictWordExp) != '[object Array]')
    throw "In createDictionaryWordExplanationTable: parameter is not Array!";
  if (dictWordExp.length != 3)
    throw "In createDictionaryWordExplanationTable: parameter length != 3";

  var resultInnerTable = document.createElement("table");
  var count = 0;
  resultInnerTable.className = "dicTable";
  for (var i=0; i < dictWordExp.length; i++) {
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var th = document.createElement("th");
    if (count == 0) {th.innerHTML = getStringDictionary();}
    if (count == 1) {th.innerHTML = getStringPaliWord();}
    if (count == 2) {th.innerHTML = getStringExplain();}
    td.innerHTML = dictWordExp[i];
    tr.appendChild(th);
    tr.appendChild(td);
    resultInnerTable.appendChild(tr);
    count += 1;
  }
  return resultInnerTable;
};


/**
 * Create a back-to-top DOM element
 * @return {DOM Element} Back-to-top DOM Element
 * @private
 */
Lookup.prototype.createBackToTop = function() {
  var backToTop = document.createElement("a");
  backToTop.href = '/';
  backToTop.onclick = function(e){window.scrollTo(0,0);return false;};
//  backToTop.href = "javascript:window.scrollTo(0,0);";
  backToTop.style.textDecoration = "none";
  backToTop.style.color = "#00C";
  backToTop.style.fontSize = "small";
  backToTop.style.cursor = "pointer";
  backToTop.innerHTML = '<span style="text-decoration:underline">' +
                        getStringBackToTop() +
                        '</span><span style="font-size:.75em;">&#9650;</span>';
  return backToTop;
};
