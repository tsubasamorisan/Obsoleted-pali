#!/usr/bin/env python
# -*- coding:utf-8 -*-

import os

if __name__ == '__main__':
  os.system("wget http://localhost:8080/?locale=en_US\&memcache=no -O production/index-en_US.html")
  os.system("wget http://localhost:8080/?locale=zh_TW\&memcache=no -O production/index-zh_TW.html")
  os.system("wget http://localhost:8080/?locale=zh_CN\&memcache=no -O production/index-zh_CN.html")
