<?php
ob_start();

require_once (__DIR__.'/../config/initSite.php');

ob_end_clean();
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

var textBeSureSelectedSite = "<?php echo __js('Be sure that selected site is the one where is the vehicle, if not robot could be damaged or broken.');?>"; 

var textActionCanceled = "<?php echo __js('Action canceled');?>";
var textNeedReconnect = "<?php echo __js('Reconnection is required');?>";
var textAccountDeleted = "<?php echo __js('Account deleted');?>";
var textDetailsInMessage = "<?php echo __js('Details in message');?>";
var textSeeMoreDetails = "<?php echo __js('See more details');?>";

var textInvalidPositionRobot = "<?php echo __js('Invalid position, please move the vehicule to another place');?>";
var textInvalidPositionDock = "<?php echo __js('Invalid position, please move the dock in an open environment around it.');?>";
var textLoading = "<?php echo __js('Loading');?>";
var textUpdatingMap = "<?php echo __js('Updating Map');?>";
var textMapSaved = "<?php echo __js('Map saved');?>";
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
var textTitleRequired = "<?php echo __js('Title required.');?>";
var textCommentRequired = "<?php echo __js('Comment required.');?>";
var textPasswordRequired = "<?php echo __js('Passwords required.');?>";
var textPasswordMatching = "<?php echo __js('Passwords not matching.');?>";
var textPasswordPattern = "<?php echo __js('Passwords needs to be 8 character long with at least 1 uppercase letter and 1 special character or digit');?>";
var textLoginPattern = "<?php echo __js('Login needs to be a valid mail adress.');?>";
var textNoRealTest = "<?php echo __js('You need at least 2 docks, POIs or augmented poses to launch real test.');?>";
var textTopNowActive = "<?php echo __js('Top is now active !');?>";
var textConfirmActiveElement = "<?php echo __js('You must confirm the active element');?>";
var textRecoveryDone = "<?php echo __js('Recovery done !');?>";
var textSwitchMapDone = "<?php echo __js('Switch map done !');?>";
var textNoStartMovingFoward = "<?php echo __js('You cannot start with moving forward');?>";
var textNoStartRotation = "<?php echo __js('You cannot start with a rotation');?>";
var textConfirmCheckbox = "<?php echo __js('You must confirm by checking the checkbox');?>";
var textBatteryConfigSaved = "<?php echo __js('Battery config saved');?>";
var textBrowserRestartedFullscreen = "<?php echo __js('Browser restarted fullscreen');?>";
var textBrowserRestartedWindowed = "<?php echo __js('Browser restarted windowed');?>";
var textMap = "<?php echo __js('Map');?>";
var textSite = "<?php echo __js('Site');?>";
var textAreYouSureToLeave = "<?php echo __js('Are you sure you want to leave?');?>";
var textStayAwayFromObstacles = "<?php echo __js('Stay away from obstacles');?>";


var textErrorLang = "<?php echo __js('Error lang');?>";
var textErrorSaveTops = "<?php echo __js('Error save tops');?>";
var textErrorSaveTop = "<?php echo __js('Error save top');?>";
var textErrorCheck = "<?php echo __js('Error check components');?>";
var textErrorSkipWifi = "<?php echo __js('Error skip wifi');?>";
var textErrorGetSound = "<?php echo __js('Error get sound config');?>";
var textErrorSaveSound = "<?php echo __js('Error save sound config');?>";
var textErrorSound = "<?php echo __js('Error sound');?>";
var textErrorTrinary = "<?php echo __js('Error get map trinary');?>";
var textErrorImportSite = "<?php echo __js('Error import site');?>";
var textErrorExportSite = "<?php echo __js('Error export site');?>";
var textErrorDownloadMap = "<?php echo __js('Error download map');?>";
var textErrorGetSites = "<?php echo __js('Error get sites');?>";
var textErrorSaveSite = "<?php echo __js('Error save site');?>";
var textErrorGetSite = "<?php echo __js('Error get site');?>";
var textErrorSetSite = "<?php echo __js('Error set site');?>";
var textErrorIDSite = "<?php echo __js('Error in ID site');?>";
var textErrorMasterDock = "<?php echo __js('Error master dock');?>";
var textErrorRecovery = "<?php echo __js('Error in recovery');?>";
var textErrorEditMap = "<?php echo __js('Error in edit map ');?>";
var textErrorBatteryConfig = "<?php echo __js('Error in battery config');?>";
var textErrorGetCurrentSite = "<?php echo __js('Error get current site');?>";
var textErrorMaintenanceAccount = "<?php echo __js('Error maintenance account');?>";
var textErrorManagers = "<?php echo __js('Error managers');?>";
var textErrorFinish = "<?php echo __js('Error in finish');?>";
var textErrorInitMap = "<?php echo __js('Error init map');?>";
var textErrorGetMaps = "<?php echo __js('Error get maps');?>";
var textErrorGetMap = "<?php echo __js('Error get map');?>";
var textErrorSetMap = "<?php echo __js('Error set map');?>";
var textErrorSaveMap = "<?php echo __js('Error save map');?>";
var textErrorCheckPosition = "<?php echo __js('Error check position');?>";
var textErrorStartNavigation = "<?php echo __js('Error start navigation');?>";
var textErrorStopNavigation = "<?php echo __js('Error stop navigation');?>";
var textErrorGetFiducials = "<?php echo __js('Error get fiducials');?>";
var textErrorStartMapping = "<?php echo __js('Error start mapping');?>";
var textErrorStopMapping = "<?php echo __js('Error stop mapping');?>";
var textErrorGetMapping = "<?php echo __js('Error get mapping');?>";
var textErrorInput = "<?php echo __js('Error on input');?>";
var textErrorGetGlobalVehiculePersistanteDataStorage = "<?php echo __js('Error on get GlobalVehiculePersistanteDataStorage');?>";
var textErrorSetGlobalVehiculePersistanteDataStorage = "<?php echo __js('Error on set GlobalVehiculePersistanteDataStorage');?>";
var textErrorSwitchMap = "<?php echo __js('Error on switch map');?>";

var textErrorRefreshSession = "<?php echo __js('Error in refresh session');?>"; 

//DEMO MODE
var textDemoNeedActions = "<?php echo __js('You need to setup actions before launch Demo');?>";
var textDemoWait = "<?php echo __js('Wait');?>";
var textDemosecondes = "<?php echo __js('secondes');?>";


//UNDOCK PATH
var textUndockPathMove = "<?php echo __js('Move');?>";
var textUndockPathRotate = "<?php echo __js('Rotate');?>";
var textUndockPathback = "<?php echo __js('back');?>";
var textUndockPathfront = "<?php echo __js('front');?>";
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
textAPIAnswerCode.UNKNOWN_REFLECTOR = "<?php echo __js('Unknow reflector for the current map');?>";
textAPIAnswerCode.NO_REFLECTOR_DETECTED = "<?php echo __js('No reflector detected around the robot');?>";
textAPIAnswerCode.DOCKING = "<?php echo __js('Robot trying to dock');?>"; // Robot trying to dock
textAPIAnswerCode.UNDOCKED = "<?php echo __js('Robot is undocked');?>"; // Robot is undocked
textAPIAnswerCode.WRONG_GOAL = "<?php echo __js('Wrong goal: Fiducial type and id must be defined');?>";
textAPIAnswerCode.CLOSE_FAILURE = "<?php echo __js('Dock fail too close to dock');?>";
textAPIAnswerCode.MOVE_BASIC_FAILED = "<?php echo __js('Move basic action failed');?>";
textAPIAnswerCode.GOTOPOSE_FAILED = "<?php echo __js('Go to pose action failed');?>";

textAPIAnswerCode.ROBOT_TOO_FAR = "<?php echo __js('Robot too far');?>";
textAPIAnswerCode.UNDOCK_FAIL = "<?php echo __js('Robot too far');?>";
textAPIAnswerCode.NO_VALID_CMD = "<?php echo __js('No valid command');?>";
textAPIAnswerCode.TIMEOUT = "<?php echo __js( 'Timeout');?>";
textAPIAnswerCode.COLLISION = "<?php echo __js( 'Collision');?>";
textAPIAnswerCode.OSCILLATION = "<?php echo __js( 'Oscillation');?>";
textAPIAnswerCode.ROBOT_STUCK = "<?php echo __js( 'Robot stuck');?>";
textAPIAnswerCode.MISSED_GOAL = "<?php echo __js( 'Missed goal');?>";
textAPIAnswerCode.MISSED_PATH = "<?php echo __js( 'Missed path');?>";
textAPIAnswerCode.BLOCKED_PATH = "<?php echo __js( 'Blocked path');?>";
textAPIAnswerCode.INVALID_PATH = "<?php echo __js( 'Invalid path');?>";
textAPIAnswerCode.TF_ERROR = "<?php echo __js( 'TF error');?>";
textAPIAnswerCode.NOT_INITIALIZED = "<?php echo __js( 'Not initialized');?>";
textAPIAnswerCode.INVALID_PLUGIN = "<?php echo __js('Invalid plugin');?>";
textAPIAnswerCode.INTERNAL_ERROR = "<?php echo __js( 'Internal error');?>";
textAPIAnswerCode.OUT_OF_MAP = "<?php echo __js( 'The start and / or the goal are outside the map');?>";
textAPIAnswerCode.MAP_ERROR = "<?php echo __js( 'The map is not running properly');?>";
textAPIAnswerCode.STOPPED = "<?php echo __js( 'The controller execution has been stopped rigorously.');?>";
textAPIAnswerCode.TARGET_TOO_CLOSE = "<?php echo __js( 'Target too close');?>";
textAPIAnswerCode.NOT_CURRENT_MAP = "<?php echo __js( 'Not current map');?>";
textAPIAnswerCode.DEFAULT = "<?php echo __js('Unknown error code');?>";