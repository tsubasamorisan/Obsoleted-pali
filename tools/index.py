#!/usr/bin/env python
# -*- coding:utf-8 -*-

# build index of pali words into JavaScript Array variables

import os

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


def handleIndexXML():
  import xml.dom.minidom
  dom = xml.dom.minidom.parse("paliIndex.xml")
  items = dom.getElementsByTagName("word")

  #print(items[0].toxml())
  words = items[0].childNodes[0].data.encode('utf8').split('%')
  print(words[0].decode('utf8'))
  print(words[-1].decode('utf8'))

  print(type(words))

  prefix = {}

  num = 0
  for word in words:
    y = unicode(word.decode('utf8'))
    if y[:2] not in prefix:
      prefix[y[:2]] = True
    #print(y)
    num += 1

  print(num)

  for key in prefix.keys():
    print(key)

  #x = unicode(words[2].decode('utf8'))
  #print(len(x))
  #print(x)
  #print(x[3])

  """
  jscode = u"$(function(){var availableTags = ["
  for word in words:
    jscode += u'"%s",' % word.decode('utf8')

  jscode += u"];"
  jscode += u'$( "#tags" ).autocomplete({'
  jscode += u'source: availableTags'
  jscode += u'});'
  jscode += u'});'

  #print(jscode)

  f = open('jscode.js', 'w')
  f.write(jscode.encode('utf8'))
  f.close()
  """


if __name__ == '__main__':
  xmldir = '/home/siongui/Desktop/pali-dict-software-web1version/xml/'
  fd = open("jsvarindex.js","w")

  for key in prefix_code.keys():
    #print(key)
    #prefix = 'e'
    files = os.listdir(xmldir + key)
    #print(files)
    new_list = []
    for file in files:
      x = unicode(file.decode('utf8'))
      new_list.append(x)

    jsArrayInt = u"var prefix_%s=[" % prefix_code[key]

    num = 0
    for x in new_list:
      #print(x)
      jsArrayInt += u'"%s",' % x[:-4]
      num += 1

    jsArrayInt = jsArrayInt[:-1]
    jsArrayInt += u"];\n"
    #jsArrayInt += u"// number of words with prefix %s: %s\n" % (key.decode('utf8'), num)
    #print(jsArrayInt)
    fd.write(jsArrayInt.encode('utf8'))

  fd.close()

