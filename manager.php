<?php if (!isset($_SESSION['id_groupe_user']) || $_SESSION['id_groupe_user'] > 3) die('ERROR');?>
<div id="pages_manager" class="global_page <?php echo $_SESSION['id_groupe_user'] == 3?'active':'';?>">
    <section id="manager_dashboard" class="page hmi_tuile  active">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Dashboard');?></h2>
        </header>
        <div class="content">
            <ul class="tuiles row">
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile1" data-goto="manager_edit_map" href="#"><i class="far fa-map"></i><?php echo __('Map');?></a></li>
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile2" data-goto="manager_move" href="#"><i class="fa fa-gamepad"></i><?php echo __('Control robot');?></a></li>
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile3" data-goto="manager_recovery" href="#"><i class="fa fa-search"></i><?php echo __('Recovery');?></a></li>
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile4" data-goto="manager_top" href="#"><i class="fa fa-refresh"></i><?php echo __('Change top');?></a></li>
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile5" data-goto="manager_users" href="#"><i class="fa fa-group"></i><?php echo __('Users');?></a></li>
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile6" href="logout.php"><i class="fas fa-power-off"></i><?php echo __('Logout');?></a></li>
				<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile7 todo" data-goto="manager_help" href="#"><i class="fa fa-question"></i><?php echo __('Help');?></a></li>
            </ul>
        </div>
    </section>
        
    <section id="manager_edit_map" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Map');?></h2>
        </header>
        <div class="content">
                
                <div id="manager_edit_map_container_all">
                    <div id="manager_edit_map_zoom_carte_container">
                        <div id="manager_edit_map_zoom_carte">
                            <img src=""  class="img-responsive" style="max-width:100%; max-height:100%;" />
                            <div id="manager_edit_map_zone_zoom" style="position:absolute; border:1px solid #00F;"></div>
                            <div id="manager_edit_map_zone_zoom_click" style="position:absolute; width:100%; height:100%; top:0; left:0; cursor:pointer;"></div>
                        </div>
                    </div>
                
                    <div id="manager_edit_map_all" style="position:relative; margin:auto; width:100%;">
                        <div id="manager_edit_map_map_navigation" class="zoom" style="position:relative; width:100%; margin:auto; border:1px solid #000;">
                            <svg id="manager_edit_map_svg" width="0" height="0" style="position:absolute; top:0; left:0; width:100%; height:100%;">
                                <image id="manager_edit_map_image" xlink:href="" x="0" y="0" height="0" width="0" />
                            </svg>
                        </div>
                        <div style="clear:both;"></div>
                    </div>
                    
                    <a href="#" id="manager_edit_map_bStop" class="btn btn-circle btn-danger btn-lg"><i class="fa fa-stop"></i></a>
                    <a href="#" id="manager_edit_map_bSaveCurrentElem" class="btn btn-circle btn-primary btn-lg"><i class="fa fa-check"></i></a>
                    <a href="#" id="manager_edit_map_bCancelCurrentElem" class="btn btn-circle btn-warning btn-lg"><i class="fa fa-times"></i></a>
                    
                    <a href="#" id="manager_edit_map_bManagerUndo" class="btn btn-default btn-circle disabled" style="position:absolute; bottom:40px; left:10px;"><i class="fa fa-mail-reply"></i></a>
                    <a href="#" id="manager_edit_map_bManagerRedo" class="btn btn-default btn-circle disabled" style="position:absolute; bottom:40px; left:45px;"><i class="fa fa-mail-forward"></i></a>
                    
                    <div id="manager_edit_map_menu" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bAddPOI"><i class="fa fa-map-marker"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bMoveTo"><i class="fa fa-crosshairs"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bMove" data-toggle="modal" data-target="#manager_edit_map_modalTeleop"><i class="fa fa-gamepad"></i></a></li>
                        </ul>
                    </div>
                    
                    <div id="manager_edit_map_menu_dock" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg" data-toggle="modal" data-target="#manager_edit_map_modalDoSaveBeforeTestDock"><i class="fa fa-check"></i></a></li>
                        </ul>
                    </div>
                    <div id="manager_edit_map_menu_poi" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bDeletePoi"><i class="fa fa-trash"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg" data-toggle="modal" data-target="#manager_edit_map_modalDoSaveBeforeTestPoi"><i class="fa fa-check"></i></a></li>
                        </ul>
                    </div>
                    <div id="manager_edit_map_menu_augmented_pose" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg" data-toggle="modal" data-target="#manager_edit_map_modalDoSaveBeforeTestAugmentedPose"><i class="fa fa-check"></i></a></li>
                        </ul>
                    </div>
                    
                    <div id="manager_edit_map_modalTeleop" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center;">
                                            
                                            <div style="height:60px;"></div>
                                            
                                            <a href="#" class="bUndock btn btn-primary btn_big_popup ifDocked"><i class="fa fa-upload"></i> <?php echo __('Undock robot');?></a>
                                        
                                        	<div class="ifUndocked">
                                                
                                                <div style="text-align:center; width:100%; z-index:2000; margin-top:50px;">
                                                    <div class="joystickDiv" draggable="false" style="margin:auto;">
                                                        <div class="fond"></div>
                                                        <div class="curseur"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" class="btn btn-default btn_footer_left btn_100" data-dismiss="modal"><?php echo __('Close');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal fade modalFinTest" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto">
                                            
                                            <section class="panel panel-success">
                                                <header class="panel-heading">
                                                    <h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fa fa-thumbs-up"></i></h2>
                                                </header>
                                                <div class="panel-body" style="text-align:center; font-size:24px; line-height:36px;">
                                                    <strong>Congratulations !</strong><br />
                                                    No error during action.
                                                </div>
                                            </section>
                                            <section class="panel panel-danger">
                                                <header class="panel-heading">
                                                    <h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fa fa-remove"></i></h2>
                                                </header>
                                                <div class="panel-body" style="text-align:center; font-size:24px; line-height:36px;">
                                                    <strong>Error !</strong><br />
                                                    <span class="error_details"></span>
                                                </div>
                                            </section>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" class="btn btn-default btn_footer_left btn_100" data-dismiss="modal" ><?php echo __('Close');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="manager_edit_map_modalDoSaveBeforeTestDock" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                            
                                            <h3 style="color:#F90; padding-bottom:20px;">&nbsp;</h3>
                                            
                                            <div class="row" style="margin-top:30px;">
                                                <div class="col-xs-8">
                                                    <span style="font-size:16px; color:#F90; padding-bottom:20px;"><?php echo __('Remember to save the map before launching a test');?></span>
                                                </div>
                                                <div class="col-xs-4">
                                                    <a href="#" class="btn btn-primary bSaveMapTestDock" style="margin-top:7px;"><?php echo __('Save map');?> <i class="fa"></i></a>
                                                </div>
                                            </div>
                                            
                                            
                                            <div class="row" style="margin-top:30px;">
                                                <div class="col-xs-8">
                                                    <span style="font-size:16px; padding-bottom:20px;"><?php echo __('You can change the position of the robot before the test');?></span>
                                                </div>
                                                <div class="col-xs-4">
                                                    <a href="#" class="btn btn-primary bMoveRobotTest" style="margin-top:7px;"><?php echo __('Move robot');?></a>
                                                </div>
                                            </div>
                                            
                                            <div class="teleop" style="display:none; margin-top:30px;">
                                                <a href="#" class="bUndock btn btn-primary btn_big_popup ifDocked"><i class="fa fa-upload"></i> <?php echo __('Undock robot');?></a>
                                            
                                                <div class="ifUndocked">
                                                    
                                                    <div style="text-align:center; width:100%; z-index:2000; margin-top:50px;">
                                                        <div class="joystickDiv" draggable="false" style="margin:auto;">
                                                            <div class="fond"></div>
                                                            <div class="curseur"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" class="btn btn-default btn_footer_left btn_50 bInitModalTest" data-dismiss="modal" ><?php echo __('Cancel');?></a>
                                        <a href="#" class="btn btn-primary bInitModalTest bTestDock btn_footer_right btn_50" data-dismiss="modal" ><?php echo __('Continue');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="manager_edit_map_modalDoSaveBeforeTestPoi" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                            
                                            <div class="row" style="margin-top:30px;">
                                                <div class="col-xs-8">
                                                    <span style="font-size:16px; color:#F90; padding-bottom:20px;"><?php echo __('Remember to save the map before launching a test');?></span>
                                                </div>
                                                <div class="col-xs-4">
                                                    <a href="#" class="btn btn-primary bSaveMapTestPoi" style="margin-top:7px;"><?php echo __('Save map');?> <i class="fa"></i></a>
                                                </div>
                                            </div>
                                            
                                            
                                            <div class="row" style="margin-top:30px;">
                                                <div class="col-xs-8">
                                                    <span style="font-size:16px; padding-bottom:20px;"><?php echo __('You can change the position of the robot before the test');?></span>
                                                </div>
                                                <div class="col-xs-4">
                                                    <a href="#" class="btn btn-primary bMoveRobotTest" style="margin-top:7px;"><?php echo __('Move robot');?></a>
                                                </div>
                                            </div>
                                            
                                            <div class="teleop" style="display:none; margin-top:30px;">
                                                <a href="#" class="bUndock btn btn-primary btn_big_popup ifDocked"><i class="fa fa-upload"></i> <?php echo __('Undock robot');?></a>
                                            
                                                <div class="ifUndocked">
                                                    
                                                    <div style="text-align:center; width:100%; z-index:2000; margin-top:50px;">
                                                        <div class="joystickDiv" draggable="false" style="margin:auto;">
                                                            <div class="fond"></div>
                                                            <div class="curseur"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" class="btn btn-default btn_footer_left btn_50 bInitModalTest" data-dismiss="modal"><?php echo __('Cancel');?></a>
                                        <a href="#" class="btn btn-primary bInitModalTest bTestPoi btn_footer_right btn_50" data-dismiss="modal"><?php echo __('Continue');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="manager_edit_map_modalDoSaveBeforeTestAugmentedPose" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                            
                                            <div class="row" style="margin-top:30px;">
                                                <div class="col-xs-8">
                                                    <span style="font-size:16px; padding-bottom:20px;"><?php echo __('You can change the position of the robot before the test');?></span>
                                                </div>
                                                <div class="col-xs-4">
                                                    <a href="#" class="btn btn-primary bMoveRobotTest" style="margin-top:7px;"><?php echo __('Move robot');?></a>
                                                </div>
                                            </div>
                                            
                                            <div class="teleop" style="display:none; margin-top:30px;">
                                                <a href="#" class="bUndock btn btn-primary btn_big_popup ifDocked"><i class="fa fa-upload"></i> <?php echo __('Undock robot');?></a>
                                            
                                                <div class="ifUndocked">
                                                    
                                                    <div style="text-align:center; width:100%; z-index:2000; margin-top:50px;">
                                                        <div class="joystickDiv" draggable="false" style="margin:auto;">
                                                            <div class="fond"></div>
                                                            <div class="curseur"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" class="btn btn-default btn_footer_left btn_50 bInitModalTest" data-dismiss="modal"><?php echo __('Cancel');?></a>
                                        <a href="#" class="btn btn-primary bInitModalTest bTestAugmentedPose btn_footer_right btn_50" data-dismiss="modal" ><?php echo __('Continue');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                                        
                    <div class="modal fade modalAddPoi" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                        
                                        	<a href="#" class="bUndock btn btn-primary btn_big_popup ifDocked"><i class="fa fa-upload"></i> <?php echo __('Undock robot');?></a>
                                        
                                        	<div class="ifUndocked">
                                                
                                                <div style="color:#CC0000;">
                                                    <p><?php echo stripslashes(__('Move the robot at the final position desired and click on the "Add POI" button'));?></p>
                                                </div>                                                
                                                <p><a href="#" class="btn btn-primary bAddPoiAtCurrentPose">Add POI </a></p>
                                                
                                                <div style="position:absolute; bottom:50px; left:0; width:100%; z-index:2000;">
                                                    <div class="joystickDiv" draggable="false" style="margin:auto;">
                                                        <div class="fond"></div>
                                                        <div class="curseur"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" class="btn btn-default btn_footer_left btn_100" data-dismiss="modal" style="width:100%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal fade modalPoiOptions" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                        
                                        	<form>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label">Name</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" id="manager_edit_map_poi_name" name="poi_name" value="" class="form-control input-sm mb-md" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label">Comment</label>
                                                    <div class="col-xs-8">
                                                        <textarea id="manager_edit_map_poi_comment" name="poi_comment" class="form-control input-sm mb-md"></textarea>
                                                    </div>
                                                </div>
                                            </form>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        
                                        <a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal"><?php echo __('Cancel');?></a>
										<a href="#" id="manager_edit_map_bPoiSaveConfig" class="btn btn-primary btn_footer_right btn_50" data-dismiss="modal" ><?php echo __('Save');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="popupHelp">
                    	<h2>Help</h2>
                    	<ul style="color:#000;">
                        	<li><i class="fa fa-map-marker"></i><span class="description">Add POI</span></li>
                        	<li><i class="fa fa-crosshairs"></i><span class="description">Move the robot to this point</span></li>
                        	<li><i class="fa fa-gamepad"></i><span class="description">Teleop the robot</span></li>
                        	<li><i class="fa fa-check"></i><span class="description">Test go to POI or dock</span></li>
                        	<li><span style="display:inline-block; margin-right:25px; width:15px; height:15px; border-radius:100%; background-color:#009900;"></span><span class="description">Robot position</span></li>
                        </ul>
                        
                        <p>Click to hide</p>
                    </div>
                    
                    
                </div>
                
                <div id="manager_edit_map_zoom_popup" style="position:absolute; top:20px; left:20px; width:101px; height:101px; border:1px solid #000; overflow:hidden; display:none; z-index:8000;">
                    <div id="manager_edit_map_zoom_popup_content" style="position:absolute; top:0; height:0;"></div>
                    <div id="manager_edit_map_zoom_popup_mire" style="position:absolute; width:101px; height:101px; top:0; left:0; background-image:url(assets/images/mire.png);"></div>
                </div>
            </div>
        <footer>
            <a href="#" class="btn btn-default button_goto btn_footer_left btn_50" data-goto="manager_dashboard"><?php echo __('Back');?></a>
            <a href="#" class="btn btn-success bSaveEditMap btn_footer_right btn_50" ><?php echo __('Save map');?></a>
        </footer>
    </section>
        
    <section id="manager_move" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Control robot');?></h2>
        </header>
        <div class="content" style="text-align:center;">
			<h4 style="text-align:center;margin-bottom:30px"><?= __('Move the robot using the joystick.') ?></h4>    
			<a href="#" class="bUndock btn btn-primary btn_big_popup ifDocked"><i class="fa fa-upload"></i> <?php echo __('Undock robot');?></a>
									
			<div class="ifUndocked">
				
				<div style="text-align:center; width:100%; z-index:2000; margin-top:50px;">
					<div class="joystickDiv" draggable="false" style="margin:auto;">
						<div class="fond"></div>
						<div class="curseur"></div>
					</div>
				</div>
			</div>
		</div>
        <footer>
            <a href="#" class="btn btn-default button_goto btn_footer_left btn_100" data-goto="manager_dashboard"><?php echo __('Back');?></a>
        </footer>
    </section>
        
    <section id="manager_top" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Seclect active top');?></h2>
        </header>
        <div class="content">
            	<div class="manager_top_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
				<h5 class="text-center" style="margin-bottom:30px;"><?= _('Please select the active top for the vehicle.') ?></h5>
                <ul class="tuiles row">
                </ul>
                
                <div style="clear:both; height:20px;"></div>
                
                <div class="modal fade modalSetActiveTop" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                    <div class="modal-dialog" role="dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="actions mh100vh_55">
                                    
                                    <div class="h100vh_160" style="overflow:auto">
                                        <div class="progressSetActiveTop" style="display:none;">
                                            <h4 style="text-align:center;margin-bottom:20px"><?php echo __('Setting new active top');?></h4>
                                            <div class="setActiveTopProgress progress progress-striped light active m-md">
                                                <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;">
                                                </div>
                                            </div>
                                        </div>
			                                    
            	                        <div style="clear:both;"></div>
                					</div>                   
                                    <a href="#" class="btn btn-primary" data-dismiss="modal" style="width:100%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Close');?></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        <footer>
            <a href="#" class="btn btn-default button_goto btn_footer_left btn_100" data-goto="manager_dashboard"><?php echo __('Back');?></a>
        </footer>
    </section>
        
    <section id="manager_recovery" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Recovery');?></h2>
        </header>
        <div class="content">
            
			<h4 style="text-align:center"><?= __('Move the robot near a reflector (dock or augmented pose) then click on the recovery button') ?></h4>
			<div style="text-align:center; margin-top:20px;"><a href="#" class="bRecovery btn btn-warning btn_big_popup "><?= _('Recovery') ?></a></div>
			
		
			<div style="text-align:center"><a href="#" class="bUndock btn btn-primary btn_big_popup ifDocked"><i class="fa fa-upload"></i> <?php echo __('Undock robot');?></a></div>
									
			<div class="ifUndocked">
				
				<div style="text-align:center; width:100%; z-index:2000; margin-top:20px;">
					<div class="joystickDiv" draggable="false" style="margin:auto;">
						<div class="fond"></div>
						<div class="curseur"></div>
					</div>
				</div>
			</div>
		</div>
        <footer>
            <a href="#" class="btn btn-default button_goto btn_footer_left btn_100" data-goto="manager_dashboard"><?php echo __('Back');?></a>
        </footer>
    </section>
        
    <section id="manager_users" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Users');?></h2>
        </header>
        <div class="content">
                
			<div class="manager_users_loading loading_big" style="padding-top:50px;"><i class="fa fa fa-spinner fa-pulse"></i></div>
			
			<div class="loaded col-md-12" style="padding-top:30px;">
				<ul class="tuiles row bAddUserTuile" style="margin-bottom:30px;">
					<li class="col-xs-6" style="margin-left: 25%;">
						<div class="is_checkbox tuile_img no_update bAddUser" style="height:max-content;bottom:0;border-radius:10px">
							<i class="fas fa-user-plus" style="padding-top:5px"></i>
							<h4 class="" style="margin-top: 0px;font-weight:700;font-size: 15px;"><?php echo __('Create user');?></h4>
						</div>
					</li>
				</ul>
				
				<a href="#" class="bAddUser btn btn-primary"><?= ('Add an account') ?></a>
				<ul class="list_users list_elem">
				</ul>
				
				<div class="modal fade modalUser" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto">
										<form>
											<input type="hidden" name="i_id_user" id="manager_users_i_id_user" value="-1" />
											<div class="form-group">
												<label class="col-xs-12 col-md-3 control-label" for="societe"><?php echo __('Company');?></label>
												<div class="col-xs-12 col-md-6">
													<input id="manager_users_i_user_societe" name="societe" type="text" class="form-control">
												</div>
											</div>
											<div class="form-group">
												<label class="col-xs-12 col-md-3 control-label" for="prenom"><?php echo __('Firstname');?></label>
												<div class="col-xs-12 col-md-6">
													<input id="manager_users_i_user_prenom" name="prenom" type="text" class="form-control">
												</div>
											</div>
											<div class="form-group">
												<label class="col-xs-12 col-md-3 control-label" for="nom"><?php echo __('Lastname');?></label>
												<div class="col-xs-12 col-md-6">
													<input id="manager_users_i_user_nom" name="nom" type="text" class="form-control">
												</div>
											</div>
											<div class="form-group nopymy">
												<label class="col-xs-12 col-md-3 control-label" for="email"><?php echo __('Email');?></label>
												<div class="col-xs-12 col-md-6 input-group input-group-icon">
													<input id="manager_users_i_user_email" name="email"  pattern="[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}" type="text" class="form-control">
													<span class="input-group-addon">
														<span class="icon icon-lg">
															<i class="fas fa-at"></i>
														</span>
													</span>
												</div>
											</div>
											<p class="password_format" style="margin-bottom:0"><?= _('A valid mail adress.')?> </p>
											<div class="form-group nopymy">
												<label class="col-xs-12 col-md-3 control-label" for="password"><?php echo __('Password');?></label>
												<div class="col-xs-12 col-md-6 input-group input-group-icon">
													<input id="manager_users_i_user_password" name="password" type="password" class="form-control" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?\/~_+\-=|0-9]).{8,}$">
													<span class="input-group-addon">
														<span class="icon icon-lg">
															<i class="fa fa-lock"></i>
														</span>
													</span>
												</div>
											</div>
											<p class="password_format"><?= _('8 characters, lower and uppercase, digit or special char.')?> </p>
											<div class="form-group">
												<label class="col-xs-12 col-md-3 control-label" for="cpassword"><?php echo __('Confirm password');?></label>
												<div class="col-xs-12 col-md-6 input-group input-group-icon">
													<input id="manager_users_i_user_cpassword" name="cpassword" type="password" class="form-control" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?\/~_+\-=|0-9]).{8,}$">
													<span class="input-group-addon">
														<span class="icon icon-lg">
															<i class="fa fa-lock"></i>
														</span>
													</span>
												</div>
											</div>
											<p class="password_format"><?= _('8 characters, lower and uppercase, digit or special char.')?> </p>
										</form>
									</div>
									
									<div style="clear:both;"></div>
								   
								   
									<a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Cancel');?></a>
									<a href="#" id="manager_users_bUserSave" class="btn btn-primary btn_footer_right btn_50"><?php echo __('Save');?></a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
        <footer>
            <a href="#" class="btn btn-default btn_footer_left btn_100 button_goto" data-goto="manager_dashboard"><?php echo __('Back');?></a>
        </footer>
    </section>
        
    <section id="manager_help" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Help');?></h2>
        </header>
        <div class="content">
            <h4 style="text-align:center"><?php echo __('Comming soon');?></h4>
        </div>
        <footer>
            <a href="#" class="btn btn-default btn_footer_left btn_100 button_goto" data-goto="manager_dashboard"><?php echo __('Back');?></a>
        </footer>
    </section>
</div>

