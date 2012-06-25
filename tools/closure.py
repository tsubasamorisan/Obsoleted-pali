#!/usr/bin/env python
# -*- coding:utf-8 -*-

# https://developers.google.com/closure/compiler/docs/api-tutorial1

import httplib, urllib

def main(js_code):
  # Define the parameters for the POST request and encode them in
  # a URL-safe format.
  params = urllib.urlencode([
      ('js_code', js_code),
      ('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
      ('output_format', 'text'),
      ('output_info', 'compiled_code'),
    ])

  # Always use the following value for the Content-type header.
  headers = { "Content-type": "application/x-www-form-urlencoded" }
  conn = httplib.HTTPConnection('closure-compiler.appspot.com')
  conn.request('POST', '/compile', params, headers)
  response = conn.getresponse()
  data = response.read()
  #print(data)
  conn.close
  return data

if __name__ == '__main__':
  js_code = open('static/js/inputSuggest.js', 'r').read()
  js_code += '\n'
  js_code += open('static/js/palidict.js', 'r').read()
  js_code += '\n'
  js_code += open('templates/js/bootstrap.js', 'r').read()
  f = open('complied.js', 'w')
  f.write(main(js_code))
  f.close()
