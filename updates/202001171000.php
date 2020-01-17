<?php
$query = "UPDATE `api_topic` SET nom='/scan_throttled' WHERE nom='/scan';"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');

?>
