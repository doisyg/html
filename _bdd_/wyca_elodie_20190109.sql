-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  jeu. 09 jan. 2020 à 08:57
-- Version du serveur :  5.7.23
-- Version de PHP :  5.6.38

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
(1, 'FollowMe', '/keylo_following/RotateAction', 'keylo_following/RotateAction', 'FollowMeRotate', 'int32 rotation		# rotation angle to be done\r\n---\r\nbool success		# If rotation done\r\n---\r\nint32 actual_angle		# rotation angle to be done'),
(2, 'Jobs', '/wyca_capture/capture_job', 'wyca_capture/CaptureJobAction', 'CaptureJob', 'wyca_capture/CaptureJob capture_job 	# the job to execute\r\n---\r\nstring job_id\r\nuint16 number_of_segments_skipped\r\nbool success\r\nstring message\r\n---\r\nstring job_id\r\nstring segment_name\r\nint32 waypoint_id\r\nstd_msgs/Header header'),
(3, 'Navigation', '/go_to_pose', 'wyca_bt_tool_nodes/GoToPoseAction', 'RobotMoveTo', 'geometry_msgs/PoseStamped target_pose\r\n---\r\nstring error\r\n---\r\nstring current_step'),
(4, 'Navigation', '/docking/dock', 'keylo_docking/DockAction', 'RobotDock', '---\r\nstring error\r\n---\r\nstring current_docking_step'),
(5, 'Navigation', '/docking/undock', 'keylo_docking/UndockAction', 'RobotUndock', '---\r\nstring error\r\n---\r\nstring current_undocking_step');

-- --------------------------------------------------------

--
-- Structure de la table `api_action_user`
--

DROP TABLE IF EXISTS `api_action_user`;
CREATE TABLE IF NOT EXISTS `api_action_user` (
  `id_action_user` int(10) NOT NULL AUTO_INCREMENT,
  `id_action` int(10) NOT NULL,
  `id_user` int(10) NOT NULL,
  PRIMARY KEY (`id_action_user`),
  KEY `id_service` (`id_action`),
  KEY `id_user` (`id_user`)
) ENGINE=MyISAM AUTO_INCREMENT=54 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_action_user`
--

INSERT INTO `api_action_user` (`id_action_user`, `id_action`, `id_user`) VALUES
(53, 3, 1),
(52, 5, 1),
(51, 4, 1),
(50, 2, 1),
(49, 1, 1);

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
) ENGINE=MyISAM AUTO_INCREMENT=65 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_service`
--

INSERT INTO `api_service` (`id_service`, `groupe`, `nom`, `messageType`, `function_name`, `details`) VALUES
(2, 'Energy', '/keylo_api/energy/get_energy_data', 'keylo_api/GetEnergyData', 'EnergyGetData', '---\r\nbool success				# true if updated data available\r\nstring message				# error message in case successfalse\r\nint8 battery_state			# The state of the charge of the battery in %. In the 0-100 range or 110 if charging\r\nfloat32 battery_voltage			# The voltage of the main battery\r\nbool is_main_battery_charging		# If the main battery is charging, can take up to 10 s to be detected\r\nbool is_dock_station_power_source	# If the robot is powered by the docking station\r\nbool is_robot_docked			# If the robot is physically in contact with the docking station\r\nbool is_battery_low			# If the charge of the battery drops below 10% for more than a minute\r\n\r\n\r\n'),
(3, 'Keybox', '/keylo_api/keybox/get_keybox_data', 'keylo_api/GetKeyboxData', 'KeyboxGetData', '---\r\nbool success			# If updated data available\r\nstring message			# Error message in case successfalse\r\nbool is_door_open		# If the door is open or not properly close\r\nbool is_magnet_on		# If the door locking magnet is on\r\n\r\n'),
(4, 'Keybox', '/keylo_api/keybox/set_magnet_state', 'keylo_api/SetMagnetState', 'KeyboxSetMagnet', 'bool is_magnet_on	# true to switch magnet on, false to switch off\r\n---\r\nbool success		# \r\nstring message		# \r\n'),
(5, 'Locker', '/keylo_api/locker/do_distribute', 'keylo_api/DoDistributeLocker', 'LockerDistribute', '---\r\nint8 locker_count	# The number of locker left in the distributor\r\nbool success		# If properly distributed\r\nstring message		# Error message in case successfalse / Error[201]: a locker is already being distributed, wait 1 second before distributing another locker / Error[202]: locker distributor is empty&#34;\r\n'),
(6, 'Locker', '/keylo_api/locker/get_count', 'keylo_api/GetLockerCount', 'LockerGetNumber', '---\r\nint8 locker_count	# the number of locker left in the distributor\r\n'),
(7, 'Locker', '/keylo_api/locker/set_count', 'keylo_api/SetLockerCount', 'LockerSetNumber', 'int8 locker_count	# Set a new value for the number of locker left in the distributor\r\n---\r\nbool success		# If the new locker_count has a valid value (0-9 range)\r\nstring message		# Error message in case successfalse / &#34;Error[203]: invalid locker number, please set a count of locker in the 0-9 range&#34;\r\n'),
(8, 'Navigation', '/keylo_api/navigation/do_dock', 'keylo_api/DoDock', 'RobotDock', '---\r\nbool success					# \r\nstring message					# \r\ngeometry_msgs/Pose2D goal_pose_feedback		# the pose of the robot destination in map coordinates\r\n\r\n'),
(9, 'Navigation', '/keylo_api/navigation/do_goto_box', 'keylo_api/DoGotoBox', '', 'string box_name					# the number ID of the box to send the robot to\r\n---\r\nbool success					# true if executed, false if not\r\nstring message					# Error message in case successfalse / &#34;Error[001]: destination is unreachable&#34; / &#34;Error[002]: destination is reachable but the robot is blocked in its starting position&#34; / Error[003]: Invalid box number or destination&#34; / &#34;Error[004]: Robot in final docking stage,impossible to navigate, wait for the docking procedure to finish&#34;\r\ngeometry_msgs/Pose2D goal_pose_feedback		# the pose of the robot destination in map coordinates\r\n\r\n'),
(10, 'Navigation', '/keylo_api/navigation/do_goto_dock', 'keylo_api/DoGotoDock', 'RobotMoveToDock', 'int8 docking_station_number		# the number ID of the docking station to send the robot to, usually 1\r\n---\r\nbool success				# true if executed, false if not\r\nstring message				# Error message in case successfalse / &#34;Error[001]: destination is unreachable&#34; / Error[002]: destination is reachable but the robot is blocked in its starting position&#34; /  Error[004]: Robot in final docking stage,impossible to navigate, wait for the docking procedure to finish / &#34;Error[006]: No docking station registered with this ID&#34;\r\ngeometry_msgs/Pose2D goal_pose_feedback	# The pose of the robot destination in map coordinates\r\n\r\n'),
(11, 'Navigation', '/keylo_api/navigation/do_goto_pose', 'keylo_api/DoGotoPose', 'RobotMoveTo', 'geometry_msgs/Pose2D goal_pose			# pose (x, y, theta) where to send the robot to\r\n---\r\nbool success					# true if executed, false if not\r\nstring message					# Error message in case successfalse / &#34;Error[001]: destination is unreachable&#34; / &#34;Error[002]: destination is reachable but the robot is blocked in its starting position&#34; / &#34;Error[004]: Robot in final docking stage,impossible to navigate, wait for the docking procedure to finish&#34;\r\ngeometry_msgs/Pose2D goal_pose_feedback		# the pose of the robot destination in map coordinates\r\n\r\n'),
(12, 'Navigation', '/keylo_api/navigation/do_stop', 'std_srvs/Trigger', 'RobotStop', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(13, 'Navigation', '/keylo_api/navigation/do_undock', 'keylo_api/DoUndock', 'RobotUndock', '---\r\nbool success					# true if executed, false if not\r\nstring message					# Error message in case successfalse / &#34;Error[005]: Robot is not docked, can&#39;t undock&#34;\r\n\r\n'),
(14, 'Navigation', '/keylo_api/navigation/get_robot_pose', 'keylo_api/GetRobotPose', 'RobotGetPos', '---\r\nbool success				# true if updated data available\r\nstring message				# error message in case successfalse\r\ngeometry_msgs/Pose2D robot_pose		# the robot pose in the map frame\r\n\r\n'),
(15, 'Navigation', '/keylo_api/recovery/set_robot_pose', 'keylo_api/SetRobotPose', 'RobotSetPos', 'geometry_msgs/Pose2D robot_pose	# The robot pose. x and y in meters, theta in radians\r\n---\r\nbool success			# \r\nstring message			# Error message in case successfalse / No error implemented\r\n'),
(16, 'Safety', '/keylo_api/safety/get_safety_data', 'keylo_api/GetSafetyData', 'SafetyGetData', '---\r\nbool success				# true if updated data available\r\nstring message				# Error message in case successfalse\r\nkeylo_api/SafetyData safety_data	# Safety data as defined in keylo_sterela/SafetyData message\r\n\r\n\r\n'),
(17, 'Safety', '/keylo_api/safety/set_logical_estop', 'std_srvs/SetBool', 'SafetySetLogicalEStop', 'bool data # enabling / disabling\r\n---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(18, 'Leds', '/keylo_arduino/conf_led_anim', 'keylo_arduino/ConfLedAnim', 'LedsConfigAnimation', 'uint8 state			# id de l&#39;etat du robot Ã  modifier\r\nuint8 anim			# id de l&#39;animation dÃ©sirÃ©\r\nuint8 R				# Niveau de rouge de la couleur\r\nuint8 G				# Niveau de vert de la couleur\r\nuint8 B				# Niveau de bleu de la couleur\r\n---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse'),
(19, 'Navigation', '/keylo_arduino/get_current_floor', 'keylo_arduino/GetCurrentFloor', 'RobotGetCurrentFloor', '---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse\r\nuint8 current_floor		# the current floor'),
(20, 'Leds', '/keylo_arduino/get_led_is_light_mode', 'keylo_arduino/GetLedIsLightMode', 'LedsGetIsLightMode', '---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse\r\nbool is_light_mode	# true if led is in manual mode\r\n\r\n'),
(21, 'Leds', '/keylo_arduino/get_led_is_manual_mode', 'keylo_arduino/GetLedIsManualMode', 'LedsGetIsManualMode', '---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse\r\nbool is_manual_mode	# true if led is in manual mode\r\n\r\n'),
(22, 'Sensors', '/keylo_arduino/get_sensors_data', 'keylo_arduino/GetSensorsData', 'SensorsGetAltimetreData', '---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse\r\nfloat32 temperature	# Temperature Celcuis\r\nfloat32 pressure	# Pressure Pa\r\nfloat32 altitude	# Altitude meter'),
(23, 'Navigation', '/keylo_arduino/set_current_floor', 'keylo_arduino/SetCurrentFloor', 'RobotSetCurrentFloor', 'uint8 current_floor	# the current floor\r\n---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse'),
(24, 'Leds', '/keylo_arduino/set_led_is_light_mode', 'std_srvs/SetBool', 'LedsIsLightMode', 'bool data # enabling / disabling\r\n---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(25, 'Leds', '/keylo_arduino/set_led_is_manual_mode', 'keylo_arduino/SetLedIsManualMode', 'LedsIsManualMode', 'bool is_manual_mode	# true if led is in manual mode\r\n---\r\nbool success		# true if updated data available\r\nstring message		# error message in case successfalse'),
(26, 'Interface', '/keylo_interface/do_browser_restart', 'keylo_interface/DoBrowserRestart', 'RestartBrowser', 'bool kiosk_mode		# If the browser should restart in kiosk mode\r\n---\r\nbool success		# true if executed, false if not\r\nstring message		# &#34;Error[301]: can&#39;t restart browser because one or more tab is in a non-restartable state&#34;\r\n'),
(27, 'Navigation', '/keylo_state/get_keylo_state', 'keylo_state/GetKeyloState', 'RobotGetState', '---\r\nstring robot_state		# Current robot state\r\n\r\n'),
(28, 'Navigation', '/keylo_state/get_keylo_state_list', 'keylo_state/GetKeyloStateList', 'RobotGetStatesList', '---\r\nstring[] robot_state_list		# Possible robot states\r\n\r\n'),
(29, 'Navigation', '/keylo_state/get_keylo_state_without_topic', 'keylo_state/GetKeyloStateListWithoutTopic', '', ''),
(30, 'Navigation', '/keylo_state/set_keylo_state', 'keylo_state/SetKeyloState', 'RobotSetState', 'string robot_state		# Set the current robot state to this value\r\n---\r\nbool success		# If state set\r\nstring message		# Error message in case successfalse / Error[401]: not a valid state\r\n\r\n'),
(31, 'Sensors', '/sterela_board_control/activate_ir_data', 'std_srvs/SetBool', 'SensorsActivateIR', 'bool data # enabling / disabling\r\n---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(32, 'Other', '/sterela_board_control/ask_firmware_version', 'std_srvs/Empty', 'GetFirmwareVersion', ''),
(33, 'Keybox', '/sterela_board_control/ask_is_box_magnet_on', 'std_srvs/Empty', 'SensorsAskIsBoxMagnetOn', ''),
(34, 'Navigation', '/sterela_board_control/ask_is_docked', 'std_srvs/Empty', 'SensorsAskIsDocked', ''),
(35, 'Keybox', '/sterela_board_control/ask_is_keybox_open', 'std_srvs/Empty', 'SensorsAskIsKeyboxOpen', ''),
(36, 'Energy', '/sterela_board_control/ask_power_source', 'std_srvs/Empty', 'SensorsAskPowerSource', ''),
(37, 'Energy', '/sterela_board_control/ask_power_up_number', 'std_srvs/Empty', 'SensorsAskPowerUpNumber', ''),
(38, 'Safety', '/sterela_board_control/ask_safety_stop_state', 'std_srvs/Empty', 'SensorsAskSafetyStopState', ''),
(39, 'Locker', '/sterela_board_control/distribute_locker', 'std_srvs/Empty', 'SensorsDistributeLocker', ''),
(40, 'Safety', '/sterela_board_control/set_logical_estop', 'std_srvs/SetBool', 'SensorsSetLogicalEStop', 'bool data # enabling / disabling\r\n---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(41, 'Keybox', '/sterela_board_control/unlock_keybox', 'std_srvs/SetBool', 'SensorsUnlockKeybox', 'bool data # enabling / disabling\r\n---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(42, 'Safety', '/sterela_board_control/unlock_motors_after_stop', 'std_srvs/Empty', 'SensorsUnlockMotorsAfterStop', ''),
(43, 'Safety', '/sterela_board_control/us_choice', 'keylo_sterela/SetUsMode', 'SensorsUSChoise', 'int8 mode # 0: no feedback, 1: front at 5hz, 2: back at 5h, 3: all at 2.5hz\r\n'),
(44, 'Navigation', '/wyca_interface/allow_teleop', 'std_srvs/SetBool', 'RobotAllowTeleop', 'bool data # enabling / disabling\r\n---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(51, 'Interne', '', 'std_srvs/Empty	', 'InitDynamicsTopics', ''),
(45, 'Map', '', 'std_srvs/Empty', 'MapGetHTML', '---\r\nbool success			# If updated data available\r\nstring message			# Error message in case successfalse\r\nstring html_map		# HTML code to display map'),
(46, 'Navigation', '', 'std_srvs/Empty', 'GetPOIs', '---\r\nbool success			# true if updated data available\r\nstring message			# error message in case successfalse\r\nkeylo_api/Poi[] pois		# list of POIs\r\n'),
(47, 'Navigation', '', 'std_srvs/Empty', 'GetBoxs', '---\r\nbool success			# true if updated data available\r\nstring message			# error message in case successfalse\r\nkeylo_api/Box[] pois		# list of Boxs\r\n'),
(48, 'Navigation', '', 'std_srvs/String', 'RobotMoveToPOI', 'string poi_name	# the name of the POI to send the robot to\r\n---\r\nbool success	# true if executed, false if not\r\nstring message	# Error message in case successfalse / &#34;Error[001]: destination is unreachable&#34; / &#34;Error[002]: destination is reachable but the robot is blocked in its starting position&#34; / Error[003]: Invalid box number or destination&#34; / &#34;Error[004]: Robot in final docking stage,impossible to navigate, wait for the docking procedure to finish&#34;\r\ngeometry_msgs/Pose2D goal_pose_feedback	# the pose of the robot destination in map coordinates'),
(49, 'Navigation', '', 'std_srvs/String', 'RobotMoveToBox', 'string box_name	# the name of the box to send the robot to\r\n---\r\nbool success	# true if executed, false if not\r\nstring message	# Error message in case successfalse / &#34;Error[001]: destination is unreachable&#34; / &#34;Error[002]: destination is reachable but the robot is blocked in its starting position&#34; / Error[003]: Invalid box number or destination&#34; / &#34;Error[004]: Robot in final docking stage,impossible to navigate, wait for the docking procedure to finish&#34;\r\ngeometry_msgs/Pose2D goal_pose_feedback	# the pose of the robot destination in map coordinates'),
(50, 'Map', '', 'std_srvs/Empty', 'MapInit', 'uint8 maxWidth # max width of the map\r\nuint8 maxHeight # max height of the map\r\n---'),
(52, 'Interne', '', 'std_srvs/Empty	', 'InitDynamicServices', ''),
(53, 'FollowMe', '/keylo_following/set_tracking_id', 'keylo_following/SetTrackingID', 'FollowMeSetTrackingID', 'int8 TrackingID		# ID to track\r\n---\r\nbool success		# If success\r\nstring message		# Error message'),
(54, 'FollowMe', '/keylo_following/start_person_follow', 'std_srvs/Trigger', 'FollowMeStart', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(55, 'FollowMe', '/keylo_following/stop_person_follow', 'std_srvs/Trigger', 'FollowMeStop', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(56, 'Jobs', '/wyca_capture/pause', 'std_srvs/SetBool', 'PauseCaptureJob', 'bool data # enabling / disabling\r\n---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(57, 'Tools', 'tools/pose2D_to_posestamped', 'wyca_bt_tool_nodes/Pose2DToPoseStamped', 'ConvertPose2DToPosesStamped', 'geometry_msgs/Pose2D pose_to_convert\r\n---\r\ngeometry_msgs/PoseStamped pose_converted'),
(58, 'Navigation', '/docking/get_docking_state', 'std_srvs/Trigger', 'GetDockingState', '---\r\nbool success # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(59, 'Navigation', '/docking/override_docking_state', 'std_srvs/SetBool', 'SetDockingState', 'bool data # enabling / disabling\r\n---\r\nbool success # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(60, 'Navigation', '/keylo_api/do_reload_maps', 'std_srvs/Trigger', 'ReloadMap', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(64, 'Mapping', '/wyca_mapping/stop', 'std_srvs/Trigger', 'MappingStop', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages'),
(63, 'Mapping', '/wyca_mapping/start', 'std_srvs/Trigger', 'MappingStart', '---\r\nbool success   # indicate successful run of triggered service\r\nstring message # informational, e.g. for error messages');

-- --------------------------------------------------------

--
-- Structure de la table `api_service_user`
--

DROP TABLE IF EXISTS `api_service_user`;
CREATE TABLE IF NOT EXISTS `api_service_user` (
  `id_service_user` int(10) NOT NULL AUTO_INCREMENT,
  `id_service` int(10) NOT NULL,
  `id_user` int(10) NOT NULL,
  PRIMARY KEY (`id_service_user`),
  KEY `id_service` (`id_service`),
  KEY `id_user` (`id_user`)
) ENGINE=MyISAM AUTO_INCREMENT=1264 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_service_user`
--

INSERT INTO `api_service_user` (`id_service_user`, `id_service`, `id_user`) VALUES
(1263, 57, 1),
(1262, 31, 1),
(1261, 22, 1),
(1260, 43, 1),
(1259, 42, 1),
(1258, 40, 1),
(1257, 38, 1),
(1256, 17, 1),
(1255, 16, 1),
(1254, 32, 1),
(1253, 44, 1),
(1252, 34, 1),
(1251, 30, 1),
(1250, 29, 1),
(1249, 28, 1),
(1248, 27, 1),
(1247, 23, 1),
(1246, 19, 1),
(1245, 15, 1),
(1244, 14, 1),
(1243, 12, 1),
(1242, 9, 1),
(1241, 60, 1),
(1240, 59, 1),
(1239, 58, 1),
(1238, 49, 1),
(1237, 48, 1),
(1236, 47, 1),
(1235, 46, 1),
(1234, 64, 1),
(1233, 63, 1),
(1232, 50, 1),
(1231, 45, 1),
(1230, 39, 1),
(1229, 7, 1),
(1228, 6, 1),
(1227, 5, 1),
(1226, 25, 1),
(1225, 24, 1),
(1224, 21, 1),
(1223, 20, 1),
(1222, 18, 1),
(1221, 41, 1),
(1220, 35, 1),
(1219, 33, 1),
(1218, 4, 1),
(1217, 3, 1),
(1216, 56, 1),
(1215, 52, 1),
(1214, 51, 1),
(1213, 26, 1),
(1212, 55, 1),
(1211, 54, 1),
(1210, 53, 1),
(1209, 37, 1),
(1208, 36, 1),
(1207, 2, 1);

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
) ENGINE=MyISAM AUTO_INCREMENT=76 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_topic`
--

INSERT INTO `api_topic` (`id_topic`, `groupe`, `nom`, `messageType`, `event_name`, `publish_name`, `id_service_update`) VALUES
(1, 'Keybox', '/box/is_box_magnet_on', 'std_msgs/Bool', 'onKeyboxMagnetOnChange', '', 33),
(2, 'Keybox', '/box/is_keybox_open', 'std_msgs/Bool', 'onKeyboxOpenChange', '', 35),
(3, 'Navigation', '/joy', 'sensor_msgs/Joy', 'onJoystickInput', '', 0),
(4, 'Other', '/keylo_api/email', 'std_msgs/String', 'onLogEmailNew', 'LogSendEmail', 0),
(5, 'Energy', '/keylo_api/energy/battery_state', 'std_msgs/Int8', 'onBatteryStateChange', '', 2),
(6, 'Energy', '/keylo_api/energy/battery_voltage', 'std_msgs/Float32', 'onBatteryVoltageChange', '', 2),
(7, 'Energy', '/keylo_api/energy/emergency_shutdown', 'std_msgs/Empty', 'onEmergencyShutdown', '', 2),
(8, 'Energy', '/keylo_api/energy/is_battery_critically_low', 'std_msgs/Bool', 'onBatteryCriticallyLow', '', 2),
(9, 'Energy', '/keylo_api/energy/is_battery_low', 'std_msgs/Bool', 'onEnergyBatteryLowChange', '', 2),
(10, 'Energy', '/keylo_api/energy/is_dock_station_power_source', 'std_msgs/Bool', 'onEnergyIsDockStationPowerSourceChange', '', 2),
(11, 'Energy', '/keylo_api/energy/is_main_battery_charging', 'std_msgs/Bool', 'onEnergyIsMainBatteryChargingChange', '', 2),
(12, 'Energy', '/keylo_api/energy/is_robot_docked', 'std_msgs/Bool', 'onRobotIsDockedChange', '', 2),
(13, 'Keybox', '/keylo_api/keybox/is_door_open', 'std_msgs/Bool', 'onKeyboxDoorOpenChange', '', 35),
(14, 'Keybox', '/keylo_api/keybox/is_magnet_on', 'std_msgs/Bool', 'onKeyboxMagnetOnChangeKO', '', 33),
(15, 'Locker', '/keylo_api/locker/count', 'std_msgs/Int8', 'onLockerCountChange', '', 6),
(16, 'Other', '/keylo_api/log_msg', 'std_msgs/String', 'onLogMsg', 'LogSendMsg', 0),
(17, 'Navigation', '/keylo_api/navigation/cs_teleop', 'keylo_api/Teleop', '', 'NavigationTeleop', 0),
(18, 'Navigation', '/keylo_api/navigation/current_goal', 'geometry_msgs/PoseStamped', 'onNavigationCurrentGoalChange', '', 0),
(19, 'Navigation', '/keylo_api/navigation/robot_pose', 'geometry_msgs/Pose2D', 'onNavigationRobotPosChange', '', 0),
(20, 'Navigation', '/docking/docking_state', 'std_msgs/String', 'onNavigationRobotStateChange', '', 58),
(21, 'Safety', '/keylo_api/safety/safety_data', 'keylo_api/SafetyData', 'onSafetyDataChange', '', 16),
(22, 'Other', '/keylo_api/sms', 'std_msgs/String', 'onLogSMSNew', 'LogSendSMS', 0),
(23, 'Navigation', '/keylo_arduino/current_floor', 'std_msgs/Int8', 'onNavigationCurrentFloorChange', '', 0),
(24, 'Leds', '/keylo_arduino/current_led_animation_mode', 'std_msgs/Int8', 'onLedsCurrentAnimationModeChange', '', 0),
(25, 'Leds', '/keylo_arduino/current_led_robot_state_mode', 'std_msgs/Int8', 'onLedsCurrentRobotStateModeChange', '', 0),
(26, 'Leds', '/keylo_arduino/is_light_mode', 'std_msgs/Bool', 'onLedsIsLightModeChange', '', 20),
(27, 'Leds', '/keylo_arduino/is_manual_mode', 'std_msgs/Bool', 'onLedsIsManualModeChange', '', 21),
(28, 'Sensors', '/keylo_arduino/keylo_arduino_sensors_values', 'keylo_arduino/SensorsObject', 'onSensorsAltimeterChange', '', 0),
(29, 'Leds', '/keylo_arduino/set_anim_led', 'keylo_arduino/AnimLedObject', 'onLedsSetAnimLedChange', '', 0),
(31, 'Locker', '/locker/distribute_error', 'std_msgs/Empty', 'onLockerDistributeError', '', 0),
(32, 'Sensors', '/sensors/bat_voltage', 'std_msgs/Float32', 'onSensorsBatteryVoltageChange', '', 0),
(33, 'Sensors', '/sensors/battery_voltage/average', 'std_msgs/Float32', 'onSensorsBatteryVoltageAverageChange', '', 0),
(34, 'Sensors', '/sensors/battery_voltage/max', 'std_msgs/Float32', 'onSensorsBatteryVoltageMaxChange', '', 0),
(35, 'Sensors', '/sensors/battery_voltage/min', 'std_msgs/Float32', 'onSensorsBatteryVoltageMinChange', '', 0),
(36, 'Sensors', '/sensors/IR/ir_back_left', 'std_msgs/Bool', 'onSensorsIRBackLeftChange', '', 0),
(37, 'Sensors', '/sensors/IR/ir_back_right', 'std_msgs/Bool', 'onSensorsIRBackRightChange', '', 0),
(38, 'Sensors', '/sensors/IR/ir_front_left', 'std_msgs/Bool', 'onSensorsIRFrontLeftChange', '', 0),
(39, 'Sensors', '/sensors/IR/ir_front_right', 'std_msgs/Bool', 'onSensorsIRFrontRightChange', '', 0),
(40, 'Sensors', '/sensors/is_dock_station_power_source', 'std_msgs/Bool', 'onSensorsIsDockStationPowerSourceChange', '', 0),
(41, 'Sensors', '/sensors/is_robot_docked', 'std_msgs/Bool', 'onSensorsIsRobotDockedChange', '', 0),
(42, 'Sensors', '/sensors/low_power_alert', 'std_msgs/Empty', 'onSensorsLowPowerAlertChange', '', 0),
(43, 'Sensors', '/sensors/power_consumption/average', 'std_msgs/Float32', 'onSensorsLowConsumptionAverageChange', '', 0),
(44, 'Sensors', '/sensors/power_consumption/max', 'std_msgs/Float32', 'onSensorsLowConsumptionMaxChange', '', 0),
(45, 'Sensors', '/sensors/power_consumption/min', 'std_msgs/Float32', 'onSensorsLowConsumptionMinChange', '', 0),
(46, 'Sensors', '/sensors/safety_stop/is_safety_stop', 'keylo_sterela/SafetyData', 'onSensorsIsSafetyStopChange', '', 0),
(47, 'Sensors', '/sensors/stats/board_power_up_number', 'std_msgs/Int32', 'onSensorsBoardPowerUpChange', '', 0),
(48, 'Sensors', '/sensors/stats/sterela_board_firmware_version', 'std_msgs/String', 'onSensorsSterelaBoardFirmwareVersionChange', '', 0),
(49, 'Sensors', '/sensors/US/US_back_ext_left', 'sensor_msgs/Range', 'onSensorsUSBackExtLeftChange', '', 0),
(50, 'Sensors', '/sensors/US/US_back_ext_right', 'sensor_msgs/Range', 'onSensorsUSBackExtRightChange', '', 0),
(51, 'Sensors', '/sensors/US/US_back_int_left', 'sensor_msgs/Range', 'onSensorsUSBackIntLeftChange', '', 0),
(52, 'Sensors', '/sensors/US/US_back_int_right', 'sensor_msgs/Range', 'onSensorsUSBackIntRightChange', '', 0),
(53, 'Sensors', '/sensors/US/US_front_ext_left', 'sensor_msgs/Range', 'onSensorsUSFrontExtLeftChange', '', 0),
(54, 'Sensors', '/sensors/US/US_front_ext_right', 'sensor_msgs/Range', 'onSensorsUSFrontExtRightChange', '', 0),
(55, 'Sensors', '/sensors/US/US_front_int_left', 'sensor_msgs/Range', 'onSensorsUSFrontIntLeftChange', '', 0),
(56, 'Sensors', '/sensors/US/US_front_int_right', 'sensor_msgs/Range', 'onSensorsUSFrontIntRightChange', '', 0),
(58, 'Sensors', '/motors/commanded_speeds', 'roboclaw_node/Wheels_speeds', 'onWheelsSpeedChange', '', 0),
(59, 'Navigation', '', 'std_msgs/Bool', 'onArrivedToDestination', '', 0),
(60, 'Navigation', '', 'keylo_api/arrived_poi', 'onArrivedToPOI', '', 0),
(61, 'Navigation', '', 'keylo_api/arrived_box', 'onArrivedToBox', '', 0),
(62, 'Map', '', 'std_msg/String', 'onMapBoxClick', '', 0),
(63, 'Map', '', 'geometry_msgs/Pose2D', 'onMapRouteClick', '', 0),
(64, 'Map', '', 'void', 'onMapIsLoaded', '', 0),
(65, 'Sensors', '/scan_filtered', 'sensor_msgs/LaserScan', 'onSensorsLaserScan', '', 0),
(66, 'FollowMe', '/camera_customer/person/detection_data', 'realsense_person/PersonDetection', 'onCameraCustomerDetectionChange', '', 0),
(67, 'FollowMe', '/keylo_following/following_state', 'std_msgs/String', 'onFollowMeStateChange', '', 0),
(68, 'Log', '/logs/capture', 'std_msgs/String', 'onCaptureLog', '', 0),
(69, 'Photo', '/camera_customer/color/image_raw/compressed', 'sensor_msgs/CompressedImage', 'onGetPhotoCamCustomer', '', 0),
(70, 'Photo', '/camera_nav/color/image_raw/compressed', 'sensor_msgs/CompressedImage', 'onGetPhotoCamNav', '', 0),
(71, 'Log', '/logs/nav', 'std_msgs/String', 'onNavLog', '', 0),
(74, 'Mapping', '/wyca_mapping/robot_pose_in_building_map', 'geometry_msgs/Pose2D', 'onMappingRobotPoseChange', '', 0),
(75, 'Mapping', '/map_saved', 'nav_msgs/OccupancyGrid', 'onMappingMapSaved', '', 0);

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
-- Structure de la table `api_topic_pub_user`
--

DROP TABLE IF EXISTS `api_topic_pub_user`;
CREATE TABLE IF NOT EXISTS `api_topic_pub_user` (
  `id_topic_pub_user` int(10) NOT NULL AUTO_INCREMENT,
  `id_topic_pub` int(10) NOT NULL,
  `id_user` int(10) NOT NULL,
  PRIMARY KEY (`id_topic_pub_user`),
  KEY `id_topic_pub` (`id_topic_pub`),
  KEY `id_user` (`id_user`)
) ENGINE=MyISAM AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_topic_pub_user`
--

INSERT INTO `api_topic_pub_user` (`id_topic_pub_user`, `id_topic_pub`, `id_user`) VALUES
(38, 1, 1),
(37, 2, 1),
(36, 3, 1),
(35, 4, 1);

-- --------------------------------------------------------

--
-- Structure de la table `api_topic_user`
--

DROP TABLE IF EXISTS `api_topic_user`;
CREATE TABLE IF NOT EXISTS `api_topic_user` (
  `id_topic_user` int(10) NOT NULL AUTO_INCREMENT,
  `id_topic` int(10) NOT NULL,
  `id_user` int(10) NOT NULL,
  PRIMARY KEY (`id_topic_user`),
  KEY `id_topic` (`id_topic`),
  KEY `id_user` (`id_user`)
) ENGINE=MyISAM AUTO_INCREMENT=1583 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `api_topic_user`
--

INSERT INTO `api_topic_user` (`id_topic_user`, `id_topic`, `id_user`) VALUES
(1581, 55, 1),
(1580, 54, 1),
(1579, 53, 1),
(1578, 52, 1),
(1577, 51, 1),
(1576, 50, 1),
(1575, 49, 1),
(1574, 48, 1),
(1573, 47, 1),
(1572, 46, 1),
(1571, 45, 1),
(1570, 44, 1),
(1569, 43, 1),
(1568, 42, 1),
(1567, 41, 1),
(1566, 40, 1),
(1565, 39, 1),
(1564, 38, 1),
(1563, 37, 1),
(1562, 36, 1),
(1561, 32, 1),
(1560, 35, 1),
(1559, 34, 1),
(1558, 33, 1),
(1557, 65, 1),
(1556, 58, 1),
(1555, 28, 1),
(1554, 21, 1),
(1553, 70, 1),
(1552, 69, 1),
(1551, 22, 1),
(1550, 16, 1),
(1549, 4, 1),
(1548, 23, 1),
(1547, 19, 1),
(1546, 18, 1),
(1545, 17, 1),
(1544, 20, 1),
(1543, 61, 1),
(1542, 60, 1),
(1541, 59, 1),
(1540, 74, 1),
(1539, 75, 1),
(1538, 64, 1),
(1537, 63, 1),
(1536, 62, 1),
(1535, 71, 1),
(1534, 68, 1),
(1533, 31, 1),
(1532, 15, 1),
(1531, 29, 1),
(1530, 27, 1),
(1529, 26, 1),
(1528, 25, 1),
(1527, 24, 1),
(1526, 14, 1),
(1525, 13, 1),
(1524, 2, 1),
(1523, 1, 1),
(1522, 67, 1),
(1521, 66, 1),
(1520, 12, 1),
(1519, 11, 1),
(1518, 10, 1),
(1517, 9, 1),
(1516, 8, 1),
(1515, 7, 1),
(1514, 6, 1),
(1513, 5, 1),
(1582, 56, 1);

-- --------------------------------------------------------

--
-- Structure de la table `area`
--

DROP TABLE IF EXISTS `area`;
CREATE TABLE IF NOT EXISTS `area` (
  `id_area` int(11) NOT NULL AUTO_INCREMENT,
  `id_plan` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `couleur_r` int(3) NOT NULL,
  `couleur_g` int(3) NOT NULL,
  `couleur_b` int(3) NOT NULL,
  `is_forbidden` tinyint(1) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_area`),
  KEY `id_plan` (`id_plan`),
  KEY `is_forbidden` (`is_forbidden`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `area`
--

INSERT INTO `area` (`id_area`, `id_plan`, `nom`, `comment`, `couleur_r`, `couleur_g`, `couleur_b`, `is_forbidden`, `deleted`) VALUES
(18, 49, '', '', 0, 0, 0, 1, 0),
(19, 49, '', '', 0, 0, 0, 1, 0),
(20, 49, '', '', 0, 0, 0, 1, 0),
(21, 49, '', '', 0, 0, 0, 1, 1),
(22, 49, '', '', 0, 0, 0, 1, 0),
(23, 49, '', '', 87, 159, 177, 0, 0);

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
) ENGINE=MyISAM AUTO_INCREMENT=103 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `area_config`
--

INSERT INTO `area_config` (`id_area_config`, `id_area`, `name`, `value`) VALUES
(102, 23, 'max_speed', ''),
(101, 23, 'max_speed_mode', 'Automatic'),
(100, 23, 'led_animation', '4'),
(99, 23, 'led_animation_mode', 'Manual'),
(98, 23, 'led_color', 'rgb(45,186,76)'),
(97, 23, 'led_color_mode', 'Manual');

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
) ENGINE=MyISAM AUTO_INCREMENT=792 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `area_point`
--

INSERT INTO `area_point` (`id_area_point`, `id_area`, `x`, `y`) VALUES
(791, 23, '48.395672', '9.610365'),
(790, 23, '53.363440', '6.405354'),
(789, 23, '50.639180', '3.200342'),
(788, 23, '45.671412', '6.565604'),
(787, 22, '37.979385', '21.468907'),
(786, 22, '46.152164', '20.507404'),
(783, 20, '58.972210', '20.507404'),
(785, 22, '41.665148', '16.020388'),
(782, 20, '62.497722', '17.622894'),
(781, 20, '61.696469', '12.334625'),
(780, 20, '61.375968', '12.334625'),
(779, 20, '57.369704', '10.892370'),
(778, 20, '57.209453', '11.052620'),
(263, 21, '41.024146', '12.494875'),
(777, 20, '54.965945', '21.148406'),
(784, 22, '32.530866', '18.103645'),
(262, 21, '41.024146', '12.494875'),
(776, 19, '27.723349', '12.014124'),
(261, 21, '49.196925', '12.334625'),
(775, 19, '29.165604', '6.245103'),
(260, 21, '49.036674', '4.963099'),
(774, 19, '22.435080', '3.520844'),
(259, 21, '41.184396', '6.565604'),
(773, 19, '22.595330', '14.257632'),
(772, 18, '7.087222', '23.275928'),
(771, 18, '13.279215', '20.441039'),
(770, 18, '8.728473', '14.398250'),
(769, 18, '5.222163', '14.696660'),
(768, 18, '5.669777', '21.336267');

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
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `configuration`
--

INSERT INTO `configuration` (`id_configuration`, `nom`, `description`, `valeur`) VALUES
(3, 'CURRENT_SITE', '', '1'),
(4, 'CURRENT_MAP', '', '49'),
(5, 'level_min_gotodock', '', '10'),
(6, 'level_min_dotask', '', '53'),
(7, 'level_min_gotodock_aftertask', '', '50');

-- --------------------------------------------------------

--
-- Structure de la table `droit`
--

DROP TABLE IF EXISTS `droit`;
CREATE TABLE IF NOT EXISTS `droit` (
  `id_droit` int(10) NOT NULL AUTO_INCREMENT,
  `section` varchar(50) NOT NULL,
  `sous_section` varchar(50) NOT NULL,
  `action` varchar(10) NOT NULL,
  PRIMARY KEY (`id_droit`),
  KEY `section` (`section`),
  KEY `sous_section` (`sous_section`),
  KEY `action` (`action`)
) ENGINE=MyISAM AUTO_INCREMENT=69 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `droit`
--

INSERT INTO `droit` (`id_droit`, `section`, `sous_section`, `action`) VALUES
(1, 'tasks', '', 'view'),
(2, 'tasks', '', 'add'),
(3, 'tasks', '', 'edit'),
(4, 'tasks', '', 'delete'),
(5, 'maps', '', 'view'),
(6, 'maps', '', 'add'),
(7, 'maps', '', 'edit'),
(8, 'maps', '', 'delete'),
(9, 'setup', 'sites', 'view'),
(10, 'setup', 'sites', 'add'),
(11, 'setup', 'sites', 'edit'),
(12, 'setup', 'sites', 'delete'),
(13, 'setup', 'users', 'view'),
(14, 'setup', 'users', 'add'),
(15, 'setup', 'users', 'edit'),
(16, 'setup', 'users', 'delete'),
(17, 'setup', 'user_groups', 'view'),
(18, 'setup', 'user_groups', 'add'),
(19, 'setup', 'user_groups', 'edit'),
(20, 'setup', 'user_groups', 'delete'),
(21, 'setup', 'export', 'view'),
(22, 'setup', 'export', 'add'),
(23, 'setup', 'export', 'edit'),
(24, 'setup', 'export', 'delete'),
(25, 'setup', 'configuration', 'view'),
(26, 'setup', 'configuration', 'add'),
(27, 'setup', 'configuration', 'edit'),
(28, 'setup', 'configuration', 'delete'),
(29, 'traduction', '', 'view'),
(30, 'traduction', '', 'add'),
(31, 'traduction', '', 'edit'),
(32, 'traduction', '', 'delete'),
(33, 'tasks', '', 'view'),
(34, 'tasks', '', 'add'),
(35, 'tasks', '', 'edit'),
(36, 'tasks', '', 'delete'),
(37, 'maps', '', 'view'),
(38, 'maps', '', 'add'),
(39, 'maps', '', 'edit'),
(40, 'maps', '', 'delete'),
(41, 'setup', 'robot', 'view'),
(42, 'setup', 'robot', 'add'),
(43, 'setup', 'robot', 'edit'),
(44, 'setup', 'robot', 'delete'),
(45, 'setup', 'sites', 'view'),
(46, 'setup', 'sites', 'add'),
(47, 'setup', 'sites', 'edit'),
(48, 'setup', 'sites', 'delete'),
(49, 'setup', 'users', 'view'),
(50, 'setup', 'users', 'add'),
(51, 'setup', 'users', 'edit'),
(52, 'setup', 'users', 'delete'),
(53, 'setup', 'user_groups', 'view'),
(54, 'setup', 'user_groups', 'add'),
(55, 'setup', 'user_groups', 'edit'),
(56, 'setup', 'user_groups', 'delete'),
(57, 'setup', 'export', 'view'),
(58, 'setup', 'export', 'add'),
(59, 'setup', 'export', 'edit'),
(60, 'setup', 'export', 'delete'),
(61, 'setup', 'configuration', 'view'),
(62, 'setup', 'configuration', 'add'),
(63, 'setup', 'configuration', 'edit'),
(64, 'setup', 'configuration', 'delete'),
(65, 'traduction', '', 'view'),
(66, 'traduction', '', 'add'),
(67, 'traduction', '', 'edit'),
(68, 'traduction', '', 'delete');

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
-- Structure de la table `groupe_droit`
--

DROP TABLE IF EXISTS `groupe_droit`;
CREATE TABLE IF NOT EXISTS `groupe_droit` (
  `id_groupe_droit` int(10) NOT NULL AUTO_INCREMENT,
  `id_groupe_user` int(10) NOT NULL,
  `id_droit` int(10) NOT NULL,
  PRIMARY KEY (`id_groupe_droit`),
  KEY `id_groupe` (`id_groupe_user`),
  KEY `id_droit` (`id_droit`)
) ENGINE=MyISAM AUTO_INCREMENT=101 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `groupe_droit`
--

INSERT INTO `groupe_droit` (`id_groupe_droit`, `id_groupe_user`, `id_droit`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 6),
(7, 1, 7),
(8, 1, 8),
(9, 1, 9),
(10, 1, 10),
(11, 1, 11),
(12, 1, 12),
(13, 1, 13),
(14, 1, 14),
(15, 1, 15),
(16, 1, 16),
(17, 1, 17),
(18, 1, 18),
(19, 1, 19),
(20, 1, 20),
(21, 1, 21),
(22, 1, 22),
(23, 1, 23),
(24, 1, 24),
(25, 1, 25),
(26, 1, 26),
(27, 1, 27),
(28, 1, 28),
(29, 1, 29),
(30, 1, 30),
(31, 1, 31),
(32, 1, 32),
(64, 3, 24),
(63, 3, 23),
(62, 3, 22),
(61, 3, 21),
(60, 3, 12),
(59, 3, 11),
(58, 3, 10),
(57, 3, 9),
(56, 3, 8),
(55, 3, 7),
(54, 3, 6),
(53, 3, 5),
(52, 3, 4),
(51, 3, 3),
(50, 3, 2),
(49, 3, 1),
(65, 1, 33),
(66, 1, 34),
(67, 1, 35),
(68, 1, 36),
(69, 1, 37),
(70, 1, 38),
(71, 1, 39),
(72, 1, 40),
(73, 1, 41),
(74, 1, 42),
(75, 1, 43),
(76, 1, 44),
(77, 1, 45),
(78, 1, 46),
(79, 1, 47),
(80, 1, 48),
(81, 1, 49),
(82, 1, 50),
(83, 1, 51),
(84, 1, 52),
(85, 1, 53),
(86, 1, 54),
(87, 1, 55),
(88, 1, 56),
(89, 1, 57),
(90, 1, 58),
(91, 1, 59),
(92, 1, 60),
(93, 1, 61),
(94, 1, 62),
(95, 1, 63),
(96, 1, 64),
(97, 1, 65),
(98, 1, 66),
(99, 1, 67),
(100, 1, 68);

-- --------------------------------------------------------

--
-- Structure de la table `groupe_user`
--

DROP TABLE IF EXISTS `groupe_user`;
CREATE TABLE IF NOT EXISTS `groupe_user` (
  `id_groupe_user` int(10) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  PRIMARY KEY (`id_groupe_user`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `groupe_user`
--

INSERT INTO `groupe_user` (`id_groupe_user`, `nom`) VALUES
(1, 'Super administrateur'),
(2, 'Administrateur'),
(3, 'User');

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
-- Structure de la table `plan`
--

DROP TABLE IF EXISTS `plan`;
CREATE TABLE IF NOT EXISTS `plan` (
  `id_plan` int(11) NOT NULL AUTO_INCREMENT,
  `id_site` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `image` text NOT NULL,
  `ros_resolution` int(3) NOT NULL,
  `ros_largeur` int(6) NOT NULL,
  `ros_hauteur` int(6) NOT NULL,
  PRIMARY KEY (`id_plan`),
  KEY `id_robot` (`id_site`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=55 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `plan`
--

INSERT INTO `plan` (`id_plan`, `id_site`, `nom`, `image`, `ros_resolution`, `ros_largeur`, `ros_hauteur`) VALUES
(49, 1, 'test', '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', 5, 1407, 503),
(53, 0, 'test_save', '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', 5, 1407, 503),
(54, 1, 'test', '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', 5, 336, 1073);

-- --------------------------------------------------------

--
-- Structure de la table `poi`
--

DROP TABLE IF EXISTS `poi`;
CREATE TABLE IF NOT EXISTS `poi` (
  `id_poi` int(10) NOT NULL AUTO_INCREMENT,
  `id_plan` int(11) NOT NULL,
  `x_ros` decimal(8,4) NOT NULL,
  `y_ros` decimal(8,4) NOT NULL,
  `t_ros` decimal(8,4) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id_poi`),
  KEY `id_map` (`id_plan`)
) ENGINE=MyISAM AUTO_INCREMENT=57 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `poi`
--

INSERT INTO `poi` (`id_poi`, `id_plan`, `x_ros`, `y_ros`, `t_ros`, `name`) VALUES
(50, 49, '17.3707', '15.0073', '-0.0569', 'POI centre'),
(51, 49, '6.0129', '13.3294', '1.4249', 'POI'),
(53, 49, '55.4230', '15.2612', '8.3577', 'poi2'),
(54, 49, '47.5844', '16.3372', '16.3372', 'poi3');

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
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

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
) ENGINE=MyISAM AUTO_INCREMENT=2659 DEFAULT CHARSET=latin1;

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
-- Structure de la table `site`
--

DROP TABLE IF EXISTS `site`;
CREATE TABLE IF NOT EXISTS `site` (
  `id_site` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  PRIMARY KEY (`id_site`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `site`
--

INSERT INTO `site` (`id_site`, `nom`) VALUES
(1, 'Default'),
(2, 'Test 3');

-- --------------------------------------------------------

--
-- Structure de la table `station_recharge`
--

DROP TABLE IF EXISTS `station_recharge`;
CREATE TABLE IF NOT EXISTS `station_recharge` (
  `id_station_recharge` int(11) NOT NULL AUTO_INCREMENT,
  `id_plan` int(11) NOT NULL,
  `x_ros` decimal(8,4) NOT NULL,
  `y_ros` decimal(8,4) NOT NULL,
  `t_ros` decimal(8,4) NOT NULL,
  `num` int(3) NOT NULL,
  PRIMARY KEY (`id_station_recharge`),
  KEY `id_plan` (`id_plan`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `station_recharge`
--

INSERT INTO `station_recharge` (`id_station_recharge`, `id_plan`, `x_ros`, `y_ros`, `t_ros`, `num`) VALUES
(1, 49, '6.2891', '14.4939', '1.5413', 0),
(2, 49, '25.1719', '17.0087', '1.6332', 0),
(3, 49, '24.6213', '16.0001', '6.2832', 0),
(4, 49, '49.4408', '15.9252', '1.5010', 0);

-- --------------------------------------------------------

--
-- Structure de la table `tache`
--

DROP TABLE IF EXISTS `tache`;
CREATE TABLE IF NOT EXISTS `tache` (
  `id_tache` int(11) NOT NULL AUTO_INCREMENT,
  `id_site` int(11) NOT NULL,
  `id_plan` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `action_fin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_tache`),
  KEY `id_site` (`id_site`),
  KEY `id_plan` (`id_plan`),
  KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `tache`
--

INSERT INTO `tache` (`id_tache`, `id_site`, `id_plan`, `name`, `action_fin`) VALUES
(1, 1, 49, 'test2', 1),
(2, 1, 49, 'Goto poi and wait 10s', 0);

-- --------------------------------------------------------

--
-- Structure de la table `tache_action`
--

DROP TABLE IF EXISTS `tache_action`;
CREATE TABLE IF NOT EXISTS `tache_action` (
  `id_tache_action` int(11) NOT NULL AUTO_INCREMENT,
  `id_tache` int(11) NOT NULL,
  `action_type` int(2) NOT NULL,
  `action_detail` text NOT NULL,
  `position` int(3) NOT NULL,
  PRIMARY KEY (`id_tache_action`),
  KEY `position` (`position`),
  KEY `id_tache` (`id_tache`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `tache_action`
--

INSERT INTO `tache_action` (`id_tache_action`, `id_tache`, `action_type`, `action_detail`, `position`) VALUES
(10, 1, 1, '53', 0),
(16, 2, 1, '51', 0),
(14, 1, 3, '15', 1),
(13, 1, 2, '', 3),
(15, 1, 1, '50', 2),
(17, 2, 3, '10', 1),
(18, 1, 1, '54', 4);

-- --------------------------------------------------------

--
-- Structure de la table `tache_queue`
--

DROP TABLE IF EXISTS `tache_queue`;
CREATE TABLE IF NOT EXISTS `tache_queue` (
  `id_tache_queue` int(11) NOT NULL AUTO_INCREMENT,
  `id_tache` int(11) NOT NULL,
  `position` int(3) NOT NULL,
  `state` varchar(255) NOT NULL,
  `progress` varchar(255) NOT NULL,
  `step` int(3) NOT NULL,
  PRIMARY KEY (`id_tache_queue`),
  KEY `id_tache` (`id_tache`),
  KEY `position` (`position`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `tache_queue`
--

INSERT INTO `tache_queue` (`id_tache_queue`, `id_tache`, `position`, `state`, `progress`, `step`) VALUES
(5, 2, 4, '', '', -1),
(1, 1, 0, 'in_progress', 'Executing step [object Object]1', 0),
(3, 2, 2, '', '', -1),
(4, 1, 3, '', '', -1);

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
  `adresse_1` varchar(255) NOT NULL,
  `adresse_2` varchar(255) NOT NULL,
  `codepostal` varchar(10) NOT NULL,
  `ville` varchar(255) NOT NULL,
  `societe` varchar(255) NOT NULL,
  `tel` varchar(20) NOT NULL,
  `portable` varchar(20) NOT NULL,
  `id_groupe_user` int(10) NOT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `tel_sip` int(10) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `last_connection` datetime NOT NULL,
  `online` int(1) NOT NULL,
  `api_key` varchar(255) NOT NULL,
  `id_lang` int(3) NOT NULL DEFAULT '1',
  `acces_suivi` tinyint(1) NOT NULL DEFAULT '0',
  `trax_options` text NOT NULL,
  PRIMARY KEY (`id_user`),
  KEY `actif` (`actif`),
  KEY `deleted` (`deleted`),
  KEY `id_groupe_user` (`id_groupe_user`),
  KEY `email` (`email`),
  KEY `pass` (`pass`),
  KEY `tel_sip` (`tel_sip`)
) ENGINE=MyISAM AUTO_INCREMENT=61 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id_user`, `email`, `pass`, `nom`, `prenom`, `adresse_1`, `adresse_2`, `codepostal`, `ville`, `societe`, `tel`, `portable`, `id_groupe_user`, `actif`, `deleted`, `tel_sip`, `photo`, `last_connection`, `online`, `api_key`, `id_lang`, `acces_suivi`, `trax_options`) VALUES
(1, 'stephane.morillon@smorillon.com', 'e2232c2c6677dcc20e256651eee9eb91', 'MORILLON', 'StÃ©phane', '6 route des Deveses', '', '31410', 'MONTAUT', 'Smorillon.com', '', '0672916946', 1, 1, 0, 5202, 'image73.jpg', '2020-01-06 14:40:54', 0, '5LGU.LaYMMncJaA0i42HwsX9ZX-RCNgj-9V17ROFXt71st', 2, 0, '{\"background_opacity\":100,\"displayHelpAddShelf\":false,\"displayHelpAddSegmentToJob\":false}'),
(10, 'nicolas.deroquette@wyca.fr', 'e17b716e56368a275c40ea1594aa3432', 'De roquette', 'Nicolas', '', '', '', '', 'Wyca', '', '', 3, 1, 0, -1, 'teÌleÌchargement_002.jpeg', '2018-12-19 10:35:10', -1, 'DVHH3wP22Mf4rFBwCDYDqFV5bdz7KhvrsiPh.g7lbDtTom', 2, 0, ''),
(11, 'guillaume.doisy@wyca.fr', '3c902bd85fd9ccc65dcdef2e50806dfa', 'DOISY', 'Guillaume', '', '', '', '', 'Wyca', '', '', 1, 1, 0, -1, '', '2019-08-13 13:38:51', -1, 'Bcx7SqcxvvOjiKrNuwmSBnbUDSvXxfhnJmgwZFKD6zDuvz', 2, 0, ''),
(47, 'patrick.lascombe@wyca.fr', 'd66a325bdc33e13492db7ab16a62738f', 'Lascombes', 'Patrick', '', '', '', '', 'Wyca', '', '', 1, 1, 0, -1, '', '2019-06-24 11:21:57', -1, 'sdf48RTFHG1561wsdfSDRTGS136513sFVED', 1, 0, ''),
(50, 'brice.renaudeau@wyca.fr', 'cea87ec8e72a538e4fc5cd5ff1aba359', 'RENAUDEAU', 'Brice', '', '', '', '', 'Wyca', '', '', 1, 1, 0, -1, '', '2019-07-18 15:52:45', -1, 'JNLCLkjCFTm33ben1qNA8km8u9O0IysDTM.1AzgCV7Bpt9', 1, 0, ''),
(53, 'patrick.dehlinger@wyca.fr', 'e32a479fbf7799206c74da14b1dd7931', 'Dehlinger', 'Patrick', '', '', '', '', 'Wyca', '', '', 2, 1, 0, -1, '', '2019-06-25 18:55:51', -1, 'xTKQbuUb3zDcemNPlzJyrqhk.DNEyp7reuzdi51WlUN3sa', 1, 0, ''),
(60, 'distributor', '751b823926d1ea5b9e4a4678d6ee70c8', 'Distributor', '', '', '', '', '', '', '', '', 3, 1, 0, -1, '', '2020-01-07 07:49:44', -1, 'Jnt.kK2nXB15jhVkCEGLA3NssidZWLpsdgmt4bx8GkTZL5', 2, 0, '');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
