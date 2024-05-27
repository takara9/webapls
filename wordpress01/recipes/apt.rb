# -*- coding: utf-8 -*-
#
# Cookbook Name:: wordpress01
# Recipe:: default
#
# Copyright 2015, Maho Takara
#

execute 'apt-get update' do
  command 'apt-get update'
  action :run
  ignore_failure true
end

#
# Ubuntu リポジトリの不具合のため、一時無効化
#%w{
#    language-pack-ja-base
#    language-pack-ja
#}.each do |pkgname|
#  package "#{pkgname}" do
#    action :install
#    ignore_failure true
#  end
#end
#
#execute 'update-locale' do
#  command 'update-locale LANG="ja_JP.UTF-8" LANGUAGE="ja_JP:ja"'
#  ignore_failure true
#end
