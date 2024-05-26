<?php
include "mt_framework2.php";
$fw = new MtF();
$fw->check_login();
include "header2.php";
//include "parts_top_page.php";
$_SESSION['view_counter'] = $_SESSION['view_counter'] + 1
?>

<h3>セッションとカウンターをReidsに保存</h3>

<p>ユーザー名:<font size=7 color="black">
<?php print $_SESSION['userid'] ?>
</font>
</p>
                          
<p>ホスト名:<font size=5 color="yellow">
<?php print gethostname() ?>
</font>
</p>

カウンタ = 
<font size=7 color="blue">
<?php print $_SESSION['view_counter'] ?>
</font>                          
</p>                          


<script>
$(function() {
  $('#btn').click(function(e) {
    $(this).text("リロード");
    location.reload();
  });
});
</script>

<p>
<button id="btn" name="reload"> リロード</button>
</p>
                          

<a href='do_logout2.php'>ログアウト</a>


 
                          

                     