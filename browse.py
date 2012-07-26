#!/usr/bin/env python
# -*- coding:utf-8 -*-

import xml.dom.minidom

def isValidPrefixAndWord(prefix, word, dicPrefixWordLists):
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


def getPrefixHTML(prefix, dicPrefixWordLists):
  impl = xml.dom.minidom.getDOMImplementation()
  dom = impl.createDocument(None, u'div', None)
  dom.documentElement.setAttribute(u'style', "margin: .5em; line-height: 1.5em; text-align: left;")
  urlPrefix = '/browse/' + prefix + '/'

  for word in dicPrefixWordLists[prefix.decode('utf-8')]:
    aElem = dom.createElement(u'a')
    aElem.setAttribute(u'href', urlPrefix.decode('utf-8') + word)
    aElem.setAttribute(u'style', 'margin: .5em; text-decoration: none;')

    nameTextNode = dom.createTextNode(word)
    aElem.appendChild(nameTextNode)

    dom.documentElement.appendChild(aElem)

  return dom.documentElement.toxml()

if __name__ == '__main__':
  pass
