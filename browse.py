#!/usr/bin/env python
# -*- coding:utf-8 -*-

def isValidPrefixOrWord(prefix, word, dicPrefixWordLists):
  if (prefix == None):
    if (word != None):
      # prefix = None AND word != None
      raise Exception("Impossible case: prefix = None AND word != None")
    # prefix = None AND word = None
    return True

  # prefix != None, check prefix sanity
  if prefix.decode('utf-8') in dicPrefixWordLists.keys():
    # prefix != None AND prefix is valid
    if (word == None):
      # prefix != None AND prefix is valid AND word == None
      return True

    # prefix != None AND prefix is valid AND word != None
    if word.decode('utf-8') in dicPrefixWordLists[prefix.decode('utf-8')]:
      # word is valid
      return True
    else:
      return False
  else:
    # prefix != None AND prefix is invalid
    return False

  raise Exception("Impossible case: End of isValidPrefixOrWord!")


if __name__ == '__main__':
  pass
