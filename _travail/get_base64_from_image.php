<?php
$filename = 'Map_bureau_w_openspace.png';
$contents = file_get_contents($filename);
echo base64_encode($contents);
?>