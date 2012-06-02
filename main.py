#!/usr/bin/env python
# -*- coding:utf-8 -*-

import webapp2
import jinja2
import os, cgi
from google.appengine.api import users
from dictionary import lookup

jinja_environment = jinja2.Environment(
  loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

google_analytic_code = u"""
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-32179549-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
"""

google_upper_ad_code = u"""
<script type="text/javascript"><!--
google_ad_client = "ca-pub-0436733829999264";
/* 上方橫幅 */
google_ad_slot = "1134049895";
google_ad_width = 320;
google_ad_height = 50;
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
"""

google_right_ad_code = u"""
<script type="text/javascript"><!--
google_ad_client = "ca-pub-0436733829999264";
/* 右方直條 */
google_ad_slot = "8422986659";
google_ad_width = 160;
google_ad_height = 600;
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
"""


class MainPage(webapp2.RequestHandler):
  def get(self):
    result = ""
    template_values = {
      'google_analytic' : google_analytic_code,
      'right_ads'       : google_right_ad_code,
      'upper_ads'       : google_upper_ad_code,
      'result'   : result,
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


class AboutPage(webapp2.RequestHandler):
  def get(self):
    result = u"""<br /><br />The dictionary come from <a href="http://online-dhamma.net/anicca/pali-course/Pali-Chinese-English%20Dictionary.html">Pali-Chinese-English Dictionary</a>. The version is "Pali Dict Linux Web Ver 1.0". This site is still under development so errors may be encountered. If any questions or suggestions, please <a href="/contact">contact me</a>.
              """
    template_values = {
      'google_analytic' : google_analytic_code,
      'right_ads'       : google_right_ad_code,
      'upper_ads'       : google_upper_ad_code,
      'result'   : result,
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


class LinkPage(webapp2.RequestHandler):
  def get(self):
    result = u"""<br /><br />Under Construction!"""
    template_values = {
      'google_analytic' : google_analytic_code,
      'right_ads'       : google_right_ad_code,
      'upper_ads'       : google_upper_ad_code,
      'result'   : result,
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


class ContactPage(webapp2.RequestHandler):
  def get(self):
    result = u"""<br /><br />My Email : <img src="/static/mail.png" />"""
    template_values = {
      'google_analytic' : google_analytic_code,
      'right_ads'       : google_right_ad_code,
      'upper_ads'       : google_upper_ad_code,
      'result'   : result,
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
      'google_analytic' : google_analytic_code,
      'right_ads'       : google_right_ad_code,
      'upper_ads'       : google_upper_ad_code,
      'result'   : result,
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


app = webapp2.WSGIApplication([('/', MainPage),
                              ('/about', AboutPage),
                              ('/link', LinkPage),
                              ('/contact', ContactPage),
                              ('/lookup', Lookup)],
                              debug=True)
