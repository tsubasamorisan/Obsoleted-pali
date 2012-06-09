#!/usr/bin/env python
# -*- coding:utf-8 -*-

import webapp2
import os,cgi
import jinja2
from webapp2_extras import i18n

jinja_environment = jinja2.Environment(
  loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
  extensions=['jinja2.ext.i18n'])

jinja_environment.install_gettext_translations(i18n)


class MainPage(webapp2.RequestHandler):
  def get(self):
    locale = self.request.GET.get('locale', 'en_US')
    i18n.get_i18n().set_locale(locale)

    template_values = {}
    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


app = webapp2.WSGIApplication([('/', MainPage)],
                              debug=True)
