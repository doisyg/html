		</div>
        
        <script>
		var lang = '<?php echo $currentLang->iso;?>';
		var textSelectOnOrMoreTops = "<?php echo addslashes(stripslashes(__('You must select one or more tops')));?>";
		var textIndicateAName = "<?php echo addslashes(stripslashes(__('You must indicate a name')));?>";
		var textStartMapping = "<?php echo addslashes(stripslashes(__('Start mapping')));?>";
		var textStopNavigation = "<?php echo addslashes(stripslashes(__('Stop navigation')));?>";
		</script>

		<!-- Vendor -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery/jquery.js"></script>
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui-touch-punch/jquery.ui.touch-punch.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/js/bootstrap.js"></script>
		<!-- Specific Page Vendor -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui/js/jquery-ui-1.10.4.custom.js"></script>
        
        <script src="<?php echo $_CONFIG['URL_API'];?>wyca_api.latest.min.php"></script>
        
        
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/plugins.js?v=20200204"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/joystick.js?v=20200204"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/robot.js?v=20200204"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca.js?v=20200304"></script>
        
        <script>
		$(document).ready(function(e) {
            <?php if ($INSTALL_STEP == 1) {?>
			InitInstallWifiPage();
			<?php }?>
        });
		</script>
	</body>
</html>
