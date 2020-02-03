<?php
$query = "UPDATE `api_service` SET `nom`='/wyca_api/navigation/is_activated' WHERE `nom`='/wyca_api/navigation/get_state'";
$insert = mysqli_query(DB::$connexion, $query);

$query = "UPDATE `api_service` SET `nom`='/wyca_mapping/is_activated' WHERE `nom`='/wyca_mapping/get_state'";
$insert = mysqli_query(DB::$connexion, $query);

?>
