#
# Cookbook Name:: zabbix02
# Recipe:: default
#
# Copyright 2015, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#

%w{
  zabbix-agent
}.each do |pkgname|
  package "#{pkgname}" do
    action :install
  end
end

service "zabbix-agent" do
  supports :status => true, :start => true, :stop => true, :restart => true
  action :nothing
end

server_ip = node["zabbix"]["server_ip"]
hostname  = node["zabbix"]["hostname"]


template "/etc/zabbix/zabbix_agentd.conf" do
  source "zabbix_agentd.conf.erb"
  owner "root"
  group "root"
  mode 0644
  variables({
    :server_ip => server_ip,
    :hostname => hostname,
  })

  notifies :start, "service[zabbix-agent]"
end


