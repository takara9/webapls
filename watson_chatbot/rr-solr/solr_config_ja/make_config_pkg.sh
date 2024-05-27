#!/bin/bash
#
# 作者 Maho Takara    takara@jp.ibm.com
#
# Copyright (C) 2016 International Business Machines Corporation 
# and others. All Rights Reserved. 
# 
# 2016/8/15  初版
#
rm -f solr_config.zip 
zip -r solr_config.zip  currency.xml protwords.txt schema.xml solrconfig.xml stopwords.txt synonyms.txt lang/*
