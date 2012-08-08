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

  // The word exist. Get dictionary explanations sorted according to user
  // browser accept-language header info
  var sortedDicWordExps = Data2dom.getSortedDicWordExpsbyLangs(
                            jsonData['data']);

  // Build DOM elements.
  var resultOuterTable = document.createElement("table");
  resultOuterTable.className = "resultCurvedEdges";

  var titleWord = document.createElement('span');
  titleWord.innerHTML = jsonData['word'];
  titleWord.style.fontSize = '2em';
  titleWord.style.fontWeight = 'bold';
  titleWord.style.color = 'GoldenRod';
  resultOuterTable.appendChild(titleWord);

  for (var index in sortedDicWordExps) {
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.appendChild(Data2dom.createDictionaryWordExplanationTable(
                     sortedDicWordExps[index]));
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


/**
 * Convert JSON format of lookup data to HTML DOM elements
 * This function returns shorter explanations (preview) of a word
 * @param {object} jsonData The json format lookup data of word
 * @return {DOM Element} HTML DOM elements of word preview.
 */
Data2dom.createPreview = function(jsonData) {
  // check if the word exist
  if (jsonData['data'] == null) {
    // the word does NOT exist
    return document.createTextNode(getStringNoSuchWord());
  }

  // The word exist. Build DOM elements.
  var container = document.createElement('div');

  var wordName = document.createElement('span');
  wordName.style.color = 'GoldenRod';
  wordName.style.fontWeight = 'bold';
  wordName.style.fontSize = '1.5em';
  wordName.style.margin = '.5em';
  wordName.appendChild(document.createTextNode(jsonData['word']));

  container.appendChild(wordName);

  for (var index in jsonData['data']) {
    container.appendChild(Data2dom.createDicWordExp(
      jsonData['data'][index]));
  }

  return container;
};


/**
 * Build short dictionary name and explanation.
 * @param {object} dicWordExp The dictionary-word-explanation tuple of word
 * @return {DOM Element} HTML DOM elements of short dictionary name and
 *                       explanation.
 * @private
 */
Data2dom.createDicWordExp = function(dicWordExp) {
  if (dicWordExp[0].indexOf('《パーリ语辞典》') > 0) {
    var dicShortName = '《パーリ语辞典》';
    var separator = ' -';
  } else if (dicWordExp[0].indexOf('巴汉词典》 Mahāñāṇo') > 0) {
    var dicShortName = '《巴汉词典》';
    var separator = '~';
  } else if (dicWordExp[0].indexOf('巴汉词典》 明法') > 0) {
    var dicShortName = '《巴汉词典》';
    var separator = '。';
  } else if (dicWordExp[0].indexOf('《巴利语字汇》') > 0) {
    var dicShortName = '《巴利语字汇》';
    var separator = '。';
  } else if (dicWordExp[0].indexOf('巴利文-汉文') > 0) {
    var dicShortName = '《巴利文-汉文佛学名相辞汇》'
    var separator = '。';
  } else if (dicWordExp[0].indexOf('Buddhist Dictionary') > 0) {
    var dicShortName = '《Buddhist Dictionary》';
    var separator = '<br>';
  } else if (dicWordExp[0].indexOf('Concise Pali-English') > 0) {
    var dicShortName = '《Concise Pali-English Dictionary》';
    var separator = '<br>';
  } else if (dicWordExp[0].indexOf('PTS Pali-English') > 0) {
    var dicShortName = '《PTS Pali-English Dictionary》';
    var separator = '<i>';
  } else if (dicWordExp[0].indexOf('汉译パーリ') > 0) {
    var dicShortName = '《汉译パーリ语辞典》';
    var separator = ' -';
  } else if (dicWordExp[0].indexOf('パーリ语辞典 增补') > 0) {
    var dicShortName = '《パーリ语辞典 增补改订》';
    var separator = ' -';
  } else if (dicWordExp[0].indexOf('巴英术语汇编') > 0) {
    var dicShortName = '《巴英术语汇编》'
    var separator = '。';
  } else if (dicWordExp[0].indexOf('巴利新音译') > 0) {
    var dicShortName = '《巴利语汇解》与《巴利新音译》';
    var separator = '。';
  } else if (dicWordExp[0].indexOf('巴利语入门') > 0) {
    var dicShortName = '《巴利语入门》';
    var separator = '。';
  } else {
    var dicShortName = dicWordExp[0];
    var separator = '。';
  }

  var shortDicExp = document.createElement('div');

  // show short name of the dictionary in the preview
  var dicName = document.createElement('span');
  dicName.style.color = 'red';
  dicName.appendChild(document.createTextNode(dicShortName));

  shortDicExp.appendChild(dicName);

  // show shorter explanation in the preview
  var breakPos = dicWordExp[2].indexOf(separator);
  if (breakPos == -1) {
    shortDicExp.innerHTML += dicWordExp[2];
  } else {
    shortDicExp.innerHTML += dicWordExp[2].slice(0, breakPos);
  }

  return shortDicExp;
};


/**
 * Create words list by HTML table
 * @param {Array} wordsArray The array of words
 * @return {DOM Element} elements for listing words
 */
Data2dom.createWordsList = function(wordsArray) {
  var container = document.createElement('div');
  container.style.margin = '.5em';
  container.style.lineHeight = '1.5em';
  container.style.textAlign = 'left';

  var tableElem = document.createElement('table');
  tableElem.style.width = '100%';
  var rowCount = 0;
  for (var index in wordsArray) {
    var word = wordsArray[index];
    if (rowCount == 0)
      var trElem = document.createElement('tr');
    var tdElem = document.createElement('td');

    var aElem = document.createElement('a');
    aElem.href = '/browse/' + word[0] + '/' + word +
                 window.location.search;
    aElem.style.margin = '.5em';
    aElem.style.textDecoration = 'none';
    aElem.appendChild(document.createTextNode(word));

    tdElem.appendChild(aElem);
    trElem.appendChild(tdElem);

    rowCount += 1;
    if (rowCount == 3) {
      tableElem.appendChild(trElem);
      rowCount = 0;
    }
  }
  if (trElem)
    tableElem.appendChild(trElem);

  container.appendChild(tableElem);
  return container;
};


/**
 * Get Parsed HTTP accept-languages header of the user browser. The header is
 * embedded by server in 'locale' DIV of '/' page.
 * @return {Array} Array of language-quality pairs
 */
Data2dom.getParsedAcceptLangs = function() {
  var hdr = document.getElementById('locale').innerHTML.split('~')[1];
  var pairs = hdr.split(',');
  var result = [];
  for (var i=0; i < pairs.length; i++) {
    var pair = pairs[i].split(';');
    if (pair.length == 1) result.push( [pair[0], '1'] );
    else result.push( [pair[0], pair[1].split('=')[1] ] );
  }
  return result;
};


/**
 * Sort [dic, word, explanation]s according http accept-languages header
 * @param {Array} The unsorted array of one or more [dic, word, explanation]
 * @return {Array} The sorted array of one or more [dic, word, explanation]
 *                 according to http accept-languages header
 */
Data2dom.getSortedDicWordExpsbyLangs = function(dicWordExps) {
  // put dictionaries of the same lang into the same array
  var ja = [];
  var zh = [];
  var en = [];
  var unknown = [];
  for (var i=0; i < dicWordExps.length; i++) {
    var dicWordExp = dicWordExps[i];
    if (dicWordExp[0].indexOf('《パーリ语辞典》') > 0) {
      // Pali to Japanese dictionary
      ja.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('パーリ语辞典 增补改订') > 0) {
      // Pali to Japanese dictionary
      ja.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('Buddhist Dictionary') > 0) {
      // Pali to English dictionary
      en.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('Pali-English') > 0) {
      // Pali to English dictionary
      en.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('《巴汉词典》') > 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('《巴利语字汇》') > 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('巴利文-汉文') > 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('汉译パーリ') > 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('巴利语入门') > 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('巴利新音译') > 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('巴英术语汇编') > 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else {
      // Pali to ?(unknown)
      unknown.push(dicWordExp);
      console.log('unknown: ' + dicWordExp[0]);
    }
  }

  var isLangArrayEmpty = {
    'en' : false,
    'ja' : false,
    'zh' : false,
    'unknown' : false
  };

  var result = [];
  var langq_pairs = Data2dom.getParsedAcceptLangs();

  for (var i=0; i<langq_pairs.length; i++) {
    if (langq_pairs[i][0].toLowerCase().indexOf('ja') == 0) {
      if (!isLangArrayEmpty['ja']) {
        isLangArrayEmpty['ja'] = true;
        result = result.concat(ja);
      }
    }
    if (langq_pairs[i][0].toLowerCase().indexOf('en') == 0) {
      if (!isLangArrayEmpty['en']) {
        isLangArrayEmpty['en'] = true;
        result = result.concat(en);
      }
    }
    if (langq_pairs[i][0].toLowerCase().indexOf('zh') == 0) {
      if (!isLangArrayEmpty['zh']) {
        isLangArrayEmpty['zh'] = true;
        result = result.concat(zh);
      }
    }
  }

  if (!isLangArrayEmpty['en']) {
    result = result.concat(en);
  }
  if (!isLangArrayEmpty['ja']) {
    result = result.concat(ja);
  }
  if (!isLangArrayEmpty['zh']) {
    result = result.concat(zh);
  }
  result = result.concat(unknown);

  return result;
};
