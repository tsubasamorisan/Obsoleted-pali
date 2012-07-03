#!/usr/bin/env python
# -*- coding:utf-8 -*-
# use closure-compiler to shrink JavaScript file size

import os, sys

compiler = 'java -jar ../closure-library-read-only/compiler/compiler.jar'
input_js1 = '--js static/js/palidict.js'
input_js2 = '--js static/js/inputSuggest.js'
input_js3 = '--js templates/js/bootstrap.js'
output_js1 = '--js_output_file static/js/palidict-compiled.js'
output_js2 = '--js_output_file static/js/inputSuggest-compiled.js'
output_js3 = '--js_output_file templates/js/bootstrap-compiled.js'

if __name__ == '__main__':
  if len(sys.argv) != 2:
    print("Usage:")
    print("$ python compile.py help")
    print("$ python compile.py ws")
    print("$ python compile.py sp")
    print("$ python compile.py adv")
    sys.exit(1)

  if sys.argv[1] == "help":
    os.system('%s --help' % compiler)
    sys.exit(0)
  elif sys.argv[1] == "showdir":
    os.system('ls -al static/js/')
    os.system('ls -al templates/js/')
  elif sys.argv[1] == "rm":
    os.system('rm static/js/*-compiled.js')
    os.system('rm templates/js/*-compiled.js')
  elif sys.argv[1] == "ws":
    print('%s --compilation_level WHITESPACE_ONLY %s %s' % (compiler, input_js1, output_js1))
    os.system('%s --compilation_level WHITESPACE_ONLY %s %s' % (compiler, input_js1, output_js1))
    print('%s --compilation_level WHITESPACE_ONLY %s %s' % (compiler, input_js2, output_js2))
    os.system('%s --compilation_level WHITESPACE_ONLY %s %s' % (compiler, input_js2, output_js2))
    print('%s --compilation_level WHITESPACE_ONLY %s %s' % (compiler, input_js3, output_js3))
    os.system('%s --compilation_level WHITESPACE_ONLY %s %s' % (compiler, input_js3, output_js3))
    sys.exit(0)
  elif sys.argv[1] == "sp":
    print('%s --compilation_level SIMPLE_OPTIMIZATIONS %s %s' % (compiler, input_js1, output_js1))
    os.system('%s --compilation_level SIMPLE_OPTIMIZATIONS %s %s' % (compiler, input_js1, output_js1))
    print('%s --compilation_level SIMPLE_OPTIMIZATIONS %s %s' % (compiler, input_js2, output_js2))
    os.system('%s --compilation_level SIMPLE_OPTIMIZATIONS %s %s' % (compiler, input_js2, output_js2))
    print('%s --compilation_level SIMPLE_OPTIMIZATIONS %s %s' % (compiler, input_js3, output_js3))
    os.system('%s --compilation_level SIMPLE_OPTIMIZATIONS %s %s' % (compiler, input_js3, output_js3))
    sys.exit(0)
  elif sys.argv[1] == "adv":
    print('%s --compilation_level ADVANCED_OPTIMIZATIONS %s %s' % (compiler, input_js1, output_js1))
    os.system('%s --compilation_level ADVANCED_OPTIMIZATIONS %s %s' % (compiler, input_js1, output_js1))
    print('%s --compilation_level ADVANCED_OPTIMIZATIONS %s %s' % (compiler, input_js2, output_js2))
    os.system('%s --compilation_level ADVANCED_OPTIMIZATIONS %s %s' % (compiler, input_js2, output_js2))
    print('%s --compilation_level ADVANCED_OPTIMIZATIONS %s %s' % (compiler, input_js3, output_js3))
    os.system('%s --compilation_level ADVANCED_OPTIMIZATIONS %s %s' % (compiler, input_js3, output_js3))
    sys.exit(0)
  else:
    print("Usage:")
    print("$ python compile.py help")
    print("$ python compile.py ws")
    print("$ python compile.py sp")
    print("$ python compile.py adv")
    sys.exit(1)
