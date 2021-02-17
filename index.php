<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }
if (isset($_SESSION["need_change_password"]) && $_SESSION["need_change_password"]) { header("location:change_password.php"); }

if($_CONFIG['MODE'] == 'PROD' && !is_dir(dirname(__FILE__).'/../conf/')) header('location:error_install.php');

include ('template/header.php');

include ('general.php');

if ($_SESSION['id_groupe_user'] == 1) include ('wyca.php');
if ($_SESSION['id_groupe_user'] == 2) include ('installateur.php');
if ($_SESSION['id_groupe_user'] == 3) include ('manager.php');
if ($_SESSION['id_groupe_user'] == 4) include ('user.php');


include ('template/footer.php');
?>
