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
