#!/usr/bin/env python
# -*- coding:utf-8 -*-

import webapp2
import jinja2
import os, cgi
from google.appengine.api import users
from webapp2_extras import i18n
from dictionary import lookup

jinja_environment = jinja2.Environment(
  loader=jinja2.FileSystemLoader([os.path.join(os.path.dirname(__file__), 'templates'),
                                  os.path.join(os.path.dirname(__file__), 'templates/js'),
                                  os.path.join(os.path.dirname(__file__), 'templates/css'),
                                  os.path.join(os.path.dirname(__file__), 'templates/google')]),
  extensions=['jinja2.ext.i18n'])

jinja_environment.install_gettext_translations(i18n)


class MainPage(webapp2.RequestHandler):
  def get(self):
    #lang = self.request.headers.get('accept_language')
    #browser = self.request.headers.get('user_agent')

    locale = self.request.GET.get('locale', 'en_US')
    i18n.get_i18n().set_locale(locale)

    """
    # https://developers.google.com/appengine/docs/python/runtime#The_Environment
    if (os.environ['SERVER_SOFTWARE'][:11] != "Development"):
      if (locale == "zh_TW"):
        self.response.out.write(open('production/index-zh_TW.html').read())
        return
      if (locale =="zh_CN"):
        self.response.out.write(open('production/index-zh_CN.html').read())
        return
      self.response.out.write(open('production/index-en_US.html').read())
      return
    """

    result = ""
    localeStr = {
      'en_US' : u'English',
      'zh_CN' : u'中文(简体)',
      'zh_TW' : u'中文(繁體)',
    }
    href = {
      'en_US' : u'/',
      'zh_CN' : u'/?locale=zh_CN',
      'zh_TW' : u'/?locale=zh_TW',
    }

    template_values = {
      'result' : result,
      'locale' : locale,
      'localeStr' : localeStr,
      'href' : href,
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


class Lookup(webapp2.RequestHandler):
  def get(self):
    self.redirect('/')

  def post(self):
    word = cgi.escape(self.request.get('word'))
    self.response.out.write(lookup(word))


app = webapp2.WSGIApplication([('/', MainPage),
                              ('/lookup', Lookup)],
                              debug=True)
