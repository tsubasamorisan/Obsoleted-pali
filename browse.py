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

  tableElem = dom.createElement('table')
  tableElem.setAttribute(u'style', 'width: 100%;')
  rowCount = 0
  for word in dicPrefixWordLists[prefix.decode('utf-8')]:
    if (rowCount == 0):
      trElem = dom.createElement('tr')

    tdElem = dom.createElement('td')

    aElem = dom.createElement(u'a')
    aElem.setAttribute(u'href', urlPrefix.decode('utf-8') + word)
    aElem.setAttribute(u'style', 'margin: .5em; text-decoration: none;')
    nameTextNode = dom.createTextNode(word)
    aElem.appendChild(nameTextNode)

    tdElem.appendChild(aElem)
    trElem.appendChild(tdElem)

    rowCount += 1
    if rowCount == 3:
      tableElem.appendChild(trElem)
      rowCount = 0

  dom.documentElement.appendChild(tableElem)

  return dom.documentElement.toxml()


def getWordHTML(word, dicPrefixWordLists, lookupData, jj2tpl):
  if (lookupData['data'] == None):
    raise Exception("Impossible case: No lookup data of %s" % word)

  divTableHTML = u'<div style="margin: .5em; text-align: left;">%s</div>'

  tableHTML = u''
  for item in lookupData['data']:
    tmpHTML = jj2tpl.render().encode('utf-8') + '<br />'
    tmpHTML = tmpHTML.replace('$#@dic$#@', item[0].encode('utf-8'))
    tmpHTML = tmpHTML.replace('$#@word$#@', item[1].encode('utf-8'))
    tmpHTML = tmpHTML.replace('$#@exp$#@', item[2].encode('utf-8'))
    tableHTML += tmpHTML.decode('utf-8')

  return divTableHTML % tableHTML


if __name__ == '__main__':
  pass
