		</div>
        
        <script>
		var lang = '<?php echo $currentLang->iso;?>';

		var robot_host = '<?php echo $_CONFIG["ROBOT_HOST"]?>';
		var robot_http = '<?php echo $_CONFIG["ROBOT_HTTP"]?>';
		
		var use_ssl = <?php echo $server_request_scheme == 'http'?'false':'true';?>;
		var app_url = '<?php echo $server_request_scheme;?>://wyca.run';

		var user_api_key = '<?php echo $_SESSION["api_key"];?>';
		var user_id = '<?php echo $_SESSION["id_user"];?>';
		var app_sound_is_on = JSON.parse('<?php echo $app_sound;?>');
		// TODO var id_map_last = <?php // echo $currentIdMap;?>;

		</script>
		<script src="<?php echo $_CONFIG['URL'];?>template/trad_js.php?v=<?php echo $lastUpdate;?>"></script>
		<!-- Vendor -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery/jquery.js"></script>
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui/js/jquery-ui-1.10.4.custom.js"></script>
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui-touch-punch/jquery.ui.touch-punch.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/js/bootstrap.js"></script>
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-colorpicker/js/bootstrap-colorpicker.min.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/ios7-switch/ios7-switch.js"></script>
		<!-- Specific Page Vendor -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui/js/jquery-ui-1.10.4.custom.js"></script>
		
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/iro/iro.js"></script>
        
        
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/svg-pan-zoom/svg-pan-zoom.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/svg-pan-zoom/hammer.js"></script>

        <script src="<?php echo $_CONFIG['URL_API'];?>wyca_socket_api.js?v=<?php echo $lastUpdate;?>"></script>

		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/mouse_to_touch.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/plugins.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/joystick.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/robot.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/app.js?v=<?php echo $lastUpdate;?>"></script>
        
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/init_map.js?v=<?php echo $lastUpdate;?>"></script>
        <?php if ($_SESSION['id_groupe_user'] == 1) {?>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca_app.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca_map.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca_map_actions.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca_map_svg.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca_bystep_app.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca_bystep_map.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca_bystep_map_actions.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca_bystep_map_svg.js?v=<?php echo $lastUpdate;?>"></script>
		<?php } if ($_SESSION['id_groupe_user'] == 2) {?>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/bystep_app.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/bystep_map.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/bystep_map_actions.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/bystep_map_svg.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/normal_app.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/normal_map.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/normal_map_actions.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/normal_map_svg.js?v=<?php echo $lastUpdate;?>"></script>
		<?php } if ($_SESSION['id_groupe_user'] == 3) {?>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/manager_app.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/manager_map.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/manager_map_actions.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/manager_map_svg.js?v=<?php echo $lastUpdate;?>"></script>
        <?php } if ($_SESSION['id_groupe_user'] == 4) {?>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/user_app.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/user_map.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/user_map_actions.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/user_map_svg.js?v=<?php echo $lastUpdate;?>"></script>
        <?php }?>
        
        <script>
		$(document).ready(function(e) {
			
			<?php if(isset($error_conf_release) && $error_conf_release) { ?>
				<?php if($_CONFIG['MODE'] == 'PROD') { ?>
					console.log('---------------------------------------------------------');
					console.log('Invalid or missing version.conf file on release detected');
					console.log('---------------------------------------------------------');
				<?php }else{?>
					DisplayError('Invalid or missing version.conf file on release detected');
				<?php }?>
			<?php }?>
			
			<?php if ($_SESSION['id_groupe_user'] == 2) {?>
				//BYSTEP INSTALL_STEP
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 2) {?>
				InitTopsByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 3) {?>
				InitTopsActiveByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 4) {?>
				InitCheckByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 5) {?>
				InitInstallWifiPageByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 6) {?>
				InitSoundByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 61) {?>
				InitSiteSelectMapByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 62) {?>
				InitMasterDockByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 10) {?>
				InitSiteImportByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 12) {?>
				InitMappingByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 13) {?>
				GetLastMappingByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 20) {?>
				GetInfosCurrentMapByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 30) {?>
				GetConfigurationsByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 33) {?>
				GetManagersByStep();
				$('#bHeaderInfo').attr('onClick',"$('#install_by_step_manager .modalHelpManager').modal('show')");
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 34) {?>
				GetServiceBooksByStep();
				<?php }?>
			<?php }?>
			<?php if ($_SESSION['id_groupe_user'] == 1) {?>
				//WYCABYSTEP INSTALL_STEP
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 2) {?>
				InitTopsWycaByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 3) {?>
				InitTopsActiveWycaByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 4) {?>
				InitCheckWycaByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 5) {?>
				InitInstallWifiPageWycaByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 6) {?>
				InitSoundWycaByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 61) {?>
				InitSiteSelectMapWycaByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 62) {?>
				InitMasterDockWycaByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 10) {?>
				InitSiteImportWycaByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 12) {?>
				InitMappingWycaByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 13) {?>
				GetLastMappingWycaByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 20) {?>
				GetInfosCurrentMapWycaByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 30) {?>
				GetConfigurationsWycaByStep();
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 33) {?>
				GetManagersWycaByStep();
				$('#bHeaderInfo').attr('onClick',"$('#install_by_step_manager .modalHelpManager').modal('show')");
				<?php }?>
				<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 34) {?>
				GetServiceBooksWycaByStep();
				<?php }?>
			<?php }?>
        });
		</script>
	</body>
</html>
