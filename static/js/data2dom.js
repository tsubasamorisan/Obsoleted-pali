/**
 * @fileoverview Convert data to DOM element
 */

var Data2dom = Data2dom || {};

/**
 * Convert JSON format of lookup data to HTML DOM elements
 * @param{object} jsonData The json format lookup data of word
 * @return {DOM Element} HTML table of word explanations.
 */
Data2dom.createLookupTable = function(jsonData) {
  // check if the word exist
  if (jsonData['data'] == null) {
    // the word does NOT exist
    return document.createTextNode(getStringNoSuchWord());
  }

  // The word exist. Build DOM elements.
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
    td.appendChild(Data2dom.createDictionaryWordExplanationTable(
                     jsonData['data'][index]));
    td.appendChild(Data2dom.createBackToTop());

    tr.appendChild(td);
    resultOuterTable.appendChild(tr);
  }
  return resultOuterTable;
};


/**
 * Create a DOM element which contains a table for dictionary-word-explanation.
 * @param {Array} dictWordExp Array which contains data to be processed.
 * @return {DOM Element} HTML table of dictionary-word-explanation.
 * @private
 */
Data2dom.createDictionaryWordExplanationTable = function(dictWordExp) {
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
Data2dom.createBackToTop = function() {
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
