		</div>
        
        <script>
		var lang = '<?php echo $currentLang->iso;?>';
		var robot_host = '<?php echo (file_exists('C:\\'))?'10.0.0.23:9090':'elodie.wyca-solutions.com:9090';?>';
		var id_map_last = <?php echo $currentIdMap;?>;
		var textSelectOnOrMoreTops = "<?php echo addslashes(stripslashes(__('You must select one or more tops')));?>";
		var textIndicateAName = "<?php echo addslashes(stripslashes(__('You must indicate a name')));?>";
		var textStartMapping = "<?php echo addslashes(stripslashes(__('Start mapping')));?>";
		var textStopNavigation = "<?php echo addslashes(stripslashes(__('Stop navigation')));?>";
		var textBuildingMap = "<?php echo addslashes(stripslashes(__('Building the map')));?>";
		var textStartAutonomous = "<?php echo addslashes(stripslashes(__('Start autonomous navigation')));?>";
		</script>

		<!-- Vendor -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery/jquery.js"></script>
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui/js/jquery-ui-1.10.4.custom.js"></script>
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui-touch-punch/jquery.ui.touch-punch.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/js/bootstrap.js"></script>
		<!-- Specific Page Vendor -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui/js/jquery-ui-1.10.4.custom.js"></script>
        
        <script src="<?php echo $_CONFIG['URL_API'];?>wyca_api.latest.min.php"></script>
        
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/svg-pan-zoom/svg-pan-zoom.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/svg-pan-zoom/hammer.js"></script>

		<?php $lastUpdate = '20200312';?>

		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/plugins.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/joystick.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/robot.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/map.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/map_actions.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/map_svg.js?v=<?php echo $lastUpdate;?>"></script>
        
        <script>
		$(document).ready(function(e) {
            <?php if ($INSTALL_STEP == 1) {?>
			InitInstallWifiPage();
			<?php }?>
			<?php if ($INSTALL_STEP == 8) {?>
			GetInfosCurrentMap();
			<?php }?>
        });
		</script>
	</body>
</html>
