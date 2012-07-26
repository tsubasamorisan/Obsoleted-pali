#!/usr/bin/env python
# -*- coding:utf-8 -*-

def isInvalidPrefixOrWord(prefix, word, dicPrefixWordLists):
  if (prefix == None):
    if (word != None):
      # prefix = None AND word != None
      raise Exception("Impossible case: prefix = None AND word != None")
    # prefix = None AND word = None
    return False

  # prefix != None, check prefix sanity
  if prefix.decode('utf-8') not in dicPrefixWordLists.keys():
    # prefix != None AND prefix is invalid
    return True

  if (word == None):
    # prefix != None AND prefix is valid AND word == None
    return False

  # prefix != None AND prefix is valid AND word != None
  if word.decode('utf-8') in dicPrefixWordLists[prefix.decode('utf-8')]:
    # word is valid
    return False

  return True


def handleBrowse(path, prefix, word, dicPrefixWordLists):
  response = {}

  response['invalidBrowse'] = False
  if (path.startswith('/browse')):
    # check url sanity
    if (prefix == None and word == None):
      return response
    if (isInvalidPrefixOrWord(prefix, word, dicPrefixWordLists)):
      response['invalidBrowse'] = True
      return response

  return response

if __name__ == '__main__':
  pass
