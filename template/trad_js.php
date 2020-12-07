<?php
require_once (__DIR__.'/../config/initSite.php');

if (false) // Pour rendre l'IDE plus firendly
{
?><script id="trad_js"><?php
}
else
{
?>// JavaScript Document
<?php
}
?>

var textNeedReconnect = "<?php echo __js('Reconnection is required');?>";

var textLoading = "<?php echo __js('Loading');?>";
var textUpdatingMap = "<?php echo __js('Updating Map');?>";
var textSelectOnOrMoreTops = "<?php echo __js('You must select one or more tops');?>";
var textAvailablesTopsSaved = "<?php echo __js('Available tops saved');?>";
var textIndicateAName = "<?php echo __js('You must indicate a name');?>";
var textSiteImported = "<?php echo __js('Site successfully imported');?>";
var textNameUsed = "<?php echo __js('Name already used please change');?>";
var textStartMapping = "<?php echo __js('Start mapping');?>";
var textStopNavigation = "<?php echo __js('Stop navigation');?>";
var textBuildingMap = "<?php echo __js('Building the map');?>";
var textStartAutonomous = "<?php echo __js('Start autonomous navigation');?>";
var textBtnCheckTest = "<?php echo __js('Testing');?>";
var textBtnCheckNext = "<?php echo __js('Next');?>";
var textLessThanOne = "<?php echo __js('Less than 1');?>";
var textPasswordRequired = "<?php echo __js('Passwords required.');?>";
var textPasswordMatching = "<?php echo __js('Passwords not matching.');?>";
var textPasswordPattern = "<?php echo __js('Passwords needs to be 8 character long with at least 1 uppercase letter and 1 special character or digit');?>";
var textLoginPattern = "<?php echo __js('Login needs to be a valid mail adress.');?>";
var textNoRealTest = "<?php echo __js('You need at least 2 docks, POIs or augmented poses to launch real test.');?>";

//ANSWERCODE API

var textAPIAnswerCode = {}; //OBJ

textAPIAnswerCode.NO_ERROR = "<?php echo __js('No error');?>";
textAPIAnswerCode.FORMAT_ERROR_MISSING_DATA = "<?php echo __js('Format error ; missing data');?>";
textAPIAnswerCode.FORMAT_ERROR_INVALID_DATA = "<?php echo __js('Format error ; invalid data');?>";
textAPIAnswerCode.NOT_ALLOW = "<?php echo __js('Not allow');?>";
textAPIAnswerCode.COULD_NOT_PARSE_JSON = "<?php echo __js('Could not parse JSON');?>";
textAPIAnswerCode.UNKNOW_API_OPERATION = "<?php echo __js('Unknow API operation');?>";
textAPIAnswerCode.NOT_IMPLEMENTED = "<?php echo __js('Not implemented');?>";
textAPIAnswerCode.INVALID_ID = "<?php echo __js('Invalid ID');?>";
textAPIAnswerCode.INVALID_FILE = "<?php echo __js('Invalid file');?>";
textAPIAnswerCode.INVALID_KEY = "<?php echo __js('Invalid key');?>";
textAPIAnswerCode.EMAIL_ALREADY_USED = "<?php echo __js('Email already used');?>";
textAPIAnswerCode.DETAILS_IN_MESSAGE = "<?php echo __js('Details in message');?>";
textAPIAnswerCode.AUTH_KO = "<?php echo __js('Auth KO');?>";
textAPIAnswerCode.AUTH_NEEDED = "<?php echo __js('Auth needed');?>";
textAPIAnswerCode.NO_ACTION_IN_PROGRESS = "<?php echo __js('No action in progress');?>";
textAPIAnswerCode.ACTION_ALREADY_STARTED = "<?php echo __js('Action already started');?>";
textAPIAnswerCode.CANCELED = "<?php echo __js('Action canceled');?>";
textAPIAnswerCode.SERVICE_UNAVAILABLE = "<?php echo __js('Service unvailable');?>";
textAPIAnswerCode.BATTERY_TOO_LOW = "<?php echo __js('Battery too low');?>";
textAPIAnswerCode.NAVIGTION_IS_NOT_STARTED = "<?php echo __js('Navigation is not started');?>";
textAPIAnswerCode.NAVIGTION_IS_ACTIVE = "<?php echo __js('Navigation is active and block current operation');?>";
textAPIAnswerCode.MAPPING_IS_NOT_STARTED = "<?php echo __js('Mapping is not started');?>";
textAPIAnswerCode.MAPPING_IS_ACTIVE = "<?php echo __js('Mapping is active and block current operation');?>";
textAPIAnswerCode.MAP_NOT_IN_SITE = "<?php echo __js('Map not in current site');?>";
textAPIAnswerCode.UNDOCKING = "<?php echo __js('Robot trying to undock');?>"; // Robot trying to undock
textAPIAnswerCode.DOCKED = "<?php echo __js('Robot is docked');?>"; // Robot is docked
textAPIAnswerCode.NO_DOCK = "<?php echo __js('No dock detected');?>"; // No dock detected
textAPIAnswerCode.NOT_DOCKABLE = "<?php echo __js('The robot is not dockable (bad position)');?>"; // The robot is not dockable (bad position)
textAPIAnswerCode.MOVE_FAILED = "<?php echo __js('Moving step failed');?>"; // Moving step failed
textAPIAnswerCode.NO_DOCKING_STATION = "<?php echo __js('No docking station');?>";
textAPIAnswerCode.INVALID_START_POSE = "<?php echo __js('Invalid start position');?>";
textAPIAnswerCode.NO_VALID_GLOBAL_PATH = "<?php echo __js('No valid global path');?>";
textAPIAnswerCode.INVALID_TARGET_POSE = "<?php echo __js('Invalid target position');?>";
textAPIAnswerCode.OBSTACLE_FAIL = "<?php echo __js('Obstacle fail');?>";
textAPIAnswerCode.WRONG_UNDOCK_PATH = "<?php echo __js('Wrong undock path');?>";
textAPIAnswerCode.UNKNOW_REFLECTOR = "<?php echo __js('Unknow reflector for the current map');?>";
textAPIAnswerCode.NO_REFLECTOR_DETECTED = "<?php echo __js('No reflector detected around the robot');?>";
textAPIAnswerCode.DOCKING = "<?php echo __js('Robot trying to dock');?>"; // Robot trying to dock
textAPIAnswerCode.UNDOCKED = "<?php echo __js('Robot is undocked');?>"; // Robot is undocked
textAPIAnswerCode.WRONG_GOAL = "<?php echo __js('Wrong goal: Fiducial type and id must be defined');?>";
textAPIAnswerCode.CLOSE_FAILURE = "<?php echo __js('Dock fail too close to dock');?>";
textAPIAnswerCode.MOVE_BASIC_FAILED = "<?php echo __js('Move basic action failed');?>";
textAPIAnswerCode.GOTOPOSE_FAILED = "<?php echo __js('Go to pose action failed');?>";
textAPIAnswerCode.DEFAULT = "<?php echo __js('Unknown error code');?>";