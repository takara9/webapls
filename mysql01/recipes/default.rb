# -*- coding: utf-8 -*-
#
# Cookbook Name:: mysql01
# Recipe:: default
# 
# MySQL 5.6 コミュニティ・エディションをダウンロード
# インストール＆セットアップする
#

work_dir = '/root/mysql'
conf_dir = '/etc/mysql'

#
# パッケージ導入 Ubuntu,CentOS/Redhat
#
case node['platform']

when 'ubuntu'
  execute 'apt-get update' do
    command 'apt-get update'
  end

  # 前提パッケージ
  package 'apparmor-utils'
  package 'libaio1'

  # https://dev.mysql.com/downloads/mysql/ のサイトからMySQLのtarファイルのURLを拾って指定
  tar_url = 'http://dev.mysql.com/get/Downloads/MySQL-5.6/mysql-server_5.6.27-1ubuntu14.04_amd64.deb-bundle.tar'

when 'centos','redhat'
  execute 'yum update' do
    command 'yum update -y'
    action :run
  end

  # 前提パッケージ
  package 'wget'
  package 'libaio'

  # https://dev.mysql.com/downloads/mysql/ のサイトからMySQLのtarファイルのURLを拾って指定
  case node['platform_version'].to_i
    when 6
      tar_url = 'http://dev.mysql.com/get/Downloads/MySQL-5.6/MySQL-5.6.27-1.el6.x86_64.rpm-bundle.tar'    
    when 7
      package 'net-tools'

      tar_url = 'http://dev.mysql.com/get/Downloads/MySQL-5.6/MySQL-5.6.27-1.el7.x86_64.rpm-bundle.tar'
  end
end

#
# MySQL tarファイルの取得と展開
#
script "install_mysql" do
  interpreter "bash"
  user        "root"
  code <<-EOL
     # rm -fr /etc/my.cnf /etc/my.cnf.d #{conf_dir}
     mkdir #{conf_dir}
     mkdir #{work_dir}
     wget -P #{work_dir} #{tar_url}
     cd #{work_dir}
     tar xvf `ls *.tar`
  EOL
  action :run
end


#
# MySQL Serverのインストール
#
case node['platform']
when 'ubuntu'
  dpkg_package "#{work_dir}/mysql-common_5.6.27-1ubuntu14.04_amd64.deb"
  dpkg_package "#{work_dir}/mysql-community-server_5.6.27-1ubuntu14.04_amd64.deb"
  dpkg_package "#{work_dir}/mysql-community-client_5.6.27-1ubuntu14.04_amd64.deb"
when 'centos','redhat'
  case node['platform_version'].to_i
    when 6
      # 依存関係のあるモジュール postfix以下のコマンドは実行できない。
      #rpm_package "mysql-libs-5.1.73-5.el6_6.x86_64" do
      #  action :remove
      #end
      execute "delete mysql-libs-5.1.73-5.el6_6.x86_64" do
        command "rpm -e --nodeps mysql-libs-5.1.73-5.el6_6.x86_64"
        action :run
        ignore_failure true
      end

      rpm_package "#{work_dir}/MySQL-shared-5.6.27-1.el6.x86_64.rpm" 
      rpm_package "#{work_dir}/MySQL-shared-compat-5.6.27-1.el6.x86_64.rpm" 
      rpm_package "#{work_dir}/MySQL-server-5.6.27-1.el6.x86_64.rpm"
      rpm_package "#{work_dir}/MySQL-client-5.6.27-1.el6.x86_64.rpm"

    when 7
      # 依存関係のあるモジュール postfix以下のコマンドは実行できない。
      #rpm_package "mariadb-libs-5.5.44-1.el7_1.x86_64" do
      #  action :remove
      #end
      execute "delete mariadb-libs-5.5.44-1.el7_1.x86_64" do
        command "rpm -e --nodeps mariadb-libs-5.5.44-1.el7_1.x86_64"
        action :run
        ignore_failure true
      end

      rpm_package "#{work_dir}/MySQL-shared-5.6.27-1.el7.x86_64.rpm" 
      rpm_package "#{work_dir}/MySQL-shared-compat-5.6.27-1.el7.x86_64.rpm"
      rpm_package "#{work_dir}/MySQL-server-5.6.27-1.el7.x86_64.rpm"
      rpm_package "#{work_dir}/MySQL-client-5.6.27-1.el7.x86_64.rpm"
  end
end


#
# MySQLの自動起動と停止を設定
#
service "mysql" do
  supports :start => true, :stop => true
  action :nothing
end

service "mysql_enable" do
  service_name 'mysql'
  action :enable
  only_if {node["mysql"]["service"] == 'enable'}
end


#
# コンテナ領域を新規作成
#  iSCSIと組み合わせて、外部共用ディスクのマウント・ポイントとして
#  利用できる様にする
#
directory "/data1" do
  owner 'mysql'
  group 'mysql'
  mode '0755'
  action :create
  notifies :stop, "service[mysql]", :immediately
end


case node['platform']
#
# Ubuntu の AppArmor アプリ アーマーの設定
#
when 'ubuntu','debian'
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
  template "/etc/apparmor.d/usr.sbin.mysqld" do
    source "usr.sbin.mysqld.erb"
    owner "root"
    group "root"
    mode 0644
    notifies :run, "execute[aa-enforce_usr.bin.mysqld]"
  end


#
# CentOS/RedHat は設定ファイルの置き場作成
#
when 'centos','redhat'
  directory "/etc/mysql" do
    owner "root"
    group "root"
    mode '0755'
    action :create
  end
  directory "/etc/mysql/conf.d" do
    owner "root"
    group "root"
    mode '0755'
    action :create
  end
  directory "/var/log/mysql" do
    owner "mysql"
    group "mysql"
    mode '0755'
    action :create
  end

end # case


#
# MySQL設定ファイルの配置
#
template "/etc/mysql/my.cnf" do
  source "my.cnf.erb"
  owner "root"
  group "root"
  mode 0644
end
template "/etc/mysql/conf.d/character-set.cnf" do
  source "character-set.cnf.erb"
  owner "root"
  group "root"
  mode 0644
end
template "/etc/mysql/conf.d/engine.cnf" do
  source "engine.cnf.erb"
  owner "root"
  group "root"
  mode 0644
end
template "/etc/mysql/conf.d/mysqld_safe_syslog.cnf" do
  source "mysqld_safe_syslog.cnf.erb"
  owner "root"
  group "root"
  mode 0644
end


#
# 先の設定ファイルが指すコンテナ領域に
# MySQLのコンテナ、ログ等を作成する
#
# 共有ディスクにセットアップする事を想定して
# この設定が動作するのは、service ノードの場合のみで
# standby ノードの場合には、実行しない。
# 
execute "mysqL_install_db" do
  command "/usr/bin/mysql_install_db"
  action :run
  only_if {node["mysql"]["node"] == 'service'}
  notifies :start, "service[mysql]", :immediately
end

#
# secure_install.sql を実行してパスワードを設定
#
root_password = node["mysql"]["root_password"]
template "#{Chef::Config[:file_cache_path]}/secure_install.sql" do
  owner "root"
  group "root"
  mode 0644
  source "secure_install.sql.erb"
  variables({
    :root_password => root_password,
  })
  only_if {node["mysql"]["node"] == 'service'}
  action :create
end


execute "secure_install" do
  command "/usr/bin/mysql -u root < #{Chef::Config[:file_cache_path]}/secure_install.sql"
  # 匿名ユーザーの削除で存在しないとエラーとなるので追加
  ignore_failure true
  only_if "/usr/bin/mysql -u root -e 'show databases;'"
  only_if {node["mysql"]["node"] == 'service'}
  action :run
end


#
# データベースを作成
# 
db_name = node["mysql"]["db_name"]
template "#{Chef::Config[:file_cache_path]}/create_db.sql" do
  owner "root"
  group "root"
  mode 0644
  source "create_db.sql.erb"
  variables({
    :db_name => db_name,
  })
  only_if {node["mysql"]["node"] == 'service'}
  action :create
end
execute "create_db" do
  command "/usr/bin/mysql -u root -p#{root_password} < #{Chef::Config[:file_cache_path]}/create_db.sql"
  not_if "/usr/bin/mysql -u root -p#{root_password} -D #{db_name}"
  only_if {node["mysql"]["node"] == 'service'}
  action :run
end


#
# ユーザーを追加
#
user_name     = node["mysql"]["user"]["name"]
user_password = node["mysql"]["user"]["password"]

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
  only_if {node["mysql"]["node"] == 'service'}
  action :create
end
execute "create_user" do
  command "/usr/bin/mysql -u root -p#{root_password} < #{Chef::Config[:file_cache_path]}/create_user.sql"
  not_if "/usr/bin/mysql -u #{user_name} -p#{user_password} -D #{db_name}"
  only_if {node["mysql"]["node"] == 'service'}
  action :run
end

### 終了
