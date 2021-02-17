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
				<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile5" data-goto="manager_setup_sites" href="#"><i class="fa fa-building"></i><?php echo __('Sites');?></a></li>
                <!-- <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile6" data-goto="manager_users" href="#"><i class="fa fa-group"></i><?php echo __('Users');?></a></li> -->
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile6" href="logout.php"><i class="fas fa-power-off"></i><?php echo __('Logout');?></a></li>
				<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile7 todo" data-goto="manager_help" href="#"><i class="fa fa-question"></i><?php echo __('Help');?></a></li>
            </ul>
			<div class="popupHelp">
				<h2><?=__('Help')?></h2>
				<div class="content sm-content text-left">
					<p class=""><?= __('This dashboard display all available functionalities for a manager.')?></p>
					<p class=""><?= __('Use Logout button to log out of the app')?></p>
				</div>
				<p class="legende"><?=__('Click to hide')?></p>
			</div>
        </div>
    </section>
        
    <section id="manager_edit_map" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Map');?></h2>
        </header>
        <div class="content">
			<div id="manager_edit_map_container_all">
				<div class="btn-circle btn-lg burger_menu" data-open="manager_edit_map_menu">
					<div class="burger_menu_trait"></div>
					<div class="burger_menu_trait"></div>
					<div class="burger_menu_trait"></div>
				</div>
				
				<i class="fas fa-times times_icon_menu iconMenuRed"></i>
				<div class="btn-circle btn-lg icon_menu" data-menu="manager_edit_map_menu_gotopose">
					<i class="fa fa-crosshairs iconMenuBlue" style="left: -7px;"></i>
				</div>
				<div class="btn-circle btn-lg icon_menu" data-menu="manager_edit_map_menu_poi">
					<i class="fa fa-map-marker-alt iconMenuBlue"></i>
				</div>
				
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
				
				<a href="#" id="manager_edit_map_bStop" class="btn btn-circle btn-danger btn-menu"><i class="fa fa-stop"></i></a>
				<a href="#" id="manager_edit_map_bSaveCurrentElem" class="btn btn-circle btn-primary btn-menu"><i class="fa fa-check"></i></a>
				<a href="#" id="manager_edit_map_bCancelCurrentElem" class="btn btn-circle btn-warning btn-menu"><i class="fa fa-times"></i></a>
				
				<a href="#" id="manager_edit_map_bUndo" class="btn btn-default btn-circle disabled" style="position:absolute; bottom:20px; left:10px;"><i class="fas fa-undo-alt"></i></a>
				<a href="#" id="manager_edit_map_bRedo" class="btn btn-default btn-circle disabled" style="position:absolute; bottom:20px; left:45px;"><i class="fas fa-redo-alt"></i></a>
				
				<div id="manager_edit_map_menu" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
					<ul>
						<li><a href="#" class="btn btn-circle btn-default bAddPOI btn-menu" data-orientation="V">
							<i class="fa fa-map-marker-alt iconMenuBlue"></i>
						</a></li>
						<li><a href="#" class="btn btn-circle btn-default bMoveTo btn-menu" data-orientation="H">
							<i class="fa fa-crosshairs iconMenuBlue" style="font-size:24px"></i>
						</a></li>
						<li><a href="#" class="btn btn-circle btn-default bMove btn-menu" data-orientation="H" data-toggle="modal" data-target="#manager_edit_map_modalTeleop">
							<i class="fa fa-gamepad iconMenuPurple"></i>
						</a></li>
					</ul>
				</div>
				
				<div id="manager_edit_map_menu_dock" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
					<ul>
						<li><a href="#" class="btn btn-circle btn-default btn-menu bTestDock" ><img class="fi-route" src="assets/images/route_green.svg"/></a></li>
					</ul>
				</div>
				
				<div id="manager_edit_map_menu_poi" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
					<ul>
						<li><a href="#" class="btn btn-circle btn-default btn-menu bTestPoi"><img class="fi-route" src="assets/images/route_green.svg"/></a></li>
						<li><a href="#" class="btn btn-circle btn-default btn-menu bConfigPoi"><i class="fa fa-gears iconMenuBlue"></i></a></li>
						<li><a href="#" class="btn btn-circle btn-default btn-menu bDeletePoi"><i class="fa fa-trash iconMenuRed"></i></a></li>
					</ul>
				</div>
				
				<div id="manager_edit_map_menu_augmented_pose" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
					<ul>
						<li><a href="#" class="btn btn-circle btn-default btn-menu bTestAugmentedPose"><img class="fi-route" src="assets/images/route_green.svg"/></a></li>
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
										<div class="btn_big_popup ifDocking ifUndocking"><i class="fa fa fa-spinner fa-pulse"></i></div>
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
								   
									<a href="#" class="btn btn-primary btn_footer_left btn_100" data-dismiss="modal"><?php echo __('Close');?></a>
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
												<h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fas fa-info"></i></h2>
											</header>
											<div class="panel-body" style="text-align:center; font-size:24px; line-height:36px;">
												<strong><?=__('Action finished !') ?></strong><br />
												<?=__('No error during action.') ?>
											</div>
										</section>
										<section class="panel panel-danger">
											<header class="panel-heading">
												<h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fa fa-remove"></i></h2>
											</header>
											<div class="panel-body" style="text-align:center; font-size:24px; line-height:36px;">
												<strong><?=__('Error !') ?></strong><br />
												<span class="error_details"></span>
											</div>
										</section>
										<section class="panel panel-warning">
											<header class="panel-heading">
												<h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fas fa-exclamation-triangle"></i></h2>
											</header>
											<div class="panel-body" style="text-align:center; font-size:24px; line-height:36px;">
												<strong><?=__('Warning !') ?></strong><br />
												<span class="error_details"></span>
											</div>
										</section>
									</div>
									
									<div style="clear:both;"></div>
								   
									<a href="#" class="btn btn-primary btn_footer_left btn_100" data-dismiss="modal" ><?php echo __('Close');?></a>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div id="manager_edit_map_modalGoToDock" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto; text-align:center;">
										<h2 class="h2ModalGoTo">
											<?=__('Go to Dock ?') ?>
											<div class="btn-circle btn-lg btn-popup">
												<i class="fas fa-charging-station iconMenuGreen" style="position: relative;top: -10px;left: -5px;"></i>
											</div>
										</h2>
										<h4 class="h4ModalGoTo"><?=__('Do you want to send the vehicle to this docking station ?') ?></h4>
										
										<h5 class="h5ModalGoTo">
											<?=__('Click on the stop icon to cancel action while the vehicle is moving.') ?>
										</h5>
										
										<div class="checkbox checkbox_wrapper" style="display:none">
											<label>
												<input type="checkbox" value="" class="checkboxGotodock">
												<?=__('Don\'t show this message again')?>
											</label>
										</div>
										<a href="#" class="btn btn-default btn_footer_left btn_50 bModalCancelGoToDock" data-dismiss="modal" ><?php echo __('Cancel');?></a>
										<a href="#" class="btn btn-primary btn_footer_right btn_50 bModalGoToDock" data-dismiss="modal" ><?php echo __('Go');?></a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div id="manager_edit_map_modalGoToAugmentedPose" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto; text-align:center;">
										<h2 class="h2ModalGoTo">
											<?=__('Go to Augmented Pose ?') ?>
											<div class="btn-circle btn-lg btn-popup">
												<div class="iconAugmentedPose" style="top: -15px;left: -10px;"><i class="fas fa-map-marker-alt iconMenuPurple"></i><i class="fas fa-barcode"></i></div>
											</div>
										</h2>
										<h4 class="h4ModalGoTo"><?=__('Do you want to send the vehicle to this augmented pose ?') ?></h4>
										
										<h5 class="h5ModalGoTo">
											<?=__('Click on the stop icon to cancel action while the vehicle is moving.') ?>
										</h5>
										
										<div class="checkbox checkbox_wrapper" style="display:none">
											<label>
												<input type="checkbox" value="" class="checkboxGotoaugmentedpose">
												<?=__('Don\'t show this message again')?>
											</label>
										</div>
										<a href="#" class="btn btn-default btn_footer_left btn_50 bModalCancelGoToAugmentedPose" data-dismiss="modal" ><?php echo __('Cancel');?></a>
										<a href="#" class="btn btn-primary btn_footer_right btn_50 bModalGoToAugmentedPose" data-dismiss="modal" ><?php echo __('Go');?></a>
									</div>
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
										<h4><?=__('Saving map before testing')?></h4>
										<span id="start_point_text"></span>
										<div class="row" style="margin: 0;">
											<div class="col-xs-3">
												
											</div>
											<div class="col-xs-6 SaveBeforeTestPoiProgress progress progress-striped light active m-md" style="margin: 6px 0;padding:0">
												<div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div>
											</div>
											<div class="col-xs-3">
												
											</div>														
										</div>
										
									</div>
									<div style="clear:both;"></div>
									<a href="#" class="btn btn-default btn_footer_right btn_100 bCancelTestPoi" data-dismiss="modal"><?php echo __('Cancel');?></a>
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
										<div class="btn_big_popup ifDocking ifUndocking"><i class="fa fa fa-spinner fa-pulse"></i></div>
										<div class="ifUndocked">
										
											<div class ="modal-advice">
												<p><?php echo stripslashes(__('Move the robot at the final position desired and click on the "Add POI" button'));?></p>
											</div>                                                
											
											<div style="position:absolute; bottom:50px; left:0; width:100%; z-index:2000;">
												<div class="joystickDiv" draggable="false" style="margin:auto;">
													<div class="fond"></div>
													<div class="curseur"></div>
												</div>
											</div>
										</div>
									</div>
									
									<div style="clear:both;"></div>
								   
									<a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal"><?php echo __('Cancel');?></a>
									<a href="#" id="manager_edit_map_bModalAddPoiSave" class="btn btn-primary btn_footer_right btn_50 ifDocked_disabled"><?php echo __('Add POI');?></a>
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
												<label class="col-xs-4 control-label"><?=__('Name')?></label>
												<div class="col-xs-8">
													<input type="text" id="manager_edit_map_poi_name" name="poi_name" value="" class="form-control input-sm mb-md" />
												</div>
											</div>
											<div class="form-group">
												<label class="col-xs-4 control-label"><?=__('Comment')?></label>
												<div class="col-xs-8">
													<textarea id="manager_edit_map_poi_comment" name="poi_comment" class="form-control input-sm mb-md"></textarea>
												</div>
											</div>
										</form>
										
									</div>
									
									<div style="clear:both;"></div>
									<a href="#" id="manager_edit_map_bPoiCancelConfig" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal"><?php echo __('Cancel');?></a>
									<a href="#" id="manager_edit_map_bPoiSaveConfig" class="btn btn-primary btn_footer_right btn_50"><?php echo __('Save');?></a>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="modal fade modalHelpClickGotoPose" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto; text-align:center;">
										<h2><?=__('Go to position') ?></h2>
										<h4 style="text-align:left;margin:30px 0;"><?=__('Click on the map to choose the position you\'re aiming for.') ?></h4>
										<h4 style="text-align:justify;margin:30px 0;"><?=__('Click on the menu icon to cancel.') ?></h4>
										<div class="btn-circle btn-lg btn-popup" style="display: block;">
											<i class="fas fa-crosshairs iconMenuBlue"></i>
											<i class="fas fa-times times_icon iconMenuRed" style="display: inline-block;"></i>
										</div>
										<h4 style="text-align:justify;margin:30px 0;"><?=__('Click on the stop icon to cancel action while the vehicle is moving.') ?></h4>
										
										<div class="btn-circle btn-lg btn-popup btn-danger" style="display: block;">
											<i class="fa fa-stop"></i>
										</div>
										<div style="clear:both;"></div>
										<div class="checkbox checkbox_wrapper">
											<label>
												<input type="checkbox" value="" class="checkboxHelpGotopose">
												<?=__('Don\'t show this message again')?>
											</label>
										</div>
										<a href="#" class="btn btn-primary btn_footer_left btn_100 bHelpClickGotoPoseOk" data-dismiss="modal" ><?php echo __('Ok');?></a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			
				<div class="modal fade modalReloadMap" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto; text-align:center">
										<i class="far fa-map fa-5x" style="margin:20px 0;position:relative">
											<!--<i class="fas fa-asterisk fa-2x" style="position: absolute;font-size: 16px;color: #343434;top:-8px;right: -9px;"></i>-->
										</i>
										<h4 style="margin:20px 0"><?= __('The map has been modified externally.')?></h4>
										<h4 style="margin:20px 0"><?= __('Would you like to reload it?')?></h4>
										<h4 style="margin:20px 0"><?= __('This will prevent you from losing changes that have been made.')?></h4>
										<div class="manager_edit_map_modalReloadMap_loading loading_big" style="margin-top: 50px;"><i class="fa fa fa-spinner fa-pulse fa-2x"></i></div>
									</div>
									
									<div style="clear:both;"></div>
									
									<a href="#" id="manager_edit_map_bAbortReloadMap" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('No');?></a> 
									<a href="#" id="" class="btn btn-primary btn_footer_right btn_50 manager_edit_map_bReloadMap"><?php echo __('Reload Map');?></a>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="modal fade modalConfirmNoReloadMap" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto; text-align:center">
										<i class="fas fa-sync-alt fa-5x" style="margin:20px 0;position:relative">
											<!--<i class="fas fa-asterisk fa-2x" style="position: absolute;font-size: 16px;color: #343434;top:-8px;right: -9px;"></i>-->
										</i>
										<h4 style="margin:20px 0"><?= __('Are you sure ?')?></h4>
										<h4 style="margin:20px 0"><?= __('If you choose to keep your map,')?></h4>
										<h4 style="margin:20px 0"><?= __('You may loose some modifications perfomed on the map by overwriting changes that have been made.')?></h4>
										<div class="manager_edit_map_modalReloadMap_loading loading_big" style="margin-top: 50px;"><i class="fa fa fa-spinner fa-pulse fa-2x"></i></div>
									</div>
									
									<div style="clear:both;"></div>
									
									<a href="#" class="btn btn-warning btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Yes');?></a> 
									<a href="#" class="btn btn-primary btn_footer_right btn_50 manager_edit_map_bReloadMap"><?php echo __('Reload Map');?></a>
								</div>
							</div>
						</div>
					</div>
				</div>
                    
				<div class="manager_edit_map_loading loading_big loading_map"><i class="fa fa fa-spinner fa-pulse fa-3x"></i></div>
			</div>
			<div id="manager_edit_map_zoom_popup" style="position:absolute; top:20px; left:20px; width:101px; height:101px; border:1px solid #000; overflow:hidden; display:none; z-index:8000;">
				<div id="manager_edit_map_zoom_popup_content" style="position:absolute; top:0; height:0;"></div>
				<div id="manager_edit_map_zoom_popup_mire" style="position:absolute; width:101px; height:101px; top:0; left:0; background-image:url(assets/images/mire.png);"></div>
			</div>
			
			<div class="popupHelp">
				<h2><?=__('Help')?></h2>
				<ul style="color:#000;">
					<li><i class="fa fa-map-marker-alt iconMenuBlue"></i><span class="description"><?=__('Add POI')?></span></li>
					<li><i class="fa fa-crosshairs iconMenuBlue"></i><span class="description"><?=__('Move the robot to this point')?></span></li>
					<li><i class="fa fa-gamepad iconMenuPurple"></i><span class="description"><?=__('Teleop the robot')?></span></li>
					<li style="position:relative;font-size:16px"><img class="route" src="assets/images/route_green.svg"/><span class="description" style="margin-left: 40px;position: relative;top: 3px;"><?=__('Test go to POI, dock or augmented pose')?></span></li>
					<li style="position:relative;">
					<svg class="svg_popupHelp_robot" xmlns="http://www.w3.org/2000/svg">
						<circle cx="20" cy="20" r="12" class="robot_elem robot_elem_fond"></circle>
						<polyline points="16 16 24 20 16 24" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linejoin="round" stroke-linecap="round" class="robot_elem" transform="rotate(-90,20,20)"></polyline>
					</svg>
					<span class="description" style="margin-left: 40px;"><?=__('Robot position')?></span></li>
				</ul>
				<p class="legende"><?=__('Click to hide')?></p>
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
			<div class="btn_big_popup ifDocking ifUndocking"><i class="fa fa fa-spinner fa-pulse"></i></div>
			<div class="ifUndocked">
				
				<div style="text-align:center; width:100%; z-index:2000; margin-top:50px;">
					<div class="joystickDiv" draggable="false" style="margin:auto;">
						<div class="fond"></div>
						<div class="curseur"></div>
					</div>
				</div>
			</div>
			<div class="popupHelp">
				<h2><?=__('Help')?></h2>
				<div class="content sm-content text-left">
					<p><?= __('This page allows you to control the robot using the virtual joystick.')?></p>
					<p><?= __('If the robot is docked on a docking station or on an augmented position, the joystick will be hidden and an Undock button will be present to allow you to undock the robot.')?></p>	
				</div>
				<p class="legende"><?=__('Click to hide')?></p>
			</div>
		</div>
        <footer>
            <a href="#" class="btn btn-default button_goto btn_footer_left btn_100" data-goto="manager_dashboard"><?php echo __('Back');?></a>
        </footer>
    </section>
        
    <section id="manager_top" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Select active top');?></h2>
        </header>
        <div class="content">
			<div class="manager_top_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
			<h5 class="text-center" style="margin-bottom:30px;"><?=__('Please select the active top for the vehicle.') ?></h5>
			<ul class="tuiles row">
			</ul>
			
			<div style="clear:both; height:20px;"></div>
			
			<div class="modal fade modalSetActiveTop" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
				<div class="modal-dialog" role="dialog">
					<div class="modal-content">
						<div class="modal-header">
							<div class="actions mh100vh_55">
								
								<div class="h100vh_160" style="overflow:auto">
									<div class="progressSetActiveTop">
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
			<div class="popupHelp">
				<h2><?=__('Help')?></h2>
				<div class="content text-left">
					<p><?= __('Please select active top by clicking on it. That will indicate to the vehicle that its current top on it is the one you picked.')?></p>
					
				</div>
				<p class="legende"><?=__('Click to hide')?></p>
			</div>
		</div>
        <footer>
            <a href="#" class="btn btn-default button_goto btn_footer_left btn_100" data-goto="manager_dashboard"><?php echo __('Back');?></a>
        </footer>
    </section>
    
	<section id="manager_setup_sites" class="page with_footer">
		<a href="#" class="bBackButton button_goto" data-goto="manager_dashboard"></a>
		<header>
			<div class="pull-left"><img src="assets/images/logo.png" /></div>
			<h2><?php echo __('Sites');?></h2>
		</header>
		<div class="content">
			
			<div class="manager_setup_sites_loading loading_big" style="padding-top:50px;"><i class="fa fa fa-spinner fa-pulse"></i></div>
			
			<div class="loaded col-md-12" style="padding-top:30px;">
				<ul class="list_sites list_elem">
				</ul>
			</div>
			<div class="popupHelp">
				<h2><?=__('Help')?></h2>
				<div class="content sm-content text-left">
					<p class=""><?= __('This page allow you to manage sites')?></p>
					<p class=""><?= __('You can delete a site by clicking on the red cross icon.')?></p>
					<p class=""><?= __('A confimation will be asked for each site you want to delete.')?></p>
					<p class=""><?= __('You can switch site by clicking on the blue check icon of the site you want to load.')?></p>
				</div>
				<p class="legende"><?=__('Click to hide')?></p>
			</div>
		</div>
		<footer>
			<a href="#" class="btn btn-default btn_footer_left btn_100 button_goto" data-goto="manager_dashboard"><?php echo __('Back');?></a>
		</footer>
	</section>
	
    <section id="manager_recovery" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Recovery');?></h2>
        </header>
        <div class="content">
            
			<h4 style="text-align:center"><?= __('Move the robot near a reflector (dock or augmented pose) then click on the recovery button') ?></h4>
			<div style="text-align:center; margin-top:20px;"><a href="#" class="bRecovery ifDocked_disabled btn btn-warning btn_big_popup" ><?=__('Recovery') ?></a></div>
					
			<div style="text-align:center"><a href="#" class="bUndock btn btn-primary btn_big_popup ifDocked"><i class="fa fa-upload"></i> <?php echo __('Undock robot');?></a></div>
			<div style="text-align:center"><div class="btn_big_popup ifDocking ifUndocking"><i class="fa fa fa-spinner fa-pulse"></i></div></div>
		   
			<div class="ifUndocked ifNRecovery">
				<div style="text-align:center; width:100%; z-index:2000; margin-top:20px;">
					<div class="joystickDiv" draggable="false" style="margin:auto;">
						<div class="fond"></div>
						<div class="curseur"></div>
					</div>
				</div>
			</div>
			
			<div class="ifRecovery" style="text-align:center; margin-top:20px;display:none;"><a href="#" class="btn btn-danger btn-lg bCancelRecovery"><?=__('Cancel Recovery') ?></a></div>
			<div class="ifRecovery manager_recovery_feedback recovery_feedback" style="display:none;">
				<hr style="border-top: 1px solid #909090;">
				<div class="row recovery_step RecoveryScan" id="">
					<div class="col-xs-10"><h5><?= __('Scan reflectors')?></h5></div>
					<div class="col-xs-2"><i class="fas fa-check iconMenuGreen" style="display:none;"></i><i class="fa fa fa-spinner fa-pulse"></i></div>
				</div>
				<div class="row recovery_step RecoveryPose" id="">
					<div class="col-xs-10"><h5><?= __('Robot position initiated')?></h5></div>
					<div class="col-xs-2"><i class="fas fa-check iconMenuGreen" style="display:none;"></i><i class="fa fa fa-spinner fa-pulse"></i></div>
				</div>
				<div class="row recovery_step RecoveryRotate" id="">
					<div class="col-xs-10"><h5><?= __('Rotate to clean obstacles')?></h5></div>
					<div class="col-xs-2"><i class="fas fa-check iconMenuGreen" style="display:none;"></i><i class="fa fa fa-spinner fa-pulse"></i></div>
				</div>
				<div class="row recovery_step RecoveryNav" id="">
					<div class="col-xs-10"><h5><?= __('Navigation started')?></h5></div>
					<div class="col-xs-2"><i class="fas fa-check iconMenuGreen" style="display:none;"></i><i class="fa fa fa-spinner fa-pulse"></i></div>
				</div>
				<hr style="border-top: 1px solid #909090;">
			</div>
				
			<div class="popupHelp">
				<h2><?=__('Help')?></h2>
				<div class="content sm-content text-left">
					<p><?= __('If you start the robot undocked to a docking station or if the robot is lost, this page will allow you to relocate the robot correctly.')?></p>
					<p><?= __('If the robot has just been started, a success message will be displayed.')?></p>
					<p><?= __('If the robot was lost, it will rotate 360° to clean the obstacles it could have wrongly spotted due to its bad location.')?></p>
					<p><?= __('A feedback popup will indicate the success or failure of the recovery.')?></p>	
				</div>
				<p class="legende"><?=__('Click to hide')?></p>
			</div>
		</div>
        <footer>
            <a href="#" class="btn btn-default button_goto btn_footer_left btn_100" data-goto="manager_dashboard"><?php echo __('Back');?></a>
        </footer>
    </section>
    
	<!--
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
				
				
					</div>
				</div>
			</div>
			<div class="popupHelp">
				<h2><?=__('Help')?></h2>
				<div class="content sm-content text-left">
					<p class=""><?= __('This page allows you to manage user accounts.')?></p>
					<p class=""><?= __('You can edit, add or delete user accounts.')?></p>
					<p class=""><?= __('User accounts can mainly :')?></p>
					<p class="">&nbsp;&nbsp;&nbsp;<?= __('- Move the robot through map.')?></p>
				</div>
				<p class="legende"><?=__('Click to hide')?></p>
			</div>
		</div>
        <footer>
            <a href="#" class="btn btn-default btn_footer_left btn_100 button_goto" data-goto="manager_dashboard"><?php echo __('Back');?></a>
        </footer>
    </section>
    -->
	
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
	
	<div class="modal fade modalWarningTeleop" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog" role="dialog">
			<div class="modal-content">
				<div class="modal-header">
					<div class="actions mh100vh_160">
						<div class="h100vh_160" style="overflow:auto">
							<i class="fas fa-sync-alt"></i>
							<h4 style="margin:20px 0"><?= __('Are you sure ?')?></h4>
							<h4 style="margin:20px 0"><?= __('If you choose to keep your map,')?></h4>
							<h4 style="margin:20px 0"><?= __('You may loose some modifications perfomed on the map by overwriting changes that have been made.')?></h4>
							<div class="manager_edit_map_modalReloadMap_loading loading_big" style="margin-top: 50px;"><i class="fa fa fa-spinner fa-pulse fa-2x"></i></div>
						</div>
						
						<div style="clear:both;"></div>
					   
					   
						<a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Cancel');?></a>
						<a href="#" id="manager_users_bUserSave" class="btn btn-primary btn_footer_right btn_50"><?php echo __('Save');?></a>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade modalWarningConnexion" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog" role="dialog">
			<div class="modal-content">
				<div class="modal-header">
					<div class="actions mh100vh_110">
						<div class="h100vh_160 text-center" style="overflow:auto;overflow-x: hidden;">
							<i class="fas fa-exclamation-triangle text-danger" style="font-size:80px;position:relative;"></i>
							<h3 style="margin:40px 0"><?= __('You are connected using manager account.')?></h3>
							<h4 class="text-danger" style="margin:20px 0;font-weight: 900;"><?= __('Safety is degraded.')?></h4>
							<h4 class="text-danger" style="margin:20px 0;font-weight: 900;"><?= __('Not to be used in production.')?></h4>
							<h4 class="text-danger" style="margin:20px 0;font-weight: 900;"><?= __('Only for trained users.')?></h4>
							<div class="checkbox checkbox_wrapper" style="    position: unset;font-size: 18px;color: #343a40!important;margin-top: 35px;">
								<label>
									<input type="checkbox" value="" class="checkboxWarningConnexion" style="margin-top: 6px;">
									<?=__("I assume the responsibility")?>
								</label>
							</div>
						</div>
						
						<div style="clear:both;"></div>
						<a href="#" id="modalWarningConnexion_bOk" class="btn btn-warning btn_footer_right btn_100"><?php echo __('Ok');?></a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

