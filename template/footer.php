		
        <div id="modalJoystick" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog" role="dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="actions" style="min-height:calc(100vh - 110px);">
                            <div style="text-align:center; font-size:26px;">
	                            <!--<?php echo __('Enable joystick');?> <a href="#" id="bToggleJosytick"><i class="ico_jotick fa fa-toggle-off" style="font-size:30px;"></i></a>-->
                                
                                
                                <div style="clear:both; height:50px;"></div>
                                
                                <div class="joystickDiv" draggable="false" style="margin:auto;">
                                    <div class="fond"></div>
                                    <div class="curseur"></div>
                                </div>
                            </div>
                            <div style="clear:both; height:50px;"></div>
                            
                            
                            <a href="#" id="bUndockJoystick" class="btn btn-warning" style="width:100%; display:none; position:absolute; left:0; bottom:55px; font-size:30px;"><?php echo __('Undock');?></a>
                            <a href="#" id="bDockJoystick" class="btn btn-warning" style="width:100%; display:none; position:absolute; left:0; bottom:55px; font-size:30px;"><?php echo __('Dock');?></a>
                            
                            <a href="#" id="bCloseJoystickPanel" class="btn btn-primary" data-dismiss="modal" style="width:100%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Close');?></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        
        <script>
		var lang = '<?php echo $_COOKIE['lang'];?>';
		</script>

		<!-- Vendor -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery/jquery.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-browser-mobile/jquery.browser.mobile.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap/js/bootstrap.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/nanoscroller/nanoscroller.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/fullcalendar/lib/moment.min.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/magnific-popup/magnific-popup.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-placeholder/jquery.placeholder.js"></script>
		
		<!-- Specific Page Vendor -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui/js/jquery-ui-1.10.4.custom.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-ui-touch-punch/jquery.ui.touch-punch.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-appear/jquery.appear.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-multiselect/bootstrap-multiselect.js"></script>
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/bootstrap-colorpicker/js/bootstrap-colorpicker.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-easypiechart/jquery.easypiechart.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/flot/jquery.flot.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/flot-tooltip/jquery.flot.tooltip.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/flot/jquery.flot.pie.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/flot/jquery.flot.categories.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/flot/jquery.flot.resize.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-sparkline/jquery.sparkline.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/raphael/raphael.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/morris/morris.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/gauge/gauge.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/snap-svg/snap.svg.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/liquid-meter/liquid.meter.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jqvmap/jquery.vmap.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jqvmap/data/jquery.vmap.sampledata.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jqvmap/maps/jquery.vmap.world.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jqvmap/maps/continents/jquery.vmap.africa.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jqvmap/maps/continents/jquery.vmap.asia.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jqvmap/maps/continents/jquery.vmap.australia.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jqvmap/maps/continents/jquery.vmap.europe.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jqvmap/maps/continents/jquery.vmap.north-america.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jqvmap/maps/continents/jquery.vmap.south-america.js"></script>
        
        
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/select2/select2.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-datatables/media/js/jquery.dataTables.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-datatables/extras/TableTools/js/dataTables.tableTools.min.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jquery-datatables-bs3/assets/js/datatables.js"></script>
		
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/codemirror/lib/codemirror.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/codemirror/addon/selection/active-line.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/codemirror/addon/edit/matchbrackets.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/codemirror/mode/yaml/yaml.js"></script>
        
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/farbtastic/farbtastic.js"></script>        
        <script src="<?php echo $_CONFIG['URL'];?>assets/vendor/jstree/jstree.js"></script>
		
        <!--<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/directive.js"></script>-->
        
		<!-- Theme Base, Components and Settings -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/theme.js"></script>
		
		<!-- Theme Custom -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/theme.custom.js"></script>
		
		<!-- Theme Initialization Files -->
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/theme.init.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/joystick.js?v=20200103_2"></script>
        
        <script src="<?php echo $_CONFIG['URL_API'];?>extern/roslib.js"></script>
        <script src="<?php echo $_CONFIG['URL_API'];?>webrtc.wyca2.min.js"></script>
        <script src="<?php echo $_CONFIG['URL_API'];?>wyca_api.latest.min.php?api_key=5LGU.LaYMMncJaA0i42HwsX9ZX-RCNgj-9V17ROFXt71st&v=20191127"></script>
        
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca.js"></script>
        
        <script>
			var api_key_user = '<?php echo $userConnected->api_key;?>';
			var id_user = '<?php echo $userConnected->id_user;?>';
        </script>
        
        <script>
		function ConfirmDelete(lien)
		{
			if (confirm('<?php echo __('Etes vous sûr de vouloir supprimer cet élément ?');?>'))
				location.href = lien;
		}
		$('.confirmDelete').click(function(e) {
			if (!confirm('<?php echo __('Etes vous sûr de vouloir supprimer cet élément ?');?>'))
				e.preventDefault();
		});
		$(document).ready(function(e) {
            setTimeout(function(){ $(".alert-success button").click(); }, 3000);
		});
		
		</script> 

	</body>
</html>
