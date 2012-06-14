prefix_code = {
//  "°" : "uc",
//  "-" : "dash",
  "a" : "a",
  "ā" : "aa",
  "b" : "b",
  "c" : "c",
  "d" : "d",
  "ḍ" : "dotd",
  "e" : "e",
  "g" : "g",
  "h" : "h",
  "i" : "i",
  "ī" : "ii",
  "j" : "j",
  "k" : "k",
  "l" : "l",
  "ḷ" : "dotl",
  "m" : "m",
//  "ṃ" : "dotm",
  "n" : "n",
  "ñ" : "tilden",
//  "ṇ" : "dotn",
//  "ṅ" : "ndot",
//  "ŋ" : "ngng",
  "o" : "o",
  "p" : "p",
  "r" : "r",
  "s" : "s",
  "t" : "t",
  "ṭ" : "dott",
  "u" : "u",
  "ū" : "uu",
  "v" : "v",
  "y" : "y",
}

function strMatch() {
  // remove whitespace in the beginning and end of the string
  var userInputStr = document.getElementById("PaliInput").value.replace(/(^\s+)|(\s+$)/g, "");

  document.getElementById("userInput").innerHTML = userInputStr;
/*
  keyword: javascript string prefix match
  http://stackoverflow.com/questions/457160/the-most-efficient-algorithm-to-find-first-prefix-match-from-a-sorted-string-arr
*/
  /* TODO: should we convert the string to lower case here? */

  /* Here we give simple implementation for prefix matching */
  if (userInputStr.length == 0){
    document.getElementById("result").innerHTML = "";
    return;
  }

  //if the first letter in user input string is invalid, return
  if (!prefix_code[userInputStr[0]]) {
    document.getElementById("result").innerHTML = {{_("'No Such Word'")|safe}};
    return;
  }

  var arrayName = "prefix_" + prefix_code[userInputStr[0]];

  var matched_count = 0;
  var matched_array = new Array();
  /* keyword: javascript evaluate string as variable
     in this case, eval(arrayName) */
  for ( i=0; i < eval(arrayName).length; i++ ) {
    if (eval(arrayName)[i].indexOf(userInputStr) == 0) {// If the Pali word starts with the string that users input
      matched_array.push(eval(arrayName)[i]);
      matched_count += 1;
    }
    if (matched_count == 25) {break;}
  }
  /* http://www.javascriptkit.com/javatutors/arraysort.shtml */
  /* http://www.w3schools.com/jsref/jsref_sort.asp */
  matched_array.sort();
  var resultElement = document.getElementById("result");
  resultElement.innerHTML = "";
  for (i=0; i<matched_array.length; i++) {
    /* http://www.javascriptkit.com/javatutors/dom2.shtml */
    var word = document.createElement('span');
    word.setAttribute('style','position: absolute;');
    word.style.left = getOffset(document.getElementById('PaliInput')).left;
    word.innerHTML = matched_array[i];
    resultElement.appendChild(word);
    resultElement.innerHTML += '<br />';
  }
}

