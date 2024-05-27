# -*- coding: utf-8 -*-
#
# Cookbook Name:: wordpress01
# Recipe:: default
#
# Copyright 2015, Maho Takara
#

include_recipe "wordpress01::apt"
include_recipe "wordpress01::nginx_fpm"
include_recipe "wordpress01::mysql"
include_recipe "wordpress01::wordpress"





