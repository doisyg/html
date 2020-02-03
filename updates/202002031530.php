<?php
$query = "UPDATE `api_service` SET `nom`='/wyca_api/navigation/is_started' WHERE `nom`='/wyca_api/navigation/is_activated'";
$insert = mysqli_query(DB::$connexion, $query);

$query = "UPDATE `api_service` SET `nom`='/wyca_mapping/is_started' WHERE `nom`='/wyca_mapping/is_activated'";
$insert = mysqli_query(DB::$connexion, $query);

?>
