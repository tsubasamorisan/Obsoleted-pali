#!/usr/bin/env python
# -*- coding:utf-8 -*-

# build index of pali words into JavaScript Array variables

import os
import xml.dom.minidom
import json

prefix_code = {
#  "°" : "uc",
#  "-" : "dash",
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
#  "ṃ" : "dotm",
  "n" : "n",
  "ñ" : "tilden",
#  "ṇ" : "dotn",
#  "ṅ" : "ndot",
#  "ŋ" : "ngng",
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


if __name__ == '__main__':
  xmldir = '/home/siongui/Desktop/pali-dict-software-web1version/xml/'
  fd = open("jsvarindex.js","w")

  wordCount = 0
  trueWordCount = 0

  dicPrefixWordLists = {}

  # get words start with prefix 'key'
  for key in prefix_code.keys():
    files = os.listdir(xmldir + key)
    trueWordList = []
    dicPrefixWordLists[key] = []

    # iterate all words start with prefix 'key'
    for file in files:
      wordCount += 1
      fileName = unicode(file.decode('utf8'))
      filaPath = xmldir + key + '/' + fileName.encode('utf-8')
      fileData = open(filaPath.decode('utf-8'), 'r').read()
      dom = xml.dom.minidom.parseString(fileData)
      words = dom.getElementsByTagName('word')
      isSameAsContent = False
      for word in words:
        wordStr = word.childNodes[0].data
        if (wordStr.lower() == fileName[:-4]):
          trueWordList.append(fileName)
          dicPrefixWordLists[key].append(fileName[:-4])
          isSameAsContent = True
          trueWordCount += 1
          break

    # build JavaScript Pali words index
    jsArrayInt = u"var prefix_%s=[" % prefix_code[key]

    for x in trueWordList:
      jsArrayInt += u'"%s",' % x[:-4]

    jsArrayInt = jsArrayInt[:-1]
    jsArrayInt += u"];\n"
    fd.write(jsArrayInt.encode('utf8'))

  fd.close()

  for key in dicPrefixWordLists.keys():
    dicPrefixWordLists[key].sort()
  fdpy = open("json","w")
  fdpy.write(json.dumps(dicPrefixWordLists))
  fdpy.close()

  print('word count: %s' % wordCount)
  print('true word count: %s' % trueWordCount)
