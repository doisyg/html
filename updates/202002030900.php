<?php
$query = "INSERT INTO `api_service` (`groupe`, `nom`, `messageType`, `function_name`, `details`) VALUES ('Navigation', '/wyca_api/do_reload_maps', 'std_srvs/Trigger', 'NavigationReloadMaps', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages')";
$insert = mysqli_query(DB::$connexion, $query);
$id_service = mysqli_insert_id(DB::$connexion);
$query = "INSERT INTO `api_service_user` (`id_service`, `id_user`) VALUES (".$id_service.", 1)";
$insert = mysqli_query(DB::$connexion, $query);

?>
