	<div id="pages_install_by_step" class="global_sub_page <?php echo $INSTALL_STEP < 100?'active':'';?>">
    	<section id="install_by_step_lang" class="page hmi_tuile <?php echo $INSTALL_STEP <= 1?'active':'';?>">
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Select language');?></h2>
            </header>
            <div class="content">
            	<ul class="tuiles heightauto row">
                	<li class="col-xs-6 col-md-6 col-lg-6">
                        <a href="#" class="select_langue button_goto anim_tuiles tuile_img tuile1" data-goto="install_by_step_tops" data-id_lang="1">
                            <img src="assets/images/lang/fr_big.jpg" />
                        </a>
                    </li>
                	<li class="col-xs-6 col-md-6 col-lg-6">
                        <h2 style="margin-top:35px"><?= _('Français') ?></h2>
                    </li>
                	<li class="col-xs-6 col-md-6 col-lg-6" style="clear:both; margin-top:20px">
                        <a href="#" class="select_langue button_goto anim_tuiles tuile_img tuile2" data-goto="install_by_step_tops" data-id_lang="2">
                            <img src="assets/images/lang/en_big.jpg" />
                        </a>
                    </li>
					<li class="col-xs-6 col-md-6 col-lg-6" style="margin-top:20px">
                        <h2 style="margin-top:35px"><?= _('English') ?></h2>
                    </li>
                </ul>
            </div>
        </section>
		
    	<!--
    	<section id="install_by_step_date" class="page <?php echo $INSTALL_STEP == 2?'active':'';?>">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_wifi"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Date');?></h2>
            </header>
            <div class="content">
            
            	<h3><?php echo __('Configure date');?></h3>
                
                <h4>A FAIRE</h4>
                
                <a href="#" class="save_date button_goto btn btn-default pull-right" data-goto="install_by_step_tops">OK <i class="fa fa-chevron-right"></i></a>
                
            </div>
        </section>-->
        
        <section id="install_by_step_tops" class="page with_footer hmi_tuile <?php echo $INSTALL_STEP == 2?'active':'';?>">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_lang"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Select available Tops');?></h2>
            </header>
            <div class="content">
            	<div class="install_by_step_tops_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
                <ul class="tuiles row">
                </ul>
                
                <div style="clear:both; height:40px;"></div>
                <a href="#" class="import_top btn btn-lg btn-success" style="margin-left:50%; transform:translateX(-50%)">Import new top</a>   
                
                <a href="#" class="save_tops_next_select button_goto" data-goto="install_by_step_top" style="display:none;" data-goto="install_by_step_top"></a>   
                <a href="#" class="save_tops_next_check button_goto" data-goto="install_by_step_check" style="display:none;" data-goto="install_by_step_top"></a>   
                
            
                <div class="modal fade modalImportTop" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                    <div class="modal-dialog" role="dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="actions mh100vh_55">
                                    <div class="h100vh_160" style="overflow:auto; text-align:center">
                                    
                                        <div class="modalImportTop_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
                                        <div class="modalImportTop_content">
	                                        <div class="file_import_top_wrapper">
												<input class="file_import_top" type="file" class="form-control" accept=".wyca"/>
												<p><i class="fas fa-2x fa-file-import"></i><br><?= __('Import')?><br><?= __('your')?><br><?= __('Top')?></p>
												<span class="filename_import_top" style="display:none">Test</span>
											</div>
											<img class="img-responsive" id="elodie_import_top" src="assets/images/elodie_form.png">
                                        </div>
                                        
                                    </div>
                                    
                                    <div style="clear:both;"></div>                                   
                                    <a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal"><?php echo __('Cancel');?></a>
									<a href="#" class="btn btn-primary bImportTopDo btn_footer_right btn_50" ><?php echo __('Import');?></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                
            </div>
            <footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_50 btn_back" data-goto="install_by_step_lang"><?= __('Back')?></a>
				<a href="#" class="save_tops btn btn-primary btn_footer_right btn_50"><?= __('Next')?></a>
            </footer>
        </section>
        
        <section id="install_by_step_top" class="page hmi_tuile <?php echo $INSTALL_STEP == 3?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_tops"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Select active Top');?></h2>
            </header>
            <div class="content">
            	<div class="install_by_step_top_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
                <ul class="tuiles row">
                </ul>
                
                <div style="clear:both; height:20px;"></div>
            </div>
			<footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_100 btn_back" data-goto="install_by_step_tops"><?= __('Back')?></a>
            </footer>
        </section>
        
        <section id="install_by_step_check" class="page hmi_tuile <?php echo $INSTALL_STEP == 4?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_top"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Auto Diag');?></h2>
            </header>
            <div class="content">
                <ul class="tuiles row" style="position:relative;max-width:375px;">
                    <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                    	<div class="is_checkbox test anim_tuiles tuile_img tuile1 no_update">
                            <i class="fa fa-check"></i>
                    		<i class="fa fa fa-spinner fa-pulse"></i>
                    		<img class="i" src="assets/images/radar_icon.png">
							<?php echo __('Lidar');?>
                        </div>
                    </li>
                    <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                    	<div class="is_checkbox anim_tuiles tuile_img tuile1 no_update">
                            <i class="fa fa-check"></i>
                    		<i class="fa fa fa-spinner fa-pulse"></i>
                    		<img class="i" src="assets/images/ultrasound.svg">
							<?php echo __('Sonar');?>
                        </div>
						<span class="trait_legende" style="width:calc(var(--vh, 1vh) * 20);transform:rotate(50deg)translateX(0px)translateY(0px);"></span>
                    </li>
                    <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                    	<div class="is_checkbox anim_tuiles tuile_img tuile1 no_update">
                            <i class="fa fa-check"></i>
                    		<i class="fa fa fa-spinner fa-pulse"></i>
                    		<img class="i" src="assets/images/motor.png">
							<?php echo __('Motor');?>
                        </div>
						<span class="trait_legende" style="width:calc(var(--vh, 1vh) * 20);transform:rotate(50deg)translateX(0px)translateY(0px);"></span>
                    </li>
                    <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                    	<img class="img-responsive" id="elodie_import_top" src="assets/images/elodie_form.png">
                    </li>
                    <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                    	<div class="is_checkbox anim_tuiles tuile_img tuile1 no_update">
                            <i class="fa fa-check"></i>
                    		<i class="fa fa fa-spinner fa-pulse"></i>
                    		<i class="fa fa-battery-4"></i>
							<?php echo __('Com. Battery');?>
                        </div>
                    </li>
                    <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                    	<div class="is_checkbox anim_tuiles tuile_img tuile1 no_update">
                            <i class="fa fa-check"></i>
                    		<i class="fa fa fa-spinner fa-pulse"></i>
                    		<img class="i" src="assets/images/3d_sensor.png">
							<?php echo __('3D Sensor');?>
                        </div>
                    </li>
                    <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                    	<div class="is_checkbox anim_tuiles tuile_img tuile1 no_update">
                            <i class="fa fa-check"></i>
                    		<i class="fa fa fa-spinner fa-pulse"></i>
                    		<img class="i" src="assets/images/strip_led2.png">
							<?php echo __('Com. Leds');?>
                        </div>
                    </li>
					
					<svg class="svg_legende" xmlns="http://www.w3.org/2000/svg">
						<line x1="65" y1="142" x2="109" y2="226" stroke-width="1" stroke="#343434" class="line_lidar"/>
						<line x1="187" y1="122" x2="168" y2="197" stroke-width="1" stroke="#343434" class="line_us"/>
						<line x1="187" y1="122" x2="134" y2="197" stroke-width="1" stroke="#343434" class="line_us"/>
						<line x1="308" y1="142" x2="226" y2="281" stroke-width="1" stroke="#343434" class="line_motor"/>
						<line x1="65" y1="351" x2="109" y2="286" stroke-width="1" stroke="#343434" class="line_battery"/>
						<line x1="187" y1="371" x2="155" y2="265" stroke-width="1" stroke="#343434" class="line_sensor"/>
						<line x1="308" y1="351" x2="174" y2="286" stroke-width="1" stroke="#343434" class="line_leds"/>
					</svg>
					
                </ul>  
            </div>
			<footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_50 btn_back" data-goto="install_by_step_top"><?= __('Back')?></a>
				<a href="#" class="button_goto install_by_step_check_next btn btn-primary btn_footer_right btn_50" data-goto="install_by_step_wifi"><i class="fa fa fa-spinner fa-pulse"></i> <?= __('Testing')?></a>
            </footer>
        </section>
		
		<section id="install_by_step_wifi" class="page <?php echo $INSTALL_STEP == 5?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_check"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Wifi');?></h2>
            </header>
            <div class="content">
            
            	<h3><?php echo __('Configure Wifi');?></h3>
                <div class="install_bystep_setup_wifi_loading loading_big" style="display:block"><i class="fa fa fa-spinner fa-pulse"></i></div>
                <table class="table table_wifi">
                	<tbody class="tbody_wifi">
                    </tbody>
                </table>
                
                <a href="#" class="refresh_wifi btn btn-default pull-left"><i class="fa fa-refresh"></i></a>
            </div>
			<footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_50 btn_back" data-goto="install_by_step_check" ><?= __('Back')?></a>
				<a href="#" class="skip_wifi button_goto btn btn-primary btn_footer_right btn_50" data-goto="install_by_step_site"><?= __('Skip')?></a>
                <a href="#" class="set_passwd_wifi button_goto" data-goto="install_by_step_wifi_password" style="display:none;"></a>
            </footer>
        </section>
        
		<section id="install_by_step_wifi_password" class="page with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_wifi"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Wifi');?></h2>
            </header>
			<div class="content">
			
				<h3><?php echo __('Set password');?></h3>
				
				<form id="form_connect_wifi"class="form_site" action="" method="post" style="margin-bottom:20px;">
					<input type="password" class="form-control i_wifi_passwd_name" value="" />
				</form>  
				
				
				<div class="wifi_connexion_error"></div>
				
				<div class="wifi_connexion_progress"><i class="fa fa fa-spinner fa-pulse"></i></div>
				
				
			</div>
			<footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_50 btn_back" data-goto="install_by_step_wifi"><?= __('Back')?></a>
				<a href="#" onClick="$('#form_connect_wifi').submit();" class="install_by_step_wifi_password_save btn btn-primary btn_footer_right btn_50"><?= __('Connect')?></a>
			</footer>
        </section>
			
		<section id="install_by_step_site" class="page <?php echo $INSTALL_STEP == 10?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_wifi"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Site');?></h2>
            </header>
            <div class="content">
				<h4 style="text-align:center;margin:30px 0"><?= __('Import site or create a new one ?') ?></h4>
				<ul class="tuiles row">
                    <li class="col-xs-6">
                    	<div class="is_checkbox tuile_img no_update button_goto" id="bImportSite" data-goto="install_by_step_import_site" style="bottom:0;border-radius:10px" onTouchStart="InitBystepSiteImport()">
                    		<i class="fas fa-file-import" style="padding-top:5px"></i>
							<h4 class="" style="margin-top: 0px;font-weight:700"><?php echo __('Import Site');?></h4>
                        </div>
                    </li>
                    <li class="col-xs-6">
                    	<div class="is_checkbox tuile_img no_update button_goto" id="bCreateSite" data-goto="install_by_step_new_site" style="bottom:0;border-radius:10px">
                    		<i class="fas fa-hotel" style="padding-top:5px"></i>
							<h4 class="" style="margin-top: 0px;font-weight:700"><?php echo __('Create Site');?></h4>
                        </div>
                    </li>
				</ul>
				
				<!-- <a href="#" class="install_by_step_maintenance_next button_goto" data-goto="install_by_step_manager" style="display:none;"></a> -->
            </div>
			<footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_100 btn_back" data-goto="install_by_step_wifi"><?= __('Back')?></a>
            </footer>
        </section>
		
		<section id="install_by_step_import_site" class="page <?php echo $INSTALL_STEP == 60?'active':'';?> with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_by_step_site"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Site import');?></h2>
            </header>
            <div class="content">
                <div class="install_by_step_setup_import_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
                <div class="install_by_step_setup_import_content">
					<div class="file_import_site_wrapper">
						<input class="file_import_site" type="file" class="form-control" accept=".wyca"/>
						<p><i class="fas fa-2x fa-file-import"></i><br><?= __('Import your site')?></p>
						<span class="filename_import_site" style="display:none">Test</span>
					</div>
    			</div>
				<a href="#" class="install_by_step_import_site_next button_goto" data-goto="install_by_step_site_master_dock" style="display:none;"></a>
            </div>
            <footer>
                <a href="#" class="button_goto btn btn-default btn_footer_left btn_50 btn_back" data-goto="install_by_step_site"><?= __('Back')?></a>
                <a href="#" class="btn btn-primary bImportSiteDo btn_footer_right btn_50"><?php echo __('Import');?></a>
            </footer>
        </section>
		
		<section id="install_by_step_site_master_dock" class="page <?php echo $INSTALL_STEP == 61?'active':'';?> with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_by_step_import_site"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Default Dock');?></h2>
            </header>
            <div class="content">
				<h4 style="text-align:center;margin:30px 0"><?= __('Pick the default docking station') ?></h4>
				<div class="MasterDock_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
				<ul class="tuiles row" id="MasterDockList">
                    
				</ul>
					
				<a href="#" class="install_by_step_site_master_dock_next button_goto" data-goto="install_by_step_edit_map" style="display:none;"></a>
            </div>
            <footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_100 btn_back" data-goto=	"install_by_step_import_site"><?= __('Back')?></a>
            </footer>
        </section>
		
		<section id="install_by_step_new_site" class="page <?php echo $INSTALL_STEP == 11?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_wifi"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('New site');?></h2>
            </header>
            <div class="content">
                
                <h3><?php echo __('Indicate the site name');?></h3>
                
                <form id="form_site" class="form_site" action="" method="post" style="margin-bottom:20px;">
	                <input type="text" class="form-control i_site_name" value="" />
                </form>
                
                <a href="#" class="install_by_step_site_next button_goto" data-goto="install_by_step_mapping" style="display:none;"></a>   
            </div>
			<footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_50 btn_back" data-goto="install_by_step_site"><?= __('Back')?></a>
				<a href="#" onClick="$('#form_site').submit();" class="install_by_step_site_save btn btn-primary btn_footer_right btn_50"><?= __('Next')?></a>
            </footer>
        </section>
		
        <section id="install_by_step_mapping" class="page <?php echo $INSTALL_STEP == 12?'active':'';?> hide_photo_back with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_site"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Mapping');?></h2>
            </header>
            <div class="content">
                
                <div style="text-align:center; font-size:26px;">
                
                	<div class="switchLiveMapping switch switch-sm switch-primary" style="position:absolute; top:20px; right:20px; display:none; z-index:1001; ">
                        <input type="checkbox" name="switch" data-plugin-ios-switch checked="checked" />
                    </div>
                	
                	
                    <h3 class="ifNMapping ifNMappingInit"><?php echo __('Move robot to start point');?></h3>
                    <h3 class="ifMappingInit" style="display:none"><?php echo __('Mapping Init');?></h3>
                    
                    <div class="progressStartMapping" style="display:none;">
                        <h3><?php echo __('Start mapping');?></h3>
                        <div class="createMapProgress progress progress-striped light active m-md">
                            <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;">
                            </div>
                        </div>
                    </div>
                
                    <div class="mapping_view" style="position:absolute; top:0; left:0; right:0; bottom:0; overflow:hidden; display:none; z-index:1000;">
                        <img id="install_by_step_mapping_mapping_robot" src="assets/images/robot-dessus.png" width="6" style="position:absolute; bottom:400px; margin-left:-3px; z-index:300;" />
                        <img class="map_dyn" id="install_by_step_mapping_img_map_saved" src="" style="position:absolute; z-index:200" />
                    </div>
					
                    <a href="#" class="bUndock btn btn-primary btn_big_popup ifDocked" style="position: absolute;bottom: 50px;z-index: 2000;display: none;left:50%;transform:translateX(-50%)"><i class="fa fa-upload"></i> <?php echo __('Undock robot');?></a>
                    <div class="ifUndocked" style="position:absolute; bottom:50px; left:0; width:100%; z-index:2000;">
                        <div class="joystickDiv" draggable="false" style="margin:auto;">
                            <div class="fond"></div>
                            <div class="curseur"></div>
                        </div>
                    </div>
                    
                </div>         
            </div>
            <footer>
            	<a href="#" class="ifNMapping bMappingBack btn btn-default button_goto btn_footer_left btn_33 btn_back" data-goto="install_by_step_new_site" ><?php echo __('Back');?></a>
            	<a href="#" class="ifNMapping bMappingStart btn btn-primary btn_footer_right btn_66" ><?php echo __('Start Mapping');?></a>
            	<a href="#" class="ifMapping bMappingStop button_goto btn btn-primary btn_footer_right btn_100" data-goto="install_by_step_mapping_fin" style="display:none"><?php echo __('Done');?></a>
            </footer>
        </section>
        
		<section id="install_by_step_mapping_fin" class="page <?php echo $INSTALL_STEP == 13?'active':'';?> hide_photo_back with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_mapping"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Mapping config');?></h2>
            </header>
            <div class="content">
                
                <div style="text-align:center;">
                
                    <form id="install_by_step_mapping_form" method="post">
                        <input type="hidden" name="todo" value="saveMapping" />
                        <input type="hidden" id="install_by_step_mapping_from_image" name="image" value="" />
                        <input type="hidden" id="install_by_step_mapping_from_image_tri" name="image_tri" value="" />
                        <input type="hidden" id="install_by_step_mapping_from_ros_hauteur" name="ros_hauteur" value="" />
                        <input type="hidden" id="install_by_step_mapping_from_ros_largeur" name="ros_largeur" value="" />
                        <input type="hidden" id="install_by_step_mapping_from_threshold_free" name="threshold_free" value="" />
                        <input type="hidden" id="install_by_step_mapping_from_threshold_occupied" name="threshold_occupied" value="" />
                        <input type="text" id="install_by_step_mapping_from_name" name="nom" placeholder="<?php echo __('Map name')?>" class="form-control" style="margin-bottom:20px;" />
                    </form>
                
                    <div class="fin_mapping_view" style="height:65vh; width:100%; margin:10px 0; border:1px solid #EFEFEF; position:relative; background-color:#F0F0F0;">
                        <img id="install_by_step_mapping_img_map_saved_fin" src="" style="z-index:200; display:none; max-width:100%;" />
                        <div id="install_by_step_mapping_divOptionTrinary">
							<div class="threshold_wrapper">
								<div class="slider_wrapper">
									<span class="btn btn_slider_minus"><i class="fas fa-minus-square"></i></span>
									<div id="install_by_step_mapping_threshold_free_slider_elem" class="mt-lg mb-lg slider-primary" data-plugin-slider data-plugin-options='{ "value": 25, "range": "min", "max": 100 }' data-plugin-slider-output="#install_by_step_mapping_threshold_free_slider">
										<input id="install_by_step_mapping_threshold_free_slider" type="hidden" value="25" />
									</div>
									<span class="btn btn_slider_plus"><i class="fas fa-plus-square"></i></span>
								</div>
								<p id="install_by_step_mapping_threshold_free_output"><?php echo __('Empty area threshold');?> : <b>25</b></p>
                            </div>
							
                            <div class="threshold_wrapper">
								<div class="slider_wrapper">
									<span class="btn btn_slider_minus"><i class="fas fa-minus-square"></i></span>
									 <div id="install_by_step_mapping_threshold_occupied_slider_elem" class="mt-lg mb-lg slider-primary" data-plugin-slider data-plugin-options='{ "value": 65, "range": "min", "max": 100 }' data-plugin-slider-output="#install_by_step_mapping_threshold_occupied_slider">
										<input id="install_by_step_mapping_threshold_occupied_slider" type="hidden" value="65" />
									</div>
									<span class="btn btn_slider_plus"><i class="fas fa-plus-square"></i></span>
								</div>
								<p id="install_by_step_mapping_threshold_occupied_output"><?php echo __('Object detection threshold');?> : <b>65</b></p>
                            </div>
                            <a href="#" class="btn btn-sm btn-primary bResetValueThreshold"><?php echo __('Reset values');?></a>
                        </div>
                        <div id="install_by_step_mapping_divResultTrinary">
                            <div style="height:80vh; overflow:auto;">
                                <i style="font-size:60px;" class="fa fa-spinner fa-pulse loading_fin_create_map"></i>
                                <canvas id="install_by_step_mapping_canvas_result_trinary" width="" height="" style="max-width:100%; max-height:65vh;"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <div style="clear:both; height:10px;"></div>
                    
                </div>         
            </div>
            <footer>
            	<a href="#" class="btn btn-default button_goto bMappingCancelMap2 btn_footer_left btn_50 btn_back" data-goto="install_by_step_mapping"><?php echo __('Back');?></a>           
                <a href="#" class="btn btn-primary bMappingSaveMap btn_footer_right btn_50"><?php echo __('Save');?></a>
                <a href="#" class="install_by_step_mapping_fin_next button_goto" data-goto="install_by_step_edit_map" style="display:none;"></a>   
            </footer>
        </section>
       
		<section id="install_by_step_mapping_use" class="page hide_photo_back with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_mapping"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Mapping config');?></h2>
            </header>
            <div class="content">
                
                <div style="text-align:center;">
                    
                    <h2 class="modalUseThisMapNowTitle1"><?php echo 'Do you want to use this map now ?';?></h2>
                    <h2 class="modalUseThisMapNowTitle2" style="display:none;"><?php echo 'Configure map on robot';?></h2>
                    
                    <div class="modalUseThisMapNowContent" style="display:none;">
                        <i style="font-size:60px;" class="fa fa-spinner fa-pulse"></i>
                        <div class="modalUseThisMapNowContentDetails" style="font-size:18px;"></div>
                    </div>
                </div>
                
            </div>
            <footer>
            	<a href="#" class="btn btn-warning button_goto bUseThisMapNowNo btn_footer_left btn_50" data-goto="install_by_step_edit_map"><?php echo __('No');?></a>           
                <a href="#" class="btn btn-primary bUseThisMapNowYes btn_footer_right btn_50"><?php echo __('Yes');?></a>
                <a href="#" class="install_by_step_mapping_use_next button_goto" data-goto="install_by_step_edit_map" style="display:none;"></a>                   
            </footer>
        </section>
         
		<section id="install_by_step_edit_map" class="page <?php echo $INSTALL_STEP == 20?'active':'';?> hide_photo_back with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_mapping"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Edit map');?></h2>
            </header>
            <div class="content">
                
                <div id="install_by_step_edit_map_container_all">
					
					<div class="btn-circle btn-lg burger_menu" data-open="install_by_step_edit_map_menu">
						<div class="burger_menu_trait"></div>
						<div class="burger_menu_trait"></div>
						<div class="burger_menu_trait"></div>
					</div>
					
					<i class="fas fa-times times_icon_menu iconMenuRed"></i>
					<div class="btn-circle btn-lg icon_menu" data-menu="install_by_step_edit_map_menu_point">
						<i class="fas fa-draw-polygon icon_menu_point iconMenuGreen" style="transform: scale(2.5);left: 17px;top: -23px;"></i>
					</div>
					<div class="btn-circle btn-lg icon_menu" data-menu="install_by_step_edit_map_menu_forbidden">
						<div class="iconForbiddenArea"><i class="fas fa-vector-square"></i><i class="fa fa-minus-circle iconMenuRed"></i></div>
					</div>
					<div class="btn-circle btn-lg icon_menu" data-menu="install_by_step_edit_map_menu_area">
						<i class="fas fa-draw-polygon iconMenuGreen"></i>
					</div>
					<div class="btn-circle btn-lg icon_menu" data-menu="install_by_step_edit_map_menu_dock">
						<i class="fas fa-charging-station iconMenuGreen" style="position: relative;top: -1px;left:-5px;"></i>
					</div>
					<div class="btn-circle btn-lg icon_menu" data-menu="install_by_step_edit_map_menu_poi">
						<i class="fa fa-map-marker-alt iconMenuBlue"></i>
					</div>
					<div class="btn-circle btn-lg icon_menu" data-menu="install_by_step_edit_map_menu_augmented_pose">
						<div class="iconAugmentedPose"><i class="fas fa-map-marker-alt iconMenuBlue"></i><i class="fas fa-barcode"></i></div>
					</div>
					
                    <div id="install_by_step_edit_map_zoom_carte_container">
                        <div id="install_by_step_edit_map_zoom_carte">
                            <img src=""  class="img-responsive" style="max-width:100%; max-height:100%;" />
                            <div id="install_by_step_edit_map_zone_zoom" style="position:absolute; border:1px solid #00F;"></div>
                            <div id="install_by_step_edit_map_zone_zoom_click" style="position:absolute; width:100%; height:100%; top:0; left:0; cursor:pointer;"></div>
                        </div>
                    </div>
                
                    <div id="install_by_step_edit_map_all" style="position:relative; margin:auto; width:100%;">
                        <div id="install_by_step_edit_map_map_navigation" class="zoom" style="position:relative; width:100%; margin:auto; border:1px solid #000;">
                            <svg id="install_by_step_edit_map_svg" width="0" height="0" style="position:absolute; top:0; left:0; width:100%; height:100%;">
                                <image id="install_by_step_edit_map_image" xlink:href="" x="0" y="0" height="0" width="0" />
                            </svg>
                        </div>
                        <div style="clear:both;"></div>
                    </div>
                    
                    <a href="#" id="install_by_step_edit_map_bStop" class="btn btn-circle btn-danger btn-menu"><i class="fa fa-stop"></i></a>
                    <a href="#" id="install_by_step_edit_map_bEndGomme" class="btn btn-circle btn-primary btn-menu"><i class="fa fa-check"></i></a>
                    <a href="#" id="install_by_step_edit_map_bSaveCurrentElem" class="btn btn-circle btn-primary btn-menu"><i class="fa fa-check"></i></a>
                    <a href="#" id="install_by_step_edit_map_bCancelCurrentElem" class="btn btn-circle btn-warning btn-menu"><i class="fa fa-times"></i></a>
                    
                    <a href="#" id="install_by_step_edit_map_bByStepUndo" class="btn btn-default btn-circle disabled" style="position:absolute; bottom:20px; left:10px;"><i class="fa fa-reply"></i></a>
                    <a href="#" id="install_by_step_edit_map_bByStepRedo" class="btn btn-default btn-circle disabled" style="position:absolute; bottom:20px; left:45px;"><i class="fa fa-share"></i></a>
                    
                    <div id="install_by_step_edit_map_menu" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
                        	<li><a href="#" class="btn btn-circle btn-default bAddForbiddenArea btn-menu" data-orientation="V">
								<div class="iconForbiddenArea"><i class="fas fa-vector-square"></i><i class="fa fa-minus-circle iconMenuRed"></i></div>
							</a></li>
                        	<li><a href="#" class="btn btn-circle btn-default bAddArea btn-menu" data-orientation="V">
								<i class="fas fa-draw-polygon iconMenuGreen" style="font-size:24px"></i>
							</a></li>
                        	<li><a href="#" class="btn btn-circle btn-default bAddPOI btn-menu" data-orientation="V">
								<i class="fa fa-map-marker-alt iconMenuBlue"></i>
							</a></li>
                        	<li><a href="#" class="btn btn-circle btn-default bAddAugmentedPose btn-menu" data-orientation="V">
								<div class="iconAugmentedPose"><i class="fas fa-map-marker-alt iconMenuBlue"></i><i class="fas fa-barcode"></i></div>
							</a></li>
                        	<li><a href="#" class="btn btn-circle btn-default bAddDock btn-menu" data-orientation="V">
								<i class="fas fa-charging-station iconMenuGreen" style="position: relative;top: -1px;left: 2px;"></i>
							</a></li>
                        	<li><a href="#" class="btn btn-circle btn-default bGomme btn-menu" data-orientation="V">
								<i class="fa fa-eraser "></i>
							</a></li>
                        	<li><a href="#" class="btn btn-circle btn-default bMoveTo btn-menu" data-orientation="H">
								<i class="fa fa-crosshairs iconMenuBlue" style="font-size:24px"></i>
							</a></li>
                        	<li><a href="#" class="btn btn-circle btn-default bMove btn-menu" data-orientation="H" data-toggle="modal" data-target="#install_by_step_edit_map_modalTeleop">
								<i class="fa fa-gamepad iconMenuPurple"></i>
							</a></li>
                        </ul>
                    </div>
                    
                    <div id="install_by_step_edit_map_menu_point" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bDeletePoint"><i class="fa fa-trash iconMenuRed"></i></a></li>
                        </ul>
                    </div>
                    <div id="install_by_step_edit_map_menu_forbidden" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bDeleteForbidden"><i class="fa fa-trash iconMenuRed"></i></a></li>
                        </ul>
                    </div>
                    <div id="install_by_step_edit_map_menu_area" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bConfigArea"><i class="fa fa-gears iconMenuBlue"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bDeleteArea"><i class="fa fa-trash iconMenuRed"></i></a></li>
                        </ul>
                    </div>
                    <div id="install_by_step_edit_map_menu_dock" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
							<li><a href="#" class="btn btn-circle btn-default btn-menu" data-toggle="modal" data-target="#install_by_step_edit_map_modalDoSaveBeforeTestDock"><img class="fi-route" src="assets/images/route_green.svg"/></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bConfigDock"><i class="fa fa-gears iconMenuBlue"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bDeleteDock"><i class="fa fa-trash iconMenuRed"></i></a></li>
                        </ul>
                    </div>
                    <div id="install_by_step_edit_map_menu_poi" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
							<li><a href="#" class="btn btn-circle btn-default btn-menu" data-toggle="modal" data-target="#install_by_step_edit_map_modalDoSaveBeforeTestPoi"><img class="fi-route" src="assets/images/route_green.svg"/></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bConfigPoi"><i class="fa fa-gears iconMenuBlue"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bDeletePoi"><i class="fa fa-trash iconMenuRed"></i></a></li>
                        </ul>
                    </div>
                    <div id="install_by_step_edit_map_menu_augmented_pose" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
							<li><a href="#" class="btn btn-circle btn-default btn-menu" data-toggle="modal" data-target="#install_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose"><img class="fi-route" src="assets/images/route_green.svg"/></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bConfigAugmentedPose"><i class="fa fa-gears iconMenuBlue"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bDeleteAugmentedPose"><i class="fa fa-trash iconMenuRed"></i></a></li>
                        	
                        </ul>
                    </div>
                    
                    <div id="install_by_step_edit_map_modalTeleop" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
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
                                       
                                        <a href="#" class="btn btn-primary btn_footer_left btn_100" data-dismiss="modal" ><?php echo __('Close');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="install_by_step_edit_map_modalDoSaveBeforeTestDock" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                            
                                            <div class="row" style="margin-top:30px;">
                                                <div class="col-xs-7">
                                                    <span style="font-size:16px; color:#F90; padding-bottom:20px;"><?php echo __('Remember to save the map before launching a test');?></span>
                                                </div>
                                                <div class="col-xs-5">
                                                    <a href="#" class="btn btn-primary bSaveMapTestDock" style="margin-top:7px;"><?php echo __('Save map');?> <i class="fa"></i></a>
                                                </div>
                                            </div>
                                            
                                            
                                            <div class="row" style="margin-top:30px;">
                                                <div class="col-xs-7">
                                                    <span style="font-size:16px; padding-bottom:20px;"><?php echo __('You can change the position of the robot before the test');?></span>
                                                </div>
                                                <div class="col-xs-5">
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
                                       
                                        <a href="#" class="btn btn-primary bInitModalTest btn_footer_left btn_50" data-dismiss="modal"><?php echo __('Cancel');?></a>
                                        <a href="#" class="btn btn-warning bInitModalTest bTestDock btn_footer_right btn_50" data-dismiss="modal"><?php echo __('Go');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="install_by_step_edit_map_modalDoSaveBeforeTestPoi" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                            
                                            <div class="row" style="margin-top:30px;">
                                                <div class="col-xs-7">
                                                    <span style="font-size:16px; color:#F90; padding-bottom:20px;"><?php echo __('Remember to save the map before launching a test');?></span>
                                                </div>
                                                <div class="col-xs-8">
                                                    <a href="#" class="btn btn-primary bSaveMapTestPoi" style="margin-top:7px;"><?php echo __('Save map');?> <i class="fa"></i></a>
                                                </div>
                                            </div>
                                            
                                            
                                            <div class="row" style="margin-top:30px;">
                                                <div class="col-xs-7">
                                                    <span style="font-size:16px; padding-bottom:20px;"><?php echo __('You can change the position of the robot before the test');?></span>
                                                </div>
                                                <div class="col-xs-5">
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
                                        <a href="#" class="btn btn-primary btn_footer_right btn_50 bInitModalTest bTestPoi" data-dismiss="modal"><?php echo __('Go');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="install_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                            
                                            <div class="row" style="margin-top:30px;">
                                                <div class="col-xs-7">
                                                    <span style="font-size:16px; color:#F90; padding-bottom:20px;"><?php echo __('Remember to save the map before launching a test');?></span>
                                                </div>
                                                <div class="col-xs-5">
                                                    <a href="#" class="btn btn-primary bSaveMapTestAugmentedPose" style="margin-top:7px;"><?php echo __('Save map');?> <i class="fa"></i></a>
                                                </div>
                                            </div>
                                            
                                            
                                            <div class="row" style="margin-top:30px;">
                                                <div class="col-xs-7">
                                                    <span style="font-size:16px; padding-bottom:20px;"><?php echo __('You can change the position of the robot before the test');?></span>
                                                </div>
                                                <div class="col-xs-5">
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
                                       
                                        <a href="#" class="btn btn-default bInitModalTest btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Cancel');?></a>
                                        <a href="#" class="btn btn-primary bInitModalTest bTestAugmentedPose btn_footer_right btn_50" data-dismiss="modal"><?php echo __('Go');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal fade modalAreaOptions" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto">
                                            <form>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label">Area color</label>
                                                    <div class="col-xs-7">
                                                        <div id="install_by_step_edit_map_area_color_elem" class="input-group color" data-color="rgb(87, 159, 177)" data-color-format="rgb" data-plugin-colorpicker>
                                                            <span class="input-group-addon"><i></i></span>
                                                            <input id="install_by_step_edit_map_area_color" name="area_color" type="text" class="form-control" style="width:0; padding:0;">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('LED Color');?></label>
                                                    <div class="col-xs-8">
                                                        <select id="install_by_step_edit_map_led_color_mode" name="led_color_mode" class="form-control input-sm mb-md selectChangeAffGroup">
                                                            <option value="Automatic"><?php echo __('Automatic');?></option>
                                                            <option value="Manual"><?php echo __('Manual');?></option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div id="install_by_step_edit_map_led_color_group" class="form-group">
                                                    <label class="col-xs-4 control-label">LED color</label>
                                                    <div class="col-xs-7">
                                                        <div id="install_by_step_edit_map_led_color_elem" class="input-group color" data-color="rgb(255, 146, 180)" data-color-format="rgb" data-plugin-colorpicker>
                                                            <span class="input-group-addon"><i></i></span>
                                                            <input id="install_by_step_edit_map_led_color" name="led_color" type="text" class="form-control" style="width:0; padding:0;">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('LED Animation');?></label>
                                                    <div class="col-xs-8">
                                                        <select id="install_by_step_edit_map_led_animation_mode" name="led_animation_mode" class="form-control input-sm mb-md selectChangeAffGroup">
                                                            <option value="Automatic"><?php echo __('Automatic');?></option>
                                                            <option value="Manual"><?php echo __('Manual');?></option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div id="install_by_step_edit_map_led_animation_group" class="form-group">
                                                    <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('Animation');?></label>
                                                    <div class="col-xs-8">
                                                        <select id="install_by_step_edit_map_led_animation" name="led_animation" class="form-control input-sm mb-md">
                                                            <option value="1"><?php echo __('Progress');?></option>
                                                            <option value="2"><?php echo __('Progress from center');?></option>
                                                            <option value="3"><?php echo __('Rainbow');?></option>
                                                            <option value="4"><?php echo __('K2000');?></option>
                                                            <option value="5"><?php echo __('Blink');?></option>
                                                            <option value="6"><?php echo __('Blink 2');?></option>
                                                            <option value="7"><?php echo __('Police');?></option>
                                                            <option value="8"><?php echo __('Fade');?></option>
                                                            <option value="9"><?php echo __('Move');?></option>
                                                            <option value="10"><?php echo __('Light');?></option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('Max speed');?></label>
                                                    <div class="col-xs-8">
                                                        <select id="install_by_step_edit_map_max_speed_mode" name="max_speed_mode" class="form-control input-sm mb-md selectChangeAffGroup">
                                                            <option value="Automatic"><?php echo __('Automatic');?></option>
                                                            <option value="Manual"><?php echo __('Manual');?></option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div id="install_by_step_edit_map_max_speed_group" class="form-group">
                                                    <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('Max speed');?></label>
                                                    <div class="col-xs-8">
                                                        <input type="number" id="install_by_step_edit_map_max_speed" name="max_speed" class="form-control input-sm mb-md" />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <div style="clear:both;"></div>
										<a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Cancel');?></a>
                                        <a href="#" id="install_by_step_edit_map_bAreaSaveConfig" class="btn btn-primary btn_footer_right btn_50" data-dismiss="modal"><?php echo __('Save');?></a>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal fade modalAddDock" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                        
                                        	<a href="#" class="bUndock btn btn-primary btn_big_popup ifDocked"><i class="fa fa-upload"></i> <?php echo __('Undock robot');?></a>
                                        
                                        	<div class="ifUndocked">
                                                <div style="height:200px; position:relative;">
                                                
                                                    <img id="install_by_step_edit_map_modalAddDock_robot" src="assets/images/robot-dessus.png" width="50" style="position:absolute; top:130px; margin-left:-25px; z-index:300;" />
                                                    
                                                    <img id="install_by_step_edit_map_modalAddDock_dock0" class="dock" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddDock_dock1" class="dock" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddDock_dock2" class="dock" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddDock_dock3" class="dock" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddDock_dock4" class="dock" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddDock_dock5" class="dock" src="assets/images/reflector.png" width="25" />
                                                    
                                                </div>
                                            
                                            	<div class ="modal-advice">
                                                    <p class="texts_add_dock text_prepare_robot"><?php echo stripslashes(__('Move the robot in front of the dock and click on the "Scan" button'));?></p>
                                                    <p class="texts_add_dock text_set_dock"><?php echo stripslashes(__('Click on the fiducial to create the docking station'));?></p>
                                                </div>
                                                <p><a href="#" class="btn btn-primary bScanAddDock">Scan</a></p>
                                                
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
										<a href="#" id="install_by_step_edit_map_bModalAddDockSave" class="btn btn-primary btn_footer_right btn_50" data-dismiss="modal"><?php echo __('Save');?></a>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal fade modalDockOptions" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                        
                                        	<form>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label">Name</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" id="install_by_step_edit_map_dock_name" name="dock_name" value="" class="form-control input-sm mb-md" />
                                                    </div>
                                                </div>
                                                <!--
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label">Number</label>
                                                    <div class="col-xs-8">
                                                        <input type="number" id="install_by_step_edit_map_dock_number" name="dock_number" value="1" class="form-control input-sm mb-md" />
                                                    </div>
                                                </div>
                                                -->
                                                <input type="hidden" id="install_by_step_edit_map_dock_number" name="dock_number" value="1" />
                                                
                                                <div class="form-group">
                                                    <label for="dock_is_master" class="col-xs-10 control-label">Is default docking station for this robot</label>
                                                    <div class="col-xs-2">
                                                        <input type="checkbox" id="install_by_step_edit_map_dock_is_master" name="dock_is_master" class="input-sm mb-md" style="height:auto;" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label">Comment</label>
                                                    <div class="col-xs-8">
                                                        <textarea id="install_by_step_edit_map_dock_comment" name="dock_comment" class="form-control input-sm mb-md"></textarea>
                                                    </div>
                                                </div>
                                                <fieldset>
                                                	<legend>Undock procedure</legend>
                                                    <div style="text-align:left;">
                                                        <a href="#" class="bByStepUndockProcedureAddElem btn btn-circle btn-default"><i class="fa fa-plus"></i></a>
                                                        <ul class="list_undock_procedure list_elem">
                                                        </ul>
													</div>
                                                </fieldset>
                                            </form>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                        <a href="#" id="install_by_step_edit_map_bDockCancelConfig" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Cancel');?></a>
                                        <a href="#" id="install_by_step_edit_map_bDockSaveConfig" class="btn btn-primary btn_footer_right btn_50"><?php echo __('Save');?></a>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal fade modalDockElemOptions" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                        
                                        	<form>
                                                <div class="form-group">
                                                    <label class="col-xs-12 control-label">Action</label>
                                                    <div class="col-xs-6">
                                                        <input type="radio" id="install_by_step_edit_map_up_elem_action_move" name="up_elem_action" value="move" class="form-control" />
                                                    	<label for="up_elem_action_move" class="control-label">Move</label>    
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <input type="radio" id="install_by_step_edit_map_up_elem_action_rotate" name="up_elem_action" value="rotate" class="form-control" />
                                                    	<label for="up_elem_action_rotate" class="control-label">Rotate</label>
                                                    </div>
                                                </div>
                                                
                                                <div class="up_elem_action_move">
                                                    <div class="form-group">
                                                        <label class="col-xs-12 control-label">Direction</label>
                                                        <div class="col-xs-6">
                                                            <input type="radio" id="install_by_step_edit_map_up_elem_direction_front" name="up_elem_direction" value="front" class="form-control" />
                                                            <label for="up_elem_direction_front" class="control-label">Front</label>    
                                                        </div>
                                                        <div class="col-xs-6">
                                                            <input type="radio" id="install_by_step_edit_map_up_elem_direction_back" name="up_elem_direction" value="back" class="form-control" />
                                                            <label for="up_elem_direction_back" class="control-label">Back</label>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="form-group">
                                                        <label class="col-xs-12 control-label">Distance</label>
                                                        <div class="col-md-6 input-group mb-md">
                                                            <input type="text" value="0" class="form-control" name="up_elem_move_distance" id="install_by_step_edit_map_up_elem_move_distance" />
                                                            <span class="input-group-addon">m</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                
                                                <div class="up_elem_action_rotate">
                                                    <div class="form-group">
                                                        <label class="col-xs-12 control-label">Angle</label>
                                                        <div class="col-md-6 input-group mb-md">
                                                            <input type="text" value="0" class="form-control" name="up_elem_rotate_angle" id="install_by_step_edit_map_up_elem_rotate_angle" />
                                                            <span class="input-group-addon ">°</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </form>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                        <a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal"><?php echo __('Cancel');?></a>
                                        <a href="#" class="btn btn-primary bDockElemSave btn_footer_right btn_50" data-dismiss="modal"><?php echo __('Save');?></a>
                                       
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
                                        <a href="#" id="install_by_step_edit_map_bModalAddPoiSave" class="btn btn-primary btn_footer_right btn_50" data-dismiss="modal"><?php echo __('Add POI');?></a>
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
                                                        <input type="text" id="install_by_step_edit_map_poi_name" name="poi_name" value="" class="form-control input-sm mb-md" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label">Comment</label>
                                                    <div class="col-xs-8">
                                                        <textarea id="install_by_step_edit_map_poi_comment" name="poi_comment" class="form-control input-sm mb-md"></textarea>
                                                    </div>
                                                </div>
                                            </form>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
										<a href="#" id="install_by_step_edit_map_bPoiCancelConfig" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal"><?php echo __('Cancel');?></a>
                                        <a href="#" id="install_by_step_edit_map_bPoiSaveConfig" class="btn btn-primary btn_footer_right btn_50"><?php echo __('Save');?></a>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal fade modalAddAugmentedPose" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                        
                                        	<a href="#" class="bUndock btn btn-primary btn_big_popup ifDocked"><i class="fa fa-upload"></i> <?php echo __('Undock robot');?></a>
                                        
                                        	<div class="ifUndocked">
                                                
                                                <div style="height:200px; position:relative;">
                                                
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_robot" src="assets/images/robot-dessus.png" width="50" style="position:absolute; top:130px; margin-left:-25px; z-index:300;" />
                                                    
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_augmented_pose0" class="augmented_pose" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_augmented_pose1" class="augmented_pose" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_augmented_pose2" class="augmented_pose" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_augmented_pose3" class="augmented_pose" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_augmented_pose4" class="augmented_pose" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_augmented_pose5" class="augmented_pose" src="assets/images/reflector.png" width="25" />
                                                    
                                                </div>
                                            
                                            	<div class ="modal-advice">
                                                    <p class="texts_add_augmented_pose text_prepare_approch"><?php echo stripslashes(__('Move the robot at the approach position desired and click on the "Scan" button'));?></p>
                                                    <p class="texts_add_augmented_pose text_set_approch"><?php echo stripslashes(__('Click on the fiducial to set the approch position'));?></p>
                                                    <p class="texts_add_augmented_pose text_prepare_final"><?php echo stripslashes(__('Move the robot at the final position desired and click on the "Scan" button'));?></p>
                                                    <p class="texts_add_augmented_pose text_set_final"><?php echo stripslashes(__('Click on the fiducial to set the final position'));?></p>
                                                </div>                                                
                                                <p><a href="#" class="btn btn-primary bScanAddAugmentedPose">Scan</a></p>
                                                
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
                                        <a href="#" id="install_by_step_edit_map_bModalAddAugmentedPoseSave" class="btn btn-primary btn_footer_right btn_50" data-dismiss="modal"><?php echo __('Save');?></a>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal fade modalAugmentedPoseOptions" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                        
                                        	<form>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label">Name</label>
                                                    <div class="col-xs-8">
                                                        <input type="text" id="install_by_step_edit_map_augmented_pose_name" name="augmented_pose_name" value="" class="form-control input-sm mb-md" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label">Comment</label>
                                                    <div class="col-xs-8">
                                                        <textarea id="install_by_step_edit_map_augmented_pose_comment" name="augmented_pose_comment" class="form-control input-sm mb-md"></textarea>
                                                    </div>
                                                </div>
                                                <fieldset>
                                                	<legend>Undock procedure</legend>
                                                    <div style="text-align:left;">
                                                        <a href="#" class="bByStepUndockProcedureAugmentedPoseAddElem btn btn-circle btn-default"><i class="fa fa-plus"></i></a>
                                                        <ul class="list_undock_procedure_augmented_pose list_elem">
                                                        </ul>
                                                     </div>
                                                </fieldset>
                                            </form>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
										<a href="#" id="install_by_step_edit_map_bAugmentedPoseCancelConfig" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal"><?php echo __('Cancel');?></a>
                                        <a href="#" id="install_by_step_edit_map_bAugmentedPoseSaveConfig" class="btn btn-primary btn_footer_right btn_50"><?php echo __('Save');?></a>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal fade modalAugmentedPoseElemOptions" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                        
                                        	<form>
                                                <div class="form-group">
                                                    <label class="col-xs-12 control-label">Action</label>
                                                    <div class="col-xs-6">
                                                        <input type="radio" id="install_by_step_edit_map_up_augmented_pose_elem_action_move" name="up_augmented_pose_elem_action" value="move" class="form-control" />
                                                    	<label for="up_augmented_pose_elem_action_move" class="control-label">Move</label>    
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <input type="radio" id="install_by_step_edit_map_up_augmented_pose_elem_action_rotate" name="up_augmented_pose_elem_action" value="rotate" class="form-control" />
                                                    	<label for="up_augmented_pose_elem_action_rotate" class="control-label">Rotate</label>
                                                    </div>
                                                </div>
                                                
                                                <div class="up_augmented_pose_elem_action_move">
                                                    <div class="form-group">
                                                        <label class="col-xs-12 control-label">Direction</label>
                                                        <div class="col-xs-6">
                                                            <input type="radio" id="install_by_step_edit_map_up_augmented_pose_elem_direction_front" name="up_augmented_pose_elem_direction" value="front" class="form-control" />
                                                            <label for="up_augmented_pose_elem_direction_front" class="control-label">Front</label>    
                                                        </div>
                                                        <div class="col-xs-6">
                                                            <input type="radio" id="install_by_step_edit_map_up_augmented_pose_elem_direction_back" name="up_augmented_pose_elem_direction" value="back" class="form-control" />
                                                            <label for="up_augmented_pose_elem_direction_back" class="control-label">Back</label>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="form-group">
                                                        <label class="col-xs-12 control-label">Distance</label>
                                                        <div class="col-md-6 input-group mb-md">
                                                            <input type="text" value="0" class="form-control" name="up_augmented_pose_elem_move_distance" id="install_by_step_edit_map_up_augmented_pose_elem_move_distance" />
                                                            <span class="input-group-addon">m</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                
                                                <div class="up_augmented_pose_elem_action_rotate">
                                                    <div class="form-group">
                                                        <label class="col-xs-12 control-label">Angle</label>
                                                        <div class="col-md-6 input-group mb-md">
                                                            <input type="text" value="0" class="form-control" name="up_augmented_pose_elem_rotate_angle" id="install_by_step_edit_map_up_augmented_pose_elem_rotate_angle" />
                                                            <span class="input-group-addon ">°</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </form>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        
                                        <a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Cancel');?></a>
										<a href="#" class="btn btn-primary bAugmentedPoseElemSave btn_footer_right btn_50" data-dismiss="modal"><?php echo __('Save');?></a>
									</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="popupHelp">
                    	<h2>Help</h2>
                    	<ul style="color:#000;">
                        	<li><div class="iconForbiddenArea"><i class="fas fa-vector-square"></i><i class="fa fa-minus-circle iconMenuRed"></i></div><span class="description"><?= _('Add forbidden area')?></span></li>
                        	<li><i class="fa fa-draw-polygon iconMenuGreen" style="font-size: 26px;"></i><span class="description"><?= _('Add custom area')?></span></li>
                        	<li><i class="fa fa-map-marker-alt iconMenuBlue"></i><span class="description"><?= _('Add POI')?></span></li>
                        	<li><div class="iconAugmentedPose"><i class="fas fa-map-marker-alt iconMenuBlue"></i><i class="fas fa-barcode"></i></div><span class="description"><?= _('Add Augmented pose')?></span></li>
                        	<li><i class="fa fa-charging-station iconMenuGreen"></i><span class="description"><?= _('Add docking station')?></span></li>
                        	<li><i class="fa fa-eraser"></i><span class="description"><?= _('Erase pixel')?></span></li>
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
                    
                    
                </div>
                
                <div id="install_by_step_edit_map_zoom_popup" style="position:absolute; top:20px; left:20px; width:101px; height:101px; border:1px solid #000; overflow:hidden; display:none; z-index:8000;">
                    <div id="install_by_step_edit_map_zoom_popup_content" style="position:absolute; top:0; height:0;"></div>
                    <div id="install_by_step_edit_map_zoom_popup_mire" style="position:absolute; width:101px; height:101px; top:0; left:0; background-image:url(assets/images/mire.png);"></div>
                </div>
            </div>
            <footer>
            
            	
                
            	
				<a href="#" class="btn btn-success bSaveEditMap btn_footer_left btn_50"><?php echo __('Save map');?></a>
				<a href="#" class="btn btn-primary button_goto bSaveEditMap btn_footer_right btn_50" data-goto="install_by_step_config" ><?php echo __('Next');?></a>
            </footer>
        </section>
      
		<!--
        <section id="install_by_step_test_map" class="page with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_edit_map"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Test map');?></h2>
            </header>
            <div class="content">
                
                <div class="install_by_step_test_map_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
                
                <ul class="list_test list_elem">
                </ul>
                
            </div>
            <footer>
            
            	
                <a href="#" class="btn btn-default button_goto btn_footer_left btn_50 btn_back" data-goto="install_by_step_edit_map"><?php echo __('Back');?></a>
            
            	<a href="#" class="btn btn-primary button_goto bTestFinish btn_footer_right btn_50" data-goto="install_by_step_config"><?php echo __('Next');?></a>
            </footer>
        </section>
        -->
        
		<section id="install_by_step_config" class="page <?php echo $INSTALL_STEP == 30?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_edit_map"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Configuration');?></h2>
            </header>
            
            <div class="content">
                <form class="form_site" action="" method="post">
					<div class="install_by_step_config_loading loading_big" style="padding-top:20px;"><i class="fa fa fa-spinner fa-pulse"></i></div>
					<div class="loaded col-md-12" style="padding-top:25px;">
						<div class="form-group">
							<label for="i_level_min_gotocharge" class="col-xs-12 col-md-6 control-label"><?php echo __('Emergency battery level (execute a go to charge if the battery drops below this level)');?></label>
							<div class="col-md-6 input-group mb-md">
								<input type="text" value="0" class="form-control" name="i_level_min_gotocharge" id="install_by_step_config_i_level_min_gotocharge" />
								<span class="input-group-addon">%</span>
							</div>
						</div>
						
						<div class="form-group">
							<label for="i_level_min_dotask" class="col-xs-12 col-md-6 control-label"><?php echo __('Minimum battery level before move:');?></label>
							<div class="col-md-6 input-group mb-md">
								<input type="text" value="0" class="form-control" name="i_level_min_dotask" id="install_by_step_config_i_level_min_dotask" />
								<span class="input-group-addon">%</span>
							</div>
						</div>
						<a href="#" class="btn btn-sm btn-primary bResetValueEblMbl" style="margin-left:50%; transform:translateX(-50%);margin-bottom:10px;"><?php echo __('Reset values');?></a>
						
						<p><?= _('For more precise values, try to test battery in real conditions') ?></p>
						<a href="#" class="real_test btn btn-lg btn-success" style="margin-left:50%; transform:translateX(-50%)"><i class="fas fa-route"></i> <?=('Real Test')?></a>
						
						<a href="#" class="install_by_step_config_next button_goto" data-goto="install_by_step_maintenance" style="display:none;"></a>   
					</div>
                </form>
				<div class="modal fade modalRealTest" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto; text-align:center">
										<div class="modalRealTest_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i><br><?= _('Loading map\'s data') ?></div>
										<div class="modalRealTest_content">
											<p><?= _('Please choose a start position')?></p>
											<div class="form-group">
												<select class="form-control form-fa" id="real_test_start">
													<option value=""><?= _('Start position')?></option>
												</select>
											</div>
											<p><?= _('Please choose a destination')?></p>
											<div class="form-group">
												<select class="form-control form-fa" id="real_test_end">
													<option value=""><?= _('Arrival position')?></option>		
												</select>
											</div>
										</div>
									</div>
									<div style="clear:both;"></div>                                   
									<a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal"><?php echo __('Cancel');?></a>
									<a href="#" class="btn btn-primary bRealTestDo btn_footer_right btn_50" ><?php echo __('Go');?></a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal fade modalRealTestResult" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto; text-align:center">
										<div class="modalRealTestResult_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
										<div class="modalRealTestResult_content text-center">
											<div id="start_point">
												<h4><?= _('Go to start position')?></h4>
												<span id="start_point_text"></span>
												<div class="row" style="margin: 0;">
													<div class="col-xs-3">
														<a href="#" class="stop_move btn btn-danger btn-circle" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Stop move" style="display: none;"><i class="fa fa-stop battery-ko"></i></a>
													</div>
													<div class="col-xs-6 startRealTestprogress progress progress-striped light active m-md" style="margin: 6px 0;padding:0">
														<div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div>
													</div>
													<div class="col-xs-3">
														<i class="fas fa-check checkStart fa-2x iconMenuGreen"></i>
													</div>														
												</div>														
											</div>
											<div id="end_point">
												<h4><?= _('Go to destination')?></h4>
												<span id="end_point_text"></span>
												<div class="row" style="margin: 0;">
													<div class="col-xs-3">
														<a href="#" class="stop_move btn btn-danger btn-circle" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Stop move" style="display: none;"><i class="fa fa-stop battery-ko"></i></a>
													</div>
													<div class="col-xs-6 endRealTestprogress progress progress-striped light active m-md" style="margin: 6px 0;padding:0">
														<div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div>
													</div>
													<div class="col-xs-3">
														<i class="fas fa-check checkEnd fa-2x iconMenuGreen"></i>
													</div>														
												</div>
											</div>
											<div id="result_RealTest" style="border-top:1px solid #DCDCDC">
												<h4><?= _('Battery used :') ?> <span id="battery_used">0</span> %</h4>
												<p><?= _('Use this result as reference for battery configuration') ?></p>
												<a href="#" id="bUseRealTest" class="btn btn-success"><?php echo __('Use');?></a>
											</div>
										</div>
									</div>
									<div style="clear:both;"></div>
									<a href="#" class="btn btn-default btn_footer_left btn_100" data-dismiss="modal"><!-- onClick="wycaApi.StopMove()"--><?php echo __('Cancel');?></a>
								</div>
							</div>
						</div>
					</div>
				</div>
            </div>
            <footer>
				<a href="#" class="btn btn-default button_goto btn_footer_left btn_50 btn_back" data-goto="install_by_step_edit_map"><?php echo __('Back');?></a>
            	<a href="#" class="bConfigurationSave btn btn-primary btn_footer_right btn_50" data-goto="install_by_step_maintenance"><?php echo __('Save');?></a>
            </footer>
        </section>
		
        <section id="install_by_step_maintenance" class="page <?php echo $INSTALL_STEP == 31?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_config"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Maintenance');?></h2>
            </header>
            <div class="content">
				<p><?= __('A maintenance account for Wyca is by default enabled, however it can be removed to suit as your needs.') ?></p>
				<h4 style="text-align:center;margin:30px 0"><?= __('Keep Wyca maintenance account ?') ?></h4>
				<ul class="tuiles row">
                    <li class="col-xs-6">
                    	<div class="is_checkbox tuile_img no_update" id="bKeepMaintenanceAccount" style="bottom:0;border-radius:10px">
                    		<i class="fas fa-user-cog iconMenuGreen" style="padding-top:5px"></i>
							<h4 class="iconMenuGreen" style="margin-top: 0px;font-weight:700"><?php echo __('Keep');?></h4>
                        </div>
                    </li>
                    <li class="col-xs-6">
                    	<div class="is_checkbox tuile_img no_update" id="bDeleteMaintenanceAccount" style="bottom:0;border-radius:10px">
                    		<i class="fas fa-user-times iconMenuRed" style="padding-top:5px"></i>
							<h4 class="iconMenuRed" style="margin-top: 0px;font-weight:700"><?php echo __('Delete');?></h4>
                        </div>
                    </li>
				</ul>
				<a href="#" class="install_by_step_maintenance_next button_goto" data-goto="install_by_step_manager" style="display:none;"></a>
				
				<div class="modal fade modalMaintenance" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto">
										<form>
											<h4 style="text-align:center"><?= _('Maintenance account password') ?></h4>
											<p style="margin:20px 0"><?= _('Note precisely the password, you may have to send the robot back to wyca in case of loss.') ?></p>
											<div class="form-group nopymy">
												<label class="col-xs-12 col-md-3 control-label" for="password"><?php echo __('Password');?></label>
												<div class="col-xs-12 col-md-6 input-group input-group-icon">
													<input id="install_by_step_maintenance_i_maintenance_password" name="password" type="password" required="required" class="form-control" pattern="(?=^.{6,}$)(?=.*[A-z])(?=.*[0-9]).*$">
													<span class="input-group-addon">
														<span class="icon icon-lg">
															<i class="fa fa-lock"></i>
														</span>
													</span>
												</div>
											</div>
											<p class="password_format"><?= _('At least 6 characters, 1 letter, 1 digit')?> </p>
											<div class="form-group">
												<label class="col-xs-12 col-md-3 control-label" for="cpassword"><?php echo __('Confirm password');?></label>
												<div class="col-xs-12 col-md-6 input-group input-group-icon">
													<input id="install_by_step_maintenance_i_maintenance_cpassword" name="cpassword" type="password" required="required" class="form-control" pattern="(?=^.{6,}$)(?=.*[A-z])(?=.*[0-9]).*$">
													<span class="input-group-addon">
														<span class="icon icon-lg">
															<i class="fa fa-lock"></i>
														</span>
													</span>
												</div>
											</div>
											<p class="password_format"><?= _('At least 6 characters, 1 letter, 1 digit')?> </p>
										</form>
									</div>
									
									<div style="clear:both;"></div>
									<a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Cancel');?></a>
									<a href="#" id="install_by_step_maintenance_bMaintenanceSave" class="btn btn-primary btn_footer_right btn_50"><?php echo __('Save');?></a>
									
								</div>
							</div>
						</div>
					</div>
				</div>
            </div>
            <footer>
				<a href="#" class="btn btn-default button_goto btn_footer_left btn_100 btn_back" data-goto="install_by_step_config"><?php echo __('Back');?></a>
            </footer>
        </section>
        
        <section id="install_by_step_manager" class="page <?php echo $INSTALL_STEP == 32?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_maintenance"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Managers');?></h2>
            </header>
            <div class="content">
                
                <div class="install_by_step_manager_loading loading_big" style="padding-top:50px;"><i class="fa fa fa-spinner fa-pulse"></i></div>
                
                <div class="loaded col-md-12" style="padding-top:30px;">
                	<a href="#" class="bAddManager btn btn-primary">Add an account</a>
                
                    <ul class="list_managers list_elem">
                    </ul>
                    
                    <div class="modal fade modalManager" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto">
                                            <form>
                                            	<input type="hidden" name="i_id_manager" id="install_by_step_manager_i_id_manager" value="-1" />
                                                <div class="form-group" style="display:none">
                                                    <label class="col-xs-12 col-md-3 control-label" for="societe"><?php echo __('Company');?></label>
                                                    <div class="col-xs-12 col-md-6">
                                                        <input id="install_by_step_manager_i_manager_societe" value="company" name="societe" type="text" class="form-control">
                                                    </div>
                                                </div>
                                                <div class="form-group" style="display:none">
                                                    <label class="col-xs-12 col-md-3 control-label" for="prenom"><?php echo __('Firstname');?></label>
                                                    <div class="col-xs-12 col-md-6">
                                                        <input id="install_by_step_manager_i_manager_prenom" value="fname" name="prenom" type="text" class="form-control">
                                                    </div>
                                                </div>
                                                <div class="form-group" style="display:none">
                                                    <label class="col-xs-12 col-md-3 control-label" for="nom"><?php echo __('Lastname');?></label>
                                                    <div class="col-xs-12 col-md-6">
                                                        <input id="install_by_step_manager_i_manager_nom" value="lname" name="nom" type="text" class="form-control">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-12 col-md-3 control-label" for="email"><?php echo __('Login');?></label>
                                                    <div class="col-xs-12 col-md-6">
                                                        <input id="install_by_step_manager_i_manager_email" name="email" type="email" required="required" pattern="[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}" class="form-control">
                                                    </div>
                                                </div>
                                                <div class="form-group nopymy">
                                                    <label class="col-xs-12 col-md-3 control-label" for="password"><?php echo __('Password');?></label>
                                                    <div class="col-xs-12 col-md-6 input-group input-group-icon">
                                                        <input id="install_by_step_manager_i_manager_password" name="password" type="password" required="required" class="form-control" pattern="(?=^.{6,}$)(?=.*[A-z])(?=.*[0-9]).*$"> 
														<span class="input-group-addon">
															<span class="icon icon-lg">
																<i class="fa fa-lock"></i>
															</span>
														</span>
                                                    </div>
                                                </div>
												<p class="password_format"><?= _('At least 6 characters, 1 letter, 1 digit')?> </p>
                                                <div class="form-group">
                                                    <label class="col-xs-12 col-md-3 control-label" for="cpassword"><?php echo __('Confirm password');?></label>
                                                    <div class="col-xs-12 col-md-6 input-group input-group-icon">
                                                        <input id="install_by_step_manager_i_manager_cpassword" name="cpassword" type="password" required="required" class="form-control" pattern="(?=^.{6,}$)(?=.*[A-z])(?=.*[0-9]).*$">
														<span class="input-group-addon">
															<span class="icon icon-lg">
																<i class="fa fa-lock"></i>
															</span>
														</span>
                                                    </div>
                                                </div>
												<p class="password_format"><?= _('At least 6 characters, 1 letter, 1 digit')?> </p>
                                            </form>
                                        </div>
                                        
                                        <div style="clear:both;"></div>
										<a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Cancel');?></a>
                                        <a href="#" id="install_by_step_manager_bManagerSave" class="btn btn-primary btn_footer_right btn_50"><?php echo __('Save');?></a>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <footer>
				<a href="#" class="btn btn-default button_goto btn_footer_left btn_50 btn_back" data-goto="install_by_step_maintenance"><?php echo __('Back');?></a>
            	<a href="#" class="btn btn-primary button_goto bValidManager btn_footer_right btn_50" data-goto="install_by_step_service_book" style="z-index:2001;"><?php echo __('Next');?></a>
            </footer>
        </section>
		
        <section id="install_by_step_service_book" class="page <?php echo $INSTALL_STEP == 33?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_manager"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Service book');?></h2>
            </header>
            <div class="content">
                
                <div class="install_by_step_service_book_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
                
                <div class="loaded col-md-12" style="padding-top:30px;">
                    <a href="#" class="bAddServiceBook btn btn-primary">Add a service book</a>
                    <ul class="list_service_books list_elem">
                    </ul>
                    
                    <div class="modal fade modalServiceBook" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto">
                                            <form>
                                            	<div class="form-group">
                                                    <label class="col-xs-12 col-md-3 control-label" for="title"><?php echo __('Title');?></label>
                                                    <div class="col-xs-12 col-md-6">
                                                        <input id="install_by_step_service_book_i_service_book_title" name="title" type="text" class="form-control">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-12 col-md-3 control-label" for="comment"><?php echo __('Comment');?></label>
                                                    <div class="col-xs-12 col-md-6">
                                                        <textarea id="install_by_step_service_book_i_service_book_comment" name="comment" style="height:50vh;" class="form-control"></textarea>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                        <a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Cancel');?></a>
                                        <a href="#" id="install_by_step_service_book_bServiceBookSave" class="btn btn-primary btn_footer_right btn_50" ><?php echo __('Save');?></a>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
				</div>                
            </div>
            <footer>
				<a href="#" class="btn btn-default button_goto btn_footer_left btn_50 btn_back" data-goto="install_by_step_manager"><?php echo __('Back');?></a>
            	<a href="#" class="btn btn-primary button_goto bFinishInstallation btn_footer_right btn_50" data-goto="install_by_step_end" style="z-index:2001"><?php echo __('Finish');?></a>
            </footer>
        </section>
        
        <section id="install_by_step_end" class="page with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_service_book"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Congratulations !');?></h2>
            </header>
            <div class="content">
                
                <section class="panel panel-success">
                    <header class="panel-heading">
                        <h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fa fa-thumbs-up"></i></h2>
                    </header>
                    <div class="panel-body" style="text-align:center; font-size:24px; line-height:36px;">
                        <strong>Congratulations !</strong><br />
						The installation process is now complete.
                    </div>
                </section>
                
            </div>
            <footer>
            	<a href="#" class="btn btn-primary bCloseInstallation btn_footer_left btn_100" style="z-index:2001"><?php echo __('Close installation');?></a>
            </footer>
        </section>
		
		<div class="modal fade" id="modalBack" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
			<div class="modal-dialog" role="dialog">
				<div class="modal-content">
					<div class="modal-header">
						<div class="actions mh100vh_55">
							<section class="panel panel-warning">
								<header class="panel-heading">
									<h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fa fa-question-circle"></i></h2>
								</header>
								<div class="panel-body" style="text-align:center; font-size:24px; line-height:36px;">
									<h1>You're about to cancel all information not saved.</h1>
								</div>
							</section>
							<div style="clear:both;"></div>
							<a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Abort');?></a>
							<a href="#" id="bModalBackOk" data-goto="" class="btn btn-warning btn_footer_right btn_50 button_goto" ><?php echo __('OK');?></a>
						</div>
					</div>
				</div>
			</div>
		</div>
    </div>

	
