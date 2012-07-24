#!/usr/bin/env python
# -*- coding:utf-8 -*-

import webapp2
import urllib2
import json


class MainPage(webapp2.RequestHandler):
  def get(self):
    self.response.out.write(open("index.html").read())


class JSONPPage(webapp2.RequestHandler):
  def get(self):
    input1 = urllib2.unquote(self.request.get('input1'))
    input2 = urllib2.unquote(self.request.get('input2'))
    result = [{ 'input1': input1 },
              { 'input2': input2 },
              ('message #1', 'from', 'server'),
              ('message #2', 'from', 'server')]
    self.response.out.write("%s((%s))" %
                              (urllib2.unquote(self.request.get('callback')),
                               json.dumps(result)))


app = webapp2.WSGIApplication([('/', MainPage),
                               ('/jsonp', JSONPPage)],
                              debug=True)
