<?php
$query = "INSERT INTO `api_service` (`groupe`, `nom`, `messageType`, `function_name`, `details`) VALUES ('Navigation', '/wyca_api/navigation/get_state', 'std_srvs/Trigger', 'NavigationGetState', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages')";
$insert = mysqli_query(DB::$connexion, $query);
$id_service = mysqli_insert_id(DB::$connexion);
$query = "INSERT INTO `api_service_user` (`id_service`, `id_user`) VALUES (".$id_service.", 1)";
$insert = mysqli_query(DB::$connexion, $query);

$query = "INSERT INTO `api_topic` (`groupe`, `nom`, `messageType`, `event_name`, `id_service_update`) VALUES ('Navigation', '/wyca_api/navigation/state', 'std_msgs/Bool', 'onNavigationStateChange', ".$id_service.")";
$insert = mysqli_query(DB::$connexion, $query);
$id_topic = mysqli_insert_id(DB::$connexion);
$query = "INSERT INTO `api_topic_user` (`id_topic`, `id_user`) VALUES (".$id_topic.", 1)";
$insert = mysqli_query(DB::$connexion, $query);




$query = "INSERT INTO `api_service` (`groupe`, `nom`, `messageType`, `function_name`, `details`) VALUES ('Mapping', '/wyca_mapping/get_state', 'std_srvs/Trigger', 'MappingGetState', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages')";
$insert = mysqli_query(DB::$connexion, $query);
$id_service = mysqli_insert_id(DB::$connexion);
$query = "INSERT INTO `api_service_user` (`id_service`, `id_user`) VALUES (".$id_service.", 1)";
$insert = mysqli_query(DB::$connexion, $query);

$query = "INSERT INTO `api_topic` (`groupe`, `nom`, `messageType`, `event_name`, `id_service_update`) VALUES ('Mapping', '/wyca_mapping/state', 'std_msgs/Bool', 'onMappingStateChange', ".$id_service.")";
$insert = mysqli_query(DB::$connexion, $query);
$id_topic = mysqli_insert_id(DB::$connexion);
$query = "INSERT INTO `api_topic_user` (`id_topic`, `id_user`) VALUES (".$id_topic.", 1)";
$insert = mysqli_query(DB::$connexion, $query);



$query = "INSERT INTO `api_topic` (`groupe`, `nom`, `messageType`, `event_name`, `id_service_update`) VALUES ('Navigation', '/wyca_api/navigation/robot_pose', 'geometry_msgs/Pose2D', 'onRobotPoseChange', ".$id_service.")";
$insert = mysqli_query(DB::$connexion, $query);
$id_topic = mysqli_insert_id(DB::$connexion);
$query = "INSERT INTO `api_topic_user` (`id_topic`, `id_user`) VALUES (".$id_topic.", 1)";
$insert = mysqli_query(DB::$connexion, $query);






?>
