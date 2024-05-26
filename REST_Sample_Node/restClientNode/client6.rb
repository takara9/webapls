#!/usr/bin/env ruby
# -*- coding: utf-8 -*-
#
#   RESTクライアント
#
require 'net/http'
require 'uri'
require 'json'

#url = 'http://127.0.0.1:3000'
url = 'https://nodehashxx.mybluemix.net'


# HTTP/HTTPS
uri = URI.parse(url)
http = Net::HTTP.new(uri.host, uri.port)
if uri.port == 443 then
  http.use_ssl = true
end


# GET
get = Net::HTTP::Get.new(url)
res = nil
http.start do |h|
  res = h.request(get)
end
print "GET status code = ",res.code,"\n"
print "body = ",res.body,"\n"
print "\n"


# POST
form = Net::HTTP::Post.new(uri.path + "/hash")
form['Content-Type'] = 'application/json'
form.body = {'textbody' => 'hello world'}.to_json
form.basic_auth 'takara', 'hogehoge'

res = nil
http.start do |h|
  res = h.request(form)
end

print "POST status code = ",res.code,"\n"
if res.code.to_i == 200 then
  json = JSON.parse(res.body)
  print "sha1   = ",json['sha1'],"\n"
  print "sha256 = ",json['sha256'],"\n"
  print "md5    = ",json['md5'],"\n"
end


