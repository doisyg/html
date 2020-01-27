<?php
$query = "UPDATE `api_service` SET `messageType`='wyca_mapping/StopMapping', `details`='---\r\nsensor_msgs/CompressedImage final_map\r\nbool success\r\nstring message' WHERE `nom`='/wyca_mapping/stop'";
mysqli_query(DB::$connexion, $query);

$query = "INSERT INTO `api_service` (`groupe`, `nom`, `messageType`, `function_name`, `details`) VALUES ('Navigation', '/wyca_api/navigation/start', 'wyca_api/StartNavigation', 'NavigationStart', 'bool init_from_mapping\r\n---\r\nbool success\r\nstring message')";
$insert = mysqli_query(DB::$connexion, $query);
$id_service = mysqli_insert_id(DB::$connexion);
$query = "INSERT INTO `api_service_user` (`id_service`, `id_user`) VALUES (".$id_service.", 1)";
$insert = mysqli_query(DB::$connexion, $query);

$query = "INSERT INTO `api_service` (`groupe`, `nom`, `messageType`, `function_name`, `details`) VALUES ('Navigation', '/wyca_api/navigation/stop', 'std_srvs/Trigger', 'NavigationStop', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages')";
$insert = mysqli_query(DB::$connexion, $query);
$id_service = mysqli_insert_id(DB::$connexion);
$query = "INSERT INTO `api_service_user` (`id_service`, `id_user`) VALUES (".$id_service.", 1)";
$insert = mysqli_query(DB::$connexion, $query);

?>
