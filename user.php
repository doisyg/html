<?php if (!isset($_SESSION['id_groupe_user']) || $_SESSION['id_groupe_user'] > 4) die('ERROR');?>
<div id="pages_user" class="global_page <?php echo $_SESSION['id_groupe_user'] == 4?'active':'';?>">
    <section id="user_dashboard" class="page hmi_tuile active">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Dashboard');?></h2>
        </header>
        <div class="content">
            <ul class="tuiles row">
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile1" data-goto="user_edit_map" href="#"><i class="far fa-map"></i><?php echo __('Map');?></a></li>
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile2" data-goto="user_move" href="#"><i class="fa fa-gamepad"></i><?php echo __('Control robot');?></a></li>
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile3" data-goto="user_recovery" href="#"><i class="fa fa-search"></i><?php echo __('Recovery');?></a></li>
				<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile4" href="logout.php"><i class="fas fa-power-off"></i><?php echo __('Logout');?></a></li>
                    
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile5 todo" data-goto="user_help" href="#"><i class="fa fa-question"></i><?php echo __('Help');?></a></li>
            </ul>
        </div>
    </section>
	
    <section id="user_edit_map" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Map');?></h2>
        </header>
        <div class="content">
			<div id="user_edit_map_container_all">
				<div id="user_edit_map_zoom_carte_container">
					<div id="user_edit_map_zoom_carte">
						<img src=""  class="img-responsive" style="max-width:100%; max-height:100%;" />
						<div id="user_edit_map_zone_zoom" style="position:absolute; border:1px solid #00F;"></div>
						<div id="user_edit_map_zone_zoom_click" style="position:absolute; width:100%; height:100%; top:0; left:0; cursor:pointer;"></div>
					</div>
				</div>
			
				<div id="user_edit_map_all" style="position:relative; margin:auto; width:100%;">
					<div id="user_edit_map_map_navigation" class="zoom" style="position:relative; width:100%; margin:auto; border:1px solid #000;">
						<svg id="user_edit_map_svg" width="0" height="0" style="position:absolute; top:0; left:0; width:100%; height:100%;">
							<image id="user_edit_map_image" xlink:href="" x="0" y="0" height="0" width="0" />
						</svg>
					</div>
					<div style="clear:both;"></div>
				</div>
				
				<a href="#" id="user_edit_map_bStop" class="btn btn-circle btn-danger btn-menu"><i class="fa fa-stop"></i></a>
				
				<i class="fas fa-times times_icon_menu iconMenuRed"></i>
			
				<div id="user_edit_map_menu" class="menu_icon_touch" style="position: absolute; display: block; top: 7.5px; left: 7.5px;z-index:0;">
					<ul>
						<li style="display: list-item; left: 12.5px; top: 7.5px;"><a href="#" class="btn btn-circle btn-default bMoveTo btn-menu" data-orientation="H"><i class="fa fa-crosshairs iconMenuBlue" style="font-size:24px"></i></a></li>
						<li style="display: list-item; left: 57.5px; top: 7.5px;"><a href="#" class="btn btn-circle btn-default bMove btn-menu" data-orientation="H" data-toggle="modal" data-target="#user_edit_map_modalTeleop"><i class="fa fa-gamepad iconMenuPurple"></i></a></li>
					</ul>
				</div>
				
				<div id="user_edit_map_menu_dock" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
					<ul>
						<li><a href="#" class="btn btn-circle btn-default btn-menu bTestDock" ><img class="fi-route" src="assets/images/route_green.svg"/></a></li>
					</ul>
				</div>
				
				<div id="user_edit_map_menu_poi" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
					<ul>
						<li><a href="#" class="btn btn-circle btn-default btn-menu bTestPoi"><img class="fi-route" src="assets/images/route_green.svg"/></a></li>
					</ul>
				</div>
				
				<div id="user_edit_map_menu_augmented_pose" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
					<ul>
						<li><a href="#" class="btn btn-circle btn-default btn-menu bTestAugmentedPose"><img class="fi-route" src="assets/images/route_green.svg"/></a></li>
					</ul>
				</div>
				
				<div id="user_edit_map_modalTeleop" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
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
								   
									<a href="#" class="btn btn-primary btn_footer_left btn_100" data-dismiss="modal" ><?php echo __('Close');?></a>
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
												<strong><?= _('Action finished !') ?></strong><br />
												<?= _('No error during action.') ?>
											</div>
										</section>
										<section class="panel panel-danger">
											<header class="panel-heading">
												<h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fa fa-remove"></i></h2>
											</header>
											<div class="panel-body" style="text-align:center; font-size:24px; line-height:36px;">
												<strong><?= _('Error !') ?></strong><br />
												<span class="error_details"></span>
											</div>
										</section>
										<section class="panel panel-warning">
											<header class="panel-heading">
												<h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fas fa-exclamation-triangle"></i></h2>
											</header>
											<div class="panel-body" style="text-align:center; font-size:24px; line-height:36px;">
												<strong><?= _('Warning !') ?></strong><br />
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
					
					
				<div id="user_edit_map_modalGoToDock" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto; text-align:center;">
										<h2 class="h2ModalGoTo">
											<?= _('Go to Dock ?') ?>
											<div class="btn-circle btn-lg btn-popup">
												<i class="fas fa-charging-station iconMenuGreen" style="position: relative;top: -10px;left: -5px;"></i>
											</div>
										</h2>
										<h4 class="h4ModalGoTo"><?= _('Do you want to send the vehicle to this docking station ?') ?></h4>
										
										<h5 class="h5ModalGoTo">
											<?= _('Click on the stop icon to cancel action while the vehicle is moving.') ?>
										</h5>
										
										<div class="checkbox checkbox_wrapper" style="display:none">
											<label>
												<input type="checkbox" value="" class="checkboxGotodock">
												<?= _('Don\'t show this message again')?>
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
				
				<div id="user_edit_map_modalGoToAugmentedPose" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto; text-align:center;">
										<h2 class="h2ModalGoTo">
											<?= _('Go to Augmented Pose ?') ?>
											<div class="btn-circle btn-lg btn-popup">
												<div class="iconAugmentedPose" style="top: -15px;left: -10px;"><i class="fas fa-map-marker-alt iconMenuPurple"></i><i class="fas fa-barcode"></i></div>
											</div>
										</h2>
										<h4 class="h4ModalGoTo"><?= _('Do you want to send the vehicle to this augmented pose ?') ?></h4>
										
										<h5 class="h5ModalGoTo">
											<?= _('Click on the stop icon to cancel action while the vehicle is moving.') ?>
										</h5>
										
										<div class="checkbox checkbox_wrapper" style="display:none">
											<label>
												<input type="checkbox" value="" class="checkboxGotoaugmentedpose">
												<?= _('Don\'t show this message again')?>
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
				
				<div id="user_edit_map_modalGoToPoi" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto; text-align:center;">
										<h2 class="h2ModalGoTo">
											<?= _('Go to POI ?') ?>
											<div class="btn-circle btn-lg btn-popup" style="display: block;position: unset;transform: none;">
												<i class="fa fa-map-marker-alt iconMenuBlue" style="position: relative;top: -12px;left: -3px;"></i>
											</div>
										</h2>
										<h4 class="h4ModalGoTo"><?= _('Do you want to send the vehicle to this POI ?') ?></h4>
										
										<h5 class="h5ModalGoTo">
											<?= _('Click on the stop icon to cancel action while the vehicle is moving.') ?>
										</h5>
										
										<div class="checkbox checkbox_wrapper" style="display:none">
											<label>
												<input type="checkbox" value="" class="checkboxGotopoi">
												<?= _('Don\'t show this message again')?>
											</label>
										</div>
										<a href="#" class="btn btn-default btn_footer_left btn_50 bModalCancelGoToPoi" data-dismiss="modal" ><?php echo __('Cancel');?></a>
										<a href="#" class="btn btn-primary btn_footer_right btn_50 bModalGoToPoi" data-dismiss="modal" ><?php echo __('Go');?></a>
									</div>
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
										<h2><?= _('Go to position') ?></h2>
										<h4 style="text-align:left;margin:30px 0;"><?= _('Click on the map to choose the position you\'re aiming for.') ?></h4>
										<h4 style="text-align:justify;margin:30px 0;"><?= _('Click on the menu icon to cancel.') ?></h4>
										<div class="btn-circle btn-lg btn-popup" style="display: block;">
											<i class="fas fa-crosshairs iconMenuBlue"></i>
											<i class="fas fa-times times_icon iconMenuRed" style="display: inline-block;"></i>
										</div>
										<h4 style="text-align:justify;margin:30px 0;"><?= _('Click on the stop icon to cancel action while the vehicle is moving.') ?></h4>
										
										<div class="btn-circle btn-lg btn-popup btn-danger" style="display: block;">
											<i class="fa fa-stop"></i>
										</div>
										<div style="clear:both;"></div>
										<div class="checkbox checkbox_wrapper" >
											<label>
												<input type="checkbox" value="" class="checkboxHelpGotopose">
												<?= _('Don\'t show this message again')?>
											</label>
										</div>
										<a href="#" class="btn btn-primary btn_footer_left btn_100 bHelpClickGotoPoseOk" data-dismiss="modal" ><?php echo __('Ok');?></a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="popupHelp">
					<h2><?= _('Help')?></h2>
					<ul style="color:#000;">
						<li><i class="fa fa-crosshairs iconMenuBlue"></i><span class="description"><?= _('Move the robot to this point')?></span></li>
						<li><i class="fa fa-gamepad iconMenuPurple"></i><span class="description"><?= _('Teleop the robot')?></span></li>
						<li style="position:relative;font-size:16px"><img class="route" src="assets/images/route_green.svg"/><span class="description" style="margin-left: 40px;position: relative;top: 3px;"><?= _('Test go to POI, dock or augmented pose')?></span></li>
						<li style="position:relative;">
						<svg class="svg_popupHelp_robot" xmlns="http://www.w3.org/2000/svg">
							<circle cx="20" cy="20" r="12" class="robot_elem robot_elem_fond"></circle>
							<polyline points="16 16 24 20 16 24" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linejoin="round" stroke-linecap="round" class="robot_elem" transform="rotate(-90,20,20)"></polyline>
						</svg>
						<span class="description" style="margin-left: 40px;"><?= _('Robot position')?></span></li>
					</ul>
					<p class="legende"><?= _('Click to hide')?></p>
				</div>
				
				<div class="user_edit_map_loading loading_big loading_map"><i class="fa fa fa-spinner fa-pulse fa-3x"></i></div>
			</div>
			
			<div id="user_edit_map_zoom_popup" style="position:absolute; top:20px; left:20px; width:101px; height:101px; border:1px solid #000; overflow:hidden; display:none; z-index:8000;">
				<div id="user_edit_map_zoom_popup_content" style="position:absolute; top:0; height:0;"></div>
				<div id="user_edit_map_zoom_popup_mire" style="position:absolute; width:101px; height:101px; top:0; left:0; background-image:url(assets/images/mire.png);"></div>
			</div>
		</div>
        <footer>
            <a href="#" class="btn btn-default btn_footer_left btn_100 button_goto" data-goto="user_dashboard"><?php echo __('Back');?></a>
        </footer>
    </section>
        
    <section id="user_move" class="page with_footer">
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
            <a href="#" class="btn btn-default btn_footer_left btn_100 button_goto" data-goto="user_dashboard"><?php echo __('Back');?></a>
        </footer>
    </section>
        
    <section id="user_recovery" class="page with_footer">
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
            <a href="#" class="btn btn-default btn_footer_left btn_100 button_goto" data-goto="user_dashboard"><?php echo __('Back');?></a>
        </footer>
    </section>
        
    <section id="user_help" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Help');?></h2>
        </header>
        <div class="content">
           <h4 style="text-align:center"><h4 style="text-align:center"><?php echo __('Comming soon');?></h4></h4>
        </div>
        <footer>
            <a href="#" class="btn btn-default btn_footer_left btn_100 button_goto" data-goto="user_dashboard"><?php echo __('Back');?></a>
        </footer>
    </section>
</div>