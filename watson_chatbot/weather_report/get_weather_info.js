#!/usr/bin/env node
//
// お天気情報の取得
//
// 作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 

/*

天気の取得
http://openweathermap.org/api
https://github.com/baslr/node-openweathermap
npm install openweathermap

天気のコード
http://openweathermap.org/weather-conditions

時刻の変換
http://momentjs.com/docs/#/parsing/
npm install moment
https://github.com/moment/moment/

*/

weather = require('openweathermap');
var owm = require('openweathermap.json');
weather.defaults(owm);


var moment = require('moment');
var cred = require('cloudant_credentials_id.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.credentials.url);
var dbn  = require('weather_database_name.json');
var db = cloudant.db.use(dbn.name);


// 今の天気
weather.now({id:'1850147'},function(err, json){
    console.log(json);
    var tm = moment.unix(json.dt);
    var day = moment(tm).format("M月D日");
    var temp = parseInt(json.main.temp);
    var weather = json.weather[0].main;
    var weather_id = json.weather[0].id;
    var location = json.weather[0].name;

    db.get(weather_id, function(err, rec) {
	msg = "今日の天気は、" + rec.j_description + "、" + temp + " 度 です。"
	console.log(msg);
    });
});


// 明日の天気
weather.daily({id:'1850147', cnt:2},function(err, json){
    console.log(json);
    var tm = moment.unix(json.list[1].dt);
    var day = moment(tm).format("M月D日");
    console.log("Date: ",day);
    var weather_id = json.list[1].weather[0].id;
    var temp = "最高気温は、" + parseInt(json.list[1].temp.max) + "度 最低気温は、" + parseInt(json.list[1].temp.max) + "度、" + "夜は、" + parseInt(json.list[1].temp.night) + "度です。";


    db.get(weather_id, function(err, rec) {
	msg = "明日の天気は、" + rec.j_description + "です。" + temp
	console.log(msg);
    });

});

