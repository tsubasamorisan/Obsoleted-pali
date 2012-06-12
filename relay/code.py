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


# To run on PythonAnywhere and WebFaction, see the following link:
# http://webpy.org/cookbook/mod_wsgi-apache
#app = web.application(urls, globals())
#application = app.wsgifunc()

# To work with Apache and mod_wsgi, Add WSGIScriptAlias / /path_to_python_script_dir/code.py
# http://stackoverflow.com/questions/3613594/web-py-url-mapping-not-accepting

if __name__ == "__main__":
  app = web.application(urls, globals())
  app.run()
