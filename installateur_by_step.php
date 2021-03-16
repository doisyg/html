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
                        <h2 style="margin-top:35px"><?=__('Français') ?></h2>
                    </li>
                	<li class="col-xs-6 col-md-6 col-lg-6" style="clear:both; margin-top:20px">
                        <a href="#" class="select_langue button_goto anim_tuiles tuile_img tuile2" data-goto="install_by_step_tops" data-id_lang="2">
                            <img src="assets/images/lang/en_big.jpg" />
                        </a>
                    </li>
					<li class="col-xs-6 col-md-6 col-lg-6" style="margin-top:20px">
                        <h2 style="margin-top:35px"><?=__('English') ?></h2>
                    </li>
                </ul>
				<div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content sm-content">
						<p><?= __('Please select the language displayed on the app by clicking on the correspondant flag.')?></p>					
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
				</div>
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
            <div class="content text-center">
            	<div class="install_by_step_tops_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
				<h5 class="text-center" style="margin-bottom:5px;"><?=__('Please select available tops for the vehicle.') ?></h5>
				<p class="text-center" style="margin-bottom:30px;"><i class="fas fa-exclamation-triangle"></i> <?=__('This is not the active top selection.') ?></p>
                <ul class="tuiles row">
                </ul>
                
                <div style="clear:both; height:40px;"></div>
                <a href="#" class="import_top btn btn-lg btn-success"><?= __('Import new top')?></a>   
                
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
                
                
				<div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content text-left">
						<p><?= __('Please select available tops by checkboxing its. These tops will then be available to indicate the active top on the robot.')?></p>
						
						<p><?= __('If you select only one top, the next step of choosing the active top will be ignored (the active top being the only available top).')?></p>					
						<p><?= __('You can also import a .wyca top config file.')?><br><div class="text-center"><a href="#" class="import_top btn btn-lg btn-success"><?= __('Import new top')?></a></div></p>			
						   
                
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
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
				<h5 class="text-center" style="margin-bottom:30px;"><?=__('Please select the active top for the vehicle.') ?></h5>
                <ul class="tuiles row">
                </ul>
  				<div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content text-left">
						<p><?= __('Please select active top by clicking on it. That will indicate to the vehicle that its current top on it is the one you picked.')?></p>
						
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
				</div>
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
            <div class="content" style="padding: 0;">
            
            	<div style="position:relative;max-width:375px; margin:auto;">
					<svg class="svg_legende" xmlns="http://www.w3.org/2000/svg">
						<line x1="65" y1="142" x2="109" y2="226" stroke-width="1" stroke="#343434" class="line_lidar"/>
						<line x1="187" y1="122" x2="168" y2="197" stroke-width="1" stroke="#343434" class="line_us"/>
						<line x1="187" y1="122" x2="134" y2="197" stroke-width="1" stroke="#343434" class="line_us"/>
						<line x1="308" y1="142" x2="226" y2="281" stroke-width="1" stroke="#343434" class="line_motor"/>
						<line x1="65" y1="351" x2="109" y2="286" stroke-width="1" stroke="#343434" class="line_battery"/>
						<line x1="187" y1="371" x2="155" y2="265" stroke-width="1" stroke="#343434" class="line_sensor"/>
						<line x1="308" y1="351" x2="174" y2="288" stroke-width="1" stroke="#343434" class="line_leds"/>
					</svg>
                    
                    <ul class="tuiles row" style="position:relative;max-width:375px; margin:0;">
                       
                        <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                            <div id="install_by_step_check_lidar" data-line="line_lidar" data-line-placement="bottom" class="is_checkbox anim_tuiles tuile_img tuile1 no_update">
                                <i class="fa fa-check component_state component_ok"></i>
                                <i class="fa fa-exclamation-triangle component_state component_warning"></i>
                                <i class="fa fa-exclamation-circle component_state component_error"></i>
                                <i class="fa fa fa-spinner fa-pulse"></i>
                                <img class="i" src="assets/images/radar_icon.png">
                                <?php echo __('Lidar');?>
                            </div>
                        </li>
                        <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                            <div id="install_by_step_check_us" data-line="line_us" data-line-placement="bottom" class="is_checkbox anim_tuiles tuile_img tuile1 no_update">
                                <i class="fa fa-check component_state component_ok"></i>
                                <i class="fa fa-exclamation-triangle component_state component_warning"></i>
                                <i class="fa fa-exclamation-circle component_state component_error"></i>
                                <i class="fa fa fa-spinner fa-pulse"></i>
                                <img class="i" src="assets/images/ultrasound.svg">
                                <?php echo __('Sonar');?>
                            </div>
                            <span class="trait_legende" style="width:calc(var(--vh, 1vh) * 20);transform:rotate(50deg)translateX(0px)translateY(0px);"></span>
                        </li>
                        <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                            <div id="install_by_step_check_motor" data-line="line_motor" data-line-placement="bottom" class="is_checkbox anim_tuiles tuile_img tuile1 no_update">
                                <i class="fa fa-check component_state component_ok"></i>
                                <i class="fa fa-exclamation-triangle component_state component_warning"></i>
                                <i class="fa fa-exclamation-circle component_state component_error"></i>
                                <i class="fa fa fa-spinner fa-pulse"></i>
                                <img class="i" src="assets/images/motor.png">
                                <?php echo __('Motor');?>
                            </div>
                            <span class="trait_legende" style="width:calc(var(--vh, 1vh) * 20);transform:rotate(50deg)translateX(0px)translateY(0px);"></span>
                        </li>
                        <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                            <img class="img-responsive" id="elodie_import_top" src="assets/images/elodie_form.png" style="z-index:5">
                        </li>
                        <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                            <div id="install_by_step_check_battery" data-line="line_battery" data-line-placement="top" class="is_checkbox anim_tuiles tuile_img tuile1 no_update">
                                <i class="fa fa-check component_state component_ok"></i>
                                <i class="fa fa-exclamation-triangle component_state component_warning"></i>
                                <i class="fa fa-exclamation-circle component_state component_error"></i>
                                <i class="fa fa fa-spinner fa-pulse"></i>
                                <i class="fa fa-battery-4"></i>
                                <?php echo __('Com. Battery');?>
                            </div>
                        </li>
                        <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                            <div id="install_by_step_check_cam3d" data-line="line_sensor" data-line-placement="top" class="is_checkbox anim_tuiles tuile_img tuile1 no_update">
                                <i class="fa fa-check component_state component_ok"></i>
                                <i class="fa fa-exclamation-triangle component_state component_warning"></i>
                                <i class="fa fa-exclamation-circle component_state component_error"></i>
                                <i class="fa fa fa-spinner fa-pulse"></i>
                                <img class="i" src="assets/images/3d_sensor.png">
                                <?php echo __('3D Sensor');?>
                            </div>
                        </li>
                        <li class="col-xs-4 col-md-3 col-lg-2 tuile_wrapper">
                            <div id="install_by_step_check_leds" data-line="line_leds" data-line-placement="top" class="is_checkbox anim_tuiles tuile_img tuile1 no_update">
                                <i class="fa fa-check component_state component_ok"></i>
                                <i class="fa fa-exclamation-triangle component_state component_warning"></i>
                                <i class="fa fa-exclamation-circle component_state component_error"></i>
                                <i class="fa fa fa-spinner fa-pulse"></i>
                                <img class="i" src="assets/images/strip_led2.png">
                                <?php echo __('Com. Leds');?>
                            </div>
                        </li>
                        
                    </ul>  
                </div>
				<div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content text-left">
						<p><?= __('This step will test the robot\'s components. For each tested components the result will appear on your screen.')?></p>
						<div style="display: flex;justify-content: space-around;">	
							<i class="fa fa-2x fa-check component_state component_ok"></i>
							<i class="fa fa-2x fa-exclamation-triangle component_state component_warning"></i>
							<i class="fa fa-2x fa-exclamation-circle component_state component_error"></i>
						</div>
						<p><?= __('If it turns green, this means no problem has been detected, if not click on the element to have more details')?></p>
						
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
				</div>
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
				<div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content text-left">
						<p><?= __('You have the possibility to connect the robot to a Wifi network to give it Internet access.')?></p>
						<p><?= __('This Internet access can be useful to allow Wyca to take control of the robot remotely and thus make updates or specific settings.')?></p>
						<p><?= __('If you do not want to connect the robot to a Wifi network, you can skip this step by clicking on the Skip button.')?></p>
						<p><?= __('This page will present the list of detected wifi networks.')?></p>
						<p><?= __('If the robot is currently connected to a Wifi network, it will appear in bold on a gray background.')?></p>
						<p><?= __('To connect the robot to a network, click on it, a popup will then allow you to enter the password of the network.')?></p>
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
				</div>
            </div>
			<footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_50 btn_back" data-goto="install_by_step_check" ><?= __('Back')?></a>
				<a href="#" class="skip_wifi button_goto btn btn-primary btn_footer_right btn_50" data-goto="install_by_step_sound"><?= __('Skip')?></a>
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
				
				<form id="form_connect_wifi" class="form_site" action="" method="post" style="margin-bottom:20px;">
					<input type="password" class="form-control i_wifi_passwd_name" value="" />
				</form>  
				
				
				<div class="wifi_connexion_error"></div>
				
				<div class="wifi_connexion_progress"><i class="fa fa fa-spinner fa-pulse"></i></div>
				
				
			</div>
			<footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_50 btn_back" data-goto="install_by_step_wifi"><?= __('Back')?></a>
				<a href="#" class="install_by_step_wifi_password_save btn btn-primary btn_footer_right btn_50"><?= __('Connect')?></a>
			</footer>
        </section>
		
		<section id="install_by_step_sound" class="page <?php echo $INSTALL_STEP == 6?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_wifi"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Sound management');?></h2>
            </header>
            <div class="content">
				<div class="row">
					<h4 class="col-xs-9" style="margin: 6px 0;"><?=__('Allow vehicle basics sounds')?></h4>
					<div class="col-xs-3 switch switch-sm switch-primary">
                        <input type="checkbox" name="switch" class="sound_switch_ROS" data-plugin-ios-switch checked="checked" />
                    </div>
				</div>
				<ul class="sound_list">
					<li><?= __('audible warning when reversing')?></li>
				</ul>
				<div class="row" style="margin-top:20px;">
					<h4 class="col-xs-9" style="margin:0;"><?=__('Allow this app to play sound through the vehicle')?></h4>
					<div class="col-xs-3 switch switch-sm switch-primary">
                        <input type="checkbox" name="switch" class="sound_switch_app"  data-plugin-ios-switch checked="checked" />
                    </div>
				</div>
				<ul class="sound_list">
					<li><?= __('audible success on goto operation')?></li>
					<li><?= __('audible error on goto operation')?></li>
				</ul>
				<div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content text-left">
						<p><?= __('You have the possibility to enable or disable vehicle sounds.')?></p>
						<p><?= __('You have the possibility to enable or disable sounds of this application.')?></p>
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
				</div>
            </div>
			<footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_50 btn_back" data-goto="install_by_step_wifi" ><?= __('Back')?></a>
				<a href="#" class="bNextSound button_goto btn btn-primary btn_footer_right btn_50" data-goto="install_by_step_site"><?= __('Next')?></a>
            </footer>
        </section>
        
		<section id="install_by_step_site" class="page <?php echo $INSTALL_STEP == 10?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_sound"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Site');?></h2>
            </header>
            <div class="content">
				<h4 style="text-align:center;margin:30px 0"><?= __('Import site or create a new one ?') ?></h4>
				<div class="row">
                    <div class="col-xs-6 text-center">
                    	<a class="button_goto bTuile btn" id="bImportSite" data-goto="install_by_step_import_site">
                    		<i class="fas fa-file-import iconMenuBlue"></i>
							<h5 class="iconMenuBlue"><?php echo __('Import existing site with map');?></h5>
                        </a>
                    </div>
                    <div class="col-xs-6 text-center">
                    	<a class="button_goto bTuile btn" id="bCreateSite" data-goto="install_by_step_new_site" >
                    		<i class="fas fa-hotel iconMenuGreen"></i>
							<h5 class="iconMenuGreen"><?php echo __('Create new site with mapping');?></h5>
                        </a>
                    </div>
				</div>
				<div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content text-left" style="justify-content: space-evenly;">
						<p><?= __('The vehicle can handle multiple sites and can change from one to another.')?></p>
						<p><?= __('You can import a site (using a .wyca file exported from another robot or from a backup for example).')?></p>
						<p><?= __('Or you can create a new site and do mapping next.')?></p>
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
				</div>
            </div>
			<footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_100 btn_back" data-goto="install_by_step_sound"><?= __('Back')?></a>
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
				<a href="#" class="install_by_step_import_site_next button_goto" data-goto="install_by_step_site_map" style="display:none;"></a>
            </div>
            <footer>
                <a href="#" class="button_goto btn btn-default btn_footer_left btn_50 btn_back" data-goto="install_by_step_site"><?= __('Back')?></a>
                <a href="#" class="btn btn-primary bImportSiteDo btn_footer_right btn_50"><?php echo __('Import');?></a>
            </footer>
        </section>
		
		<section id="install_by_step_site_map" class="page <?php echo $INSTALL_STEP == 61?'active':'';?> with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_by_step_import_site"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Select Map');?></h2>
            </header>
            <div class="content">
				<h4 style="text-align:center;margin:30px 0"><?= __('Select the current map') ?></h4>
				
				<div class="import_site_map_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
				<div class="row" id="ImportSiteMapList">
                    
				</div>
				<a href="#" class="install_by_step_site_map_next button_goto" data-goto="install_by_step_site_master_dock" style="display:none;"></a>
            </div>
            <footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_100 btn_back" data-goto=	"install_by_step_import_site"><?= __('Back')?></a>
            </footer>
        </section>
		
		<section id="install_by_step_site_master_dock" class="page <?php echo $INSTALL_STEP == 62?'active':'';?> with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_by_step_site_map"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Default Dock');?></h2>
            </header>
            <div class="content">
				<h4 style="text-align:center;margin:30px 0"><?= __('Select the default docking station') ?></h4>
				
				<div class="MasterDock_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
				<div class="row" id="MasterDockList">
                    
				</div>
				<p style="padding-left:5px;margin-top:10px"><i class="fas fa-asterisk" style="color: darkorange;"></i> <?=__('Actual default dock') ?></p>
				<a href="#" class="install_by_step_site_master_dock_next button_goto" data-goto="install_by_step_site_recovery" style="display:none;"></a>
            </div>
            <footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_100 btn_back" data-goto="install_by_step_site_map"><?= __('Back')?></a>
            </footer>
        </section>
		
		<section id="install_by_step_site_recovery" class="page <?php echo $INSTALL_STEP == 63?'active':'';?> with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_by_step_site_master_dock"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Recovery');?></h2>
            </header>
			<div class="content">
				
            	<h4 style="text-align:center;margin:15px 0"><?= __('The robot needs to relocate itself.') ?><br><br><?= __('Move the robot near a reflector (dock or augmented pose) then click on the recovery button') ?></h4>
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
				<div class="ifRecovery install_by_step_site_recovery_feedback recovery_feedback" style="display:none;">
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
				
				<a href="#" class="install_by_step_site_recovery_next button_goto" data-goto="install_by_step_edit_map" style="display:none;"></a>
            </div>
            <footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_50 btn_back" data-goto=	"install_by_step_site_master_dock"><?= __('Back')?></a>
				<a href="#" class="button_goto btn btn-warning btn_footer_right btn_50 skip_recovery" data-goto=	"install_by_step_edit_map"><?= __('Skip')?></a>
            </footer>
        </section>
		
		<section id="install_by_step_new_site" class="page <?php echo $INSTALL_STEP == 11?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_site"></a>
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
				<div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content text-left sm-content">
						<p><?= __('Choose a name for the new site.')?></p>
						<p><?= __('Keep in mind that Elodie cannot have two sites with the same name.')?></p>
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
				</div>
            </div>
			<footer>
				<a href="#" class="button_goto btn btn-default btn_footer_left btn_50 btn_back" data-goto="install_by_step_site"><?= __('Back')?></a>
				<a href="#" onClick="$('#form_site').submit();" class="install_by_step_site_save btn btn-primary btn_footer_right btn_50"><?= __('Next')?></a>
            </footer>
        </section>
		
        <section id="install_by_step_mapping" class="page <?php echo $INSTALL_STEP == 12?'active':'';?> hide_photo_back with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_new_site"></a>
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
                    <div class="btn_big_popup ifDocking ifUndocking" style="position: absolute;bottom: 50px;z-index: 2000;display: none;left:50%;transform:translateX(-50%)"><i class="fa fa fa-spinner fa-pulse"></i></div>
                    <div class="ifUndocked" style="position:absolute; bottom:50px; left:0; width:100%; z-index:2000;">
                        <div class="joystickDiv" draggable="false" style="margin:auto;">
                            <div class="fond"></div>
                            <div class="curseur"></div>
                        </div>
                    </div>
                    
					<div class="modal fade" id="install_by_step_mapping_modalConfirm" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
						<div class="modal-dialog" role="dialog">
							<div class="modal-content">
								<div class="modal-header">
									<div class="actions mh100vh_55">
										<section class="panel panel-info">
											<header class="panel-heading">
												<h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fa fa-question-circle"></i></h2>
											</header>
											<div class="panel-body" style="text-align:center; font-size:24px; line-height:36px;">
												<h3><?= __('Are you sure mapping is over ?')?></h3>
												<h4><?= __('In case mapping is not valid, you will have to start mapping again.')?></h4>
											</div>
										</section>
										<div style="clear:both;"></div>
										<a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Abort');?></a>
										<a href="#" class="btn btn-primary bMappingStop button_goto btn_footer_right btn_50" data-dismiss="modal" data-goto="install_by_step_mapping_fin"><?php echo __('Save');?></a>
									</div>
								</div>
							</div>
						</div>
					</div>
                </div>
				<div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content text-left sm-content">
						<p class="ifNMapping"><?= __('To start the mapping, you need to undock the robot if it docked to the charging station.')?></p>
						<p class="ifNMapping"><?= __('Then move the vehicle using the joystick to the start position.')?></p>
						<p class="ifNMapping"><?= __('Once you\'re ready, click on the Start button and begin mapping.')?></p>
						<p class="ifMapping"><?= __('When the mapping is started, the map will being built dynamically on your screen.')?></p>
						<p class="ifMapping"><?= __('The blue point is representing the vehicle facing toward. The map is automatically positioned according to this representation of the robot')?></p>
						<p class="ifMapping"><?= __('Continue the creation of the map by moving the robot using the joystick.')?></p>
						<p class="ifMapping"><?= __('Once the map is finalized, you can validate it by clicking on the Done button.')?></p>
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
				</div>				
            </div>
            <footer>
            	<a href="#" class="ifNMapping bMappingBack btn btn-default button_goto btn_footer_left btn_33 btn_back" data-goto="install_by_step_new_site" ><?php echo __('Back');?></a>
            	<a href="#" class="ifNMapping bMappingStart btn btn-primary btn_footer_right btn_66 ifUndocked" ><?php echo __('Start Mapping');?></a>
            	<a href="#" class="ifMapping btn btn-primary btn_footer_right btn_100 bMappingDone" style="display:none"><?php echo __('Mapping done');?></a>
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
                            <div style="max-height:80vh; overflow:auto;">
                                <i style="font-size:60px;" class="fa fa-spinner fa-pulse loading_fin_create_map"></i>
                                <canvas id="install_by_step_mapping_canvas_result_trinary" width="" height="" style="max-width:100%; max-height:65vh;"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <div style="clear:both; height:10px;"></div>
                    
                </div>
				<div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content text-left sm-content">
						<p class=""><?= __('Once the mapping is finished, you have the possibility to optimize the final result by playing on two values.')?></p>
						<p class=""><?= __('The default values are judicious in 95% of the cases.')?></p>
						<p class=""><?= __('It might be necessary to play with these values to correct navigation problems in particular cases.')?></p>
						<p class=""><?= __(' The goal is to make sure that all the walls are shown in black on the map and that all the areas where the robot has to move are shown in white on the map.')?></p>
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
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
					<div class="btn-circle btn-lg icon_menu" data-menu="install_by_step_edit_map_menu_gotopose">
						<i class="fa fa-crosshairs iconMenuBlue" style="left: -7px;"></i>
					</div>
					<div class="btn-circle btn-lg icon_menu" data-menu="install_by_step_edit_map_menu_dock">
						<i class="fas fa-charging-station iconMenuGreen" style="position: relative;top: -1px;left:-5px;"></i>
					</div>
					<div class="btn-circle btn-lg icon_menu" data-menu="install_by_step_edit_map_menu_poi">
						<i class="fa fa-map-marker-alt iconMenuBlue"></i>
					</div>
					<div class="btn-circle btn-lg icon_menu" data-menu="install_by_step_edit_map_menu_augmented_pose">
						<div class="iconAugmentedPose"><i class="fas fa-map-marker-alt iconMenuPurple"></i><i class="fas fa-barcode"></i></div>
					</div>
					<div class="btn-circle btn-lg icon_menu" data-menu="install_by_step_edit_map_menu_erase">
						<i class="fa fa-eraser" style="left: -9px;color: #333333;"></i>
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
                    <a href="#" id="install_by_step_edit_map_bCancelGomme" class="btn btn-circle btn-warning btn-menu"><i class="fa fa-times"></i></a>
                    <a href="#" id="install_by_step_edit_map_bSaveCurrentElem" class="btn btn-circle btn-primary btn-menu btnSaveElem"><i class="fa fa-check"></i></a>
                    <a href="#" id="install_by_step_edit_map_bCancelCurrentElem" class="btn btn-circle btn-warning btn-menu btnSaveElem"><i class="fa fa-times"></i></a>
                    
                    <a href="#" id="install_by_step_edit_map_bUndo" class="btn btn-default btn-circle disabled" style="position:absolute; bottom:20px; left:10px;"><i class="fas fa-undo-alt"></i></a>
                    <a href="#" id="install_by_step_edit_map_bRedo" class="btn btn-default btn-circle disabled" style="position:absolute; bottom:20px; left:45px;"><i class="fas fa-redo-alt"></i></a>
                    <span id="install_by_step_edit_map_tRobotNotLocalised" class="tRobotNotLocalised" style="display:none;"><i class="fas fa-exclamation-triangle"></i><?php echo __('The robot is not localized');?></span>
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
								<div class="iconAugmentedPose"><i class="fas fa-map-marker-alt iconMenuPurple"></i><i class="fas fa-barcode"></i></div>
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
							<li><a href="#" class="btn btn-circle btn-default btn-menu bTestDock" ><img class="fi-route" src="assets/images/route_green.svg"/></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bConfigDock"><i class="fa fa-gears iconMenuBlue"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bDeleteDock"><i class="fa fa-trash iconMenuRed"></i></a></li>
                        </ul>
                    </div>
                    <div id="install_by_step_edit_map_menu_poi" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
							<li><a href="#" class="btn btn-circle btn-default btn-menu bTestPoi"><img class="fi-route" src="assets/images/route_green.svg"/></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bConfigPoi"><i class="fa fa-gears iconMenuBlue"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bDeletePoi"><i class="fa fa-trash iconMenuRed"></i></a></li>
                        </ul>
                    </div>
                    <div id="install_by_step_edit_map_menu_augmented_pose" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
							<li><a href="#" class="btn btn-circle btn-default btn-menu bTestAugmentedPose"><img class="fi-route" src="assets/images/route_green.svg"/></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bConfigAugmentedPose"><i class="fa fa-gears iconMenuBlue"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bDeleteAugmentedPose"><i class="fa fa-trash iconMenuRed"></i></a></li>
                        </ul>
                    </div>
                    <div id="install_by_step_edit_map_menu_erase" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
							<li><a href="#" class="btn btn-circle btn-default btn-menu bGommeSize" data-size="10"><i class="fas fa-circle" style="font-size: 22px;position: relative;top: -0px;"></i></a></li>
							<li><a href="#" class="btn btn-circle btn-default btn-menu bGommeSize" data-size="5" ><i class="fas fa-circle" style="font-size: 16px;position: relative;top: -2px;"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-menu bGommeSize selected" data-size="1" ><i class="fas fa-circle" style="font-size: 10px;position: relative;top: -5px;"></i></a></li>
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
                    
                    <div id="install_by_step_edit_map_modalDoSaveBeforeTestDock" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
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
												<div class="col-xs-6 SaveBeforeTestDockProgress progress progress-striped light active m-md" style="margin: 6px 0;padding:0">
													<div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div>
												</div>
												<div class="col-xs-3">
													
												</div>														
											</div>
                                            
                                        </div>
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" class="btn btn-default btn_footer_right btn_100 bCancelTestDock" data-dismiss="modal"><?php echo __('Cancel');?></a>
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
                    
                    <div id="install_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
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
												<div class="col-xs-6 SaveBeforeTestAugmentedPoseProgress progress progress-striped light active m-md" style="margin: 6px 0;padding:0">
													<div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;"></div>
												</div>
												<div class="col-xs-3">
													
												</div>														
											</div>
                                            
                                        </div>
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" class="btn btn-default btn_footer_right btn_100 bCancelTestAugmentedPose" data-dismiss="modal"><?php echo __('Cancel');?></a>
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
                                                    <label class="col-xs-4 control-label"><?php echo __('Area Color');?></label>
                                                    <div class="col-xs-8">
                                                        <div id="install_by_step_edit_map_area_color_elem" class="input-group color input-group-sm">
                                                            <span class="input-group-addon"><i class="fas fa-stop preview_color"></i></span>
                                                            <input id="install_by_step_edit_map_area_color" name="area_color" type="text" class="form-control" value="#579fb1">
                                                        </div>
                                                    </div>
													<div class="iro-colorpicker" data-color_init="#579fb1"></div>
                                                </div>
												<div class="form-group sep">
                                                    <label class="col-xs-4 control-label"><?php echo __('LED Color');?></label>
                                                    <div class="col-xs-8">
														<div class="col-xs-12" style="padding:0; margin-bottom:5px;">
															<select id="install_by_step_edit_map_led_color_mode" name="led_color_mode" class="form-control input-sm mb-md selectChangeAffGroup">
																<option value="Automatic"><?php echo __('Automatic');?></option>
																<option value="Manual"><?php echo __('Manual');?></option>
															</select>
														</div>
														<div id="install_by_step_edit_map_led_color_group" class="col-xs-12" style="padding:0">
																<div id="install_by_step_edit_map_led_color_elem" class="input-group color input-group-sm">
																	<span class="input-group-addon"><i class="fas fa-stop preview_color"></i></span>
																	<input id="install_by_step_edit_map_led_color" name="led_color" type="text" class="form-control" value="#ff92b4">
																</div>
															<div class="iro-colorpicker" data-color_init="#ff92b4"></div>
														</div>
													</div>
                                                </div>
                                                <div class="form-group sep">
                                                    <label class="col-xs-4 control-label"><?php echo __('LED Animation');?></label>
                                                    <div class="col-xs-8">
                                                    	<div class="col-xs-12" style="padding:0;margin-bottom:5px;">
                                                            <select id="install_by_step_edit_map_led_animation_mode" name="led_animation_mode" class="form-control input-sm mb-md selectChangeAffGroup">
                                                                <option value="Automatic"><?php echo __('Automatic');?></option>
                                                                <option value="Manual"><?php echo __('Manual');?></option>
                                                            </select>
                                                    	</div>
                                                        <div id="install_by_step_edit_map_led_animation_group" class="col-xs-12" style="padding:0">
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
                                                </div>
                                                <div class="form-group sep">
                                                    <label class="col-xs-4 control-label"><?php echo __('Max Speed');?></label>
                                                    <div class="col-xs-8">
                                                    	<div class="col-xs-12" style="padding:0;margin-bottom:5px;">
                                                            <select id="install_by_step_edit_map_max_speed_mode" name="max_speed_mode" class="form-control input-sm mb-md selectChangeAffGroup">
                                                                <option value="Automatic"><?php echo __('Automatic');?></option>
                                                                <option value="Manual"><?php echo __('Manual');?></option>
                                                            </select>
                                                        </div>
                                                        <div id="install_by_step_edit_map_max_speed_group" class="col-xs-12 input-group input-group-sm mb-md" style="padding:0">
                                                            <input type="number" id="install_by_step_edit_map_max_speed" name="max_speed" class="form-control input-sm mb-md" />
                                                            <span class="input-group-addon">m/s</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group sep">
                                                    <label class="col-xs-4 control-label"><?php echo __('Min Obstacle Distance');?></label>
                                                    <div class="col-xs-8">
                                                    	<div class="col-xs-12" style="padding:0;margin-bottom:5px;">
															<select id="install_by_step_edit_map_min_distance_obstacle_mode" name="min_distance_obstacle_mode" class="form-control input-sm mb-md selectChangeAffGroup">
																<option value="Automatic"><?php echo __('Automatic');?></option>
																<option value="Manual"><?php echo __('Manual');?></option>
															</select>
                                                        </div>
                                                        <div id="install_by_step_edit_map_min_distance_obstacle_group" class="col-xs-12 input-group input-group-sm mb-md" style="padding:0">
                                                            <input type="number" id="install_by_step_edit_map_min_distance_obstacle" name="min_distance_obstacle" class="form-control input-sm mb-md" />
                                                            <span class="input-group-addon">cm</span>
                                                        </div>
                                                    </div>
                                                </div>
												<div class="form-group sep">
                                                    <label class="col-xs-4 control-label"><?php echo __('Area Sound');?></label>
                                                    <div class="col-xs-8">
                                                    	<div class="col-xs-12" style="padding:0; margin-bottom:5px;">
                                                        <select id="install_by_step_edit_map_area_sound" name="area_sound" class="form-control input-sm mb-md select_area_sound">
                                                            <option value="-1"><?php echo __('No sound');?></option>
                                                        </select>
                                                        </div>
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
											<div class="btn_big_popup ifDocking ifUndocking"><i class="fa fa fa-spinner fa-pulse"></i></div>
                                        	<div class="ifUndocked">
                                                <div style="height:200px; position:relative;">
                                                
                                                    <img id="install_by_step_edit_map_modalAddDock_robot" src="assets/images/robot-dessus.png" width="50" style="position:absolute; top:130px; margin-left:-25px; z-index:300;" />
                                                    
                                                    <img id="install_by_step_edit_map_modalAddDock_dock0" class="dock" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddDock_dock1" class="dock" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddDock_dock2" class="dock" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddDock_dock3" class="dock" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddDock_dock4" class="dock" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddDock_dock5" class="dock" src="assets/images/reflector.png" width="25" />
                                                    <div class="fiducial_number_wrapper"></div>
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
										<a href="#" id="install_by_step_edit_map_bModalAddDockSave" class="btn btn-primary btn_footer_right btn_50 ifDocked_disabled" data-dismiss="modal"><?php echo __('Save');?></a>
                                       
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
                                                    <label class="col-xs-4 control-label"><?= __('Name')?></label>
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
												
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label"><?= __('Fiducial ID')?></label>
                                                    <div class="col-xs-8">
                                                        <input type="number" id="install_by_step_edit_map_dock_fiducial_number" name="fiducial_ID" readonly value="1" class="form-control input-sm mb-md" />
                                                    </div>
                                                </div>
                                                
                                                <input type="hidden" id="install_by_step_edit_map_dock_number" name="dock_number" value="1" />
                                                
                                                <div class="form-group">
                                                    <label for="dock_is_master" class="col-xs-10 control-label"><?= __('Is default docking station for this robot')?></label>
                                                    <div class="col-xs-2">
                                                        <input type="checkbox" id="install_by_step_edit_map_dock_is_master" name="dock_is_master" class="input-sm mb-md" style="height:auto;" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label"><?= __('Comment')?></label>
                                                    <div class="col-xs-8">
                                                        <textarea id="install_by_step_edit_map_dock_comment" name="dock_comment" class="form-control input-sm mb-md"></textarea>
                                                    </div>
                                                </div>
                                                <fieldset>
                                                	<legend><?= __('Undock procedure')?></legend>
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
                                                    <label class="col-xs-12 control-label"><?= __('Action')?></label>
                                                    <div class="col-xs-6">
                                                        <input type="radio" id="install_by_step_edit_map_up_elem_action_move" name="up_elem_action" value="move" class="form-control" />
                                                    	<label for="up_elem_action_move" class="control-label"><?= __('Move')?></label>    
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <input type="radio" id="install_by_step_edit_map_up_elem_action_rotate" name="up_elem_action" value="rotate" class="form-control" />
                                                    	<label for="up_elem_action_rotate" class="control-label"><?= __('Rotate')?></label>
                                                    </div>
                                                </div>
                                                
                                                <div class="up_elem_action_move">
                                                    <div class="form-group">
                                                        <label class="col-xs-12 control-label"><?= __('Direction')?></label>
                                                        <div class="col-xs-6">
                                                            <input type="radio" id="install_by_step_edit_map_up_elem_direction_front" name="up_elem_direction" value="front" class="form-control" />
                                                            <label for="up_elem_direction_front" class="control-label"><?= __('Front')?></label>    
                                                        </div>
                                                        <div class="col-xs-6">
                                                            <input type="radio" id="install_by_step_edit_map_up_elem_direction_back" name="up_elem_direction" value="back" class="form-control" />
                                                            <label for="up_elem_direction_back" class="control-label"><?= __('Back')?></label>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="form-group">
                                                        <label class="col-xs-12 control-label"><?= __('Distance')?></label>
                                                        <div class="col-md-6 input-group mb-md">
                                                            <input type="text" value="0" class="form-control" name="up_elem_move_distance" id="install_by_step_edit_map_up_elem_move_distance" />
                                                            <span class="input-group-addon">m</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                
                                                <div class="up_elem_action_rotate">
                                                    <div class="form-group">
                                                        <label class="col-xs-12 control-label"><?= __('Angle')?></label>
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
                                        <a href="#" id="install_by_step_edit_map_bModalAddPoiSave" class="btn btn-primary btn_footer_right btn_50 ifDocked_disabled"><?php echo __('Add POI');?></a>
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
                                                    <label class="col-xs-4 control-label"><?= __('Name')?></label>
                                                    <div class="col-xs-8">
                                                        <input type="text" id="install_by_step_edit_map_poi_name" name="poi_name" value="" class="form-control input-sm mb-md" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label"><?= __('Comment')?></label>
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
											<div class="btn_big_popup ifDocking ifUndocking"><i class="fa fa fa-spinner fa-pulse"></i></div>
                                        	<div class="ifUndocked">
                                                
                                                <div style="height:200px; position:relative;">
                                                
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_robot" src="assets/images/robot-dessus.png" width="50" style="position:absolute; top:130px; margin-left:-25px; z-index:300;" />
                                                    
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_augmented_pose0" class="augmented_pose" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_augmented_pose1" class="augmented_pose" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_augmented_pose2" class="augmented_pose" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_augmented_pose3" class="augmented_pose" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_augmented_pose4" class="augmented_pose" src="assets/images/reflector.png" width="25" />
                                                    <img id="install_by_step_edit_map_modalAddAugmentedPose_augmented_pose5" class="augmented_pose" src="assets/images/reflector.png" width="25" />
													<div class="fiducial_number_wrapper"></div>
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
                                        <a href="#" id="install_by_step_edit_map_bModalAddAugmentedPoseSave" class="btn btn-primary btn_footer_right btn_50 ifDocked_disabled" data-dismiss="modal"><?php echo __('Save');?></a>
                                       
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
                                                    <label class="col-xs-4 control-label"><?= __('Name')?></label>
                                                    <div class="col-xs-8">
                                                        <input type="text" id="install_by_step_edit_map_augmented_pose_name" name="augmented_pose_name" value="" class="form-control input-sm mb-md" />
                                                    </div>
                                                </div>
												
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label"><?= __('Fiducial ID')?></label>
                                                    <div class="col-xs-8">	
                                                        <input type="number" id="install_by_step_edit_map_augmented_pose_fiducial_number" name="augmented_pose_fiducial_number" readonly value="1" class="form-control input-sm mb-md" />
                                                    </div>
                                                </div>
                                                
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label"><?= __('Comment')?></label>
                                                    <div class="col-xs-8">
                                                        <textarea id="install_by_step_edit_map_augmented_pose_comment" name="augmented_pose_comment" class="form-control input-sm mb-md"></textarea>
                                                    </div>
                                                </div>
                                                <fieldset>
                                                	<legend><?= __('Undock procedure')?></legend>
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
                                                    <label class="col-xs-12 control-label"><?= __('Action')?></label>
                                                    <div class="col-xs-6">
                                                        <input type="radio" id="install_by_step_edit_map_up_augmented_pose_elem_action_move" name="up_augmented_pose_elem_action" value="move" class="form-control" />
                                                    	<label for="up_augmented_pose_elem_action_move" class="control-label"><?= __('Move')?></label>    
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <input type="radio" id="install_by_step_edit_map_up_augmented_pose_elem_action_rotate" name="up_augmented_pose_elem_action" value="rotate" class="form-control" />
                                                    	<label for="up_augmented_pose_elem_action_rotate" class="control-label"><?= __('Rotate')?></label>
                                                    </div>
                                                </div>
                                                
                                                <div class="up_augmented_pose_elem_action_move">
                                                    <div class="form-group">
                                                        <label class="col-xs-12 control-label"><?= __('Direction')?></label>
                                                        <div class="col-xs-6">
                                                            <input type="radio" id="install_by_step_edit_map_up_augmented_pose_elem_direction_front" name="up_augmented_pose_elem_direction" value="front" class="form-control" />
                                                            <label for="up_augmented_pose_elem_direction_front" class="control-label"><?= __('Front')?></label>    
                                                        </div>
                                                        <div class="col-xs-6">
                                                            <input type="radio" id="install_by_step_edit_map_up_augmented_pose_elem_direction_back" name="up_augmented_pose_elem_direction" value="back" class="form-control" />
                                                            <label for="up_augmented_pose_elem_direction_back" class="control-label"><?= __('Back')?></label>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="form-group">
                                                        <label class="col-xs-12 control-label"><?= __('Distance')?></label>
                                                        <div class="col-md-6 input-group mb-md">
                                                            <input type="text" value="0" class="form-control" name="up_augmented_pose_elem_move_distance" id="install_by_step_edit_map_up_augmented_pose_elem_move_distance" />
                                                            <span class="input-group-addon">m</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                
                                                <div class="up_augmented_pose_elem_action_rotate">
                                                    <div class="form-group">
                                                        <label class="col-xs-12 control-label"><?= __('Angle')?></label>
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
					
                    <div class="modal fade modalHelpClickArea" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
										<div class="h100vh_160" style="overflow:auto; text-align:center;">
											<h2><?=__('Add area') ?></h2>
											<h4 style="text-align:justify;margin:30px 0;"><?=__('Click on the map to choose the position of the top-left corner point of your area.') ?></h4>
											<svg id="" width="100" height="100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events" preserveAspectRatio="xMinYMax meet" >
												<polygon points="30,30 70,30 70,70 30,70" style="fill: rgba(87, 159, 177, 0.5);"></polygon>
												<line x1="30" y1="30" x2="30" y2="70" stroke-width="5" style="stroke: #589FB2;"></line>
												<line x1="70" y1="30" x2="30" y2="30" stroke-width="5" style="stroke: #589FB2;"></line>
												<line x1="70" y1="70" x2="70" y2="30" stroke-width="5" style="stroke: #589FB2;"></line>
												<line x1="30" y1="70" x2="70" y2="70" stroke-width="5" style="stroke: #589FB2;"></line>
												<rect x="25" y="25" height="10" width="10" stroke-width="1"></rect>
												<rect x="65" y="25" height="10" width="10" stroke-width="1"></rect>
												<rect x="65" y="65" height="10" width="10" stroke-width="1"></rect>
												<rect x="25" y="65" height="10" width="10" stroke-width="1" ></rect>
												<path fill="currentColor" transform="scale(0.05) translate(550,550)" d="M302.189 329.126H196.105l55.831 135.993c3.889 9.428-.555 19.999-9.444 23.999l-49.165 21.427c-9.165 4-19.443-.571-23.332-9.714l-53.053-129.136-86.664 89.138C18.729 472.71 0 463.554 0 447.977V18.299C0 1.899 19.921-6.096 30.277 5.443l284.412 292.542c11.472 11.179 3.007 31.141-12.5 31.141z"></path>
											</svg>
											<h4 style="text-align:justify;margin:30px 0;"><?=__('Click on the menu icon to cancel.') ?></h4>
											
											<div class="checkbox checkbox_wrapper">
												<label>
													<input type="checkbox" value="" class="checkboxHelpArea">
													<?=__('Don\'t show this message again')?>
												</label>
											</div>
											<div class="btn-circle btn-lg btn-popup" style="display: block;">
												<i class="fas fa-draw-polygon iconMenuGreen" style="font-size: 28px;line-height: 28px;position: relative;left: -2px;"></i>
												<i class="fas fa-times times_icon iconMenuRed" style="display: inline-block;"></i>
											</div>
											<div style="clear:both;"></div>
											<a href="#" class="btn btn-primary btn_footer_left btn_100 bHelpClickAreaOk" data-dismiss="modal" ><?php echo __('Ok');?></a>
										</div>
									</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal fade modalHelpClickForbidden" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
										<div class="h100vh_160" style="overflow:auto; text-align:center;">
											<h2><?=__('Add forbidden area') ?></h2>
											<h4 style="text-align:justify;margin:30px 0;"><?=__('Click on the map to choose the position of the top-left corner point of your forbidden area.') ?></h4>
											<svg id="" width="100" height="100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events" preserveAspectRatio="xMinYMax meet" >
												<polygon points="30,30 70,30 70,70 30,70" style="fill: rgba(255, 0, 0, 0.3);"></polygon>
												<line x1="30" y1="30" x2="30" y2="70" stroke-width="5" style="stroke: #da3939;"></line>
												<line x1="70" y1="30" x2="30" y2="30" stroke-width="5" style="stroke: #da3939;"></line>
												<line x1="70" y1="70" x2="70" y2="30" stroke-width="5" style="stroke: #da3939;"></line>
												<line x1="30" y1="70" x2="70" y2="70" stroke-width="5" style="stroke: #da3939;"></line>
												<rect x="25" y="25" height="10" width="10" stroke-width="1"></rect>
												<rect x="65" y="25" height="10" width="10" stroke-width="1"></rect>
												<rect x="65" y="65" height="10" width="10" stroke-width="1"></rect>
												<rect x="25" y="65" height="10" width="10" stroke-width="1" ></rect>
												<path fill="currentColor" transform="scale(0.05) translate(550,550)" d="M302.189 329.126H196.105l55.831 135.993c3.889 9.428-.555 19.999-9.444 23.999l-49.165 21.427c-9.165 4-19.443-.571-23.332-9.714l-53.053-129.136-86.664 89.138C18.729 472.71 0 463.554 0 447.977V18.299C0 1.899 19.921-6.096 30.277 5.443l284.412 292.542c11.472 11.179 3.007 31.141-12.5 31.141z"></path>
											</svg>
											<h4 style="text-align:justify;margin:30px 0;"><?=__('Click on the menu icon to cancel.') ?></h4>
											
											<div class="checkbox checkbox_wrapper">
												<label>
													<input type="checkbox" value="" class="checkboxHelpForbidden">
													<?=__('Don\'t show this message again')?>
												</label>
											</div>
											<div class="btn-circle btn-lg btn-popup" style="display: block;">
												<div class="iconForbiddenArea"><i class="fas fa-vector-square"></i><i class="fa fa-minus-circle iconMenuRed"></i></div>
												<i class="fas fa-times times_icon iconMenuRed" style="display: inline-block;"></i>
											</div>
											<div style="clear:both;"></div>
											<a href="#" class="btn btn-primary btn_footer_left btn_100 bHelpClickForbiddenOk" data-dismiss="modal" ><?php echo __('Ok');?></a>
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
											<div class="install_by_step_edit_map_modalReloadMap_loading loading_big" style="margin-top: 50px;"><i class="fa fa fa-spinner fa-pulse fa-2x"></i></div>
                                        </div>
                                        
                                        <div style="clear:both;"></div>
										
                                        <a href="#" id="install_by_step_edit_map_bAbortReloadMap" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('No');?></a> 
										<a href="#" id="" class="btn btn-primary btn_footer_right btn_50 install_by_step_edit_map_bReloadMap"><?php echo __('Reload Map');?></a>
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
											<div class="install_by_step_edit_map_modalReloadMap_loading loading_big" style="margin-top: 50px;"><i class="fa fa fa-spinner fa-pulse fa-2x"></i></div>
                                        </div>
                                        
                                        <div style="clear:both;"></div>
										
                                        <a href="#" class="btn btn-warning btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Yes');?></a> 
										<a href="#" class="btn btn-primary btn_footer_right btn_50 install_by_step_edit_map_bReloadMap"><?php echo __('Reload Map');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
					<div class="install_by_step_edit_map_loading loading_big loading_map"><i class="fa fa fa-spinner fa-pulse fa-3x"></i></div>
                </div>
                
                <div id="install_by_step_edit_map_zoom_popup" style="position:absolute; top:20px; left:20px; width:101px; height:101px; border:1px solid #000; overflow:hidden; display:none; z-index:8000;">
                    <div id="install_by_step_edit_map_zoom_popup_content" style="position:absolute; top:0; height:0;"></div>
                    <div id="install_by_step_edit_map_zoom_popup_mire" style="position:absolute; width:101px; height:101px; top:0; left:0; background-image:url(assets/images/mire.png);"></div>
                </div>
				<div class="popupHelp">
					<h2 style="margin-top: 5px; margin-bottom: 15px;"><?=__('Help')?></h2>
					<ul style="color:#000;">
						<li><div class="iconForbiddenArea"><i class="fas fa-vector-square"></i><i class="fa fa-minus-circle iconMenuRed"></i></div><span class="description"><?=__('Add forbidden area')?></span></li>
						<li><i class="fa fa-draw-polygon iconMenuGreen" style="font-size: 26px;"></i><span class="description"><?=__('Add custom area')?></span></li>
						<li><i class="fa fa-map-marker-alt iconMenuBlue"></i><span class="description"><?=__('Add POI')?></span></li>
						<li><div class="iconAugmentedPose"><i class="fas fa-map-marker-alt iconMenuPurple"></i><i class="fas fa-barcode"></i></div><span class="description"><?=__('Add Augmented pose')?></span></li>
						<li><i class="fa fa-charging-station iconMenuGreen"></i><span class="description"><?=__('Add docking station')?></span></li>
						<li><i class="fa fa-eraser"></i><span class="description"><?=__('Erase pixel')?></span></li>
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
            
            	
                
            	
				<a href="#" class="btn btn-success bSaveEditMap btn_footer_left btn_50"><?php echo __('Save map');?></a>
				<a href="#" class="btn btn-primary button_goto bSaveEditMap btn_footer_right btn_50 bNextEditMap" data-goto="install_by_step_config" ><?php echo __('Next');?></a>
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
						
						<p><?=__('For more precise values, try to test battery in real conditions') ?></p>
						<a href="#" class="real_test btn btn-lg btn-success" style="margin-left:50%; transform:translateX(-50%)"><i class="fas fa-route"></i> <?= __('Real Test')?></a>
						
						<a href="#" class="install_by_step_config_next button_goto" data-goto="install_by_step_export_site" style="display:none;"></a>   
					</div>
                </form>
				<div class="modal fade modalRealTest" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto; text-align:center">
										<div class="modalRealTest_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i><br><?=__('Loading map\'s data') ?></div>
										<div class="modalRealTest_content">
											<p><?=__('Please choose a start position')?></p>
											<div class="form-group">
												<select class="form-control form-fa real_test_start">
													<option value=""><?=__('Start position')?></option>
												</select>
											</div>
											<p><?=__('Please choose a destination')?></p>
											<div class="form-group">
												<select class="form-control form-fa real_test_end">
													<option value=""><?=__('Arrival position')?></option>		
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
											<div class="start_point">
												<h4><?=__('Go to start position')?></h4>
												<span class="start_point_text"></span>
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
											<div class="end_point">
												<h4><?=__('Go to destination')?></h4>
												<span class="end_point_text"></span>
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
											<div class="result_RealTest" style="border-top:1px solid #DCDCDC">
												<h4><?=__('Battery used :') ?> <span class="battery_used">0</span> %</h4>
												<p><?=__('Use this result as reference for battery configuration') ?></p>
												<a href="#" class="btn btn-success bUseRealTest"><?php echo __('Use');?></a>
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
				<div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content text-left sm-content-text">
						<p class=""><?= __('You can configure two battery levels to avoid the robot getting stuck in the middle of an area because of battery breakdown.')?></p>
						<p class=""><?= __('Emergency battery level is the minimum level allowed on the robot. If the robot goes under it will automatically go to its default charging station')?></p>
						<p class=""><?= __('The second threshold is the level below which the robot will refuse to perform a task when docked')?></p>
						<p class=""><?= __('You can set these values manually or use the tool to evaluate the load consumption on a site in real conditions.')?></p>
						<p class=""><?= __('The real test tool will ask for two points, a starting and a arrival. It will automatically calculate the level of battery used between these two points.')?></p>
						<p class=""><?= __('You can then click on the Use button to let the tool fill yours battery levels. You can always change these values by hand.')?></p>
						<p class=""><?= __('Try to use the farthest points in order to have the most relevant test possible.')?></p>
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
				</div>
            </div>
            <footer>
				<a href="#" class="btn btn-default button_goto btn_footer_left btn_50 btn_back" data-goto="install_by_step_edit_map"><?php echo __('Back');?></a>
            	<a href="#" class="bConfigurationSave btn btn-primary btn_footer_right btn_50" data-goto="install_by_step_export_site"><?php echo __('Save');?></a>
            </footer>
        </section>
		
		<section id="install_by_step_export_site" class="page <?php echo $INSTALL_STEP == 31?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_config"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Site export');?></h2>
            </header>
            <div class="content">
                <div class="col-md-12" style="padding-top:10px;">
                	<p> <?=__('The export of a site is a backup of all the configuration linked to a site (map, charging stations, areas...).') ?></p>
					<a class="bExportSite bTuile center btn">
						<i class="fas fa-download iconMenuGreen"></i>
						<h4 class="iconMenuGreen"><?php echo __('Export Site');?></h4>
					</a>
					<p><?=__('You can also use the generated file to import this site on another vehicle.') ?><br><br><?=__('Keep this copy as it will allow you to reload your site in case of factory reset.') ?></p>
					<a href="#" class="install_by_step_export_site_next button_goto" data-goto="install_by_step_maintenance" style="display:none;"></a>
				
                </div>
                <div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content text-left sm-content">
						<p class=""><?= __('The export of a site is a backup of all the configuration linked to a site (map, charging stations, areas...).')?></p>
						<p class=""><?= __('You can also use the .wyca generated file to import this site on another vehicle.')?></p>
						<p class=""><?= __('Keep this copy as it will allow you to reload your site in case of factory reset.')?></p>
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
				</div>
            </div>
            <footer>
				<a href="#" class="btn btn-default button_goto btn_footer_left btn_50 btn_back" data-goto="install_by_step_config"><?php echo __('Back');?></a>
            	<a href="#" class="btn btn-warning button_goto btn_footer_right btn_50 bExportSiteSkip" data-goto="install_by_step_maintenance"><?php echo __('Skip');?></a>
            </footer>
        </section>
		
        <section id="install_by_step_maintenance" class="page <?php echo $INSTALL_STEP == 32?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_export_site"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Maintenance');?></h2>
            </header>
            <div class="content">
				<p><?= __('A maintenance account for Wyca is by default enabled, however it can be removed to suit your security requirement.') ?></p>
				<h4 style="text-align:center;margin:30px 0"><?= __('Keep Wyca maintenance account ?') ?></h4>
				<div class="tuiles row">
                    <div class="col-xs-6 text-center">
                    	<a class="bTuile btn" id="bModalDeleteMaintenanceAccount">
                    		<i class="fas fa-user-times iconMenuRed"></i>
							<h4 class="iconMenuRed"><?php echo __('Delete');?></h4>
                        </a>
                    </div>
					<div class="col-xs-6 text-center">
                    	<a class="bTuile btn" id="bKeepMaintenanceAccount">
                    		<i class="fas fa-user-cog iconMenuGreen"></i>
							<h4 class="iconMenuGreen"><?php echo __('Keep');?></h4>
                        </a>
                    </div>
				</div>
				<a href="#" class="install_by_step_maintenance_next button_goto" data-goto="install_by_step_manager" style="display:none;"></a>
				
				<div class="modal fade modalMaintenance" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto">
										<form>
											<h4 style="text-align:center"><i class="fas fa-key" style="color:#ed9c28;font-size:20px"></i> <?=__('Keep account default password') ?></h4>
											<p style="margin:20px 0"> <?=__('Do you want to keep the default password for Wyca maintenance account ?')?> </p>
											<div class="row">
												<div class="col-xs-6 text-center">
													<a class="bTuile btn" id="bChangeMaintenanceAccountPassword">
														<i class="fas fa-exchange-alt iconMenuBlue"></i>
														<h4 class="iconMenuBlue"><?php echo __('Change');?></h4>
													</a>
												</div>
												<div class="col-xs-6 text-center">
													<a class="bTuile btn" id="bKeepMaintenanceAccountPassword">
														<i class="fas fa-lock iconMenuGreen"></i>
														<h4 class="iconMenuGreen"><?php echo __('Keep');?></h4>
													</a>
												</div>
											</div>
											<p style="margin:20px 0"> <?=__('If you change and loose this password, the robot could become unusable with no recovery options other than a factory return.') ?> </p>
										</form>
									</div>
									
									<div style="clear:both;"></div>
									<a href="#" class="btn btn-default btn_footer_left btn_100" data-dismiss="modal" ><?php echo __('Back');?></a>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="modal fade modalPasswordMaintenance" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto">
										<form>
											<h4 style="text-align:center"><i class="fas fa-exclamation-triangle" style="color:#ed9c28;font-size:20px"></i> <?=__('Maintenance account password') ?></h4>
											<p style="margin:20px 0"> <?=__('Please save this password, it will be required by WYCA for maintenance operation.') ?><br><?=__('If you loose this password, the robot could become unusable with no recovery options.') ?></p>
											<div class="form-group nopymy">
												<label class="col-xs-12 col-md-3 control-label" for="password"><?php echo __('Password');?></label>
												<div class="col-xs-12 col-md-6 input-group input-group-icon">
													<input id="install_by_step_maintenance_i_maintenance_password" name="password" type="password" required="required" class="form-control" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?\/~_+\-=|0-9]).{8,}">
													<span class="input-group-addon">
														<span class="icon icon-lg">
															<i class="fa fa-lock"></i>
														</span>
													</span>
												</div>
											</div>
											<p class="password_format"><?=__('8 characters, lower and uppercase, digit or special char.')?> </p>
											<div class="form-group">
												<label class="col-xs-12 col-md-3 control-label" for="cpassword"><?php echo __('Confirm password');?></label>
												<div class="col-xs-12 col-md-6 input-group input-group-icon">
													<input id="install_by_step_maintenance_i_maintenance_cpassword" name="cpassword" type="password" required="required" class="form-control" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?\/~_+\-=|0-9]).{8,}">
													<span class="input-group-addon">
														<span class="icon icon-lg">
															<i class="fa fa-lock"></i>
														</span>
													</span>
												</div>
											</div>
											<p class="password_format"><?=__('8 characters, lower and uppercase, digit or special char.')?> </p>
										</form>
									</div>
									
									<div style="clear:both;"></div>
									<a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Cancel');?></a>
									<a href="#" id="install_by_step_maintenance_bPasswordMaintenanceSave" class="btn btn-primary btn_footer_right btn_50"><?php echo __('Save');?></a>
									
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="modal fade modalConfirmDeleteMaintenanceAccount" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
					<div class="modal-dialog" role="dialog">
						<div class="modal-content">
							<div class="modal-header">
								<div class="actions mh100vh_55">
									<div class="h100vh_160" style="overflow:auto">
										<h4 style="text-align:center;margin-bottom:20px"><i class="fas fa-user-times iconMenuRed"></i> <?=__('Delete Wyca maintenance account') ?></h4>
										<p><?=__('Wyca may need access to this account to operate maintenance operations on the robot.')?></p>
										<p><?=__('If you delete this account. Wyca will not be able to access the robot.')?></p>
										<p><?=__('In case of lost password, you may need to sent back the robot to Wyca.')?></p>
										<div style="display:flex;align-items: center;    position: absolute;bottom: 70px;">
											<input type="checkbox" class="cb_confirm" id="install_by_step_delete_maintenance_account" name="" />  
											<label for="install_by_step_delete_maintenance_account" style="margin-left:10px;font-size:16px; color:#000000;"><?php echo __('I confirm that I want to delete WYCA maintenance account.');?></label>
										</div>
										
									</div>
									
									<div style="clear:both;"></div>
									<a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Cancel');?></a>
									<a href="#" id="bDeleteMaintenanceAccount" class="btn btn-danger btn_footer_right btn_50 disabled"><?php echo __('Delete');?></a>
									
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content text-left sm-content">
						<p class=""><?= __('A maintenance account for Wyca is by default enabled, however it can be removed to suit your security requirement.')?></p>
						<p class=""><?= __('Wyca may need this account to perfom maintenance stuff on the vehicle')?></p>
						<p class=""><?= __('If you keep this account, you could change the default password or keep it too.')?></p>
						<p class=""><?= __('This password will be communicated to the Wyca team if necessary.')?></p>
						<p class=""><?= __('If you choose to change it, keep it safe beacuse if you lose the password, there will be no way to retrieve or reset it without returning the robot to Wyca\'s location.')?></p>
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
				</div>
            </div>
            <footer>
				<a href="#" class="btn btn-default button_goto btn_footer_left btn_100 btn_back" data-goto="install_by_step_export_site"><?php echo __('Back');?></a>
            </footer>
        </section>
        
        <section id="install_by_step_manager" class="page <?php echo $INSTALL_STEP == 33?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_maintenance"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Managers');?></h2>
            </header>
            <div class="content">
                
                <div class="install_by_step_manager_loading loading_big" style="padding-top:50px;"><i class="fa fa fa-spinner fa-pulse"></i></div>
                
                <div class="loaded col-md-12" style="padding-top:30px;">
					<a class="bTuile bAddManager center btn" id="bCreateManager">
						<i class="fas fa-user-plus iconMenuGreen"></i>
						<h4 class="iconMenuGreen" ><?php echo __('Create manager');?></h4>
					</a>
					
					<a href="#" class="bAddManager btn btn-primary" style="margin-left: 50%;transform: translateX(-50%);" id="bAddManager"><?= ('Add an account') ?></a>
                    <ul class="list_managers list_elem">
                    </ul>
					
                    <div class="modal fade modalHelpManager" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
										<div class="h100vh_160" style="overflow:auto; text-align:center;">
											<h2><?=__('Managers') ?></h2>
											<h4 style="text-align:left;margin:30px 0;"><?=__('Managers are the end-users of the vehicle, able to create POIs and take control of the robot.') ?></h4>
											<div style="display:flex;justify-content:space-around;">
												<div class="btn-circle btn-lg btn-popup" style="display:inline-block;position:unset;transform:unset;">
													<i class="fas fa-map-marker-alt iconMenuBlue" style="position: relative;left: -2px;line-height:1;"></i>
												</div>
												<div class="btn-circle btn-lg btn-popup" style="display:inline-block;position:unset;transform:unset;">
													<i class="fas fa-gamepad iconMenuPurple" style="position: relative;left: -11px;line-height:1;"></i>
												</div>
											</div>
											<h4 style="text-align:justify;margin:30px 0;"><?=__('The manager can also switch the active top among the available tops listed earlier in the installation process.') ?></h4>
											
											<div style="clear:both;"></div>
											<div class="checkbox checkbox_wrapper">
												<label>
													<input type="checkbox" value="" class="checkboxHelpManager">
													<?=__('Don\'t show this message again')?>
												</label>
											</div>
											<a href="#" class="btn btn-primary btn_footer_left btn_100 bHelpManagerOk" data-dismiss="modal" ><?php echo __('Ok');?></a>
										</div>
									</div>
                                </div>
                            </div>
                        </div>
                    </div>
					
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
                                                <div class="form-group nopymy">
                                                    <label class="col-xs-12 col-md-3 control-label" for="email"><?php echo __('Login');?></label>
                                                    <div class="col-xs-12 col-md-6 input-group input-group-icon">
                                                        <input id="install_by_step_manager_i_manager_email" name="email" type="email" required="required" pattern="[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}" class="form-control">
														<span class="input-group-addon">
															<span class="icon icon-lg">
																<i class="fas fa-at"></i>
															</span>
														</span>
													</div>
													
                                                </div>
												<p class="password_format" style="margin-bottom:0"><?=__('A valid mail adress.')?> </p>
                                                <div class="form-group nopymy">
                                                    <label class="col-xs-12 col-md-3 control-label" for="password"><?php echo __('Password');?></label>
                                                    <div class="col-xs-12 col-md-6 input-group input-group-icon">
                                                        <input id="install_by_step_manager_i_manager_password" name="password" type="password" required="required" class="form-control" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?\/~_+\-=|0-9]).{8,}"> 
														<span class="input-group-addon">
															<span class="icon icon-lg">
																<i class="fa fa-lock"></i>
															</span>
														</span>
                                                    </div>
                                                </div>
												<p class="password_format"><?=__('8 characters, lower and uppercase, digit or special char.')?> </p>
                                                <div class="form-group">
                                                    <label class="col-xs-12 col-md-3 control-label" for="cpassword"><?php echo __('Confirm password');?></label>
                                                    <div class="col-xs-12 col-md-6 input-group input-group-icon">
                                                        <input id="install_by_step_manager_i_manager_cpassword" name="cpassword" type="password" required="required" class="form-control" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?\/~_+\-=|0-9]).{8,}">
														<span class="input-group-addon">
															<span class="icon icon-lg">
																<i class="fa fa-lock"></i>
															</span>
														</span>
                                                    </div>
                                                </div>
												<p class="password_format"><?=__('8 characters, lower and uppercase, digit or special char.')?> </p>
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
            	<a href="#" class="bValidManagerNext btn btn-primary button_goto bValidManager btn_footer_right btn_50" data-goto="install_by_step_service_book" style="display:none;"><?php echo __('Next');?></a>
            	<a href="#" class="bValidManagerSkip btn btn-warning button_goto bValidManager btn_footer_right btn_50" data-goto="install_by_step_service_book"><?php echo __('Skip');?></a>
            </footer>
        </section>
		
        <section id="install_by_step_service_book" class="page <?php echo $INSTALL_STEP == 34?'active':'';?> with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_manager"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Service book');?></h2>
            </header>
            <div class="content">
                
                <div class="install_by_step_service_book_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
                
                <div class="loaded col-md-12" style="padding-top:0px;">
					<h5><?=__('Service books describe the vehicle\'s maintenance and deployement operations') ?></h5>
                    <a href="#" class="bAddServiceBook btn btn-primary"><?= __('Add a service book')?></a>
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
				<div class="popupHelp">
					<h2><?=__('Help')?></h2>
					<div class="content text-left">
						<p class=""><?= __('The last step in the process is to complete the robot\'s service book.')?></p>
						<p class=""><?= __('You need to indicate all the important elements concerning the life and maintenance of the robot to facilitate future maintenance.')?></p>
						<p class=""><?= __('To add an entry to the service log, click on the button in the center of the screen.')?></p>
						<p class=""><?= __('A popup will open allowing you to enter a title and description.')?></p>
						<p class=""><?= __('The various items in the service book are not removable or editable once created.')?></p>
					</div>
					<p class="legende"><?=__('Click to hide')?></p>
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
                <h2><?php echo __('Congratulations');?></h2>
            </header>
            <div class="content">
                
                <section class="panel panel-success" style="border: 0;box-shadow: unset;">
                    <header class="panel-heading" style="background: unset;padding: 0;border: 0;">
                        <img src="assets/images/Robot.gif" class="img-responsive" style="margin: 0 auto;height: auto;"/>
                    </header>
                    <div class="panel-body" style="text-align:center; font-size:24px; line-height:36px;    border: 0;">
                        <strong><?= __('Congratulations !')?></strong><br />
						<?= __('The installation process is now complete.') ?>
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
									<h1><?= __('You\'re about to cancel all information not saved.')?></h1>
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