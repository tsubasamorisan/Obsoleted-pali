#!/usr/bin/env python
# -*- coding:utf-8 -*-

wordPrefix = [
  "a",
  "ā",
  "b",
  "c",
  "d",
  "ḍ",
  "e",
  "g",
  "h",
  "i",
  "ī",
  "j",
  "k",
  "l",
  "ḷ",
  "m",
  "n",
  "ñ",
  "o",
  "p",
  "r",
  "s",
  "t",
  "ṭ",
  "u",
  "ū",
  "v",
  "y"
]

def isInvalidPrefixOrWord(prefix, word):
  isValidPrefix = False
  isValidWord = False
  if (prefix == None):
    if (word != None):
      # prefix = None AND word != None
      raise Exception("Impossible case: prefix = None AND word != None")
    # prefix = None AND word = None
    return False
  # prefix != None, check prefix sanity
  if prefix in wordPrefix:
    isValidPrefix = True
  else:
    isValidPrefix = False

  if (word == None):
    isValidWord = True

  isInvalidPrefixOrWord = not (isValidPrefix and isValidWord)
  return isInvalidPrefixOrWord


def handleBrowse(path, prefix, word):
  response = {}

  response['invalidBrowse'] = False
  if (path.startswith('/browse')):
    # check url sanity
    if (prefix == None and word == None):
      return response
    if (isInvalidPrefixOrWord(prefix, word)):
      response['invalidBrowse'] = True
      return response

  return response

if __name__ == '__main__':
  pass
