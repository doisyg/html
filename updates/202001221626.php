<?php
$query = "UPDATE `api_topic` SET nom='/bms/relative_SOC_percentage' WHERE nom='/bms/absolute_SOC_percentage';"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');

?>
