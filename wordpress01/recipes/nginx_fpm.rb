#
# Cookbook Name:: webap01
# Recipe:: default
#
# Copyright 2015, Maho Takara
#

%w{
  nginx
  php5-fpm
  php5-memcached
  php5-mysqlnd-ms
  mysql-client
}.each do |pkgname|
  package "#{pkgname}" do
    action :install
  end
end

service "nginx" do
  action [ :enable, :start]
end

service "php5-fpm" do
  action [ :enable, :start]
end


execute 'nginx_sites-enabled_default_prep' do
  command 'rm -f /etc/nginx/sites-enabled/default'
  ignore_failure true
end

cookbook_file "/etc/nginx/sites-enabled/wordpress.conf" do
  source "wordpress.conf"
  owner "root"
  group "root"
  mode 0644
  notifies :restart, "service[nginx]"
end

cookbook_file "/usr/share/nginx/html/info.php" do
  source "info.php"
  owner "root"
  group "root"
  mode 0644
end


# config mysql 
mysql_hostname      = node["mysql"]["hostname"]
mysql_user_name     = node["mysql"]["user"]["name"]
mysql_user_password = node["mysql"]["user"]["password"]

template "/etc/php5/fpm/php.ini" do
  source "php.ini.erb"
  owner "root"
  group "root"
  mode 0644

  variables({
    :hostname => mysql_hostname,
    :username => mysql_user_name,
    :password => mysql_user_password,
  })
  notifies :restart, "service[php5-fpm]"
end



