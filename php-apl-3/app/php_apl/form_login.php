<?php
include "mt_framework.php";
$fw = new MtF();
include "header.php";
?>

<h1>ログインページ</h1>

<?php
if (isset($_SESSION["userid"])) {
   print $_SESSION['userid']."さん、";
   print "既にログイン済みです。<br>";
} else {
?>

<form action="do_login.php" method="post">
  ユーザーID: <input type="text" name="userid" /><br>
  パスワード: <input type="password" name="passwd" /><br>
<input type="submit" value="ログイン" /><br>
</form>   

<?php
}
?>

</body>
</html>

