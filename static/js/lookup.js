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
  }

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
  var qry = '?callback=' + 'JSONPlookupCallback' + '&word=' +
            encodeURIComponent(this.textInput_.value);
  var ext = document.createElement('script');
  ext.setAttribute('src', this.url_ + qry);
  if (typeof ext != "undefined") {
    document.getElementsByTagName("head")[0].appendChild(ext);
  }
};


/**
 * Callback function of JSONP lookup
 * Static Function (Static Method)
 * @param {string} result The JSON-format data which contains the result of word
 *                        lookup. "list of 3-tuple" in Python
 */
window['JSONPlookupCallback'] = function(result) {
  // FIXME: replace document.getElementById('result')
  // FIXME: re-write this function
  document.getElementById('result').innerHTML = "";
  if (result == null) {
    document.getElementById('result').innerHTML = getStringNoSuchWord();
    return;
  }
  var resultOuterTable = document.createElement("table");
  resultOuterTable.className = "resultCurvedEdges";
  //result = eval(result);
  for (var index1 in result) {
    var dictWordExp = eval(result[index1]);
    var resultInnerTable = document.createElement("table");
    var count = 0;
    resultInnerTable.className = "dicTable";
    for (var index2 in dictWordExp) {
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      var th = document.createElement("th");
      if (count == 0) {th.innerHTML = getStringDictionary();}
      else if (count == 1) {th.innerHTML = getStringPaliWord();}
      else {th.innerHTML = getStringExplain();}
      td.innerHTML = dictWordExp[index2];
      tr.appendChild(th);
      tr.appendChild(td);
      resultInnerTable.appendChild(tr);
      if (count > 2) {console.log("in JSONPlookupCallback: something strange. count > 2");}
      count += 1;
    }
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.appendChild(resultInnerTable);

    var backToTop = document.createElement("a");
    backToTop.href = '/';
    backToTop.onclick = function(e){window.scrollTo(0,0);return false;};
//    backToTop.href = "javascript:window.scrollTo(0,0);";
    backToTop.style.textDecoration = "none";
    backToTop.style.color = "#00C";
    backToTop.style.fontSize = "small";
    backToTop.style.cursor = "pointer";
    backToTop.innerHTML = '<span style="text-decoration:underline">' + getStringBackToTop() + '</span><span style="font-size:.75em;">&#9650;</span>';
    td.appendChild(backToTop);

    tr.appendChild(td);
    resultOuterTable.appendChild(tr);
  }
  document.getElementById('result').appendChild(resultOuterTable);
};
