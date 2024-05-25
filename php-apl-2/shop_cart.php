<?php
include "mt_framework.php";
include "mt_dao_animals.php";

$fw = new MtF();
$fw->check_login();


// カタログのリスト取得
$dao = new DaoAnimals();
$rslt = $dao->select_all();
if ($rslt) {
    $_SESSION['message'] = "";
} else {
    $_SESSION['message'] = "問題が発生しました。";    
};


// カタログ表示
include "shop_catalog_list.php";
?>

