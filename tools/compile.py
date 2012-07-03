#!/usr/bin/env python
# -*- coding:utf-8 -*-
# use closure-compiler to shrink JavaScript file size

import os, sys

compiler = 'java -jar ../closure-library-read-only/compiler/compiler.jar'
input_js1 = '--js static/js/palidict.js'
input_js2 = '--js static/js/inputSuggest.js'
input_js3 = '--js templates/js/bootstrap.js'
output_js1_wso = '--js_output_file static/js/palidict-wso.js'
output_js2_wso = '--js_output_file static/js/inputSuggest-wso.js'
output_js3_wso = '--js_output_file templates/js/bootstrap-wso.js'
output_js1_sp = '--js_output_file static/js/palidict-sp.js'
output_js2_sp = '--js_output_file static/js/inputSuggest-sp.js'
output_js3_sp = '--js_output_file templates/js/bootstrap-sp.js'
output_js1_adv = '--js_output_file static/js/palidict-adv.js'
output_js2_adv = '--js_output_file static/js/inputSuggest-adv.js'
output_js3_adv = '--js_output_file templates/js/bootstrap-adv.js'

if __name__ == '__main__':
  if len(sys.argv) != 2:
    print("Usage:")
    print("$ python compile.py help")
    print("$ python compile.py wso")
    print("$ python compile.py sp")
    print("$ python compile.py adv")
    sys.exit(1)

  if sys.argv[1] == "help":
    os.system('%s --help' % compiler)
    sys.exit(0)
  elif sys.argv[1] == "showdir":
    os.system('ls -al static/js/')
    os.system('ls -al templates/js/')
    sys.exit(0)
  elif sys.argv[1] == "rm":
    os.system('rm static/js/palidict-*.js')
    os.system('rm static/js/inputSuggest-*.js')
    os.system('rm templates/js/bootstrap-*.js')
    sys.exit(0)
  elif sys.argv[1] == "wso":
    print('%s --compilation_level WHITESPACE_ONLY %s %s' % (compiler, input_js1, output_js1_wso))
    os.system('%s --compilation_level WHITESPACE_ONLY %s %s' % (compiler, input_js1, output_js1_wso))
    print('%s --compilation_level WHITESPACE_ONLY %s %s' % (compiler, input_js2, output_js2_wso))
    os.system('%s --compilation_level WHITESPACE_ONLY %s %s' % (compiler, input_js2, output_js2_wso))
    print('%s --compilation_level WHITESPACE_ONLY %s %s' % (compiler, input_js3, output_js3_wso))
    os.system('%s --compilation_level WHITESPACE_ONLY %s %s' % (compiler, input_js3, output_js3_wso))
    sys.exit(0)
  elif sys.argv[1] == "sp":
    print('%s --compilation_level SIMPLE_OPTIMIZATIONS %s %s' % (compiler, input_js1, output_js1_sp))
    os.system('%s --compilation_level SIMPLE_OPTIMIZATIONS %s %s' % (compiler, input_js1, output_js1_sp))
    print('%s --compilation_level SIMPLE_OPTIMIZATIONS %s %s' % (compiler, input_js2, output_js2_sp))
    os.system('%s --compilation_level SIMPLE_OPTIMIZATIONS %s %s' % (compiler, input_js2, output_js2_sp))
    print('%s --compilation_level SIMPLE_OPTIMIZATIONS %s %s' % (compiler, input_js3, output_js3_sp))
    os.system('%s --compilation_level SIMPLE_OPTIMIZATIONS %s %s' % (compiler, input_js3, output_js3_sp))
    sys.exit(0)
  elif sys.argv[1] == "adv":
    print('%s --compilation_level ADVANCED_OPTIMIZATIONS %s %s' % (compiler, input_js1, output_js1_adv))
    os.system('%s --compilation_level ADVANCED_OPTIMIZATIONS %s %s' % (compiler, input_js1, output_js1_adv))
    print('%s --compilation_level ADVANCED_OPTIMIZATIONS %s %s' % (compiler, input_js2, output_js2_adv))
    os.system('%s --compilation_level ADVANCED_OPTIMIZATIONS %s %s' % (compiler, input_js2, output_js2_adv))
    print('%s --compilation_level ADVANCED_OPTIMIZATIONS %s %s' % (compiler, input_js3, output_js3_adv))
    os.system('%s --compilation_level ADVANCED_OPTIMIZATIONS %s %s' % (compiler, input_js3, output_js3_adv))
    sys.exit(0)
  else:
    print("Usage:")
    print("$ python compile.py help")
    print("$ python compile.py wso")
    print("$ python compile.py sp")
    print("$ python compile.py adv")
    sys.exit(1)
