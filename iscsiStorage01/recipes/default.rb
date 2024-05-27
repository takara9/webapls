# -*- coding: utf-8 -*-
#
# Cookbook Name:: iscsiStorage01
# Recipe:: default
#

#
# iSCSIとマルチパスを利用するための
# 追加パッケージの導入
#
case node['platform']
# === Debian系 ===
when 'ubuntu','debian'
  execute 'apt-get update' do
    command 'apt-get update'
    action :run
  end
  %w{
    open-iscsi
    multipath-tools
  }.each do |pkgname|
    package "#{pkgname}" do
      action :install
    end
  end
# === RedHat系 ===
when 'centos','redhat'
  execute 'yum update' do
    command 'yum update -y'
    action :run
  end
  %w{
    iscsi-initiator-utils 
    device-mapper-multipath
  }.each do |pkgname|
    package "#{pkgname}" do
      action :install
    end
  end

  # CentOS6 ではパスが異なっており、コマンドが動作しないため修正
  if node['platform_version'].to_i == 6 then
    execute 'ln -s /sbin/iscsid /usr/sbin/iscsid' do
      command 'ln -s /sbin/iscsid /usr/sbin/iscsid'
      not_if 'test -f /usr/sbin/iscsid'
      action :run
    end
  end
end


# 
# SoftLayerでは最初からモジュールがインストール
# されていて起動した状態となっているので停止する。
# 
case node['platform']
# === Debian系 ===
when 'ubuntu','debian'
  execute 'stop open-iscsi' do
    command "service open-iscsi stop"
    ignore_failure true
  end

  # 後で利用するため、ここは定義だけ
  service "open-iscsi" do
    supports :status => true, :start => true, :stop => true, :restart => true
    action [ :enable, :stop]
  end

  # 後で利用するため、ここは定義だけ
  service "multipath-tools" do
    supports :status => true, :start => true, :stop => true, :restart => true
    action [ :enable, :stop]
  end

# === RedHat系 ===
when 'centos','redhat'
  execute 'stop iscsi' do
    command "service iscsi stop"
    ignore_failure true
  end

  # 後で利用するため、ここは定義だけ
  service "iscsi" do
    supports :status => true, :start => true, :stop => true, :restart => true
    action [ :enable, :stop]
  end

  # 後で利用するため、ここは定義だけ
  service "multipathd" do
    supports :status => true, :start => true, :stop => true, :restart => true
    action [ :enable, :stop]
  end

end



# 属性ファイルに定義した値をローカル変数に代入
initiator_name = node["initiator_name"]
iscsi_user_name = node["iscsi_user_name"]
iscsi_user_password = node["iscsi_user_password"]
iscsi_target_ipaddr = node["iscsi_target_ipaddr"]
device_name1 = node["multipath_device"]["name1"]
device_mount_point1 = node["multipath_device"]["mount1"]

# iSCSIイニシエーター名ファイルを作成
file "/etc/iscsi/initiatorname.iscsi" do
  owner "root"
  group "root"
  mode 0600
  config_file = "InitiatorName=#{initiator_name}\n"
  content config_file
  action :create
end

# テンプレートにユーザー名とパスワードをセットして
# iscsid設定ファイルを配置
template "/etc/iscsi/iscsid.conf" do
  owner "root"
  group "root"
  mode 0644
  source "iscsid.conf.erb"
  variables({
    :username => iscsi_user_name,
    :password => iscsi_user_password
  })
  action :create
end

# iSCSIのターゲット上のデバイスを探し出す
execute 'iscsiadm -m discovery' do
  command "iscsiadm -m discovery -t sendtargets -p #{iscsi_target_ipaddr}"
  #notifies :start, "service[open-iscsi]", :immediately
end


# iscsiのサービスを再スタート 
case node['platform']
when 'ubuntu','debian'
  execute 'restart iscsi' do
    command "service open-iscsi restart"
    action :run
  end
when 'centos','redhat'
  execute 'restart iscsi' do
    command "service iscsi restart"
    action :run
  end
end

#
# マルチパスの設定のため、iSCSI の WWIDを取得
#
wwids = Hash.new([])
n = 1
ruby_block 'getting_iscsi_wwid' do
  block do
    (97..122).each do |n|
      dev = "/dev/sd#{n.chr}"
      cmd = ""
      case node['platform']
      when 'ubuntu','debian'
        cmd = "/lib/udev/scsi_id"
      when 'centos','redhat'
        if node['platform_version'].to_i == 7 then
          cmd = "/usr/lib/udev/scsi_id"
        else
          cmd = "/sbin/scsi_id"
        end
      end
      result = shell_out("#{cmd} -g #{dev}")
      wwid = result.stdout.chop
      if wwid != "" then
        wwids[wwid] = dev 
      end
    end
  end
  action :run
end

#
# マルチパスの設定ファイルを作成
#
file "/etc/multipath.conf" do
  owner "root"
  group "root"
  mode 0644
  config_file = "# multipath-tools configuration file\n"\
    "defaults {\n"\
    "       user_friendly_names     yes\n"\
    "}\n"\
    "\n"\
    "blacklist {\n"\
    "       devnode \"^(ram|raw|loop|fd|md|dm-|sr|scd|st)[0-9]*\"\n"\
    "       devnode \"^hd[a-z][[0-9]*]\"\n"\
    "}\n"\
    "multipaths {\n"
  content "#{config_file}\n"
  action :create
end

#
# 発見したデバイスの数だけ設定を追加
#
ruby_block 'adding_wwid_to_multipath.conf' do
  block do
    File::open("/etc/multipath.conf", "a") do |f|
      n = 1
      wwids.each do |wwid, dev| 
        config_data = "  multipath {\n"\
        "    wwid                    #{wwid}\n"\
        "    alias                   iscsimp#{n}\n"\
        "    path_grouping_policy    multibus\n"\
        "    path_selector           \"round-robin 0\"\n"\
        "    failback                manual\n"\
        "    rr_weight               priorities\n"\
        "    no_path_retry           5\n"\
        "    rr_min_io               100\n"\
        "  }\n"
        f.write config_data
        n = n + 1
      end
      f.write "}\n"
    end
  end
  action :run
  #notifies :restart, "service[multipath-tools]", :immediately 
end


#
# マルチパスのデーモンを再起動
# 
case node['platform']
when 'ubuntu','debian'
  execute 'service multipath-tools restart' do
    command "service multipath-tools restart"
    action :run
  end
when 'centos','redhat'
  execute 'service multipathd restart' do
    command "service multipathd restart"
    action :run
  end
end

# 時間待ちを入れないと次でエラーとなる
execute 'sleep' do
  command "sleep 5"
  action :run
end


#
# マスターの時だけ、ファイルシステムを作成
# 失敗してもfstabの設定を完了させるために止めない
#
execute 'mkfs.ext4' do
  command "mkfs.ext4 #{device_name1}"
  only_if { node["iscsi_host"] == 'master' }
  action :run
  ignore_failure true
end

#
# /etc/fstabにiSCSIストレージの設定を追加
#
ruby_block 'adding_fstab_entry' do
  block do
    file = "/etc/fstab"
    line = "#{device_name1} #{device_mount_point1} ext4 rw,noauto,exec,noatime 0 0\n"
    if (`grep "^/dev/mapper" #{file}`.size == 0) then
      File::open(file, "a") do |f|
        f.write "#{line}"
      end
    end
  end
  action :run
end

#
# マウントポイントを作る
#
directory "#{device_mount_point1}" do
  owner 'root'
  group 'root'
  mode '0755'
  action :create
end

#
# マスターの時だけ、マウント実行
#
mount "#{device_mount_point1}" do
  device "#{device_name1}"
  only_if { node["iscsi_host"] == 'master' }
  ignore_failure true
end
