#!/usr/bin/env python
# -*- coding:utf-8 -*-

import webapp2
import jinja2
import os, cgi
import urllib
import json
from google.appengine.api import memcache
from webapp2_extras import i18n
from dictionary import lookup, jsonpLookup
from userLocale import getUserLocale
from browse import handleBrowse

jinja_environment = jinja2.Environment(
  loader=jinja2.FileSystemLoader([os.path.join(os.path.dirname(__file__), 'templates'),
                                  os.path.join(os.path.dirname(__file__), 'templates/js'),
                                  os.path.join(os.path.dirname(__file__), 'templates/google')]),
  extensions=['jinja2.ext.i18n'])

jinja_environment.install_gettext_translations(i18n)


memcache.set('en_US', open('production/index-en_US.html', 'r').read())
memcache.set('zh_TW', open('production/index-zh_TW.html', 'r').read())
memcache.set('zh_CN', open('production/index-zh_CN.html', 'r').read())


class MainPage(webapp2.RequestHandler):
  def get(self, prefix=None, word=None):
    locale = getUserLocale(self.request.GET.get('locale'),
                           self.request.headers.get('accept_language'))
    i18n.get_i18n().set_locale(locale)
    #browser = self.request.headers.get('user_agent')

    handleBrowseResult = handleBrowse(self.request.path, prefix, word)
    if (handleBrowseResult['invalidBrowse']):
      self.error(404)
      self.response.out.write("Page Not Found!")
      return

    useMemcache = self.request.GET.get('memcache', 'yes')
    if (useMemcache == 'yes'):
      # https://developers.google.com/appengine/docs/python/runtime#The_Environment
      if (os.environ['SERVER_SOFTWARE'].startswith("Development") is False):
        # if (memcache=yes) and (not Development Server)
        data = memcache.get(locale)
        if data is not None:
          # memcache data does NOT expire
          self.response.out.write(data)
        else:
          # memcache data expires, set memcache again
          memcache.set(locale, open('production/index-%s.html' % locale, 'r').read())
          data = memcache.get(locale)
          self.response.out.write(data)
        return

    compiledBootstrapJS = self.request.GET.get('compiledBootstrapJS')
    if compiledBootstrapJS not in ['yes', 'no']:
      compiledBootstrapJS = None
    if (compiledBootstrapJS == None):
      if (os.environ['SERVER_SOFTWARE'].startswith("Development") is True):
        compiledBootstrapJS = 'no'
      else:
        compiledBootstrapJS = 'yes'

    template_values = {
      'locale' : locale,
      'compiledBootstrapJS' : compiledBootstrapJS,
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


class Lookup(webapp2.RequestHandler):
  def get(self):
    # http://docs.python.org/library/json.html
    # http://stackoverflow.com/questions/10468553/google-app-engine-json-response-as-rest
    # https://developers.google.com/appengine/docs/python/tools/webapp/redirects
    paliword = cgi.escape(self.request.get('word'))
    if paliword == "":
      self.response.headers['Content-Type'] = 'application/javascript'
      self.response.out.write("%s(%s)" % (self.request.get('callback'), json.dumps(None)))
      return
    result = jsonpLookup(paliword)
    #self.response.headers['Content-Type'] = 'application/json'
    self.response.headers['Content-Type'] = 'application/javascript'
    self.response.out.write("%s(%s)" % (self.request.get('callback'), json.dumps(result)))
    return
    self.redirect('/')

  def post(self):
    word = cgi.escape(self.request.get('word'))
    self.response.out.write(lookup(word))


app = webapp2.WSGIApplication([('/', MainPage),
                              ('/browse', MainPage),
                              ('/about', MainPage),
                              ('/link', MainPage),
                              (r'/browse/(.*)/(.*)', MainPage),
                              (r'/browse/(.*)', MainPage),
                              ('/lookup', Lookup)],
                              debug=True)
