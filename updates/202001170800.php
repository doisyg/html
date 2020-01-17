<?php
$query = "DROP TABLE IF EXISTS `api_action`;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "CREATE TABLE `api_action` (
  `id_action` int(10) NOT NULL,
  `groupe` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `messageType` varchar(255) NOT NULL,
  `function_name` varchar(255) NOT NULL,
  `details` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "INSERT INTO `api_action` (`id_action`, `groupe`, `nom`, `messageType`, `function_name`, `details`) VALUES
(3, 'Navigation', '/go_to_pose', 'wyca_bt_tool_nodes/GoToPoseAction', 'RobotMoveTo', 'geometry_msgs/PoseStamped target_pose\r\n---\r\nstring error\r\n---\r\nstring current_step'),
(4, 'Navigation', '/docking/dock', 'keylo_docking/DockAction', 'RobotDock', '---\r\nstring error\r\n---\r\nstring current_docking_step'),
(5, 'Navigation', '/docking/undock', 'keylo_docking/UndockAction', 'RobotUndock', '---\r\nstring error\r\n---\r\nstring current_undocking_step');"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "DROP TABLE IF EXISTS `api_action_user`;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "CREATE TABLE `api_action_user` (
  `id_action_user` int(10) NOT NULL,
  `id_action` int(10) NOT NULL,
  `id_user` int(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "INSERT INTO `api_action_user` (`id_action_user`, `id_action`, `id_user`) VALUES
(70, 3, 1),
(69, 5, 1),
(68, 4, 1);"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "DROP TABLE IF EXISTS `api_service`;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "CREATE TABLE `api_service` (
  `id_service` int(10) NOT NULL,
  `groupe` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `messageType` varchar(255) NOT NULL,
  `function_name` varchar(255) NOT NULL,
  `details` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "INSERT INTO `api_service` (`id_service`, `groupe`, `nom`, `messageType`, `function_name`, `details`) VALUES
(65, 'Safety', '/sensors/safety_stop/refresh_safety_stop', 'std_srvs/Trigger', 'RefreshSafetyStop', '---\r\nbool success # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(66, 'Safety', '/sensors/safety_stop/refresh_freewheel_state', 'std_srvs/Trigger', 'RefreshFreewheelState', '---\r\nbool success # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(12, 'Navigation', '/keylo_api/navigation/do_stop', 'std_srvs/Trigger', 'RobotStop', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(14, 'Navigation', '/keylo_api/navigation/get_robot_pose', 'keylo_api/GetRobotPose', 'RobotGetPos', '---\r\nbool success				# true if updated data available\r\nstring message				# error message in case successfalse\r\ngeometry_msgs/Pose2D robot_pose		# the robot pose in the map frame\r\n\r\n'),
(15, 'Navigation', '/keylo_api/recovery/set_robot_pose', 'keylo_api/SetRobotPose', 'RobotSetPos', 'geometry_msgs/Pose2D robot_pose	# The robot pose. x and y in meters, theta in radians\r\n---\r\nbool success			# \r\nstring message			# Error message in case successfalse / No error implemented\r\n'),
(18, 'Leds', '/elodie_api/leds/conf_led_anim', 'elodie_u_controller/ConfLedAnim', 'LedsConfigAnimation', 'uint8 state			# id de l&#39;etat du robot Ãƒ  modifier\r\nuint8 anim			# id de l&#39;animation dÃƒÂ©sirÃƒÂ©\r\nuint8 R				# Niveau de rouge de la couleur\r\nuint8 G				# Niveau de vert de la couleur\r\nuint8 B				# Niveau de bleu de la couleur\r\n---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse'),
(19, 'Navigation', '/sensors/get_current_floor', 'elodie_u_controller/GetCurrentFloor', 'RobotGetCurrentFloor', '---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse\r\nuint8 current_floor		# the current floor'),
(20, 'Leds', '/elodie_api/leds/get_led_is_light_mode', 'elodie_u_controller/GetLedIsLightMode', 'LedsGetIsLightMode', '---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse\r\nbool is_light_mode	# true if led is in manual mode\r\n\r\n'),
(21, 'Leds', 'elodie_api/leds/get_led_is_manual_mode', 'elodie_u_controller/GetLedIsManualMode', 'LedsGetIsManualMode', '---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse\r\nbool is_manual_mode	# true if led is in manual mode\r\n\r\n'),
(22, 'Sensors', '/sensors/get_sensors_data', 'elodie_u_controller/GetSensorsData', 'SensorsGetAltimetreData', '---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse\r\nfloat32 temperature	# Temperature Celcuis\r\nfloat32 pressure	# Pressure Pa\r\nfloat32 altitude	# Altitude meter'),
(23, 'Navigation', '/sensors/set_current_floor', 'elodie_u_controller/SetCurrentFloor', 'RobotSetCurrentFloor', 'uint8 current_floor	# the current floor\r\n---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse'),
(24, 'Leds', '/elodie_api/leds/set_led_is_light_mode', 'std_srvs/SetBool', 'LedsIsLightMode', 'bool data # enabling / disabling\r\n---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(25, 'Leds', '/elodie_api/leds/set_led_is_manual_mode', 'elodie_u_controller/SetLedIsManualMode', 'LedsIsManualMode', 'bool is_manual_mode	# true if led is in manual mode\r\n---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse'),
(26, 'Interface', '/keylo_interface/do_browser_restart', 'keylo_interface/DoBrowserRestart', 'RestartBrowser', 'bool kiosk_mode		# If the browser should restart in kiosk mode\r\n---\r\nbool success		# true if executed, false if not\r\nstring message		# &#34;Error[301]: can&#39;t restart browser because one or more tab is in a non-restartable state&#34;\r\n'),
(30, 'Navigation', '/keylo_state/set_keylo_state', 'keylo_state/SetKeyloState', 'RobotSetState', 'string robot_state		# Set the current robot state to this value\r\n---\r\nbool success		# If state set\r\nstring message		# Error message in case successfalse / Error[401]: not a valid state\r\n\r\n'),
(51, 'Interne', '', 'std_srvs/Empty	', 'InitDynamicsTopics', ''),
(45, 'Map', '', 'std_srvs/Empty', 'MapGetHTML', '---\r\nbool success			# If updated data available\r\nstring message			# Error message in case successfalse\r\nstring html_map		# HTML code to display map'),
(46, 'Navigation', '', 'std_srvs/Empty', 'GetPOIs', '---\r\nbool success			# true if updated data available\r\nstring message			# error message in case successfalse\r\nkeylo_api/Poi[] pois		# list of POIs\r\n'),
(47, 'Navigation', '', 'std_srvs/Empty', 'GetBoxs', '---\r\nbool success			# true if updated data available\r\nstring message			# error message in case successfalse\r\nkeylo_api/Box[] pois		# list of Boxs\r\n'),
(48, 'Navigation', '', 'std_srvs/String', 'RobotMoveToPOI', 'string poi_name	# the name of the POI to send the robot to\r\n---\r\nbool success	# true if executed, false if not\r\nstring message	# Error message in case successfalse / &#34;Error[001]: destination is unreachable&#34; / &#34;Error[002]: destination is reachable but the robot is blocked in its starting position&#34; / Error[003]: Invalid box number or destination&#34; / &#34;Error[004]: Robot in final docking stage,impossible to navigate, wait for the docking procedure to finish&#34;\r\ngeometry_msgs/Pose2D goal_pose_feedback	# the pose of the robot destination in map coordinates'),
(50, 'Map', '', 'std_srvs/Empty', 'MapInit', 'uint8 maxWidth # max width of the map\r\nuint8 maxHeight # max height of the map\r\n---'),
(52, 'Interne', '', 'std_srvs/Empty	', 'InitDynamicServices', ''),
(57, 'Tools', 'tools/pose2D_to_posestamped', 'wyca_bt_tool_nodes/Pose2DToPoseStamped', 'ConvertPose2DToPosesStamped', 'geometry_msgs/Pose2D pose_to_convert\r\n---\r\ngeometry_msgs/PoseStamped pose_converted'),
(58, 'Navigation', '/docking/get_docking_state', 'std_srvs/Trigger', 'GetDockingState', '---\r\nbool success # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(59, 'Navigation', '/docking/override_docking_state', 'std_srvs/SetBool', 'SetDockingState', 'bool data # enabling / disabling\r\n---\r\nbool success # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(64, 'Mapping', '/wyca_mapping/stop', 'std_srvs/Trigger', 'MappingStop', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(63, 'Mapping', '/wyca_mapping/start', 'std_srvs/Trigger', 'MappingStart', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages');"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "DROP TABLE IF EXISTS `api_service_user`;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "CREATE TABLE `api_service_user` (
  `id_service_user` int(10) NOT NULL,
  `id_service` int(10) NOT NULL,
  `id_user` int(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "INSERT INTO `api_service_user` (`id_service_user`, `id_service`, `id_user`) VALUES
(1427, 65, 1),
(1426, 66, 1),
(1429, 57, 1),
(1428, 22, 1),
(1425, 30, 1),
(1424, 23, 1),
(1423, 19, 1),
(1422, 15, 1),
(1421, 14, 1),
(1420, 12, 1),
(1419, 59, 1),
(1418, 58, 1),
(1417, 48, 1),
(1416, 47, 1),
(1415, 46, 1),
(1414, 64, 1),
(1413, 63, 1),
(1412, 50, 1),
(1411, 45, 1),
(1410, 25, 1),
(1409, 24, 1),
(1408, 21, 1),
(1407, 20, 1),
(1406, 18, 1),
(1405, 52, 1),
(1404, 51, 1),
(1403, 26, 1);"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "DROP TABLE IF EXISTS `api_topic`;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "CREATE TABLE `api_topic` (
  `id_topic` int(10) NOT NULL,
  `groupe` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `messageType` varchar(255) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `publish_name` varchar(255) NOT NULL,
  `id_service_update` int(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "INSERT INTO `api_topic` (`id_topic`, `groupe`, `nom`, `messageType`, `event_name`, `publish_name`, `id_service_update`) VALUES
(4, 'Other', '/keylo_api/email', 'std_msgs/String', 'onLogEmailNew', 'LogSendEmail', 0),
(16, 'Other', '/keylo_api/log_msg', 'std_msgs/String', 'onLogMsg', 'LogSendMsg', 0),
(20, 'Navigation', '/docking/docking_state', 'std_msgs/String', 'onNavigationRobotStateChange', '', 58),
(22, 'Other', '/keylo_api/sms', 'std_msgs/String', 'onLogSMSNew', 'LogSendSMS', 0),
(23, 'Navigation', '/sensors/current_floor', 'std_msgs/Int8', 'onNavigationCurrentFloorChange', '', 0),
(24, 'Leds', '/elodie_api/leds/current_led_animation_mode', 'std_msgs/Int8', 'onLedsCurrentAnimationModeChange', '', 0),
(25, 'Leds', '/elodie_api/leds/current_led_robot_state_mode', 'std_msgs/Int8', 'onLedsCurrentRobotStateModeChange', '', 0),
(26, 'Leds', '/elodie_api/leds/is_light_mode', 'std_msgs/Bool', 'onLedsIsLightModeChange', '', 20),
(27, 'Leds', '/elodie_api/leds/is_manual_mode', 'std_msgs/Bool', 'onLedsIsManualModeChange', '', 21),
(28, 'Sensors', '/sensors/BMP280_values', 'elodie_u_controller/SensorsObject', 'onSensorsAltimeterChange', '', 0),
(29, 'Leds', '/keylo_arduino/set_anim_led', 'keylo_arduino/AnimLedObject', 'onLedsSetAnimLedChange', '', 0),
(77, 'BMS', '/bms/absolute_SOC_percentage', 'std_msgs/UInt8', 'onSOCChange', '', 0),
(78, 'BMS', '/bms/currentA', 'std_msgs/Float32', 'onCurrentAChange', '', 0),
(79, 'BMS', '/bms/is_powered', 'std_msgs/Bool', 'onIsPoweredChange', '', 0),
(80, 'BMS', '/bms/remaining_capacity_Wh', 'std_msgs/UInt16', 'onRemainingCapacityWhChange', '', 0),
(81, 'BMS', '/bms/time_remaining_to_empty_min', 'std_msgs/UInt16', 'onTimeRemainingToEmptyMinChange', '', 0),
(82, 'BMS', '/bms/time_remaining_to_full_min', 'std_msgs/UInt16', 'onTimeRemainingToFullMinChange', '', 0),
(83, 'Safety', '/sensors/safety_stop/is_safety_stop', 'std_msgs/Bool', 'onIsSafetyStopChange', '', 65),
(84, 'Safety', '/sensors/freewheel_state/is_freewheel', 'std_msgs/Bool', 'onIsFreewheelChange', '', 66),
(62, 'Map', '', 'std_msg/String', 'onMapBoxClick', '', 0),
(63, 'Map', '', 'geometry_msgs/Pose2D', 'onMapRouteClick', '', 0),
(64, 'Map', '', 'void', 'onMapIsLoaded', '', 0),
(65, 'Sensors', '/scan', 'sensor_msgs/LaserScan', 'onSensorsLaserScan', '', 0),
(68, 'Log', '/logs/capture', 'std_msgs/String', 'onCaptureLog', '', 0),
(71, 'Log', '/logs/nav', 'std_msgs/String', 'onNavLog', '', 0),
(74, 'Mapping', '/wyca_mapping/robot_pose_in_building_map', 'geometry_msgs/Pose2D', 'onMappingRobotPoseChange', '', 0),
(76, 'Mapping', '/wyca_mapping/map_in_construction', 'wyca_mapping/MapInConstruction', 'onMapInConstruction', '', 0);"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "DROP TABLE IF EXISTS `api_topic_pub`;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "CREATE TABLE `api_topic_pub` (
  `id_topic_pub` int(10) NOT NULL,
  `groupe` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `messageType` varchar(255) NOT NULL,
  `function_name` varchar(255) NOT NULL,
  `details` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "INSERT INTO `api_topic_pub` (`id_topic_pub`, `groupe`, `nom`, `messageType`, `function_name`, `details`) VALUES
(1, 'Navigation', '/joystick_control/twist_safe_to_be', 'geometry_msgs/Twist', 'TeleopRobot', ''),
(2, 'Navigation', '/joystick_control/is_unsafe_off', 'std_msgs/Bool', 'JoystickIsUnsafeOff', ''),
(3, 'Navigation', '/joystick_control/is_safe_off', 'std_msgs/Bool', 'JoystickIsSafeOff', ''),
(4, 'Navigation', '/disable_static_local_costmap_layer', 'std_msgs/Empty', 'DisableStaticCostmap', '');"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "DROP TABLE IF EXISTS `api_topic_pub_user`;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "CREATE TABLE `api_topic_pub_user` (
  `id_topic_pub_user` int(10) NOT NULL,
  `id_topic_pub` int(10) NOT NULL,
  `id_user` int(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "INSERT INTO `api_topic_pub_user` (`id_topic_pub_user`, `id_topic_pub`, `id_user`) VALUES
(54, 1, 1),
(53, 2, 1),
(52, 3, 1),
(51, 4, 1);"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "DROP TABLE IF EXISTS `api_topic_user`;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "CREATE TABLE `api_topic_user` (
  `id_topic_user` int(10) NOT NULL,
  `id_topic` int(10) NOT NULL,
  `id_user` int(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "INSERT INTO `api_topic_user` (`id_topic_user`, `id_topic`, `id_user`) VALUES
(1769, 65, 1),
(1768, 28, 1),
(1767, 83, 1),
(1766, 84, 1),
(1765, 22, 1),
(1764, 16, 1),
(1763, 4, 1),
(1762, 23, 1),
(1761, 20, 1),
(1760, 74, 1),
(1759, 76, 1),
(1758, 64, 1),
(1757, 63, 1),
(1756, 62, 1),
(1755, 71, 1),
(1754, 68, 1),
(1753, 29, 1),
(1752, 27, 1),
(1751, 26, 1),
(1750, 25, 1),
(1749, 24, 1),
(1748, 82, 1),
(1747, 81, 1),
(1746, 80, 1),
(1745, 79, 1),
(1744, 78, 1),
(1743, 77, 1);"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_action`
  ADD PRIMARY KEY (`id_action`),
  ADD KEY `groupe` (`groupe`);"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_action_user`
  ADD PRIMARY KEY (`id_action_user`),
  ADD KEY `id_service` (`id_action`),
  ADD KEY `id_user` (`id_user`);"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_service`
  ADD PRIMARY KEY (`id_service`),
  ADD KEY `groupe` (`groupe`);"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_service_user`
  ADD PRIMARY KEY (`id_service_user`),
  ADD KEY `id_service` (`id_service`),
  ADD KEY `id_user` (`id_user`);"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_topic`
  ADD PRIMARY KEY (`id_topic`),
  ADD KEY `groupe` (`groupe`),
  ADD KEY `update_service` (`id_service_update`);"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_topic_pub`
  ADD PRIMARY KEY (`id_topic_pub`),
  ADD KEY `groupe` (`groupe`);"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_topic_pub_user`
  ADD PRIMARY KEY (`id_topic_pub_user`),
  ADD KEY `id_topic_pub` (`id_topic_pub`),
  ADD KEY `id_user` (`id_user`);"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_topic_user`
  ADD PRIMARY KEY (`id_topic_user`),
  ADD KEY `id_topic` (`id_topic`),
  ADD KEY `id_user` (`id_user`);"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_action`
  MODIFY `id_action` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_action_user`
  MODIFY `id_action_user` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_service`
  MODIFY `id_service` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_service_user`
  MODIFY `id_service_user` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1430;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_topic`
  MODIFY `id_topic` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_topic_pub`
  MODIFY `id_topic_pub` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_topic_pub_user`
  MODIFY `id_topic_pub_user` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
$query = "ALTER TABLE `api_topic_user`
  MODIFY `id_topic_user` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1770;"; mysqli_query(DB::$connexion, $query) or die(mysqli_error(DB::$connexion).'<!--'.$query.'-->');
