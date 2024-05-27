#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# 過去１時間に連続でCPU使用率が80%を超えたら
# 仮想サーバーを追加する
# また、サーバー追加後２時間は、再追加しない
#
import SoftLayer
import datetime
import time

# 以下は、環境に合わせて変更してください
user_id = 'my_softlayer_id'
api_key = 'my_api_key'
tmp_img = 'my_template_image_id'
ssh_key = 000000  # my sshkey id

# サーバーのパラメータ
server_id = "0000000"	 # 監視対象サーバー
threshold = 80.0		 # CPU使用率 閾値
resumption_period = 7200 # 二時間後に監視再開（秒）
check_interval_tm = 60   # 監視間隔（秒）
resumption_time = 0		 # 起動後の経過時間

# 
def getCpuUsage():
	# サービスに接続
	client = SoftLayer.Client(username=user_id, api_key=api_key)
	cci = client['Virtual_Guest'].getCpuMetricDataByDate(id=server_id)
	size = len(cci)
	
	# 最近の１時間のCPU稼動状況
	sum_sample = 0
	num_sample = 0
	for i in range(size - 3, size - 1):
		num_sample = num_sample + 1
		sum_sample = sum_sample + int(cci[i]['counter'])
	
	ave_sample = sum_sample/num_sample
	ave_usage = ave_sample / 30.0
	print "Last 1 hour CPU usage = ", ave_usage, "%"
	return ave_usage

def CreateInstanceFromTemplate():
	# テンプレートイメージからの仮想サーバーの注文
	# 環境にあわせて修正してね
	client = SoftLayer.Client(username=user_id, api_key=api_key)
	client['Virtual_Guest'].createObject({
        'hostname': 'reinforce',
        'domain': 'mydomain.com',
        'startCpus': 1,
        'maxMemory': 1024,
        'hourlyBillingFlag': 'true',
        "datacenter": {
        	'name': 'sjc01'
    	},
        'blockDeviceTemplateGroup': { 
           'globalIdentifier':  tmp_img
        },
        'sshKeys': [
        	{
            	'id': ssh_key
        	}
        ],
        'localDiskFlag': 'true'
    })

# メイン
if __name__ == '__main__':
	# 監視の無限ループ
	while True:
		# 仮想サーバー起動後の経過監視時間
		if (resumption_time > 0):
			print "Resuming moniter ... "
			print "time = ", resumption_time
			resumption_time = resumption_time + check_interval_tm
			if (resumption_time > resumption_period):
				resumption_time = 0
		# CPU使用率閾値の判定、および仮想サーバー起動
		ave_usage = getCpuUsage()
		if (ave_usage > threshold ):
			if (resumption_time == 0):
				print "Create Virtual Server"
				CreateInstanceFromTemplate()
				resumption_time = check_interval_tm
		time.sleep(check_interval_tm)

