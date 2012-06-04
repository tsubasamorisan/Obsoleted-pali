#!/usr/bin/env python
# -*- coding:utf-8 -*-

import webapp2
import jinja2
import os, cgi
from google.appengine.api import users
from dictionary import lookup

jinja_environment = jinja2.Environment(
  loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))


class MainPage(webapp2.RequestHandler):
  def get(self):
    result = ""
    template_values = {
      'result'           : result,
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


class AboutPage(webapp2.RequestHandler):
  def get(self):
    result = u"""<br /><br />
<p style="padding-left:30px; padding-right:30px">The dictionary come from <a href="http://online-dhamma.net/anicca/pali-course/Pali-Chinese-English%20Dictionary.html">Pali-Chinese-English Dictionary</a>. The version is "Pali Dict Linux Web Ver 1.0". This site is still under development so errors may be encountered. If any questions or suggestions, please <a href="/contact">contact me</a>.</p>
              """
    template_values = {
      'result'           : result,
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


class LinkPage(webapp2.RequestHandler):
  def get(self):
    result = u"""<br /><br />
<div align="left" style="padding-left:30px; padding-right:30px">
Source Code : <a href="http://code.google.com/p/pali/">pali</a> project on Google Code<br />
Dictionary : from "Pali Dict Linux Web Ver 1.0" on <a href="http://online-dhamma.net/anicca/pali-course/Pali-Chinese-English%20Dictionary.html">Pali-Chinese-English Dictionary</a><br />
<br />
Other links about Buddhism:<br />
<a href="http://www.theravadacn.org/DhammaIndex2.htm">覺醒之翼</a><br />
<a href="http://www.wpp-branches.net/cn/index.php">巴蓬寺分院</a><br />
<a href="http://www.dhamma.net.cn/">覺悟之路</a><br />
</div>
              """
    template_values = {
      'result'           : result,
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


class ContactPage(webapp2.RequestHandler):
  def get(self):
    result = u"""<br /><br />My Email : <img src="/static/mail.png" />"""
    template_values = {
      'result'           : result,
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


class Lookup(webapp2.RequestHandler):
  def get(self):
    self.redirect('/')

  def post(self):
    word = cgi.escape(self.request.get('word'))
    result = lookup(word)
    template_values = {
      'result'           : result,
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


app = webapp2.WSGIApplication([('/', MainPage),
                              ('/about', AboutPage),
                              ('/link', LinkPage),
                              ('/contact', ContactPage),
                              ('/lookup', Lookup)],
                              debug=True)
