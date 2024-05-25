<?php include "header.php"; ?>



<?php
print "<p>カタログリスト</p>";
print "ユーザー: ".$_SESSION["userid"];
?>
<br>
<br>
<?php
if ($rslt == null) {
    print "ヒットしませんでした。";
} else {
?>

<form name="test">
<table border="1">
<tr>
<th width="100" align="center">ID</th>
<th width="200">NAME</th>
</tr>
      
<?php
    while ($row = $rslt->fetch()) {
        print "<tr>";
        print "<td align=\"center\">".$row['id']."</td>";
        print "<td>".$row['name']."</td>";
        print "<td>";
        print "<input type='button' name='dta' value='詳細'   onClick='line_menu_action(3,".$row['id'].")'>";	
        print "<input type='button' name='pck' value='かごへ' onClick='line_menu_action(4,".$row['id'].")'>";
        print "</td>";
        print "</tr>";
    }
?>
</table>
</form>

<?php } ?>

</body>
</html>
      

