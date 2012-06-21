#!/usr/bin/env python
# -*- coding:utf-8 -*-

import webapp2
import jinja2
import os, cgi
from google.appengine.api import users
from google.appengine.api import memcache
from webapp2_extras import i18n
from dictionary import lookup

jinja_environment = jinja2.Environment(
  loader=jinja2.FileSystemLoader([os.path.join(os.path.dirname(__file__), 'templates'),
                                  os.path.join(os.path.dirname(__file__), 'templates/js'),
                                  os.path.join(os.path.dirname(__file__), 'templates/css'),
                                  os.path.join(os.path.dirname(__file__), 'templates/google')]),
  extensions=['jinja2.ext.i18n'])

jinja_environment.install_gettext_translations(i18n)


memcache.set('en_US', open('production/index-en_US.html', 'r').read())
memcache.set('zh_TW', open('production/index-zh_TW.html', 'r').read())
memcache.set('zh_CN', open('production/index-zh_CN.html', 'r').read())


class MainPage(webapp2.RequestHandler):
  def get(self):
    #locale = self.request.GET.get('locale', 'en_US')
    locale = self.request.GET.get('locale')
    if (locale):
      if locale not in ['en_US', 'zh_TW', 'zh_CN']:
        locale = 'en_US'
        i18n.get_i18n().set_locale(locale)
        #self.response.out.write("locale: en_US")
      else:
        i18n.get_i18n().set_locale(locale)
        #self.response.out.write("locale: %s" % locale)
    else:
      #self.response.out.write("no locale")
      accept_languages = self.request.headers.get('accept_language')
      if accept_languages is None:
        locale = 'en_US'
      else:
        languages = accept_languages.split(",")
        language_q_pairs = []
        for language in languages:
          if language.split(";")[0] == language:
            language_q_pairs.append((language, "1"))
          else:
            locale = language.split(";")[0]
            q = language.split(";")[1].split("=")[1]
            language_q_pairs.append((locale, q))
        #self.response.out.write(language_q_pairs)
        if (language_q_pairs[0][0].lower() == 'zh-tw'):
          locale = 'zh_TW'
          i18n.get_i18n().set_locale(locale)
          #self.response.out.write("locale: %s" % locale)
        elif (language_q_pairs[0][0].lower() == 'zh-hk'):
          locale = 'zh_TW'
          i18n.get_i18n().set_locale(locale)
          #self.response.out.write("locale: %s" % locale)
        elif (language_q_pairs[0][0].lower() == 'zh-cn'):
          locale = 'zh_CN'
          i18n.get_i18n().set_locale(locale)
          #self.response.out.write("locale: %s" % locale)
        elif (language_q_pairs[0][0].lower().startswith('zh')):
          locale = 'zh_CN'
          i18n.get_i18n().set_locale(locale)
          #self.response.out.write("locale: %s" % locale)
        else:
          locale = 'en_US'
          i18n.get_i18n().set_locale(locale)
          #self.response.out.write("locale: %s" % locale)
    #browser = self.request.headers.get('user_agent')

    useMemcache = self.request.GET.get('memcache', 'yes')
    if (useMemcache == 'yes'):
      # https://developers.google.com/appengine/docs/python/runtime#The_Environment
      if (os.environ['SERVER_SOFTWARE'].startswith("Development") is False):
        data = memcache.get(locale)
        if data is not None:
          self.response.out.write(data)
        else:
          memcache.set(locale, open('production/index-%s.html' % locale, 'r').read())
          data = memcache.get(locale)
          self.response.out.write(data)
        return

    result = ""
    localeStr = {
      'en_US' : u'English',
      'zh_CN' : u'中文(简体)',
      'zh_TW' : u'中文(繁體)',
    }
    href = {
      'en_US' : u'/?locale=en_US',
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
