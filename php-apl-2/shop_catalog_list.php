<?php include "header.php"; ?>
<h1>リスト</h1>

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
        print "<input type='button' name='edt' value='かごへ' onClick='line_menu_action(4,".$row['id'].")'>";
        print "</td>";
        print "</tr>";
    }
?>
</table>
</form>

<?php } ?>

</body>
</html>
      

