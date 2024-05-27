#
# Cookbook Name:: mysql01
# Recipe:: default
#
# Copyright 2015, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#

%w{
  mysql-server
  apparmor-utils
}.each do |pkgname|
  package "#{pkgname}" do
    action :install
  end
end

service "mysql" do
  supports :status => true, :start => true, :stop => true, :restart => true
  action :nothing
end

directory "/data1" do
  owner 'mysql'
  group 'mysql'
  mode '0755'
  action :create
end

directory "/data2" do
  owner 'mysql'
  group 'mysql'
  mode '0755'
  action :create
end

directory "/data3" do
  owner 'mysql'
  group 'mysql'
  mode '0755'
  action :create
end

execute "stop_mysql" do
  command "service mysql stop"
  ignore_failure true
  action :run
end

execute "aa-disable_usr.bin.mysqld" do
  command "aa-disable usr.sbin.mysqld"
  ignore_failure true
  action :run
end

execute "aa-enforce_usr.bin.mysqld" do
  command "aa-enforce usr.sbin.mysqld"
  ignore_failure true
  action :nothing
end

cookbook_file "/etc/apparmor.d/usr.sbin.mysqld" do
  source "usr.sbin.mysqld"
  owner "root"
  group "root"
  mode 0644
  notifies :run, "execute[aa-enforce_usr.bin.mysqld]"
end

cookbook_file "/etc/mysql/my.cnf" do
  source "my.cnf"
  owner "root"
  group "root"
  mode 0644
end


cookbook_file "/etc/mysql/conf.d/character-set.cnf" do
  source "character-set.cnf"
  owner "root"
  group "root"
  mode 0644
end

cookbook_file "/etc/mysql/conf.d/engine.cnf" do
  source "engine.cnf"
  owner "root"
  group "root"
  mode 0644
end

cookbook_file "/etc/mysql/conf.d/mysqld_safe_syslog.cnf" do
  source "mysqld_safe_syslog.cnf"
  owner "root"
  group "root"
  mode 0644
end

execute "mysqL_install_db" do
  command "/usr/bin/mysql_install_db"
  action :run
end

execute "start_mysql" do
  command "service mysql start"
  action :run
end


# secure install
root_password = node["mysql"]["root_password"]

template "#{Chef::Config[:file_cache_path]}/secure_install.sql" do
  owner "root"
  group "root"
  mode 0644
  source "secure_install.sql.erb"
  variables({
    :root_password => root_password,
  })
end

execute "secure_install" do
  command "/usr/bin/mysql -u root < #{Chef::Config[:file_cache_path]}/secure_install.sql"
  action :run
  only_if "/usr/bin/mysql -u root -e 'show databases;'"
  ignore_failure true
end

# create database
db_name = node["mysql"]["db_name"]
execute "create_db" do
  command "/usr/bin/mysql -u root -p#{root_password} < #{Chef::Config[:file_cache_path]}/create_db.sql"
  action :nothing
  not_if "/usr/bin/mysql -u root -p#{root_password} -D #{db_name}"
end

template "#{Chef::Config[:file_cache_path]}/create_db.sql" do
  owner "root"
  group "root"
  mode 0644
  source "create_db.sql.erb"
  variables({
    :db_name => db_name,
  })
  notifies :run, "execute[create_db]", :immediately
end

# create user
user_name     = node["mysql"]["user"]["name"]
user_password = node["mysql"]["user"]["password"]
execute "create_user" do
  command "/usr/bin/mysql -u root -p#{root_password} < #{Chef::Config[:file_cache_path]}/create_user.sql"
  action :nothing
  not_if "/usr/bin/mysql -u #{user_name} -p#{user_password} -D #{db_name}"
end

template "#{Chef::Config[:file_cache_path]}/create_user.sql" do
  owner "root"
  group "root"
  mode 0644
  source "create_user.sql.erb"
  variables({
    :db_name => db_name,
    :username => user_name,
    :password => user_password,
  })
  notifies :run, "execute[create_user]", :immediately
end

