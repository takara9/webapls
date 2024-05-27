#
# Cookbook Name:: memcached01
# Recipe:: default
#
# Copyright 2015, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#

execute 'apt-get update' do
  command 'apt-get update'
  ignore_failure true
end

%w{
  nmon
  memcached
}.each do |pkgname|
  package "#{pkgname}" do
    action :install
  end
end

service "memcached" do
  action [ :enable, :start]
end

template "/etc/memcached.conf" do
  source "memcached.conf.erb"
  owner "root"
  group "root"
  mode 0644
  notifies :restart, "service[memcached]"
end




