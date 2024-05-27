#
# Cookbook Name:: locale01
# Recipe:: default
#
# Copyright 2015,
#
# All rights reserved 
#

case node['platform']

###
###
###
when 'ubuntu'
  execute 'apt-get update' do
    command 'apt-get update'
    ignore_failure true
    action :run
  end

  %w{
    language-pack-ja-base
    language-pack-ja
  }.each do |pkgname|
    package "#{pkgname}" do
      action :install
    end
  end

  execute 'update-locale LANG=ja_JP.UTF-8 LANGUAGE=ja_JP:ja' do
    command 'update-locale LANG=ja_JP.UTF-8 LANGUAGE="ja_JP:ja"'
    ignore_failure true
    action :run
  end

###
###
###
when 'centos','redhat'
  execute 'yum update' do
    command 'yum update -y'
    ignore_failure true
    action :run
  end

  if node['platform_version'].to_i == 7 then
    package 'man-pages-ja.noarch' do
      action :install
    end
    execute 'localectl set-locale LANG=ja_JP.UTF-8' do
      command 'localectl set-locale LANG=ja_JP.UTF-8'
      action :run
    end
  else
    execute 'yum -y groupinstall "Japanese Support"' do
      command 'yum -y groupinstall "Japanese Support"'
      ignore_failure true
      action :run
    end
    bash "change locale" do
      code <<-EOC
        sed -i.org -e "s/en_US.UTF-8/ja_JP.UTF-8/g" /etc/sysconfig/i18n
      EOC
    end
  end

end # node['platform']


# Debian/Ubuntu RedHat/CentOS
script "Change TIMEZONE " do
  interpreter "bash"
  user        "root"
  code <<-EOL
    rm -f /etc/localtime
    ln -s /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
  EOL
end

