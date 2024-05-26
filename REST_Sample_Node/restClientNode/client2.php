<?php
/*
   RESTクライアント
*/

$ch = curl_init();
//$url = 'http://localhost:3000';
$url = 'https://nodehashxx.mybluemix.net';

// GET
$options = array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => 1
);
curl_setopt_array($ch, $options);
$resp = curl_exec($ch);
print "GET resp = ".$resp."\n";


// POST
$uri = $url . "/hash";
$form = array(
   'textbody' => 'hello world'
);

$username = 'takara';
$password = 'hogehoge';
$options = array(
    CURLOPT_POST => 1,
    CURLOPT_HEADER => 0,
    CURLOPT_URL => $uri,
    CURLOPT_FRESH_CONNECT => 1,
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_FORBID_REUSE => 1,
    CURLOPT_TIMEOUT => 4,
    CURLOPT_USERPWD => $username.":".$password, 
    CURLOPT_POSTFIELDS => http_build_query($form)
);


curl_setopt_array($ch, $options);
$resp = curl_exec($ch);

// 結果表示
$result = json_decode($resp);
if (isset($result->{'error'})) {
    print "error = ".$result->{'error'}."\n";
} else {
    print "SHA1   = ".$result->{'sha1'}."\n";
    print "SHA256 = ".$result->{'sha256'}."\n";
    print "MD5    = ".$result->{'md5'}."\n";
}

curl_close($ch);

?>
