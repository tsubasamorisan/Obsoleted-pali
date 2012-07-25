/**
 * @fileoverview Look up word in AJAX way
 * TODO: pass i18n string as parameters?
 * FIXME: This file is not modulized because of i18n string function
 */


/**
 * Class to look up word in AJAX way.
 *
 * @param {string} textInputId The id of DOM element which is the text input of
 *                             word to be lookup
 * @param {string} formId The id of DOM element which contains above text input
 *                        of word to be looked up.
 * @param {string} resultId The id of DOM element to show the result of the word
 *                          lookup. (should be empty DIV or SPAN)
 * @param {string} lookupURL The URL to look up word
 * @param {boolean} useJSONP Use JSONP if true. use HTTP Post if false.
 * @constructor
 */
Lookup = function(textInputId, formId, resultId, lookupURL, useJSONP) {
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
   * The DOM element which is the text input of word to be looked up.
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

  this.globalName_ = this.randomId();
  // check if this name is already in global scope. if already exists, get
  // another name.
  while (window[this.globalName_]) {
    this.globalName_ = this.randomId();
  }
  // put this object instance in global scope
  window[this.globalName_] = this;

  if (!this['JSONPCallback']) this['JSONPCallback'] = this.JSONPCallback;
};


/**
 * Generate random id string
 * @return {string} String of 5 random characters
 * @private
 */
Lookup.prototype.randomId = function() {
  /**
   * Referece:
   * @see http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
   */
  var id = '';
  /**
   * javascript function name cannot start with number
   * so do NOT use number in chars
   */
  //var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  for( var i=0; i < 5; i++ )
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
};


/**
 * Look up word by HTTP Post method
 * @private
 */
Lookup.prototype.lookupByHTTPPost = function() {
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
        this.result_.innerHTML = xmlhttp.responseText;
      } else {
        this.result_.innerHTML = 'In lookupByHTTPPost: XMLHttpRequest error!';
        throw "In lookupByHTTPPost: XMLHttpRequest error!";
      }
    }
  }.bind(this);

  this.result_.innerHTML = getStringLookingUp();
  xmlhttp.open("POST", this.url_, true);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send("word=" + encodeURIComponent(this.textInput_.value));
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
  var qry = '?word=' + encodeURIComponent(this.textInput_.value) +
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
  this.result_.innerHTML = "";
  if (jsonData == null) {
    this.result_.innerHTML = getStringNoSuchWord();
    return;
  }
  var resultOuterTable = document.createElement("table");
  resultOuterTable.className = "resultCurvedEdges";
  for (var index in jsonData) {

    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.appendChild(this.createDictionaryWordExplanationTable(jsonData[index]));
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
