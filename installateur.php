<?php if (!isset($_SESSION['id_groupe_user']) || $_SESSION['id_groupe_user'] > 2) die('ERROR');

$INSTALL_STEP = Configuration::GetValue('INSTALL_STEP');
if ($INSTALL_STEP == '') $INSTALL_STEP = 0;
?>
<div id="pages_install" class="global_page <?php echo $_SESSION['id_groupe_user'] == 2?'active':'';?>">
	<?php 
	include ('installateur_by_step.php');
	include ('installateur_normal.php');
	?>
</div>