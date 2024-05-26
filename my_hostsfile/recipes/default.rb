#
# Cookbook Name:: edit_hosts
# Recipe:: default
#
# Copyright 2017, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#
hostsfile_entry '192.168.33.11' do
  hostname  'server1'
  action    :create_if_missing
end

hostsfile_entry '192.168.33.12' do
  hostname  'server2'
  action    :create_if_missing
end

hostsfile_entry '192.168.33.13' do
  hostname  'server3'
  action    :create_if_missing
end

