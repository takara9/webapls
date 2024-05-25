<?php
include "mt_framework.php";
include "mt_dao_animals.php";

$fw = new MtF();
$fw->check_login();


include "header.php";

if (isset($_SESSION["cart"]) ){
?>


<h2>カート内のリスト</h2>

<p>カートの商品数: <?php echo count($_SESSION["cart"])?></p>

<table border="1">
<tr>
<td width="200">ID</td>
<td width="400">アイテム</td>
</tr>

<?php
for( $i=0 ; $i<count($_SESSION["cart"]); $i++ ){
?>

<tr>
<td width="200"><?php echo $i+1 ?></td>             
<td width="400"><?php echo $_SESSION["cart"][$i]?></td>             
</tr>
<?php } ?>

</table>

<?php
} else {
?>

<h2>カートは空です</h2>

<?php
}
?>


</body>
</html>
      

