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

google_translate_code = u"""
<div id="google_translate_element"></div><script>
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    multilanguagePage: true,
    gaTrack: true,
    gaId: 'UA-32179549-1',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}
</script><script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
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
      'google_analytic'  : google_analytic_code,
      'google_translate' : google_translate_code,
      'right_ads'        : google_right_ad_code,
      'upper_ads'        : google_upper_ad_code,
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
      'google_analytic'  : google_analytic_code,
      'google_translate' : google_translate_code,
      'right_ads'        : google_right_ad_code,
      'upper_ads'        : google_upper_ad_code,
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
      'google_analytic'  : google_analytic_code,
      'google_translate' : google_translate_code,
      'right_ads'        : google_right_ad_code,
      'upper_ads'        : google_upper_ad_code,
      'result'           : result,
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))


class ContactPage(webapp2.RequestHandler):
  def get(self):
    result = u"""<br /><br />My Email : <img src="/static/mail.png" />"""
    template_values = {
      'google_analytic'  : google_analytic_code,
      'google_translate' : google_translate_code,
      'right_ads'        : google_right_ad_code,
      'upper_ads'        : google_upper_ad_code,
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
      'google_analytic'  : google_analytic_code,
      'google_translate' : google_translate_code,
      'right_ads'        : google_right_ad_code,
      'upper_ads'        : google_upper_ad_code,
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
