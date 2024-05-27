# -*- coding: utf-8 -*-
#
# Cookbook Name:: pm_heartbeat01
# Recipe:: default
#

# 
# パッケージのインストール 
#
execute 'apt-get update' do
  command 'apt-get update'
  ignore_failure true
end

%w{
  heartbeat
}.each do |pkgname|
  package "#{pkgname}" do
    action :install
  end
end


#
# アクティブとスタンバイのIPアドレス設定
#
mystate = node["mystate"]
if mystate == 'MASTER' then
  peer_ip = node["backup"]["ipaddr"]
  myname = node["master"]["hostname"]
else
  peer_ip = node["master"]["ipaddr"]
  myname = node["backup"]["hostname"]
end


#
# ホスト名の変更
#
file "/etc/hostname" do
  owner "root"
  group "root"
  mode 0644
  hostname = "#{myname}\n"
  content hostname
  action :create
end
execute 'change_hostname' do
  command 'hostname -F /etc/hostname'
  action :run
end


#
# ハートビートの認証キー設定
#
template "/etc/heartbeat/authkeys" do
  source "authkeys.erb"
  owner "root"
  group "root"
  mode 0600
end

#
# パラメータの取り込み
#
vip_master = node["master"]["hostname"]
vip_backup = node["backup"]["hostname"]
vip_addr = node["vip"]["addr"]
vip_storage = node["vip"]["storage"]
vip_service = node["vip"]["service"]

#
# HOSTSファイルへノード名の追加
# 
master_hostname = node["master"]["hostname"]
master_ipaddr = node["master"]["ipaddr"]
hostsfile_entry "#{master_ipaddr}" do
  hostname master_hostname
  action :create
end
backup_hostname = node["backup"]["hostname"]
backup_ipaddr = node["backup"]["ipaddr"]
hostsfile_entry "#{backup_ipaddr}" do
  hostname backup_hostname
  action :create
end


#
# ハートビートの設定
#
template "/etc/heartbeat/ha.cf" do
  source "ha.cf.erb"
  owner "root"
  group "root"
  mode 0644
  variables({
    :master => vip_master,
    :backup => vip_backup,
    :peer => peer_ip,
  })
end

#
# リソースの設定
#
template "/etc/heartbeat/haresources" do
  source "haresources.erb"
  owner "root"
  group "root"
  mode 0644
  variables({
    :master => vip_master,
    :addr   => vip_addr,
    :storage => vip_storage,
    :service => vip_service,
  })
end

#
# ペースメーカー＆ハートビートの開始
#
service 'heartbeat' do
  action [ :enable, :start ]
end
