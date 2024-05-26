#!/usr/bin/env node
/*                                                                                        
  データベース新規作成
*/

var cfenv = require("cfenv");
var vcapLocal;
try {
    vcapLocal = require("./vcap-local.json");
} catch (err) {
    throw err;
}
var appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}
var appEnv = cfenv.getAppEnv(appEnvOpts);
var svc = appEnv.getServiceCreds('Cloudant NoSQL DB-j9');
var Cloudant = require('cloudant');

var cloudant = Cloudant(svc.url);
var dbn = "session_express";

// DB削除                                                                                   
cloudant.db.destroy(dbn, function(err) {
  // DB作成
  cloudant.db.create(dbn, function(err) {
    if (err) throw err;
    console.log("データベース作成成功");
  });
});






