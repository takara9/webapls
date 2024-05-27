# -*- coding: utf-8 -*-
#
# Cookbook Name:: chef_workstation01
# Recipe:: default
#
# Copyright 2015, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#

# ユーザーとホームディレクトリの作成
user 'chef' do
  comment 'Chef WorkStation User'
  shell '/bin/bash'
  home '/home/chef'
  password 'xyz!123X'
  system true
  manage_home true
  action :create
end


# sudoresに権限追加
file "/etc/sudoers.d/chef" do
  owner "root"
  group "root"
  mode 0600
  config_file = "chef    ALL=(ALL) NOPASSWD: ALL\n"
  content config_file
  action :create
end


# rootのSSH鍵をコピー
script "copy ssh-key from root to chef" do
  interpreter "bash"
  user        "root"
  code <<-EOL
    cp -r /root/.ssh /home/chef
    chown -R chef:chef /home/chef/.ssh
  EOL
end

# pyenv の導入と設定
script "install pyenv" do
  interpreter "bash"
  user        "chef"
  cwd         "/home/chef"
  code <<-EOL
    git clone https://github.com/yyuu/pyenv.git   .pyenv
    echo 'export PYENV_ROOT="$HOME/.pyenv"' >>    .bash_profile
    echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> .bash_profile
    echo 'eval "$(pyenv init -)"' >>              .bash_profile
  EOL
end

# ソフトウェアのパッケージ追加
execute 'apt-get update' do
  command 'apt-get update'
  action :run
end
%w{
  git 
  gcc 
  make 
  openssl 
  libssl-dev 
  libbz2-dev 
  libreadline-dev 
  libsqlite3-dev
}.each do |pkgname|
  package "#{pkgname}" do
    action :install
  end
end

# Python インストール
script "install python" do
  interpreter "bash"
  user        "chef"
  cwd         "/home/chef"
  environment 'HOME' => "/home/chef"
  code <<-EOL
    source .bash_profile
    pyenv install 2.7.10
    pyenv global 2.7.10
    pyenv versions
  EOL
end


# slcli コマンドインストール
script "install slcli" do
  interpreter "bash"
  user        "chef"
  cwd         "/home/chef"
  environment 'HOME' => "/home/chef"
  code <<-EOL
    source .bash_profile
    pip install softlayer
  EOL
end

user_name = node["chef_ws"]["username"]
api_key = node["chef_ws"]["api_key"]
endpoint_url = node["chef_ws"]["endpoint_url"]


template "/home/chef/.softlayer" do
  source "slcli_config.erb"
  owner "chef"
  group "chef"
  mode 0600
  variables({
    :username => user_name,
    :api_key  => api_key,
    :endpoint_url => endpoint_url
  })
  action :create
end


# Ruby インストール
script "install rbenv" do
  interpreter "bash"
  user        "chef"
  cwd         "/home/chef"
  environment 'HOME' => "/home/chef"
  code <<-EOL
    source .bash_profile
    git clone https://github.com/sstephenson/rbenv.git  $HOME/.rbenv
    echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >>      $HOME/.bash_profile
    echo 'eval "$(rbenv init -)"' >>                    $HOME/.bash_profile
    git clone https://github.com/sstephenson/ruby-build.git $HOME/.rbenv/plugins/ruby-build
  EOL
end

# パッケージ追加
%w{
  zlib1g-dev
}.each do |pkgname|
  package "#{pkgname}" do
    action :install
  end
end

# 
script "install rbenv" do
  interpreter "bash"
  user        "chef"
  cwd         "/home/chef"
  environment 'HOME' => "/home/chef"
  code <<-EOL
    source .bash_profile
    rbenv install 2.2.3
    rbenv versions
    rbenv global 2.2.3
  EOL
end





