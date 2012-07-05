#!/usr/bin/env python
# -*- coding:utf-8 -*-
# use closure-compiler to shrink JavaScript file size

import os, sys

compiler = 'java -jar ../closure-library-read-only/compiler/compiler.jar'

input_bootstrap = '--js templates/js/bootstrap.js'
output_bootstrap_wso = '--js_output_file templates/js/bootstrap-wso.js'
output_bootstrap_sp =  '--js_output_file templates/js/bootstrap-sp.js'
output_bootstrap_adv = '--js_output_file templates/js/bootstrap-adv.js'

input_js1 = '--js static/js/palidict.js'
input_js2 = '--js static/js/inputSuggest.js'
output_js_wso = '--js_output_file static/js/pali-wso.js'
output_js_sp =  '--js_output_file static/js/pali-sp.js'
output_js_adv = '--js_output_file static/js/pali-adv.js'

wso = '--compilation_level WHITESPACE_ONLY'
sp =  '--compilation_level SIMPLE_OPTIMIZATIONS'
adv = '--compilation_level ADVANCED_OPTIMIZATIONS'

def usage():
  print("Usage:")
  print("$ python compile.py help")
  print("$ python compile.py showdir")
  print("$ python compile.py rm")
  print("$ python compile.py wso")
  print("$ python compile.py sp")
  print("$ python compile.py adv")

if __name__ == '__main__':
  if len(sys.argv) != 2:
    usage()
    sys.exit(1)

  if sys.argv[1] == "help":
    os.system('%s --help' % compiler)
    sys.exit(0)
  elif sys.argv[1] == "showdir":
    os.system('ls -al static/js/')
    os.system('ls -al templates/js/')
    sys.exit(0)
  elif sys.argv[1] == "rm":
    os.system('rm static/js/pali-*.js')
    os.system('rm templates/js/bootstrap-*.js')
    sys.exit(0)
  elif sys.argv[1] == "wso":
    print(    '%s %s %s %s' % (compiler, wso, input_bootstrap, output_bootstrap_wso))
    os.system('%s %s %s %s' % (compiler, wso, input_bootstrap, output_bootstrap_wso))
    print(    '%s %s %s %s %s' % (compiler, wso, input_js1, input_js2, output_js_wso))
    os.system('%s %s %s %s %s' % (compiler, wso, input_js1, input_js2, output_js_wso))
    sys.exit(0)
  elif sys.argv[1] == "sp":
    print(    '%s %s %s %s' % (compiler, sp, input_bootstrap, output_bootstrap_sp))
    os.system('%s %s %s %s' % (compiler, sp, input_bootstrap, output_bootstrap_sp))
    print(    '%s %s %s %s %s' % (compiler, sp, input_js1, input_js2, output_js_sp))
    os.system('%s %s %s %s %s' % (compiler, sp, input_js1, input_js2, output_js_sp))
    sys.exit(0)
  elif sys.argv[1] == "adv":
    print(    '%s %s %s %s' % (compiler, adv, input_bootstrap, output_bootstrap_adv))
    os.system('%s %s %s %s' % (compiler, adv, input_bootstrap, output_bootstrap_adv))
    print(    '%s %s %s %s %s' % (compiler, adv, input_js1, input_js2, output_js_adv))
    os.system('%s %s %s %s %s' % (compiler, adv, input_js1, input_js2, output_js_adv))
    sys.exit(0)
  else:
    usage()
    sys.exit(1)
