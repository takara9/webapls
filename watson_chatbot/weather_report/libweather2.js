//
// 天気情報取得のライブラリ
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

// 天気APIに接続
weather = require('openweathermap');
var owm = require('../openweathermap.json');
weather.defaults(owm);

// Cloudantに接続
var moment = require('moment');
var cred = require('../cloudant_credentials_id.json');
var Cloudant = require('cloudant')
var cloudant = Cloudant(cred.credentials.url);
var dbn  = require('./weather_database_name.json');
var db = cloudant.db.use(dbn.name);


// 今の天気
exports.report_now = function(session_handle,callback) {
    weather.now({id:'1850147'},function(err, json){
	console.log(json);
	var tm = moment.unix(json.dt);
	var date = moment(tm).format("M月D日");
	var temp = parseInt(json.main.temp);
	var weather = json.weather[0].main;
	var weather_id = json.weather[0].id;
	var location = json.weather[0].name;
	db.get(weather_id, function(err, rec) {
	    msg = "今日の天気は、" + rec.j_description + "、" + temp + "度です。"
	    ans = { phrase: msg};
	    callback(err,ans);
	});
    });
}

// 明日の天気予報
exports.report_tommorow = function(session_handle,callback) {
    weather.daily({id:'1850147', cnt:2},function(err, json){
	day = 1;
	var tm = moment.unix(json.list[day].dt);
	var date = moment(tm).format("M月D日");
	var weather_id = json.list[day].weather[0].id;
	var temp = "最高気温は、" + parseInt(json.list[day].temp.max) + "度、最低気温は、" 
	    + parseInt(json.list[day].temp.min) + "度、" + "夜は、" 
	    + parseInt(json.list[day].temp.night) + "度の予報です。";
	db.get(weather_id, function(err, rec) {
	    msg = "明日の天気は、" + rec.j_description + "の見込みで、" + temp
	    ans = { phrase: msg};
	    callback(err,ans);
	});
    });
}

// 今日の天気予報
exports.report_today = function(session_handle,callback) {
    weather.daily({id:'1850147', cnt:1},function(err, json){
	var day = 0;
	console.log(json);
	var tm = moment.unix(json.list[day].dt);
	var weather_id = json.list[day].weather[0].id;
	var date = moment(tm).format("M月D日");
	var temp = "最高気温は、" + parseInt(json.list[day].temp.max) + "度、最低気温は、" 
	    + parseInt(json.list[day].temp.min) + "度、" + "夜は、" 
	    + parseInt(json.list[day].temp.night) + "度となっています。";
	db.get(weather_id, function(err, rec) {
	    msg = "今日の予報は、" + rec.j_description + "の見込みで、" + temp
	    ans = { phrase: msg};
	    callback(err,ans);
	});
    });
}

// 今の風速
exports.report_wind_now = function(session_handle,callback) {
    weather.now({id:'1850147'},function(err, json){
	var day = 0;
	console.log(json);
	var tm = moment.unix(json.dt);
	var weather_id = json.main.id;
	var wind_speed = json.wind.speed;
	var wind_deg = json.wind.deg;
	wind_status = ""
	if (wind_speed > 40) {
	    wind_status = "、猛烈な風"
	} else if (wind_speed > 20) {
	    wind_status = "、非常に強い風"
	} else if (wind_speed > 15) {
	    wind_status = "、強い風"
	} else if (wind_speed > 10) {
	    wind_status = "、やや強い風"
	}

	var date = moment(tm).format("M月D日");
	db.get(weather_id, function(err, rec) {
	    msg = "今の風速は、" + wind_speed + "メートル" + wind_status + "です。"
	    ans = { phrase: msg};
	    callback(err,ans);
	});
    });
}

// 今の気温と湿度
exports.report_temp_now = function(session_handle,callback) {
    weather.now({id:'1850147'},function(err, json){
	var day = 0;
	console.log(json);
	var tm = moment.unix(json.dt);
	var weather_id = json.main.id;
	var wind_speed = json.wind.speed;
	var wind_deg = json.wind.deg;
	var date = moment(tm).format("M月D日");
	var temp = json.main.temp;
	var humidity = json.main.humidity;
	db.get(weather_id, function(err, rec) {
	    msg = "今の気温は" + temp + "度、湿度は" + humidity + "パーセントです。"
	    ans = { phrase: msg};
	    callback(err,ans);
	});
    });
}


