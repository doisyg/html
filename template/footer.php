		</div>
        
        
        <div id="modalLoading" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog" role="dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="actions mh100vh_55">
                            <div class="h100vh_160" style="overflow:auto; text-align:center;">
                                
                                <div style="height:60px;"></div>
                                
                                <h3>Loading</h3>
                                <div class="loadingProgress progress progress-striped light active m-md">
                                    <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;">
                                    </div>
                                </div>
                                
                            </div>
                            
                            <div style="clear:both;"></div>
                        </div>
                    </div>
                </div>
            </div>
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

		var robot_host = '<?php echo (file_exists('C:\\'))?((file_exists('C:\\Users\\F'))?'10.0.0.39:'.($server_request_scheme == 'http'?'9094':'9095'):'192.168.0.33:'.($server_request_scheme == 'http'?'9094':'9095')):'wyca.run:'.($server_request_scheme == 'http'?'9094':'9095');?>';
		var robot_http = '<?php echo (file_exists('C:\\'))?((file_exists('C:\\Users\\F'))?$server_request_scheme.'://10.0.0.39':$server_request_scheme.'://192.168.0.33'):'';?>';
		//var robot_host = '<?php echo (file_exists('C:\\'))?'10.0.0.44:'.($server_request_scheme == 'http'?'9094':'9095'):'wyca.run:'.($server_request_scheme == 'http'?'9094':'9095');?>';
		var use_ssl = <?php echo $server_request_scheme == 'http'?'false':'true';?>;

		var user_api_key = '<?php echo $_SESSION["api_key"];?>';
		// TODO var id_map_last = <?php // echo $currentIdMap;?>;
		var textSelectOnOrMoreTops = "<?php echo addslashes(stripslashes(__('You must select one or more tops')));?>";
		var textIndicateAName = "<?php echo addslashes(stripslashes(__('You must indicate a name')));?>";
		var textNameUsed = "<?php echo addslashes(stripslashes(__('Name already used please change')));?>";
		var textStartMapping = "<?php echo addslashes(stripslashes(__('Start mapping')));?>";
		var textStopNavigation = "<?php echo addslashes(stripslashes(__('Stop navigation')));?>";
		var textBuildingMap = "<?php echo addslashes(stripslashes(__('Building the map')));?>";
		var textStartAutonomous = "<?php echo addslashes(stripslashes(__('Start autonomous navigation')));?>";
		var textBtnCheckTest = "<?php echo addslashes(stripslashes(__('Testing')));?>";
		var textBtnCheckNext = "<?php echo addslashes(stripslashes(__('Next')));?>";
		</script>

		<!-- Vendor -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery/jquery.js"></script>
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui/js/jquery-ui-1.10.4.custom.js"></script>
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui-touch-punch/jquery.ui.touch-punch.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/js/bootstrap.js"></script>
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-colorpicker/js/bootstrap-colorpicker.min.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/ios7-switch/ios7-switch.js"></script>
		<!-- Specific Page Vendor -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui/js/jquery-ui-1.10.4.custom.js"></script>
        
        
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/svg-pan-zoom/svg-pan-zoom.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/svg-pan-zoom/hammer.js"></script>

		<?php $lastUpdate = '20201019_2';?>
        
        <script src="<?php echo $_CONFIG['URL_API'];?>wyca_socket_api.js?v=<?php echo $lastUpdate;?>"></script>

		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/mouse_to_touch.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/plugins.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/joystick.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/robot.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca.js?v=<?php echo $lastUpdate;?>"></script>
		
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/bystep_wyca.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/bystep_map.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/bystep_map_actions.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/bystep_map_svg.js?v=<?php echo $lastUpdate;?>"></script>
        <?php if ($_SESSION['id_groupe_user'] == 1) {?>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca_wyca.js?v=<?php echo $lastUpdate;?>"></script>
		<?php } if ($_SESSION['id_groupe_user'] <= 2) {?>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/normal_wyca.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/normal_map.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/normal_map_actions.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/normal_map_svg.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/installateur_wyca.js?v=<?php echo $lastUpdate;?>"></script>
		<?php } if ($_SESSION['id_groupe_user'] <= 3) {?>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/manager_wyca.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/manager_map.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/manager_map_actions.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/manager_map_svg.js?v=<?php echo $lastUpdate;?>"></script>
        <?php } if ($_SESSION['id_groupe_user'] <= 4) {?>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/user_wyca.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/user_map.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/user_map_actions.js?v=<?php echo $lastUpdate;?>"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/user_map_svg.js?v=<?php echo $lastUpdate;?>"></script>
        <?php }?>
        
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
            <?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 7) {?>
			InitMappingByStep();
			<?php }?>
			<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 8) {?>
			GetLastMappingByStep();
			<?php }?>
			<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 9) {?>
			GetInfosCurrentMapByStep();
			<?php }?>
			<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 10) {?>
			GetConfigurationsByStep();
			<?php }?>
			<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 11) {?>
			GetManagersByStep();
			<?php }?>
			<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 12) {?>
			GetServiceBooksByStep();
			<?php }?>
			<?php if (isset($INSTALL_STEP) && $INSTALL_STEP == 5) {?>
			InitCheckByStep();
			<?php }?>
        });
		</script>
	</body>
</html>
