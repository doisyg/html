		</div>
        
        <div class="popup_error">
        	<section class="panel panel-secondary" data-portlet-item="">
                <header class="panel-heading">
                    <div class="panel-actions">
                        <a href="#" class="fa fa-times"></a>
                    </div>
                    <h2 class="panel-title">Error</h2>
                </header>
                <div class="panel-body"></div>
            </section>
        </div>
        
        <script>
		var lang = '<?php echo $currentLang->iso;?>';
		var robot_host = '<?php echo (file_exists('C:\\'))?'192.168.0.30:9095':'elodie.wyca-solutions.com:9095';?>';
		//var robot_host = '<?php echo (file_exists('C:\\'))?'10.0.0.44:9095':'elodie.wyca-solutions.com:9095';?>';
		var user_api_key = '<?php echo $_SESSION["api_key"];?>';
		// TODO var id_map_last = <?php // echo $currentIdMap;?>;
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
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-colorpicker/js/bootstrap-colorpicker.min.js"></script>
		<!-- Specific Page Vendor -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui/js/jquery-ui-1.10.4.custom.js"></script>
        
        <script src="<?php echo $_CONFIG['URL_API'];?>wyca_socket_api.js"></script>
        
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/svg-pan-zoom/svg-pan-zoom.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/svg-pan-zoom/hammer.js"></script>

		<?php $lastUpdate = '20200629_2';?>

		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/plugins.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/joystick.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/robot.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/bystep_wyca.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/bystep_map.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/bystep_map_actions.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/bystep_map_svg.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/installateur_wyca.js?v=<?php echo $lastUpdate;?>"></script>
        
        <script>
		$(document).ready(function(e) {
			
            <?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 1) {?>
			InitInstallWifiPageByStep();
			<?php }?>
            <?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 3) {?>
			InitTopsByStep();
			<?php }?>
            <?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 4) {?>
			InitTopsActiveByStep();
			<?php }?>
			<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 8) {?>
			GetInfosCurrentMapByStep();
			<?php }?>
			<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 9) {?>
			GetConfigurationsByStep();
			<?php }?>
			<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 10) {?>
			GetManagersByStep();
			<?php }?>
			<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 11) {?>
			GetServiceBooksByStep();
			<?php }?>
        });
		</script>
	</body>
</html>