<?php
$query = "UPDATE `api_topic` SET `nom`='/wyca_api/navigation/is_started' WHERE `nom`='/wyca_api/navigation/state'";
$update = mysqli_query(DB::$connexion, $query);

$query = "UPDATE `api_topic` SET `nom`='/wyca_mapping/is_started' WHERE `nom`='/wyca_mapping/state'";
$update = mysqli_query(DB::$connexion, $query);


?>
