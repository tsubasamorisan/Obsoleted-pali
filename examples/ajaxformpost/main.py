#!/usr/bin/env python
# -*- coding:utf-8 -*-

import webapp2
import cgi


class MainPage(webapp2.RequestHandler):
  def get(self):
    self.response.out.write(open("index.html").read())

  def post(self):
    input1 = cgi.escape(self.request.get('input1'))
    input2 = cgi.escape(self.request.get('input2'))

    self.response.out.write("input1: %s<br />input2: %s" % (input1, input2))


app = webapp2.WSGIApplication([('/', MainPage)],
                              debug=True)
