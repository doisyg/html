		
        <div id="modalJoystick" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog" role="dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="actions" style="min-height:calc(100vh - 110px);">
                            <div style="text-align:center; font-size:26px;">
	                            <!--<?php echo __('Enable joystick');?> <a href="#" id="bToggleJosytick"><i class="ico_jotick fa fa-toggle-off" style="font-size:30px;"></i></a>-->
                                
                                
                                <div style="clear:both; height:30px;"></div>
                                
                                <div class="joystickDiv" draggable="false" style="margin:auto;">
                                    <div class="fond"></div>
                                    <div class="curseur"></div>
                                </div>
                            </div>
                            <div style="clear:both; height:30px;"></div>
                            
                            
                            <a href="#" id="bGotoAutonomousNavigation" data-dismiss="modal" class="btn btn-default btn_big_popup only_navigation"><i class="fa fa-map-o"></i><span>Autonomous navigation</span></a>
                            
                            
                            <a href="#" id="bUndockJoystick" class="btn btn-warning" style="width:100%; display:none; position:absolute; left:0; bottom:55px; font-size:30px;"><?php echo __('Undock');?></a>
                            <a href="#" id="bDockJoystick" class="btn btn-warning" style="width:100%; display:none; position:absolute; left:0; bottom:55px; font-size:30px;"><?php echo __('Dock');?></a>
                            
                            <a href="#" id="bCloseJoystickPanel" class="btn btn-primary" data-dismiss="modal" style="width:100%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Close');?></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="modalAutonomousNavigation" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog" role="dialog">
                <div class="modal-content">
                    <div class="modal-header" style="padding-top:0;">
                        <div class="actions" style="min-height:calc(100vh - 100px);">
                           	<div class="row" style=" position:relative;">
                                <div class="" style="height:calc(100vh - 170px);">
                                    <div id="an_container_all" class="" style="position:relative; height:calc(100vh - 170px);">
                                    
                                        <div id="an_zoom_carte_container">
                                            <div id="an_zoom_carte">
                                                <img src="data:image/png;base64,<?php echo $currentMap->image_tri;?>"  class="img-responsive" style="max-width:100%; max-height:100%;" />
                                                <div id="an_zone_zoom" style="position:absolute; border:1px solid #00F;"></div>
                                                <div id="an_zone_zoom_click" style="position:absolute; width:100%; height:100%; top:0; left:0; cursor:pointer;"></div>
                                            </div>
                                        </div>
                                    
                                        <div id="an_all" style="position:relative; margin:auto; width:100%; height:calc(100vh - 100px);">
                                            <div id="an_map_navigation" class="zoom" style="position:relative; width:100%; height:calc(100vh - 100px); margin:auto;">
                                                <svg id="an_svg" width="<?php echo $currentMap->ros_largeur;?>" height="<?php echo $currentMap->ros_hauteur;?>" style="position:absolute; top:0; left:0; width:100%; height:100%;">
                                                    <image id="an_plan" xlink:href="data:image/png;base64,<?php echo $currentMap->image_tri;?>" x="0" y="0" height="<?php echo $currentMap->ros_hauteur;?>" width="<?php echo $currentMap->ros_largeur;?>" />
													<image id="an_robot" style="z-index:20000;" xlink:href="assets/images/robot-dessus-green.png" x="0" y="0" height="10" width="10" />
													<image id="an_robot_dest" style="display:none; z-index:20001;" xlink:href="assets/images/robot-dessus-red-secure.png" x="0" y="0" height="15" width="15" />
                                                </svg>
                                            </div>
                                            <div style="clear:both;"></div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            
                            <a href="#" id="bCloseAutonomousNavigation" class="btn btn-primary" data-dismiss="modal" style="width:100%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Close');?></a>
                            
                            <div id="an_confirm" style="background-color:#FFF; position:absolute; bottom:0; left:0; width:100%; font-size:30px; display:none;">
                            	<div class="col-xs-6" style="line-height:56px;"><?php echo __('Confirm?');?></div>
                                <a href="#" id="an_confirm_no" style=" font-size:30px;" class="col-xs-3 btn btn-danger btn-left" ><i class="fa fa-times"></i></a>
                                <a href="#" id="an_confirm_yes" style=" font-size:30px;" class="col-xs-3 btn btn-success btn-right"><i class="fa fa-check"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        
        <img id="an_plan_fond" src="data:image/png;base64,<?php echo $currentMap->image_tri;?>" style="display:none;" />
        
        <script>
		var lang = '<?php echo $_COOKIE['lang'];?>';
		var robot_host = '<?php echo (file_exists('C:\\'))?'192.168.0.30:9095':'elodie.wyca-solutions.com:9095';?>';
		var user_api_key = '<?php echo $userConnected->api_key;?>';
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
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/joystick.js?v=20200226_10"></script>
        
        <!--
		<script src="<?php echo $_CONFIG['URL_API'];?>extern/roslib.js"></script>
        <script src="<?php echo $_CONFIG['URL_API'];?>webrtc.wyca2.min.js"></script>
        <script src="<?php echo $_CONFIG['URL_API'];?>wyca_api.latest.min.php?api_key=5LGU.LaYMMncJaA0i42HwsX9ZX-RCNgj-9V17ROFXt71st&v=20191127"></script>
        -->
        <script src="<?php echo $_CONFIG['URL_API'];?>wyca_socket_api.js"></script>
        
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/wyca.js?v=20200204"></script>
        
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


		<?php /********* AUTONOMOUS NAV *********/ ?>
        <script>
		var current_id_plan = <?php echo $currentIdPlan;?>;
		var an_isDown = false;
		
		var an_largeurSlam = <?php echo $currentMap->ros_largeur;?>;
		var an_hauteurSlam = <?php echo $currentMap->ros_hauteur;?>;
		var an_largeurRos = <?php echo $currentMap->ros_largeur;?>;
		var an_hauteurRos = <?php echo $currentMap->ros_hauteur;?>;
		
		var an_start = true;
		
		function an_distance(x1, y1, x2, y2)
		{
			return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
		}
		
		
		var an_canvas;
		var an_canvasWidth;
		var an_canvasHeight;
		var an_ctx;
		var an_canvasData;
		var an_zoom = 1.5;
		
		var an_ros_largeur = <?php echo $currentMap->ros_largeur;?>;
		var an_ros_hauteur = <?php echo $currentMap->ros_hauteur;?>;
		var an_ros_resolution = <?php echo $currentMap->ros_resolution;?>;
		
		var an_id_plan = <?php echo $currentMap->id_plan;?>;
		
		var an_positions = Array();
		
		var an_xObject = 0;
		var an_yObject = 0;
		
		var an_zoom_carte = 1;
		
		var an_forbiddens = Array();
		var an_areas = Array();
		var an_docks = Array();
		var an_pois = Array();
		
		<?php 
		$forbiddens = $currentMap->GetForbiddenAreas();
		foreach($forbiddens as $forbidden)
		{
			$forbidden->GetPoints();
			?>an_forbiddens.push(<?php echo json_encode($forbidden);?>);
		<?php
		}
		$areas = $currentMap->GetAreas();
		foreach($areas as $area)
		{
			$area->GetPoints();
			$area->GetConfigs();
			?>an_areas.push(<?php echo json_encode($area);?>);
		<?php
		}
		$docks = $currentMap->GetStationRecharges();
		foreach($docks as $dock)
		{
			?>an_docks.push(<?php echo json_encode($dock);?>);
		<?php
		}
		$pois = $currentMap->GetPois();
		foreach($pois as $poi)
		{
			?>an_pois.push(<?php echo json_encode($poi);?>);
		<?php
		}
		?>
		
		function an_diff(x, y) {
			var centerItem = $('#robotDestination'),Fin
				centerLoc = centerItem.offset();
			var dx = x - (centerLoc.left + (centerItem.width() / 2));
				dy = y - (centerLoc.top + (centerItem.height() / 2));
			return Math.atan2(dy, dx) * (180 / Math.PI);
		}

		</script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/svg-pan-zoom/svg-pan-zoom.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/vendor/svg-pan-zoom/hammer.js"></script>
		<script src="<?php echo $_CONFIG['URL'];?>assets/javascripts/an_map_svg.js?v=20191214"></script>
		
		<script>
		  // Don't use window.onLoad like this in production, because it can only listen to one function.
		  var an_eventsHandler;
		  var an_svg;
		  window.onload = function() {
			
		
			an_eventsHandler = {
			  haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
			, init: function(options) {
				var instance = options.instance
				  , initialScale = 1
				  , pannedX = 0
				  , pannedY = 0
		
				// Init Hammer
				// Listen only for pointer and touch events
				this.hammer = Hammer(options.svgElement, {
				  inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
				})
		
				// Enable pinch
				this.hammer.get('pinch').set({enable: true})
		
				// Handle double tap
				this.hammer.on('doubletap', function(ev){
				  instance.zoomIn()
				})
		
				// Handle pan
				this.hammer.on('panstart panmove', function(ev){
				  // On pan start reset panned variables
				  if (ev.type === 'panstart') {
					pannedX = 0
					pannedY = 0
				  }
		
				  // Pan only the difference
				  instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
				  pannedX = ev.deltaX
				  pannedY = ev.deltaY
				})
		
				// Handle pinch
				this.hammer.on('pinchstart pinchmove', function(ev){
				  // On pinch start remember initial zoom
				  if (ev.type === 'pinchstart') {
					initialScale = instance.getZoom()
					instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
				  }
		
				  instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
				})
				// Prevent moving the page on some devices when panning over SVG
				options.svgElement.addEventListener('touchmove', function(e){ /*e.preventDefault(); */ });
			  }
		
			, destroy: function(){
				this.hammer.destroy()
			  }
			}
		
		  };
		</script>

	</body>
</html>
