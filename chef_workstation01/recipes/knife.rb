# -*- coding: utf-8 -*-

# パッケージ追加
%w{
  g++ 
  autoconf
}.each do |pkgname|
  package "#{pkgname}" do
    action :install
  end
end

#
directory '/home/chef/chef-repo' do
  owner 'chef'
  group 'chef'
  mode '0755'
  action :create
end

# 
directory '/home/chef/chef-repo/.chef' do
  owner 'chef'
  group 'chef'
  mode '0755'
  action :create
end

# 
file '/home/chef/chef-repo/.gitignore' do
  owner "chef"
  group "chef"
  mode 0664
  config_file = ".chef\n"
  content config_file
  action :create
end

#
script "install bundler" do
  interpreter "bash"
  user        "chef"
  cwd         "/home/chef"
  environment 'HOME' => "/home/chef"
  code <<-EOL
    source .bash_profile
    gem install bundler
    cd chef-repo
    bundle init
  EOL
end

# 
template "/home/chef/chef-repo/Gemfile" do
  source "Gemfile.erb"
  owner "chef"
  group "chef"
  mode 0644
end

#
script "bundle install" do
  interpreter "bash"
  user        "chef"
  cwd         "/home/chef/chef-repo"
  environment 'HOME' => "/home/chef"
  code <<-EOL
    source $HOME/.bash_profile
    bundle install
  EOL
end

user_name = node["chef_ws"]["username"]
api_key = node["chef_ws"]["api_key"]
# 
template "/home/chef/chef-repo/.chef/knife.rb" do
  source "knife.rb.erb"
  owner "chef"
  group "chef"
  mode 0644
  variables({
    :username => user_name,
    :api_key  => api_key,
  })
  action :create
end

#
script "copy pemfile" do
  interpreter "bash"
  user        "root"
  code <<-EOL
    cp /root/work/chef.pem /home/chef/chef-repo/.chef/
    cp /root/work/tech-team.pem /home/chef/chef-repo/.chef/
    chown chef:chef /home/chef/chef-repo/.chef/*.pem
  EOL
end

