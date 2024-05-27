# -*- coding: utf-8 -*-
#
# Cookbook Name:: chef_server01
# Recipe:: default
#
# Copyright 2015, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#
# ホスト名は小文字でなければ、chef-server-ctl test が失敗するので注意
#

# ChefServer導入条件
# アプリ・アーマー(AppArmor)をcomplainモードに変更する
#
package "apparmor-utils"

script "Change AppArmor complain mode" do
  interpreter "bash"
  user        "root"
  code <<-EOL
    aa-complain /etc/apparmor.d/*
    invoke-rc.d apparmor stop
    update-rc.d -f apparmor remove
    apparmor_status
  EOL
end

#ChefServer導入条件
# ホスト名を変更する
#
script "Change hostname long-name" do
  interpreter "bash"
  user        "root"
  code <<-EOL
    hostname `hostname -f`
    hostname > /etc/hostname
  EOL
end


#
# ChefServer のダウンロードとインストール
#
debfile = "chef-server-core_12.2.0-1_amd64.deb"
chef_server_url = "https://web-dl.packagecloud.io/chef/stable/packages/ubuntu/trusty/#{debfile}"
work_dir = "/root/work"

script "install chef server package" do
  interpreter "bash"
  user        "root"
  code <<-EOL
     mkdir #{work_dir}
     wget -P #{work_dir} #{chef_server_url}
     cd #{work_dir}
     dpkg -i chef-server-core_12.2.0-1_amd64.deb 
  EOL
end

#
# Chef 設定実施
#
execute "chef-server-ctl reconfigure" do
  command 'chef-server-ctl reconfigure'
  action :run
end


#
# Chef 管理者ユーザーと組織を追加
#
execute "chef-server-ctl user-create" do
  command "chef-server-ctl user-create chef Maho Takara takara9@gmail.com mAnhatt0n | tee #{work_dir}/chef.pem"
  action :run
end

execute "chef-server-ctl org-create" do
  command "chef-server-ctl org-create tech-team \"Tech-Service\" --association_user chef | tee #{work_dir}/tech-team.pem"
  action :run
end


#
# ウェブUI機能のインストール
#
script "install_webui" do
  interpreter "bash"
  user        "root"
  code <<-EOL
    chef-server-ctl install opscode-manage
    chef-server-ctl reconfigure
    opscode-manage-ctl reconfigure
  EOL
end

#
# レポート機能のインストール
#
script "install_report" do
  interpreter "bash"
  user        "root"
  code <<-EOL
    chef-server-ctl install opscode-reporting
    chef-server-ctl reconfigure
    opscode-reporting-ctl reconfigure
  EOL
end


#
# テスト実行
#
execute "chef-server-ctl test" do
  command "chef-server-ctl test| tee #{work_dir}/chef_test.log"
  action :run
end







