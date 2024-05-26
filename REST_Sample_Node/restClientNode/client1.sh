#!/bin/bash
#
#  RESTクライアント
#

URI=http://localhost
#URI=https://nodehashxx.mybluemix.net


#echo "GET  ==============="
#curl $URI \
#    -v \
#    -X GET

#echo
#echo "POST ==============="
#curl $URI/hash \
#    -v \
#    -u "takara:hogehoge" \
#    -d "textbody='Hello world'" \
#    -X POST


while true;
 do
echo "GET  ==============="
#curl ${URI}/big \
#    -v \
#    -X GET

curl ${URI}:3001/big \
    -X GET

curl ${URI}:3002/big \
    -X GET

curl ${URI}:3003/big \
    -X GET

curl ${URI}:3000/big \
    -X GET

done