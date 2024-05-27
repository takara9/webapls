#
# Cookbook Name:: zabbix01
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
  language-pack-ja-base
  language-pack-ja
  php5-mysql
  zabbix-server-mysql
  zabbix-frontend-php
}.each do |pkgname|
  package "#{pkgname}" do
    action :install
  end
end

execute 'update-locale' do
  command 'update-locale LANG="ja_JP.UTF-8" LANGUAGE="ja_JP:ja"'
  ignore_failure true
end

service "apache2" do
  supports :status => true, :start => true, :stop => true, :restart => true
  action [ :enable, :stop]
end

service "zabbix-server" do
  supports :status => true, :start => true, :stop => true, :restart => true
  action [ :enable, :stop]
end

service "mysql" do
  supports :status => true, :start => true, :stop => true, :restart => true
  action [ :enable, :start]
end

template "/etc/zabbix/zabbix_server.conf" do
  source "zabbix_server.conf.erb"
  owner "root"
  group "root"
  mode 0644
end

template "#{Chef::Config[:file_cache_path]}/setup_database.sql" do
  owner "root"
  group "root"
  mode 0644
  source "setup_database.sql.erb"
end

execute "setup_mysql" do
  command "/usr/bin/mysql -u root < #{Chef::Config[:file_cache_path]}/setup_database.sql"
  action :run
  only_if "/usr/bin/mysql -u root -e 'show databases;'"
end





execute "unzip_zabbix_sql" do
  command "gunzip /usr/share/zabbix-server-mysql/*.gz"
  action :run
end

execute "mysql_schema" do
  command "mysql -u zabbix -pzabbix zabbix < /usr/share/zabbix-server-mysql/schema.sql"
  action :run
end

execute "mysql_images" do
  command "mysql -u zabbix -pzabbix zabbix < /usr/share/zabbix-server-mysql/images.sql"
  action :run
end

execute "mysql_data" do
  command "mysql -u zabbix -pzabbix zabbix < /usr/share/zabbix-server-mysql/data.sql" 
  action :run
end

template "/etc/php5/apache2/php.ini" do
  source "php.ini.erb"
  owner "root"
  group "root"
  mode 0644
end

file "/var/log/zabbix-server/zabbix_server.log" do
  owner "zabbix"
  group "zabbix"
  mode 0644
  action :create
end

template "/etc/default/zabbix-server" do
  source "zabbix-server.erb"
  owner "root"
  group "root"
  mode 0644
end


template "/etc/zabbix/zabbix.conf.php" do
  source "zabbix.conf.php.erb"
  owner "root"
  group "root"
  mode 0644
  notifies :start, "service[zabbix-server]"
end

template "/etc/apache2/conf-enabled/apache.conf" do
  source "apache.conf.erb"
  owner "root"
  group "root"
  mode 0644
  notifies :restart, "service[apache2]"
end






