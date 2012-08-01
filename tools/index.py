#!/usr/bin/env python
# -*- coding:utf-8 -*-

# build index of pali words into JavaScript Array variables

import os, sys
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


def usage():
  print("Usage:")
  print("$ python index.py index")
  print("$ python index.py stats")


def buildJSONIndex(xmlDir, savedName):
  wordCount = {}
  wordCount['all'] = 0

  trueWordCount = {}
  trueWordCount['all'] = 0

  dicPrefixWordLists = {}

  # get words start with prefix 'key'
  for key in prefix_code.keys():
    # get all the files under folder name 'key'
    fileNames = os.listdir(xmlDir + key)

    wordCount[key] = 0
    trueWordCount[key] = 0
    dicPrefixWordLists[key] = []

    # iterate all words start with prefix 'key'
    for fileName in fileNames:
      wordCount['all'] += 1
      wordCount[key] += 1

      fileName = unicode(fileName.decode('utf8'))
      filaPath = xmlDir + key + '/' + fileName.encode('utf-8')
      fileData = open(filaPath.decode('utf-8'), 'r').read()

      # parse the xml data in the file
      dom = xml.dom.minidom.parseString(fileData)

      # iterate all the 'word' tag inside a xml file
      words = dom.getElementsByTagName('word')
      for word in words:
        wordStr = word.childNodes[0].data
        # FIXME: is lower() safe here?
        if (wordStr.lower() == fileName[:-4]):
          # This is a "true" word
          dicPrefixWordLists[key].append(fileName[:-4])
          trueWordCount['all'] += 1
          trueWordCount[key] += 1
          break

  # sort the words
  for key in dicPrefixWordLists.keys():
    dicPrefixWordLists[key].sort()

  # save the indexes in JSON-format to file
  fd = open(savedName, "w")
  fd.write(json.dumps(dicPrefixWordLists))
  fd.close()

  # print statistics
  for key in prefix_code.keys():
    print('word count %s: %d' % (key, wordCount[key]))
    print('true word count %s: %d' % (key, trueWordCount[key]))

  print('word count all: %d' % wordCount['all'])
  print('true word count all: %d' % trueWordCount['all'])


def stats(savedName):
  dicPrefixWordLists = json.loads(open(savedName).read())

  for key in dicPrefixWordLists.keys():
    print('# of %s words: %d' %(key, len(dicPrefixWordLists[key])) )


if __name__ == '__main__':
  xmlDir = '/home/siongui/Desktop/pali-dict-software-web1version/xml/'
  savedName = 'json'

  if len(sys.argv) != 2:
    usage()
    sys.exit(1)

  if sys.argv[1] == "index":
    buildJSONIndex(xmlDir, savedName)
    sys.exit(0)

  if sys.argv[1] == "stats":
    stats(savedName)
    sys.exit(0)
