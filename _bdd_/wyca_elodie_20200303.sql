-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  mar. 03 mars 2020 à 15:50
-- Version du serveur :  5.7.23
-- Version de PHP :  7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `wyca_elodie`
--

-- --------------------------------------------------------

--
-- Structure de la table `api_action`
--

DROP TABLE IF EXISTS `api_action`;
CREATE TABLE IF NOT EXISTS `api_action` (
  `id_action` int(10) NOT NULL AUTO_INCREMENT,
  `groupe` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `messageType` varchar(255) NOT NULL,
  `function_name` varchar(255) NOT NULL,
  `details` text NOT NULL,
  PRIMARY KEY (`id_action`),
  KEY `groupe` (`groupe`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_action`
--

INSERT INTO `api_action` (`id_action`, `groupe`, `nom`, `messageType`, `function_name`, `details`) VALUES
(3, 'Navigation', '/go_to_pose', 'wyca_bt_tool_nodes/GoToPoseAction', 'RobotMoveTo', 'geometry_msgs/PoseStamped target_pose\r\n---\r\nstring error\r\n---\r\nstring current_step'),
(4, 'Navigation', '/docking/dock', 'keylo_docking/DockAction', 'RobotDock', '---\r\nstring error\r\n---\r\nstring current_docking_step'),
(5, 'Navigation', '/docking/undock', 'keylo_docking/UndockAction', 'RobotUndock', '---\r\nstring error\r\n---\r\nstring current_undocking_step');

-- --------------------------------------------------------

--
-- Structure de la table `api_action_groupe`
--

DROP TABLE IF EXISTS `api_action_groupe`;
CREATE TABLE IF NOT EXISTS `api_action_groupe` (
  `id_action_groupe` int(10) NOT NULL AUTO_INCREMENT,
  `id_action` int(10) NOT NULL,
  `id_groupe_user` int(10) NOT NULL,
  PRIMARY KEY (`id_action_groupe`),
  KEY `id_service` (`id_action`),
  KEY `id_user` (`id_groupe_user`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_action_groupe`
--

INSERT INTO `api_action_groupe` (`id_action_groupe`, `id_action`, `id_groupe_user`) VALUES
(1, 4, -1),
(2, 5, -1),
(3, 3, -1),
(4, 4, 1),
(5, 5, 1),
(6, 3, 1),
(7, 4, 2),
(8, 5, 2),
(9, 3, 2),
(10, 4, 3),
(11, 5, 3),
(12, 3, 3);

-- --------------------------------------------------------

--
-- Structure de la table `api_service`
--

DROP TABLE IF EXISTS `api_service`;
CREATE TABLE IF NOT EXISTS `api_service` (
  `id_service` int(10) NOT NULL AUTO_INCREMENT,
  `groupe` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `messageType` varchar(255) NOT NULL,
  `function_name` varchar(255) NOT NULL,
  `details` text NOT NULL,
  PRIMARY KEY (`id_service`),
  KEY `groupe` (`groupe`)
) ENGINE=MyISAM AUTO_INCREMENT=73 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_service`
--

INSERT INTO `api_service` (`id_service`, `groupe`, `nom`, `messageType`, `function_name`, `details`) VALUES
(65, 'Safety', '/sensors/safety_stop/refresh_safety_stop', 'std_srvs/Trigger', 'RefreshSafetyStop', '---\r\nbool success # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(66, 'Safety', '/sensors/safety_stop/refresh_freewheel_state', 'std_srvs/Trigger', 'RefreshFreewheelState', '---\r\nbool success # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(12, 'Navigation', '/keylo_api/navigation/do_stop', 'std_srvs/Trigger', 'RobotStop', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(14, 'Navigation', '/keylo_api/navigation/get_robot_pose', 'keylo_api/GetRobotPose', 'RobotGetPos', '---\r\nbool success				# true if updated data available\r\nstring message				# error message in case successfalse\r\ngeometry_msgs/Pose2D robot_pose		# the robot pose in the map frame\r\n\r\n'),
(15, 'Navigation', '/keylo_api/recovery/set_robot_pose', 'keylo_api/SetRobotPose', 'RobotSetPos', 'geometry_msgs/Pose2D robot_pose	# The robot pose. x and y in meters, theta in radians\r\n---\r\nbool success			# \r\nstring message			# Error message in case successfalse / No error implemented\r\n'),
(18, 'Leds', '/elodie_api/leds/conf_led_anim', 'elodie_u_controller/ConfLedAnim', 'LedsConfigAnimation', 'uint8 state			# id de l&#39;etat du robot ÃƒÆ’  modifier\r\nuint8 anim			# id de l&#39;animation dÃƒÆ’Ã‚Â©sirÃƒÆ’Ã‚Â©\r\nuint8 R				# Niveau de rouge de la couleur\r\nuint8 G				# Niveau de vert de la couleur\r\nuint8 B				# Niveau de bleu de la couleur\r\n---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse'),
(19, 'Navigation', '/sensors/get_current_floor', 'elodie_u_controller/GetCurrentFloor', 'RobotGetCurrentFloor', '---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse\r\nuint8 current_floor		# the current floor'),
(20, 'Leds', '/elodie_api/leds/get_led_is_light_mode', 'elodie_u_controller/GetLedIsLightMode', 'LedsGetIsLightMode', '---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse\r\nbool is_light_mode	# true if led is in manual mode\r\n\r\n'),
(21, 'Leds', '/elodie_api/leds/get_led_is_manual_mode', 'elodie_u_controller/GetLedIsManualMode', 'LedsGetIsManualMode', '---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse\r\nbool is_manual_mode	# true if led is in manual mode\r\n\r\n'),
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
(64, 'Mapping', '/wyca_mapping/stop', 'wyca_mapping/StopMapping', 'MappingStop', '---\r\nsensor_msgs/CompressedImage final_map\r\nbool success\r\nstring message'),
(67, 'Navigation', '/wyca_api/navigation/start', 'wyca_api/StartNavigation', 'NavigationStart', 'bool init_from_mapping\r\n---\r\nbool success\r\nstring message'),
(63, 'Mapping', '/wyca_mapping/start', 'std_srvs/Trigger', 'MappingStart', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(68, 'Navigation', '/wyca_api/navigation/stop', 'std_srvs/Trigger', 'NavigationStop', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(69, 'Navigation', '/wyca_api/navigation/is_started', 'std_srvs/Trigger', 'NavigationGetState', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(70, 'Mapping', '/wyca_mapping/is_started', 'std_srvs/Trigger', 'MappingGetState', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(71, 'Navigation', '/wyca_api/do_reload_maps', 'std_srvs/Trigger', 'NavigationReloadMaps', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(72, 'Latency', '/wyca_api/latency_start', 'wyca_api/StartLatency', 'LatencyStart', 'int16 num\r\n---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse');

-- --------------------------------------------------------

--
-- Structure de la table `api_service_groupe`
--

DROP TABLE IF EXISTS `api_service_groupe`;
CREATE TABLE IF NOT EXISTS `api_service_groupe` (
  `id_service_groupe` int(10) NOT NULL AUTO_INCREMENT,
  `id_service` int(10) NOT NULL,
  `id_groupe_user` int(10) NOT NULL,
  PRIMARY KEY (`id_service_groupe`),
  KEY `id_service` (`id_service`),
  KEY `id_user` (`id_groupe_user`)
) ENGINE=MyISAM AUTO_INCREMENT=85 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_service_groupe`
--

INSERT INTO `api_service_groupe` (`id_service_groupe`, `id_service`, `id_groupe_user`) VALUES
(1, 26, -1),
(2, 51, -1),
(3, 52, -1),
(4, 72, -1),
(5, 18, -1),
(6, 20, -1),
(7, 24, -1),
(8, 25, -1),
(9, 21, -1),
(10, 45, -1),
(11, 50, -1),
(12, 70, -1),
(13, 63, -1),
(14, 64, -1),
(15, 46, -1),
(16, 47, -1),
(17, 48, -1),
(18, 58, -1),
(19, 59, -1),
(20, 12, -1),
(21, 14, -1),
(22, 15, -1),
(23, 30, -1),
(24, 19, -1),
(25, 23, -1),
(26, 71, -1),
(27, 69, -1),
(28, 67, -1),
(29, 68, -1),
(30, 66, -1),
(31, 65, -1),
(32, 22, -1),
(33, 57, -1),
(34, 26, 1),
(35, 51, 1),
(36, 52, 1),
(37, 72, 1),
(38, 18, 1),
(39, 20, 1),
(40, 24, 1),
(41, 25, 1),
(42, 21, 1),
(43, 45, 1),
(44, 50, 1),
(45, 70, 1),
(46, 63, 1),
(47, 64, 1),
(48, 46, 1),
(49, 47, 1),
(50, 48, 1),
(51, 58, 1),
(52, 59, 1),
(53, 12, 1),
(54, 14, 1),
(55, 15, 1),
(56, 30, 1),
(57, 19, 1),
(58, 23, 1),
(59, 71, 1),
(60, 69, 1),
(61, 67, 1),
(62, 68, 1),
(63, 66, 1),
(64, 65, 1),
(65, 22, 1),
(66, 57, 1),
(67, 70, 2),
(68, 63, 2),
(69, 64, 2),
(70, 58, 2),
(71, 12, 2),
(72, 14, 2),
(73, 69, 2),
(74, 67, 2),
(75, 68, 2),
(76, 66, 2),
(77, 65, 2),
(78, 70, 3),
(79, 58, 3),
(80, 12, 3),
(81, 14, 3),
(82, 69, 3),
(83, 67, 3),
(84, 65, 3);

-- --------------------------------------------------------

--
-- Structure de la table `api_topic`
--

DROP TABLE IF EXISTS `api_topic`;
CREATE TABLE IF NOT EXISTS `api_topic` (
  `id_topic` int(10) NOT NULL AUTO_INCREMENT,
  `groupe` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `messageType` varchar(255) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `publish_name` varchar(255) NOT NULL,
  `id_service_update` int(10) NOT NULL,
  PRIMARY KEY (`id_topic`),
  KEY `groupe` (`groupe`),
  KEY `update_service` (`id_service_update`)
) ENGINE=MyISAM AUTO_INCREMENT=89 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_topic`
--

INSERT INTO `api_topic` (`id_topic`, `groupe`, `nom`, `messageType`, `event_name`, `publish_name`, `id_service_update`) VALUES
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
(77, 'BMS', '/bms/relative_SOC_percentage', 'std_msgs/UInt8', 'onSOCChange', '', 0),
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
(65, 'Sensors', '/scan_throttled', 'sensor_msgs/LaserScan', 'onSensorsLaserScan', '', 0),
(68, 'Log', '/logs/capture', 'std_msgs/String', 'onCaptureLog', '', 0),
(71, 'Log', '/logs/nav', 'std_msgs/String', 'onNavLog', '', 0),
(74, 'Mapping', '/wyca_mapping/robot_pose_in_building_map', 'geometry_msgs/Pose2D', 'onMappingRobotPoseChange', '', 0),
(76, 'Mapping', '/wyca_mapping/map_in_construction', 'wyca_mapping/MapInConstruction', 'onMapInConstruction', '', 0),
(85, 'Navigation', '/wyca_api/navigation/is_started', 'std_msgs/Bool', 'onNavigationStateChange', '', 69),
(86, 'Mapping', '/wyca_mapping/is_started', 'std_msgs/Bool', 'onMappingStateChange', '', 70),
(87, 'Navigation', '/wyca_api/navigation/robot_pose', 'geometry_msgs/Pose2D', 'onRobotPoseChange', '', 14),
(88, 'Latency', '/wyca_api/latency_return', 'std_msgs/Int16', 'onLatencyReturn', '', 0);

-- --------------------------------------------------------

--
-- Structure de la table `api_topic_groupe`
--

DROP TABLE IF EXISTS `api_topic_groupe`;
CREATE TABLE IF NOT EXISTS `api_topic_groupe` (
  `id_topic_groupe` int(10) NOT NULL AUTO_INCREMENT,
  `id_topic` int(10) NOT NULL,
  `id_groupe_user` int(10) NOT NULL,
  PRIMARY KEY (`id_topic_groupe`),
  KEY `id_topic` (`id_topic`),
  KEY `id_user` (`id_groupe_user`)
) ENGINE=MyISAM AUTO_INCREMENT=75 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_topic_groupe`
--

INSERT INTO `api_topic_groupe` (`id_topic_groupe`, `id_topic`, `id_groupe_user`) VALUES
(1, 78, -1),
(2, 79, -1),
(3, 77, -1),
(4, 80, -1),
(5, 81, -1),
(6, 82, -1),
(7, 88, -1),
(8, 24, -1),
(9, 25, -1),
(10, 26, -1),
(11, 27, -1),
(12, 29, -1),
(13, 68, -1),
(14, 71, -1),
(15, 62, -1),
(16, 63, -1),
(17, 64, -1),
(18, 86, -1),
(19, 76, -1),
(20, 74, -1),
(21, 20, -1),
(22, 23, -1),
(23, 85, -1),
(24, 87, -1),
(25, 4, -1),
(26, 16, -1),
(27, 22, -1),
(28, 84, -1),
(29, 83, -1),
(30, 65, -1),
(31, 28, -1),
(32, 78, 1),
(33, 79, 1),
(34, 77, 1),
(35, 80, 1),
(36, 81, 1),
(37, 82, 1),
(38, 88, 1),
(39, 24, 1),
(40, 25, 1),
(41, 26, 1),
(42, 27, 1),
(43, 29, 1),
(44, 68, 1),
(45, 71, 1),
(46, 62, 1),
(47, 63, 1),
(48, 64, 1),
(49, 86, 1),
(50, 76, 1),
(51, 74, 1),
(52, 20, 1),
(53, 23, 1),
(54, 85, 1),
(55, 87, 1),
(56, 4, 1),
(57, 16, 1),
(58, 22, 1),
(59, 84, 1),
(60, 83, 1),
(61, 65, 1),
(62, 28, 1),
(63, 77, 2),
(64, 86, 2),
(65, 85, 2),
(66, 87, 2),
(67, 84, 2),
(68, 83, 2),
(69, 65, 2),
(70, 77, 3),
(71, 20, 3),
(72, 85, 3),
(73, 84, 3),
(74, 83, 3);

-- --------------------------------------------------------

--
-- Structure de la table `api_topic_pub`
--

DROP TABLE IF EXISTS `api_topic_pub`;
CREATE TABLE IF NOT EXISTS `api_topic_pub` (
  `id_topic_pub` int(10) NOT NULL AUTO_INCREMENT,
  `groupe` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `messageType` varchar(255) NOT NULL,
  `function_name` varchar(255) NOT NULL,
  `details` text NOT NULL,
  PRIMARY KEY (`id_topic_pub`),
  KEY `groupe` (`groupe`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_topic_pub`
--

INSERT INTO `api_topic_pub` (`id_topic_pub`, `groupe`, `nom`, `messageType`, `function_name`, `details`) VALUES
(1, 'Navigation', '/joystick_control/twist_safe_to_be', 'geometry_msgs/Twist', 'TeleopRobot', ''),
(2, 'Navigation', '/joystick_control/is_unsafe_off', 'std_msgs/Bool', 'JoystickIsUnsafeOff', ''),
(3, 'Navigation', '/joystick_control/is_safe_off', 'std_msgs/Bool', 'JoystickIsSafeOff', ''),
(4, 'Navigation', '/disable_static_local_costmap_layer', 'std_msgs/Empty', 'DisableStaticCostmap', '');

-- --------------------------------------------------------

--
-- Structure de la table `api_topic_pub_groupe`
--

DROP TABLE IF EXISTS `api_topic_pub_groupe`;
CREATE TABLE IF NOT EXISTS `api_topic_pub_groupe` (
  `id_topic_pub_groupe` int(10) NOT NULL AUTO_INCREMENT,
  `id_topic_pub` int(10) NOT NULL,
  `id_groupe_user` int(10) NOT NULL,
  PRIMARY KEY (`id_topic_pub_groupe`),
  KEY `id_topic_pub` (`id_topic_pub`),
  KEY `id_user` (`id_groupe_user`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_topic_pub_groupe`
--

INSERT INTO `api_topic_pub_groupe` (`id_topic_pub_groupe`, `id_topic_pub`, `id_groupe_user`) VALUES
(1, 4, -1),
(2, 3, -1),
(3, 2, -1),
(4, 1, -1),
(5, 4, 1),
(6, 3, 1),
(7, 2, 1),
(8, 1, 1),
(9, 4, 2),
(10, 3, 2),
(11, 1, 2),
(12, 4, 3),
(13, 3, 3),
(14, 1, 3);

-- --------------------------------------------------------

--
-- Structure de la table `area`
--

DROP TABLE IF EXISTS `area`;
CREATE TABLE IF NOT EXISTS `area` (
  `id_area` int(11) NOT NULL AUTO_INCREMENT,
  `id_map` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `color_r` int(3) NOT NULL,
  `color_g` int(3) NOT NULL,
  `color_b` int(3) NOT NULL,
  `is_forbidden` tinyint(1) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `from_install` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_area`),
  KEY `id_plan` (`id_map`),
  KEY `is_forbidden` (`is_forbidden`),
  KEY `from_install` (`from_install`),
  KEY `deleted` (`deleted`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `area_config`
--

DROP TABLE IF EXISTS `area_config`;
CREATE TABLE IF NOT EXISTS `area_config` (
  `id_area_config` int(11) NOT NULL AUTO_INCREMENT,
  `id_area` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id_area_config`),
  KEY `id_area` (`id_area`),
  KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `area_point`
--

DROP TABLE IF EXISTS `area_point`;
CREATE TABLE IF NOT EXISTS `area_point` (
  `id_area_point` int(11) NOT NULL AUTO_INCREMENT,
  `id_area` int(11) NOT NULL,
  `x` decimal(10,6) NOT NULL,
  `y` decimal(10,6) NOT NULL,
  PRIMARY KEY (`id_area_point`),
  KEY `id_poly` (`id_area`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `configuration`
--

DROP TABLE IF EXISTS `configuration`;
CREATE TABLE IF NOT EXISTS `configuration` (
  `id_configuration` int(10) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `valeur` varchar(255) NOT NULL,
  PRIMARY KEY (`id_configuration`),
  KEY `nom` (`nom`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `configuration`
--

INSERT INTO `configuration` (`id_configuration`, `nom`, `description`, `valeur`) VALUES
(3, 'CURRENT_SITE', '', '1'),
(4, 'CURRENT_MAP', '', '-1'),
(5, 'level_min_gotodock', '', '10'),
(6, 'level_min_dotask', '', '53'),
(7, 'level_min_gotodock_aftertask', '', '50'),
(8, 'LAST_UPDATE', '', ''),
(10, 'INSTALL_STEP', '', '0'),
(9, 'ID_LANG', '', '1');

-- --------------------------------------------------------

--
-- Structure de la table `docking_station`
--

DROP TABLE IF EXISTS `docking_station`;
CREATE TABLE IF NOT EXISTS `docking_station` (
  `id_docking_station` int(11) NOT NULL AUTO_INCREMENT,
  `id_map` int(11) NOT NULL,
  `x_ros` decimal(8,4) NOT NULL,
  `y_ros` decimal(8,4) NOT NULL,
  `t_ros` decimal(8,4) NOT NULL,
  `num` int(3) NOT NULL,
  `name` varchar(255) NOT NULL,
  `comment` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_docking_station`),
  KEY `id_plan` (`id_map`),
  KEY `active` (`active`),
  KEY `num` (`num`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `email_send`
--

DROP TABLE IF EXISTS `email_send`;
CREATE TABLE IF NOT EXISTS `email_send` (
  `id_email` int(10) NOT NULL AUTO_INCREMENT,
  `sended` tinyint(1) NOT NULL DEFAULT '0',
  `destinataire` varchar(255) NOT NULL,
  `sujet` text NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`id_email`),
  KEY `sended` (`sended`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `groupe_user`
--

DROP TABLE IF EXISTS `groupe_user`;
CREATE TABLE IF NOT EXISTS `groupe_user` (
  `id_groupe_user` int(10) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  PRIMARY KEY (`id_groupe_user`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `groupe_user`
--

INSERT INTO `groupe_user` (`id_groupe_user`, `nom`) VALUES
(1, 'Wyca'),
(2, 'Distributor'),
(3, 'Manager'),
(6, 'User');

-- --------------------------------------------------------

--
-- Structure de la table `ip_blocked`
--

DROP TABLE IF EXISTS `ip_blocked`;
CREATE TABLE IF NOT EXISTS `ip_blocked` (
  `IP` varchar(45) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`IP`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `ip_error_trace`
--

DROP TABLE IF EXISTS `ip_error_trace`;
CREATE TABLE IF NOT EXISTS `ip_error_trace` (
  `id_ip_error_trace` int(10) NOT NULL AUTO_INCREMENT,
  `type` enum('Connect','404') NOT NULL,
  `date` datetime NOT NULL,
  `IP` varchar(45) NOT NULL,
  PRIMARY KEY (`id_ip_error_trace`),
  KEY `type` (`type`),
  KEY `date` (`date`),
  KEY `IP` (`IP`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `lang`
--

DROP TABLE IF EXISTS `lang`;
CREATE TABLE IF NOT EXISTS `lang` (
  `id_lang` int(2) NOT NULL AUTO_INCREMENT,
  `iso` varchar(2) NOT NULL,
  `langue` varchar(20) NOT NULL,
  PRIMARY KEY (`id_lang`),
  KEY `iso` (`iso`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `lang`
--

INSERT INTO `lang` (`id_lang`, `iso`, `langue`) VALUES
(1, 'fr', 'Fran&ccedil;ais'),
(2, 'en', 'English');

-- --------------------------------------------------------

--
-- Structure de la table `log_ros`
--

DROP TABLE IF EXISTS `log_ros`;
CREATE TABLE IF NOT EXISTS `log_ros` (
  `id_log_ros` int(11) NOT NULL AUTO_INCREMENT,
  `level` varchar(50) NOT NULL,
  `type` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id_log_ros`),
  KEY `level` (`level`),
  KEY `type` (`type`),
  KEY `date` (`date`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `log_system`
--

DROP TABLE IF EXISTS `log_system`;
CREATE TABLE IF NOT EXISTS `log_system` (
  `id_log_system` int(11) NOT NULL AUTO_INCREMENT,
  `level` varchar(50) NOT NULL,
  `type` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id_log_system`) USING BTREE,
  KEY `level` (`level`),
  KEY `type` (`type`),
  KEY `date` (`date`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `log_task`
--

DROP TABLE IF EXISTS `log_task`;
CREATE TABLE IF NOT EXISTS `log_task` (
  `id_log_task` int(11) NOT NULL AUTO_INCREMENT,
  `level` varchar(50) NOT NULL,
  `type` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id_log_task`),
  KEY `level` (`level`),
  KEY `type` (`type`),
  KEY `date` (`date`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `map`
--

DROP TABLE IF EXISTS `map`;
CREATE TABLE IF NOT EXISTS `map` (
  `id_map` int(11) NOT NULL AUTO_INCREMENT,
  `id_site` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `image` text NOT NULL,
  `image_tri` text NOT NULL,
  `ros_resolution` int(3) NOT NULL,
  `ros_width` int(6) NOT NULL,
  `ros_height` int(6) NOT NULL,
  `threshold_free` int(3) NOT NULL,
  `threshold_occupied` int(3) NOT NULL,
  PRIMARY KEY (`id_map`),
  KEY `id_robot` (`id_site`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `poi`
--

DROP TABLE IF EXISTS `poi`;
CREATE TABLE IF NOT EXISTS `poi` (
  `id_poi` int(10) NOT NULL AUTO_INCREMENT,
  `id_map` int(11) NOT NULL,
  `x_ros` decimal(8,4) NOT NULL,
  `y_ros` decimal(8,4) NOT NULL,
  `t_ros` decimal(8,4) NOT NULL,
  `name` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `icon` varchar(255) NOT NULL,
  `advanced` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_poi`),
  KEY `id_map` (`id_map`),
  KEY `advanced` (`advanced`),
  KEY `active` (`active`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `robot_config`
--

DROP TABLE IF EXISTS `robot_config`;
CREATE TABLE IF NOT EXISTS `robot_config` (
  `id_robot_config` int(10) NOT NULL AUTO_INCREMENT,
  `id_site` int(10) NOT NULL,
  `date` datetime NOT NULL,
  `modifications` text NOT NULL,
  `update_by` enum('Server','Robot') NOT NULL DEFAULT 'Server',
  PRIMARY KEY (`id_robot_config`),
  KEY `id_robot` (`id_site`),
  KEY `date` (`date`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `robot_config`
--

INSERT INTO `robot_config` (`id_robot_config`, `id_site`, `date`, `modifications`, `update_by`) VALUES
(1, 1, '2019-12-09 00:00:00', '', 'Server');

-- --------------------------------------------------------

--
-- Structure de la table `robot_config_value`
--

DROP TABLE IF EXISTS `robot_config_value`;
CREATE TABLE IF NOT EXISTS `robot_config_value` (
  `id_robot_config_value` int(10) NOT NULL AUTO_INCREMENT,
  `id_robot_config` int(10) NOT NULL,
  `directory` varchar(255) NOT NULL,
  `file` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `data` text NOT NULL,
  `is_file` tinyint(1) NOT NULL DEFAULT '0',
  `date_upd_robot` datetime NOT NULL,
  `date_upd_server` datetime NOT NULL,
  PRIMARY KEY (`id_robot_config_value`),
  KEY `id_robot_config` (`id_robot_config`),
  KEY `dir` (`directory`),
  KEY `file` (`file`),
  KEY `is_file` (`is_file`),
  KEY `date_upd_robot` (`date_upd_robot`),
  KEY `date_upd_server` (`date_upd_server`)
) ENGINE=MyISAM AUTO_INCREMENT=2719 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `robot_config_value`
--

INSERT INTO `robot_config_value` (`id_robot_config_value`, `id_robot_config`, `directory`, `file`, `name`, `data`, `is_file`, `date_upd_robot`, `date_upd_server`) VALUES
(1, 1, '/auth', 'interface_urls.yaml', '', 'page_list: \"https://traxdev.wyca-solutions.com/robot_hmi/mapping/robot.php?id_robot=1&code=rXy5Q9LFbjdzVx7E2rbg\"', 0, '0000-00-00 00:00:00', '2019-08-13 08:08:53'),
(2, 1, '/auth', 'port.yaml', '', 'port: 9090', 0, '0000-00-00 00:00:00', '2019-08-13 08:09:03'),
(3, 1, '/auth', 'valid.secret', '', 'zSk81+WIgWIfbl|O', 0, '0000-00-00 00:00:00', '2019-08-13 08:09:12'),
(4, 1, '/collision_velocity_filter', 'collision_velocity_filter_params.yaml', '', 'footprint_update_frequency: 0.1\r\npot_ctrl_vmax: 0.4\r\npot_ctrl_vtheta_max: 0.4\r\npot_ctrl_kv: 1.0\r\npot_ctrl_kp: 2.0\r\npot_ctrl_virt_mass: 0.8\r\ninfluence_radius: 2.0\r\nobstacle_damping_dist: 1.5\r\nstop_threshold: 0.0\r\nuse_circumscribed_threshold: 0.2\r\ncostmap_obstacle_treshold: 100\r\nis_robot_circular: true\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:13:04'),
(5, 1, '/collision_velocity_filter', 'local_costmap_params.yaml', '', 'local_costmap:\r\n  global_frame: odom\r\n  robot_base_frame: base_link\r\n  update_frequency: 20.0\r\n  publish_frequency: 20.0\r\n  static_map: false\r\n  rolling_window: true\r\n  width: 5.5\r\n  height: 5.5\r\n  resolution: 0.05\r\n  transform_tolerance: 0.5\r\n  \r\n  plugins:\r\n   - {name: static_layer,        type: \"costmap_2d::StaticLayer\"}\r\n   - {name: obstacle_layer,      type: \"costmap_2d::ObstacleLayer\"}\r\n   - {name: sonar_layer,      type: \"range_sensor_layer::RangeSensorLayer\"}\r\n   - {name: inflation_layer,         type: \"costmap_2d::InflationLayer\"}\r\n\r\n\r\n\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(6, 1, '/docking', 'odom_simple_goal.yaml', '', '# config.yaml\r\n\r\nparameters:\r\n control_loop_freq: 20\r\n control_linear_P_gain: 1.0\r\n control_angular_P_gain: 2.0\r\n goal_linear_threshold: 0.02\r\n goal_angular_threshold: 0.02\r\n max_linear_velocity: 0.1\r\n max_angular_velocity: 0.3\r\n max_linear_acceleration: 0.1\r\n max_angular_acceleration: 3.5\r\n loop_indefinitly: false\r\n US_sensor_int_threshold: 0.4\r\n US_sensor_ext_threshold: 0.4\r\n\r\n obstacle_pause_duration: 1.0\r\n #set 0 for infinite consecutive iteration\r\n obstacle_pause_max_consecutive_iterations: 0\r\n\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(7, 1, '/docking', 'offset.yaml', '', 'offset: 0.01\r\nundock_distance: 0.3\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(8, 1, '/docking', 'routine_trajectory.yaml', '', '# config.yaml\r\n\r\nparameters:\r\n control_loop_freq: 20\r\n goal_linear_threshold: 0.02\r\n goal_angular_threshold: 0.02\r\n max_linear_velocity: 0.2\r\n max_angular_velocity: 0.7\r\n max_linear_acceleration: 0.01\r\n max_angular_acceleration: 0.7\r\n loop_indefinitly: false\r\n US_sensor_int_threshold: 0.5\r\n US_sensor_ext_threshold: 0.15\r\n obstacle_pause_duration: 2.0 \r\n #set 0 for infinite consecutive iteration \r\n obstacle_pause_max_consecutive_iterations: 0\r\n\r\ngoals:\r\n- id: 0\r\n  x: -0.35\r\n  y: 0\r\n  theta: 0\r\n  direction: -1\r\n- id: 1\r\n  x: -0.5\r\n  y: 0\r\n  theta: 0\r\n  direction: -1\r\n- id: 2\r\n  x: 0\r\n  y: 0\r\n  theta: 0.78539816339744830962\r\n  direction: -1\r\n- id: 3\r\n  x: 5\r\n  y: 0\r\n  theta: 0\r\n  direction: 0\r\n- id: 4\r\n  x: 0\r\n  y: 0\r\n  theta: -1.57079632679489661923\r\n  direction: -1\r\n- id: 5\r\n  x: 5\r\n  y: 0\r\n  theta: 0\r\n  direction: 0\r\n- id: 6\r\n  x: 0\r\n  y: 0\r\n  theta: 1.57079632679489661923\r\n  direction: -1\r\n- id: 7\r\n  x: 5\r\n  y: 0\r\n  theta: 0\r\n  direction: 0\r\n- id: 8\r\n  x: 0\r\n  y: 0\r\n  theta: -1.57079632679489661923\r\n  direction: -1\r\n- id: 9\r\n  x: 0\r\n  y: 0\r\n  theta: 0.78539816339744830962\r\n  direction: -1\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(9, 1, '/docking', 'undock_trajectory.yaml', '', '# config.yaml\r\n\r\nparameters:\r\n control_loop_freq: 20\r\n goal_linear_threshold: 0.02\r\n goal_angular_threshold: 0.02\r\n max_linear_velocity: 0.2\r\n max_angular_velocity: 0.7\r\n max_linear_acceleration: 0.01\r\n max_angular_acceleration: 0.7\r\n loop_indefinitly: false\r\n US_sensor_int_threshold: 0.2\r\n US_sensor_ext_threshold: 0.15\r\n obstacle_pause_duration: 2.0 \r\n #set 0 for infinite consecutive iteration \r\n obstacle_pause_max_consecutive_iterations: 0\r\n control_linear_P_gain: 1.0 \r\n control_angular_P_gain: 2.0 \r\n\r\ngoals:\r\n- id: 0\r\n  x: -0.35\r\n  y: 0\r\n  theta: 0\r\n  direction: -1\r\n- id: 1\r\n  x: 0\r\n  y: 0\r\n  theta: -2.5\r\n  direction: -1\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(10, 1, '/joy', 'xboxOverride.config.yaml', '', 'axis_linear: 4  # Left thumb stick vertical\r\nscale_linear: 0.5\r\nscale_linear_turbo: 1.0\r\n\r\naxis_angular: 3  # Left thumb stick horizontal\r\nscale_angular: 1\r\n\r\nenable_button: 5  # Right  trigger button\r\n#enable_turbo_button: 14  # low digital cross button\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(11, 1, '/joy', 'xboxSafe.config.yaml', '', 'axis_linear: 1  # Left thumb stick vertical\r\nscale_linear: 0.5\r\nscale_linear_turbo: 1.5\r\n\r\naxis_angular: 0  # Left thumb stick horizontal\r\nscale_angular: 0.8\r\n\r\nenable_button: 4  # Left trigger button\r\n#enable_turbo_button: 5  # Right trigger button\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(12, 1, '/laser_filter', 'scan_filter.yaml', '', 'scan_filter_chain:\r\n- name: shadows\r\n  type: laser_filters/ScanShadowsFilter\r\n  params:\r\n    min_angle: 1\r\n    max_angle: 179\r\n    neighbors: 25\r\n    window: 2\r\n\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(13, 1, '/leds', 'leds.yaml', '', 'CON_ANIM: 4\r\nCON_R: 255\r\nCON_G: 75\r\nCON_B: 0\r\nAU_ANIM: 5\r\nAU_R: 204\r\nAU_G: 0\r\nAU_B: 0\r\nMOVE_ANIM: 9\r\nMOVE_R: 0\r\nMOVE_G: 0\r\nMOVE_B: 255\r\nCHARGE_ANIM: 2\r\nCHARGE_R: 0\r\nCHARGE_G: 215\r\nCHARGE_B: 0\r\nARRET_ANIM: 4\r\nARRET_R: 0\r\nARRET_G: 0\r\nARRET_B: 255\r\nMAN_ANIM: 4\r\nMAN_R: 0\r\nMAN_G: 0\r\nMAN_B: 255\r\nLIGHT_ANIM: 10\r\nLIGHT_R: 255\r\nLIGHT_G: 255\r\nLIGHT_B: 255\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(14, 1, '/nav', 'amcl.yaml', '', 'odom_model_type: \"diff-corrected\"\r\n#expected noise in odometry\'s rotation estimate from the rotational component of the robot\'s motion\r\nodom_alpha1: 0.01\r\n#expected noise in odometry\'s rotation estimate from translational component of the robot\'s motion\r\nodom_alpha2: 0.03\r\n#expected noise in odometry\'s translation estimate from the translational component of the robot\'s motion.\r\nodom_alpha3: 0.03\r\n#expected noise in odometry\'s translation estimate from the rotational component of the robot\'s motion\r\nodom_alpha4: 0.01\r\n#Translation-related noise parameter (only used if model is \"omni\")\r\nodom_alpha5: 0.003\r\n\r\ntransform_tolerance: 0.2\r\ngui_publish_rate: 10.0\r\nlaser_max_beams: 30\r\nmin_particles: 500\r\nmax_particles: 5000\r\nkld_err: 0.05\r\nkld_z: 0.99\r\n\r\ndo_beamskip: true\r\n\r\nlaser_model_type: \"likelihood_field\"\r\nlaser_z_hit: 0.95\r\nlaser_z_short: 0.05\r\nlaser_z_max: 0.05\r\nlaser_z_rand: 0.05\r\nlaser_sigma_hit: 0.2\r\nlaser_lambda_short: 0.1\r\nlaser_lambda_short: 0.1\r\nlaser_likelihood_max_dist: 2.0\r\n\r\nupdate_min_d: 0.05\r\nupdate_min_a: 0.05\r\nodom_frame_id: \"odom\"\r\nresample_interval: 1\r\nrecovery_alpha_slow: 0.0\r\nrecovery_alpha_fast: 0.0\r\ninitial_pose_x: 0\r\ninitial_pose_y: 0\r\ninitial_pose_a: 0\r\nbase_frame_id: \"base_footprint\"\r\nglobal_frame_id: \"map\"\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(15, 1, '/nav', 'costmap_common_params.yaml', '', '\r\n\r\ntransform_tolerance: 0.2\r\nmap_type: costmap\r\nrobot_radius: 0.26\r\n\r\nobstacle_layer:\r\n enabled: true\r\n obstacle_range: 5.6\r\n raytrace_range: 4.0\r\n inflation_radius: 0.0\r\n track_unknown_space: true\r\n combination_method: 1\r\n\r\n observation_sources: laser_scan_sensor_marking laser_scan_sensor_clearing\r\n laser_scan_sensor_marking: {data_type: LaserScan, topic: scan_nan_cleaned, marking: false, clearing: true, inf_is_valid: true}\r\n laser_scan_sensor_clearing: {data_type: LaserScan, topic: scan_filtered, marking: true, clearing: false, inf_is_valid: true}\r\n\r\nobstacle_layer_noisy:\r\n enabled: true\r\n obstacle_range: 3.0\r\n raytrace_range: 4.0\r\n inflation_radius: 0.0\r\n track_unknown_space: true\r\n combination_method: 1\r\n\r\n observation_sources: laser_scan_sensor \r\n\r\n laser_scan_sensor: {data_type: LaserScan, topic: scan_nan_cleaned, marking: true, clearing: true, inf_is_valid: true}\r\n\r\n r200_3d: {data_type: PointCloud2, topic: camera/depth/points, marking: true, clearing: true, inf_is_valid: true, max_obstacle_height: 1.3, min_obstacle_height: 0.1}\r\n\r\n\r\ninflation_layer:\r\n  enabled:              true\r\n  cost_scaling_factor:  5.0  # exponential rate at which the obstacle cost drops off (default: 10)\r\n  inflation_radius:     1.0  # max. distance from an obstacle at which costs are incurred for planning paths.\r\n\r\nsonar_layer:\r\n  clear_threshold:    0.2\r\n  mark_threshold:     0.7\r\n  no_readings_timeout: 0.0\r\n  ns:     /sensors/US\r\n  clear_on_max_reading: true\r\n  topics: [\"US_front_ext_left\", \"US_front_ext_right\", \"US_front_int_left\", \"US_front_int_right\", \"US_back_ext_left\", \"US_back_ext_right\", \"US_back_int_left\", \"US_back_int_right\"]\r\n\r\nstatic_layer:\r\n  enabled:              true\r\n  map_topic:            \"/map_forbidden_zones\"\r\n\r\n\r\n\r\n\r\n\r\n\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(16, 1, '/nav', 'global_costmap_params.yaml', '', '\r\nglobal_costmap:\r\n  global_frame: map\r\n  robot_base_frame: base_link\r\n  update_frequency: 1.0\r\n  publish_frequency: 0.5\r\n  static_map: true\r\n\r\n  transform_tolerance: 0.5\r\n\r\n  plugins:\r\n    - {name: static_layer,            type: \"costmap_2d::StaticLayer\"}\r\n    - {name: inflation_layer,         type: \"costmap_2d::InflationLayer\"}\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(17, 1, '/nav', 'local_costmap_params.yaml', '', 'local_costmap:\r\n  global_frame: odom\r\n  robot_base_frame: base_link\r\n  update_frequency: 20.0\r\n  publish_frequency: 20.0\r\n  static_map: false\r\n  rolling_window: true\r\n  width: 5.5\r\n  height: 5.5\r\n  resolution: 0.05\r\n  transform_tolerance: 0.5\r\n  \r\n  plugins:\r\n   - {name: static_layer,        type: \"costmap_2d::StaticLayer\"}\r\n   - {name: obstacle_layer,      type: \"costmap_2d::ObstacleLayer\"}\r\n   - {name: sonar_layer,      type: \"range_sensor_layer::RangeSensorLayer\"}\r\n   - {name: inflation_layer,         type: \"costmap_2d::InflationLayer\"}\r\n\r\n\r\n\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(18, 1, '/nav', 'teb_local_planner_params.yaml', '', 'recovery_behavior_enabled: False\r\n\r\nTebLocalPlannerROS:\r\n\r\n odom_topic: odom\r\n map_frame: map\r\n    \r\n # Trajectory\r\n  \r\n teb_autosize: True\r\n dt_ref: 0.3\r\n dt_hysteresis: 0.1\r\n global_plan_overwrite_orientation: True\r\n max_global_plan_lookahead_dist: 7.0\r\n feasibility_check_no_poses: 3\r\n    \r\n # Robot\r\n         \r\n max_vel_x: 0.5\r\n max_vel_x_backwards: 0.11\r\n max_vel_y: 0.0\r\n max_vel_theta: 1.5\r\n acc_lim_x: 0.1\r\n acc_lim_theta: 0.8\r\n min_turning_radius: 0.0\r\n footprint_model: # types: \"point\", \"circular\", \"two_circles\", \"line\", \"polygon\"\r\n   type: \"circular\"\r\n   radius: 0.27 # for type \"circular\"\r\n   line_start: [-0.3, 0.0] # for type \"line\"\r\n   line_end: [0.3, 0.0] # for type \"line\"\r\n   front_offset: 0.2 # for type \"two_circles\"\r\n   front_radius: 0.2 # for type \"two_circles\"\r\n   rear_offset: 0.2 # for type \"two_circles\"\r\n   rear_radius: 0.2 # for type \"two_circles\"\r\n   vertices: [[-0.27, 0.315], [0.27, 0.315], [0.27, -0.315], [-0.27, -0.315]] # for type \"polygon\"\r\n\r\n # GoalTolerance\r\n    \r\n xy_goal_tolerance: 0.2\r\n yaw_goal_tolerance: 0.1\r\n free_goal_vel: False\r\n    \r\n # Obstacles\r\n \r\n inflation_dist: 0.27    \r\n min_obstacle_dist: 0.1\r\n include_costmap_obstacles: True\r\n costmap_obstacles_behind_robot_dist: 1.0\r\n obstacle_poses_affected: 30\r\n costmap_converter_plugin: \"\"\r\n costmap_converter_spin_thread: True\r\n costmap_converter_rate: 5\r\n\r\n # Optimization\r\n    \r\n no_inner_iterations: 2\r\n no_outer_iterations: 2\r\n optimization_activate: True\r\n optimization_verbose: False\r\n penalty_epsilon: 0.05\r\n weight_max_vel_x: 2\r\n weight_max_vel_theta: 1\r\n weight_acc_lim_x: 1\r\n weight_acc_lim_theta: 1\r\n weight_kinematics_nh: 1000\r\n weight_kinematics_forward_drive: 100\r\n weight_kinematics_turning_radius: 1\r\n weight_optimaltime: 1\r\n weight_obstacle: 50\r\n weight_dynamic_obstacle: 10 # not in use yet\r\n alternative_time_cost: False # not in use yet\r\n\r\n # Homotopy Class Planner\r\n\r\n enable_homotopy_class_planning: False\r\n enable_multithreading: True\r\n simple_exploration: False\r\n max_number_classes: 1\r\n selection_cost_hysteresis: 1.0\r\n selection_obst_cost_scale: 1.0\r\n selection_alternative_time_cost: False\r\n \r\n roadmap_graph_no_samples: 15\r\n roadmap_graph_area_width: 5\r\n h_signature_prescaler: 0.5\r\n h_signature_threshold: 0.1\r\n obstacle_keypoint_offset: 0.1\r\n obstacle_heading_threshold: 0.45\r\n visualize_hc_graph: False\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(19, 1, '/poses', 'poses.yaml', '', 'dock1: {theta: [DOCK_T], x: [DOCK_X], y: [DOCK_Y]}\r\nstart1: {theta: [START_T], x: [START_X], y: [START_Y]}\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:10:05'),
(20, 1, '/stats', 'locker.yaml', '', '{history_empty_errors: 0, history_lockers_distributed: 0, locker_count: 0}\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:10:26'),
(21, 1, '/teleop_velocity_smoother', 'limits.yaml', '', '# Example configuration:\r\n# - velocity limits are around a 10% above the physical limits\r\n# - acceleration limits are just low enough to avoid jerking\r\n\r\n# Mandatory parameters\r\nspeed_lim_v: 1.2\r\nspeed_lim_w: 1.5\r\n\r\naccel_lim_v: 1.2\r\naccel_lim_w: 8.0\r\n\r\n# Optional parameters\r\nfrequency: 20.0\r\ndecel_factor: 1.0\r\n\r\n# Robot velocity feedback type:\r\n#  0 - none\r\n#  1 - odometry\r\n#  2 - end robot commands\r\nrobot_feedback: 2\r\n\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(22, 1, '/twist_mux', 'twist_mux_locks_l1.yaml', '', '# Locks to stop the twist inputs.\r\n# For each lock:\r\n# - topic   : input topic that provides the lock; it must be of type std_msgs::Bool?!!! \r\n# - timeout : == 0.0 -> not used\r\n#              > 0.0 -> the lock is supposed to published at a certain frequency in order\r\n#                       to detect that the publisher is alive; the timeout in seconds allows\r\n#                       to detect that, and if the publisher dies we will enable the lock\r\n# - priority: priority in the range [0, 255], so all the topics with priority lower than it\r\n#             will be stopped/disabled\r\n\r\nlocks:\r\n-\r\n  name    : RELAY_BLOCK\r\n  topic   : /relays/connect_dock_power_supply\r\n  timeout : 0.0\r\n  priority: 255\r\n\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(23, 1, '/twist_mux', 'twist_mux_locks_l2.yaml', '', '# Locks to stop the twist inputs.\r\n# For each lock:\r\n# - topic   : input topic that provides the lock; it must be of type std_msgs::Bool?!!! \r\n# - timeout : == 0.0 -> not used\r\n#              > 0.0 -> the lock is supposed to published at a certain frequency in order\r\n#                       to detect that the publisher is alive; the timeout in seconds allows\r\n#                       to detect that, and if the publisher dies we will enable the lock\r\n# - priority: priority in the range [0, 255], so all the topics with priority lower than it\r\n#             will be stopped/disabled\r\n\r\nlocks:\r\n-\r\n\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(24, 1, '/twist_mux', 'twist_mux_topics_l1.yaml', '', '# Input topics handled/muxed.\r\n# For each topic:\r\n# - name    : name identifier to select the topic\r\n# - topic   : input topic of geometry_msgs::Twist type\r\n# - timeout : timeout in seconds to start discarding old messages, and use 0.0 speed instead\r\n# - priority: priority in the range [0, 255]; the higher the more priority over other topics\r\n\r\ntopics:\r\n-\r\n  name    : navigation\r\n  topic   : navigation_stack/cmd_vel\r\n  timeout : 0.5\r\n  priority: 10\r\n-\r\n  name    : docking\r\n  topic   : /cmd_vel/docking\r\n  timeout : 0.5\r\n  priority: 40\r\n-\r\n  name    : teleop\r\n  topic   : /cmd_vel/teleop_smoothed\r\n  timeout : 0.5\r\n  priority: 50\r\n\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29'),
(25, 1, '/twist_mux', 'twist_mux_topics_l2.yaml', '', '# Input topics handled/muxed.\r\n# For each topic:\r\n# - name    : name identifier to select the topic\r\n# - topic   : input topic of geometry_msgs::Twist type\r\n# - timeout : timeout in seconds to start discarding old messages, and use 0.0 speed instead\r\n# - priority: priority in the range [0, 255]; the higher the more priority over other topics\r\n\r\ntopics:\r\n-\r\n  name    : teleop_safe\r\n  topic   : /cmd_vel/teleop_safe\r\n  timeout : 0.5\r\n  priority: 50\r\n-\r\n  name    : joystick_unsafe\r\n  topic   : /cmd_vel/teleop_unsafe\r\n  timeout : 0.5\r\n  priority: 250\r\n', 0, '0000-00-00 00:00:00', '2019-08-13 08:06:29');

-- --------------------------------------------------------

--
-- Structure de la table `service_book`
--

DROP TABLE IF EXISTS `service_book`;
CREATE TABLE IF NOT EXISTS `service_book` (
  `id_service_book` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `title` text NOT NULL,
  `comment` text NOT NULL,
  `id_user` int(11) NOT NULL,
  PRIMARY KEY (`id_service_book`),
  KEY `date` (`date`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `site`
--

DROP TABLE IF EXISTS `site`;
CREATE TABLE IF NOT EXISTS `site` (
  `id_site` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`id_site`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `site`
--

INSERT INTO `site` (`id_site`, `name`, `comment`) VALUES
(1, 'Default', '');

-- --------------------------------------------------------

--
-- Structure de la table `task`
--

DROP TABLE IF EXISTS `task`;
CREATE TABLE IF NOT EXISTS `task` (
  `id_task` int(11) NOT NULL AUTO_INCREMENT,
  `id_site` int(11) NOT NULL,
  `id_map` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `action_fin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_task`),
  KEY `id_site` (`id_site`),
  KEY `id_plan` (`id_map`),
  KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `task_action`
--

DROP TABLE IF EXISTS `task_action`;
CREATE TABLE IF NOT EXISTS `task_action` (
  `id_task_action` int(11) NOT NULL AUTO_INCREMENT,
  `id_task` int(11) NOT NULL,
  `action_type` int(2) NOT NULL,
  `action_detail` text NOT NULL,
  `position` int(3) NOT NULL,
  PRIMARY KEY (`id_task_action`),
  KEY `position` (`position`),
  KEY `id_tache` (`id_task`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `task_cron`
--

DROP TABLE IF EXISTS `task_cron`;
CREATE TABLE IF NOT EXISTS `task_cron` (
  `id_task_cron` int(10) NOT NULL AUTO_INCREMENT,
  `id_task` int(10) NOT NULL,
  `minute` int(2) NOT NULL,
  `hour` int(2) NOT NULL,
  `day` int(2) NOT NULL,
  `month` int(2) NOT NULL,
  `name` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`id_task_cron`),
  KEY `id_task` (`id_task`),
  KEY `minute` (`minute`),
  KEY `hour` (`hour`),
  KEY `day` (`day`),
  KEY `month` (`month`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `task_queue`
--

DROP TABLE IF EXISTS `task_queue`;
CREATE TABLE IF NOT EXISTS `task_queue` (
  `id_task_queue` int(11) NOT NULL AUTO_INCREMENT,
  `id_task` int(11) NOT NULL,
  `position` int(3) NOT NULL,
  `state` varchar(255) NOT NULL,
  `progress` varchar(255) NOT NULL,
  `step` int(3) NOT NULL,
  PRIMARY KEY (`id_task_queue`),
  KEY `id_tache` (`id_task`),
  KEY `position` (`position`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id_user` int(10) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `societe` varchar(255) NOT NULL,
  `id_groupe_user` int(10) NOT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `last_connection` datetime NOT NULL,
  `api_key` varchar(255) NOT NULL,
  `pin` varchar(8) NOT NULL,
  PRIMARY KEY (`id_user`),
  KEY `actif` (`actif`),
  KEY `deleted` (`deleted`),
  KEY `id_groupe_user` (`id_groupe_user`),
  KEY `email` (`email`),
  KEY `pass` (`pass`)
) ENGINE=MyISAM AUTO_INCREMENT=61 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id_user`, `email`, `pass`, `nom`, `prenom`, `societe`, `id_groupe_user`, `actif`, `deleted`, `last_connection`, `api_key`, `pin`) VALUES
(1, 'team@wyca.fr', '89d3dbf0cda2ac5bcc2f571a0bb3a828', 'Wyca', '', '', 1, 1, 0, '2020-03-03 16:49:06', '5LGU.LaYMMncJaA0i42HwsX9ZX-RCNgj-9V17ROFXt71st', ''),
(60, 'distributor', '751b823926d1ea5b9e4a4678d6ee70c8', 'Distributor', '', '', 2, 1, 0, '2020-03-03 16:49:24', 'Jnt.kK2nXB15jhVkCEGLA3NssidZWLpsdgmt4bx8GkTZL5', '');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
