#!/usr/bin/env python
# -*- coding:utf-8 -*-

import web
import urllib
import urllib2

urls = (
  '/', 'index',
  '/lookup', 'lookup'
)


class index:
  def GET(self):
    response = urllib2.urlopen('http://palidictionary.appspot.com/%s' % web.ctx.fullpath)
    web.header('Content-Type','text/html; charset=utf-8', unique=True)
    return response.read()


class lookup:
  def POST(self):
    url = "http://palidictionary.appspot.com/lookup"
    value = {"word": web.input().word.encode('utf-8')}
    data = urllib.urlencode(value)
    request = urllib2.Request(url, data)
    response = urllib2.urlopen(request)
    web.header('Content-Type','text/html; charset=utf-8', unique=True)
    return response.read()


if __name__ == "__main__":
  app = web.application(urls, globals())
  app.run() # to run on http://www.pythonanywhere.com/, change this line to "application = app.wsgifunc()"
