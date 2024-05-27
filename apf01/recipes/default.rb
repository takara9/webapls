#
# Cookbook Name:: apf01
# Recipe:: default
#
#

# 
filename = "apf-current.tar.gz"
file_checksum = "793d83ca2657b86b86a23b1c3fe08ee436df8c4a83ef84c92f0f11689531a2cc"
work_dir = "/root/_apf_work"

#
cookbook_file "/root/#{filename}" do
  source "#{filename}"
  checksum "#{file_checksum}"
end

#
script "install_apf" do
  interpreter "bash"
  user        "root"
  code <<-EOL
    install -d #{work_dir}
    tar zxvf /root/#{filename} -C #{work_dir}
    cd #{work_dir}/apf-9.7-2
    sh install.sh
  EOL
end

#
template "/etc/apf/conf.apf" do
  owner "root"
  group "root"
  mode 0640
  source "conf.apf.erb"
  action :create
end

#
case node['platform']
when 'ubuntu','debian'
  bash "edit /etc/init.d/apf" do
    only_if { File.exists?("/etc/init.d/apf") }
    code <<-EOC
      sed -i -e "s/^\\. \\/etc\\/rc.d\\/init.d\\/functions/# &/g" /etc/init.d/apf;
      sed -i -e "s/echo_success/# &/g" /etc/init.d/apf
    EOC
  end
  #
  execute 'update-rc.d apf defaults' do
    command "update-rc.d apf defaults"
  end
when 'centos','redhat'
  if node['platform_version'].to_i == 7 then
    package 'net-tools' do
      action :install
    end
  end
end  # node['platform']

# 
service "apf" do
  action [:enable, :start]
end

