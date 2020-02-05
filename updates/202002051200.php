<?php
$query = "INSERT INTO `api_service` (`groupe`, `nom`, `messageType`, `function_name`, `details`) VALUES ('Latency', '/wyca_api/latency_start', 'wyca_api/StartLatency', 'LatencyStart', 'int16 num\r\n---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse')";
$insert = mysqli_query(DB::$connexion, $query);
$id_service = mysqli_insert_id(DB::$connexion);
$query = "INSERT INTO `api_service_user` (`id_service`, `id_user`) VALUES (".$id_service.", 1)";
$insert = mysqli_query(DB::$connexion, $query);

$query = "INSERT INTO `api_topic` (`groupe`, `nom`, `messageType`, `event_name`, `id_service_update`) VALUES ('Latency', '/wyca_api/latency_return', 'std_msgs/Int16', 'onLatencyReturn', 0)";
$insert = mysqli_query(DB::$connexion, $query);
$id_topic = mysqli_insert_id(DB::$connexion);
$query = "INSERT INTO `api_topic_user` (`id_topic`, `id_user`) VALUES (".$id_topic.", 1)";
$insert = mysqli_query(DB::$connexion, $query);



?>
