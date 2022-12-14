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
  // browser accept-language header info or setting
  var sortedDicWordExps = Data2dom.getSortedDicWordExpsbyLangs(
                            jsonData['data']);

  // Build DOM elements.
  var resultOuterTable = document.createElement("table");
  resultOuterTable.className = "resultCurvedEdges";

  var titleWord = document.createElement('span');
  titleWord.className = 'titleWord';
  titleWord.innerHTML = jsonData['word'];

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
  backToTop.className = "backToTop";
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
  wordName.className = "previewWordName";
  wordName.appendChild(document.createTextNode(jsonData['word']));

  container.appendChild(wordName);

  var sortedDicWordExps = Data2dom.getSortedDicWordExpsbyLangs(
                            jsonData['data']);

  for (var index in sortedDicWordExps) {
    container.appendChild(Data2dom.createPreviewDicWordExp(
      sortedDicWordExps[index]));
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
Data2dom.createPreviewDicWordExp = function(dicWordExp) {
  if (dicWordExp[0].indexOf('????????????????????????') >= 0) {
    var dicShortName = '????????????????????????';
    var separator = ' -';
  } else if (dicWordExp[0].indexOf('??????????????? Mah?????????o') >= 0) {
    var dicShortName = '??????????????????';
    var separator = '~';
  } else if (dicWordExp[0].indexOf('??????????????? Mah?????????o') >= 0) {
    var dicShortName = '??????????????????';
    var separator = '~';
  } else if (dicWordExp[0].indexOf('??????????????? ??????') >= 0) {
    var dicShortName = '??????????????????';
    var separator = '???';
  } else if (dicWordExp[0].indexOf('??????????????? ??????') >= 0) {
    var dicShortName = '??????????????????';
    var separator = '???';
  } else if (dicWordExp[0].indexOf('???????????????') >= 0) {
    var dicShortName = '?????????????????????';
    var separator = '???';
  } else if (dicWordExp[0].indexOf('???????????????') >= 0) {
    var dicShortName = '?????????????????????';
    var separator = '???';
  } else if (dicWordExp[0].indexOf('?????????-??????') >= 0) {
    var dicShortName = '????????????-???????????????????????????'
    var separator = '???';
  } else if (dicWordExp[0].indexOf('?????????-??????') >= 0) {
    var dicShortName = '????????????-???????????????????????????'
    var separator = '???';
  } else if (dicWordExp[0].indexOf('Buddhist Dictionary') >= 0) {
    var dicShortName = '???Buddhist Dictionary???';
    var separator = '<br>';
  } else if (dicWordExp[0].indexOf('Concise Pali-English') >= 0) {
    var dicShortName = '???Concise Pali-English Dictionary???';
    var separator = '<br>';
  } else if (dicWordExp[0].indexOf('PTS Pali-English') >= 0) {
    var dicShortName = '???PTS Pali-English Dictionary???';
    var separator = '<i>';
  } else if (dicWordExp[0].indexOf('???????????????') >= 0) {
    var dicShortName = '??????????????????????????????';
    var separator = ' -';
  } else if (dicWordExp[0].indexOf('???????????????') >= 0) {
    var dicShortName = '??????????????????????????????';
    var separator = ' -';
  } else if (dicWordExp[0].indexOf('?????????????????? ??????') >= 0) {
    var dicShortName = '????????????????????? ???????????????';
    var separator = ' -';
  } else if (dicWordExp[0].indexOf('??????????????????') >= 0) {
    var dicShortName = '????????????????????????'
    var separator = '???';
  } else if (dicWordExp[0].indexOf('??????????????????') >= 0) {
    var dicShortName = '????????????????????????'
    var separator = '???';
  } else if (dicWordExp[0].indexOf('???????????????') >= 0) {
    var dicShortName = '?????????????????????????????????????????????';
    var separator = '???';
  } else if (dicWordExp[0].indexOf('???????????????') >= 0) {
    var dicShortName = '?????????????????????????????????????????????';
    var separator = '???';
  } else if (dicWordExp[0].indexOf('???????????????') >= 0) {
    var dicShortName = '?????????????????????';
    var separator = '???';
  } else if (dicWordExp[0].indexOf('???????????????') >= 0) {
    var dicShortName = '?????????????????????';
    var separator = '???';
  } else {
    var dicShortName = dicWordExp[0];
    var separator = '???';
  }

  var shortDicExp = document.createElement('div');
  shortDicExp.className = 'shortDicExp';

  // show short name of the dictionary in the preview
  var dicName = document.createElement('span');
  dicName.appendChild(document.createTextNode(dicShortName));

  shortDicExp.appendChild(dicName);

  // show shorter explanation in the preview
  var breakPos = dicWordExp[2].indexOf(separator);
  if (breakPos == -1) {
    var shortExp = dicWordExp[2];
  } else {
    var shortExp = dicWordExp[2].slice(0, breakPos);
  }

  if (shortExp.length > 200) shortExp = shortExp.slice(0, 200) + '...';

  shortDicExp.innerHTML += shortExp;

  // http://stackoverflow.com/questions/4084780/how-should-i-fire-javascript-blur-event-after-click-event-that-causes-the-blur
  shortDicExp.onmousedown = function(e) {
    var full = Data2dom.createDictionaryWordExplanationTable(dicWordExp);
    full.style.marginBottom = '1em';
    // FIXME: bad practice - document.getElementById('result')
    document.getElementById('result').innerHTML = '';
    document.getElementById('result').appendChild(full);
  };

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
    aElem.title = word;
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
 * Sort [dic, word, explanation]s according http accept-languages header or
 * setting
 * @param {Array} The unsorted array of one or more [dic, word, explanation]
 * @return {Array} The sorted array of one or more [dic, word, explanation]
 *                 according to http accept-languages header or setting
 */
Data2dom.getSortedDicWordExpsbyLangs = function(dicWordExps) {
  // put dictionaries of the same lang into the same array
  var ja = [];
  var zh = [];
  var en = [];
  var unknown = [];
  for (var i=0; i < dicWordExps.length; i++) {
    var dicWordExp = dicWordExps[i];
    if (dicWordExp[0].indexOf('????????????????????????') >= 0) {
      // Pali to Japanese dictionary
      ja.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('?????????????????? ????????????') >= 0) {
      // Pali to Japanese dictionary
      ja.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('Buddhist Dictionary') >= 0) {
      // Pali to English dictionary
      en.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('Pali-English') >= 0) {
      // Pali to English dictionary
      en.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('??????????????????') >= 0 ||
               dicWordExp[0].indexOf('??????????????????') >= 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('?????????????????????') >= 0 ||
               dicWordExp[0].indexOf('?????????????????????') >= 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('?????????-??????') >= 0 ||
               dicWordExp[0].indexOf('?????????-??????') >= 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('???????????????') >= 0 ||
               dicWordExp[0].indexOf('???????????????') >= 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('???????????????') >= 0 ||
               dicWordExp[0].indexOf('???????????????') >= 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('???????????????') >= 0 ||
               dicWordExp[0].indexOf('???????????????') >= 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else if (dicWordExp[0].indexOf('??????????????????') >= 0 ||
               dicWordExp[0].indexOf('??????????????????') >= 0) {
      // Pali to Chinese dictionary
      zh.push(dicWordExp);
    } else {
      // Pali to ?(unknown)
      unknown.push(dicWordExp);
      console.log('unknown: ' + dicWordExp[0]);
    }
  }

  if (document.getElementById('toTraditionalCht').checked) {
    // translate simplified chinses to traditional chinese by TongWen library
    if (typeof TongWen != 'undefined') {
      for (var i=0; i < zh.length; i++) {
        zh[i][0] = TongWen.convert(zh[i][0], TongWen.flagTrad);
        zh[i][2] = TongWen.convert(zh[i][2], TongWen.flagTrad);
      }
    }
  }

  var isLangArrayEmpty = {
    'en' : false,
    'ja' : false,
    'zh' : false,
    'unknown' : false
  };

  // include language of dictionaries by setting
  if (!document.getElementById('p2en').checked)
    isLangArrayEmpty['en'] = true;
  if (!document.getElementById('p2ja').checked)
    isLangArrayEmpty['ja'] = true;
  if (!document.getElementById('p2zh').checked)
    isLangArrayEmpty['zh'] = true;

  var result = [];
  var order = document.getElementById('dicLangOrder').value;
  if (order == 'en2ja2zh') {
    if (!isLangArrayEmpty['en']) result = result.concat(en);
    if (!isLangArrayEmpty['ja']) result = result.concat(ja);
    if (!isLangArrayEmpty['zh']) result = result.concat(zh);
  }
  if (order == 'en2zh2ja') {
    if (!isLangArrayEmpty['en']) result = result.concat(en);
    if (!isLangArrayEmpty['zh']) result = result.concat(zh);
    if (!isLangArrayEmpty['ja']) result = result.concat(ja);
  }
  if (order == 'ja2en2zh') {
    if (!isLangArrayEmpty['ja']) result = result.concat(ja);
    if (!isLangArrayEmpty['en']) result = result.concat(en);
    if (!isLangArrayEmpty['zh']) result = result.concat(zh);
  }
  if (order == 'ja2zh2en') {
    if (!isLangArrayEmpty['ja']) result = result.concat(ja);
    if (!isLangArrayEmpty['zh']) result = result.concat(zh);
    if (!isLangArrayEmpty['en']) result = result.concat(en);
  }
  if (order == 'zh2en2ja') {
    if (!isLangArrayEmpty['zh']) result = result.concat(zh);
    if (!isLangArrayEmpty['en']) result = result.concat(en);
    if (!isLangArrayEmpty['ja']) result = result.concat(ja);
  }
  if (order == 'zh2ja2en') {
    if (!isLangArrayEmpty['zh']) result = result.concat(zh);
    if (!isLangArrayEmpty['ja']) result = result.concat(ja);
    if (!isLangArrayEmpty['en']) result = result.concat(en);
  }
  if (order != 'hdr') {
    result = result.concat(unknown);
    return result;
  }

  // show the order of language of dictionaries according to accept-languages
  // http header (default)
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

  if (!isLangArrayEmpty['en']) result = result.concat(en);
  if (!isLangArrayEmpty['ja']) result = result.concat(ja);
  if (!isLangArrayEmpty['zh']) result = result.concat(zh);
  result = result.concat(unknown);

  return result;
};
