//
// LINEから表示名を取り込んで応答する
//
// 作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 
// 2016/8/15  初版
//

exports.my_name = function(session_handle, callback) {
    var profile = JSON.parse(session_handle.profile);
    ans = { phrase: profile.contacts[0].displayName}
    callback(null,ans);
}
