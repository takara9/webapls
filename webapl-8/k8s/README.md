# デプロイ方法

~~~
$ cd k8s
$ kubectl apply -f auth-server.yaml 
serviceaccount/auth-server created
service/oauth created
deployment.apps/auth-server created

$ kubectl get svc oauth
NAME         TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
oauth        LoadBalancer   10.32.0.117   10.0.2.83     80:30614/TCP   7s
~~~


# IPアドレスをCoreDNSへ登録

CoreDNSに登録して、外部からDNS名で利用可能にする。

~~~
root@ubuntu:/coredns# cat labo.db 
labo.local.	3600 IN SOA ns1.labo.local. root.labo.local. (
				19         ; serial
				7200       ; refresh (4 hours)
				3600       ; retry (1 hour)
				604800     ; expire (1 week)
				1800       ; minimum (30 min)
				)

<中略>

; OAuth Server
oauth-server    3600 IN  A     10.0.2.83 
~~~

CoreDNSサーバーを再起動して変更を反映

~~~
root@ubuntu:/coredns# systemctl restart coredns
root@ubuntu:/coredns# systemctl status coredns
● coredns.service - CoreDNS server
   Loaded: loaded (/etc/systemd/system/coredns.service; enabled; vendor preset: enabled)
   Active: active (running) since Mon 2021-02-01 01:09:29 UTC; 5s ago
     Docs: https://coredns.io/
 Main PID: 5122 (coredns)
    Tasks: 9 (limit: 4443)
   CGroup: /system.slice/coredns.service
           └─5122 /usr/local/bin/coredns -dns.port 53:53/udp -conf /coredns/Corefile

Feb 01 01:09:29 ubuntu systemd[1]: Started CoreDNS server.
Feb 01 01:09:29 ubuntu coredns[5122]: .:53
Feb 01 01:09:29 ubuntu coredns[5122]: labo.local.:53
Feb 01 01:09:29 ubuntu coredns[5122]: k8s2.labo.local.:53
Feb 01 01:09:29 ubuntu coredns[5122]: k8s1.labo.local.:53
Feb 01 01:09:29 ubuntu coredns[5122]: k8s3.labo.local.:53
Feb 01 01:09:29 ubuntu coredns[5122]: CoreDNS-1.7.0
Feb 01 01:09:29 ubuntu coredns[5122]: linux/arm64, go1.14.4, f59c03d
Feb 01 01:09:34 ubuntu coredns[5122]: [INFO] 192.168.1.21:56806 - 33203 "A IN d.docs.live.net. udp 33 fal
~~~