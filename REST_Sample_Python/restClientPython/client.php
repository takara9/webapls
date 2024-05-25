<?php
include "cfenv.php";

$ch = curl_init();
$vcap = new Cfenv();
$vcap->byInstName('pycalcxxu');

// POST
$form = array(
   'a' => 391.345,
   'b' => 5.4452
);

$options = array(
    CURLOPT_POST => 1,
    CURLOPT_HEADER => 0,
    CURLOPT_URL => $vcap->uri,
    CURLOPT_FRESH_CONNECT => 1,
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_FORBID_REUSE => 1,
    CURLOPT_TIMEOUT => 4,
    CURLOPT_USERPWD => $vcap->user.":".$vcap->pass, 
    CURLOPT_POSTFIELDS => http_build_query($form)
);

curl_setopt_array($ch, $options);
$resp = curl_exec($ch);
$result = json_decode($resp);

if (isset($result->{'error'})) {
   print "error = ".$result->{'error'}."\n";
} else {
   print "Result = ".$result->{'ans'}."\n";
}

curl_close($ch);

?>