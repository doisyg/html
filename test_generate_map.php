<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }



$dossier_config = $_CONFIG['CONFIG_PATH'];

$plan = $currentMap;

$i = 1;
echo 'Test '.$i.'<br>';
file_put_contents($dossier_config.'test_'.$i.'_original.png', base64_decode($plan->image_tri));
echo 'test_'.$i.'_original.png<br><br>';
print_r($plan);

$imagick = new Imagick();
$imagick->readImageBlob(base64_decode($plan->image_tri));

file_put_contents($dossier_config.'test_'.$i.'_imagick.png', $imagick);
