#!/usr/bin/env python
# -*- coding:utf-8 -*-

import web
import urllib
import urllib2

urls = (
  '/', 'index',
  '/statics/(.*)', 'static',
  '/lookup', 'lookup'
)


class index:
  def GET(self):
    request = urllib2.Request('http://palidictionary.appspot.com/%s' % web.ctx.fullpath)
    request.add_header('Accept', web.ctx.env['HTTP_ACCEPT'])
    #request.add_header('Accept-Charset', web.ctx.env['HTTP_ACCEPT_CHARSET'])
    #request.add_header('Accept-Encoding', web.ctx.env['HTTP_ACCEPT_ENCODING'])
    request.add_header('Accept-Language', web.ctx.env['HTTP_ACCEPT_LANGUAGE'])
    request.add_header('User-Agent', "".join([web.ctx.env['HTTP_USER_AGENT'], " from: %s" % web.ctx.host]))
    response = urllib2.urlopen(request)
    web.header('Content-Type','text/html; charset=utf-8', unique=True)
    return response.read()


class lookup:
  def POST(self):
    url = "http://palidictionary.appspot.com/lookup"
    value = {"word": web.input().word.encode('utf-8')}
    data = urllib.urlencode(value)
    request = urllib2.Request(url, data)
    request.add_header('Accept', web.ctx.env['HTTP_ACCEPT'])
    #request.add_header('Accept-Charset', web.ctx.env['HTTP_ACCEPT_CHARSET'])
    #request.add_header('Accept-Encoding', web.ctx.env['HTTP_ACCEPT_ENCODING'])
    request.add_header('Accept-Language', web.ctx.env['HTTP_ACCEPT_LANGUAGE'])
    request.add_header('User-Agent', "".join([web.ctx.env['HTTP_USER_AGENT'], " from: %s" % web.ctx.host]))
    response = urllib2.urlopen(request)
    web.header('Content-Type','text/html; charset=utf-8', unique=True)
    return response.read()


class static:
  def GET(self, path):
    request = urllib2.Request('http://palidictionary.appspot.com/%s' % web.ctx.fullpath.replace("/statics", "/static", 1))
    request.add_header('Accept', web.ctx.env['HTTP_ACCEPT'])
    #request.add_header('Accept-Charset', web.ctx.env['HTTP_ACCEPT_CHARSET'])
    #request.add_header('Accept-Encoding', web.ctx.env['HTTP_ACCEPT_ENCODING'])
    request.add_header('Accept-Language', web.ctx.env['HTTP_ACCEPT_LANGUAGE'])
    request.add_header('User-Agent', "".join([web.ctx.env['HTTP_USER_AGENT'], " from: %s" % web.ctx.host]))
    response = urllib2.urlopen(request)
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
