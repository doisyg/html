<?php if (!isset($userConnected) || $userConnected->id_groupe_user > 2) die('ERROR');

$INSTALL_STEP = Configuration::GetValue('INSTALL_STEP');
?>
<div id="pages_install" class="global_page <?php echo $userConnected->id_groupe_user == 2?'active':'';?>">

	<div id="pages_install_by_step" class="global_sub_page <?php echo $INSTALL_STEP < 100?'active':'';?>">
    	<section id="install_by_step_lang" class="page hmi_tuile <?php echo $INSTALL_STEP == 0?'active':'';?>">
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Select language');?></h2>
            </header>
            <div class="content">
            	<ul class="tuiles heightauto row">
                	<li class="col-xs-4">
                        <a href="#" class="select_langue button_goto anim_tuiles tuile_img tuile1" data-goto="install_by_step_wifi" data-id_lang="1">
                            <img src="assets/images/lang/fr_big.jpg" />
                        </a>
                    </li>
                	<li class="col-xs-4">
                        <a href="#" class="select_langue button_goto anim_tuiles tuile_img tuile2" data-goto="install_by_step_wifi" data-id_lang="2">
                            <img src="assets/images/lang/en_big.jpg" />
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    
    	<section id="install_by_step_wifi" class="page <?php echo $INSTALL_STEP == 1?'active':'';?>">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_lang"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Wifi');?></h2>
            </header>
            <div class="content">
            
            	<h3><?php echo __('Configure Wifi');?></h3>
                
                <table class="table table_wifi">
                	<tbody class="tbody_wifi">
                    </tbody>
                </table>
                
                <a href="#" class="refresh_wifi btn btn-default pull-left"><i class="fa fa-refresh"></i></a>
                
                <a href="#" class="skip_wifi button_goto btn btn-default pull-right" data-goto="install_by_step_date">Skip <i class="fa fa-chevron-right"></i></a>
                <a href="#" class="set_passwd_wifi button_goto" data-goto="install_by_step_wifi_password" style="display:none;"></a>
                
            </div>
        </section>
        <section id="install_by_step_wifi_password" class="page">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_wifi"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Wifi');?></h2>
            </header>
            <div class="content">
            
            	<h3><?php echo __('Set password');?></h3>
                
                <form class="form_site" action="" method="post" style="margin-bottom:20px;">
	                <input type="password" class="form-control i_wifi_passwd_name" value="" />
	                <button type="submit" class="install_by_step_wifi_password_save btn btn-default pull-right" style="margin-top:20px;">Connect</button>
                </form>
                
                <div class="wifi_connexion_error"></div>
                
                <div class="wifi_connexion_progress"><i class="fa fa fa-spinner fa-pulse"></i></div>
                
                <a href="#" class="skip_wifi button_goto btn btn-default pull-right" data-goto="install_by_step_date">Skip <i class="fa fa-chevron-right"></i></a>
            </div>
        </section>
        
    
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
        </section>
        
        <section id="install_by_step_tops" class="page hmi_tuile <?php echo $INSTALL_STEP == 3?'active':'';?>">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_date"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Select available Tops');?></h2>
            </header>
            <div class="content">
                <ul class="tuiles row">
                	<?php 
					$tops = Top::GetTops();
					$i = 0;
					foreach($tops as $top)
					{
						$i++;
                    	?><li class="col-xs-4">
                        	<a class="is_checkbox anim_tuiles tuile_img tuile<?php echo $i;?>" data-id_top="<?php echo $top->id_top;?>" href="#">
                            	<i class="fa fa-check"></i>
                        		<img src="assets/images/tops/<?php echo $top->image_name;?>" /><?php echo __($top->name);?>
                            </a>
                        </li><?php
                    }
					?>
                </ul>
                
                <a href="#" class="save_tops btn btn-default pull-right">Next <i class="fa fa-chevron-right"></i></a>   
                <a href="#" class="save_tops_next_select button_goto" data-goto="install_by_step_top" style="display:none;" data-goto="install_by_step_top"></a>   
                <a href="#" class="save_tops_next_check button_goto" data-goto="install_by_step_check" style="display:none;" data-goto="install_by_step_top"></a>   
            </div>
        </section>
        
        <section id="install_by_step_top" class="page hmi_tuile <?php echo $INSTALL_STEP == 4?'active':'';?>">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_tops"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Select active Top');?></h2>
            </header>
            <div class="content">
                <ul class="tuiles row">
                	<?php 
					$tops = Top::GetTops();
					$i = 0;
					foreach($tops as $top)
					{
						$i++;
                    	?><li class="col-xs-4 bTop<?php echo $top->id_top;?>" style="display:<?php echo $top->available==1?'block':'none';?>">
                        	<a href="#" class="set_top button_goto anim_tuiles tuile_img tuile<?php echo $i;?>" data-id_top="<?php echo $top->id_top;?>" data-goto="install_by_step_check">
                            	<img src="assets/images/tops/<?php echo $top->image_name;?>" /><?php echo __($top->name);?>
                            </a>
                        </li><?php
                    }
					?>
                </ul>           
            </div>
        </section>
        
        <section id="install_by_step_check" class="page hmi_tuile <?php echo $INSTALL_STEP == 5?'active':'';?>">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_top"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Check components');?></h2>
            </header>
            <div class="content">
                <ul class="tuiles row">
                    <li class="col-xs-4">
                    	<div class="is_checkbox test anim_tuiles tuile_img tuile1">
                            <i class="fa fa-check"></i>
                    		<i class="fa fa fa-spinner fa-pulse"></i>
                    		<i class="fa fa-wifi"></i>
							<?php echo __('Lidar');?>
                        </div>
                    </li>
                    <li class="col-xs-4">
                    	<div class="is_checkbox anim_tuiles tuile_img tuile1">
                            <i class="fa fa-check"></i>
                    		<i class="fa fa fa-spinner fa-pulse"></i>
                    		<i class="fa fa-volume-up"></i>
							<?php echo __('US');?>
                        </div>
                    </li>
                    <li class="col-xs-4">
                    	<div class="is_checkbox anim_tuiles tuile_img tuile1">
                            <i class="fa fa-check"></i>
                    		<i class="fa fa fa-spinner fa-pulse"></i>
                    		<i class="fa fa-gear"></i>
							<?php echo __('Motor card');?>
                        </div>
                    </li>
                    <li class="col-xs-4">
                    	<div class="is_checkbox anim_tuiles tuile_img tuile1">
                            <i class="fa fa-check"></i>
                    		<i class="fa fa fa-spinner fa-pulse"></i>
                    		<i class="fa fa-battery-4"></i>
							<?php echo __('BMS');?>
                        </div>
                    </li>
                    <li class="col-xs-4">
                    	<div class="is_checkbox anim_tuiles tuile_img tuile1">
                            <i class="fa fa-check"></i>
                    		<i class="fa fa fa-spinner fa-pulse"></i>
                    		<i class="fa fa-camera"></i>
							<?php echo __('3D cams');?>
                        </div>
                    </li>
                    <li class="col-xs-4">
                    	<div class="is_checkbox anim_tuiles tuile_img tuile1">
                            <i class="fa fa-check"></i>
                    		<i class="fa fa fa-spinner fa-pulse"></i>
                    		<i class="fa fa-spinner"></i>
							<?php echo __('Leds');?>
                        </div>
                    </li>
                </ul>   
                
                <a href="#" class="install_by_step_check_next button_goto btn btn-default pull-right" data-goto="install_by_step_site" style="display:none;">Next <i class="fa fa-chevron-right"></i></a>
            </div>
        </section>
        <section id="install_by_step_site" class="page <?php echo $INSTALL_STEP == 6?'active':'';?>">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_check"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Site');?></h2>
            </header>
            <div class="content">
                
                <h3><?php echo __('Indicate the site name');?></h3>
                
                <form class="form_site" action="" method="post" style="margin-bottom:20px;">
	                <input type="text" class="form-control i_site_name" value="" />
	                <button type="submit" class="install_by_step_site_save btn btn-default pull-right" style="margin-top:20px;">Next <i class="fa fa-chevron-right"></i></button>
                </form>
                
                <a href="#" class="install_by_step_site_next button_goto" data-goto="install_by_step_mapping" style="display:none;"></a>   
            </div>
        </section>
        <section id="install_by_step_mapping" class="page <?php echo $INSTALL_STEP == 7?'active':'';?> hide_photo_back with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_site"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Mapping');?></h2>
            </header>
            <div class="content">
                
                <div style="text-align:center; font-size:26px;">
                
                    <a href="#" class="bMappingStart btn btn-primary btn_big_popup"><i class="fa fa-play"></i> <?php echo __('Start mapping');?></a>
                    
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
                    
                    <div style="position:absolute; bottom:50px; left:0; width:100%; z-index:2000;">
                        <div class="joystickDiv" draggable="false" style="margin:auto;">
                            <div class="fond"></div>
                            <div class="curseur"></div>
                        </div>
                    </div>
                    
                </div>         
            </div>
            <footer>
            	<a href="#" class="bMappingStop btn btn-primary button_goto" data-goto="install_by_step_mapping_fin" style="display:none; position:absolute; right:0; bottom:0px; width:100%; z-index:2001; font-size:30px;"><i class="fa fa-stop"></i> <?php echo __('Mapping done');?></a>
            </footer>
        </section>
        <section id="install_by_step_mapping_fin" class="page hide_photo_back with_footer">
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
                        <div id="divOptionTrinary">
                            <div id="threshold_free_slider_elem" class="mt-lg mb-lg slider-primary" data-plugin-slider data-plugin-options='{ "value": 25, "range": "min", "max": 100 }' data-plugin-slider-output="#threshold_free_slider">
                                <input id="threshold_free_slider" type="hidden" value="25" />
                            </div>
                            <p id="threshold_free_output">Threshold free: <b>25</b></p>
                                                
                            <div id="threshold_occupied_slider_elem" class="mt-lg mb-lg slider-primary" data-plugin-slider data-plugin-options='{ "value": 65, "range": "min", "max": 100 }' data-plugin-slider-output="#threshold_occupied_slider">
                                <input id="threshold_occupied_slider" type="hidden" value="65" />
                            </div>
                            <p id="threshold_occupied_output">Threshold occupied: <b>65</b></p>
                            
                            <a href="#" class="btn btn-xs btn-primary bResetValueThreshold"><?php echo __('Reset values');?></a>
                            
                        </div>
                        <div id="divResultTrinary">
                            <div style="height:80vh; overflow:auto;">
                                <i style="font-size:60px;" class="fa fa-spinner fa-pulse loading_fin_create_map"></i>
                                <canvas id="canvas_result_trinary" width="" height="" style="max-width:100%; max-height:65vh;"></canvas>
                            </div>
                        </div>
                    </div>
                    
                    <div style="clear:both; height:10px;"></div>
                    
                </div>         
            </div>
            <footer>
            	<a href="#" class="btn btn-warning button_goto bMappingCancelMap2" data-goto="install_by_step_mapping" style="position:absolute; width:50%; left:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>           
                <a href="#" class="btn btn-primary bMappingSaveMap" style="width:50%; position:absolute; right:0; bottom:0px; left:auto; font-size:30px;"><?php echo __('Save');?></a>
                <a href="#" class="install_by_step_mapping_fin_next button_goto" data-goto="install_by_step_mapping_use" style="display:none;"></a>   
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
            	<a href="#" class="btn btn-warning button_goto bUseThisMapNowNo" data-goto="install_by_step_edit_map" style="position:absolute; width:50%; left:0; bottom:0px; font-size:30px;"><?php echo __('No');?></a>           
                <a href="#" class="btn btn-primary bUseThisMapNowYes" style="width:50%; position:absolute; right:0; left:auto; bottom:0px; font-size:30px;"><?php echo __('Yes');?></a>
                <a href="#" class="install_by_step_mapping_use_next button_goto" data-goto="install_by_step_edit_map" style="display:none;"></a>                   
            </footer>
        </section>
        
        <section id="install_by_step_edit_map" class="page <?php echo $INSTALL_STEP == 8?'active':'';?> hide_photo_back with_footer">
        	<a href="#" class="bBackButton button_goto" data-goto="install_by_step_mapping"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Edit map');?></h2>
            </header>
            <div class="content">
                
                <div id="install_by_step_edit_map_container_all">
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
                    
                    <a href="#" id="bEndGomme" class="btn btn-circle btn-primary btn-lg"><i class="fa fa-check"></i></a>
                    <a href="#" id="bSaveCurrentElem" class="btn btn-circle btn-primary btn-lg"><i class="fa fa-check"></i></a>
                    <a href="#" id="bCancelCurrentElem" class="btn btn-circle btn-warning btn-lg"><i class="fa fa-times"></i></a>
                    
                    <div id="install_by_step_edit_map_menu" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bAddForbiddenArea"><i class="fa fa-ban"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bAddArea"><i class="fa fa-square"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bAddPOI"><i class="fa fa-map-marker"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bAddDock"><i class="fa fa-flash"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bGomme"><i class="fa fa-eraser"></i></a></li>
                        </ul>
                    </div>
                    
                    <div id="install_by_step_edit_map_menu_point" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bDeletePoint"><i class="fa fa-trash"></i></a></li>
                        </ul>
                    </div>
                    <div id="install_by_step_edit_map_menu_forbidden" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bDeleteForbidden"><i class="fa fa-trash"></i></a></li>
                        </ul>
                    </div>
                    <div id="install_by_step_edit_map_menu_area" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bConfigArea"><i class="fa fa-gears"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bDeleteArea"><i class="fa fa-trash"></i></a></li>
                        </ul>
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
                                                        <div id="area_color_elem" class="input-group color" data-color="rgb(87, 159, 177)" data-color-format="rgb" data-plugin-colorpicker>
                                                            <span class="input-group-addon"><i></i></span>
                                                            <input id="area_color" name="area_color" type="text" class="form-control" style="width:0; padding:0;">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('LED Color');?></label>
                                                    <div class="col-xs-8">
                                                        <select id="led_color_mode" name="led_color_mode" class="form-control input-sm mb-md selectChangeAffGroup">
                                                            <option value="Automatic"><?php echo __('Automatic');?></option>
                                                            <option value="Manual"><?php echo __('Manual');?></option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div id="led_color_group" class="form-group">
                                                    <label class="col-xs-4 control-label">LED color</label>
                                                    <div class="col-xs-7">
                                                        <div id="led_color_elem" class="input-group color" data-color="rgb(255, 146, 180)" data-color-format="rgb" data-plugin-colorpicker>
                                                            <span class="input-group-addon"><i></i></span>
                                                            <input id="led_color" name="led_color" type="text" class="form-control" style="width:0; padding:0;">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('LED Animation');?></label>
                                                    <div class="col-xs-8">
                                                        <select id="led_animation_mode" name="led_animation_mode" class="form-control input-sm mb-md selectChangeAffGroup">
                                                            <option value="Automatic"><?php echo __('Automatic');?></option>
                                                            <option value="Manual"><?php echo __('Manual');?></option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div id="led_animation_group" class="form-group">
                                                    <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('Animation');?></label>
                                                    <div class="col-xs-8">
                                                        <select id="led_animation" name="led_animation" class="form-control input-sm mb-md">
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
                                                        <select id="max_speed_mode" name="max_speed_mode" class="form-control input-sm mb-md selectChangeAffGroup">
                                                            <option value="Automatic"><?php echo __('Automatic');?></option>
                                                            <option value="Manual"><?php echo __('Manual');?></option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div id="max_speed_group" class="form-group">
                                                    <label class="col-xs-4 control-label" for="inputSuccess"><?php echo __('Max speed');?></label>
                                                    <div class="col-xs-8">
                                                        <input type="number" id="max_speed" name="max_speed" class="form-control input-sm mb-md" />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" id="bAreaSaveConfig" class="btn btn-primary" data-dismiss="modal" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Save');?></a>
                                        <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="popupHelp">
                    	<h2>Help</h2>
                    	<ul>
                        	<li><i class="fa fa-ban"></i><span class="description">Add forbidden area</span></li>
                        	<li><i class="fa fa-square"></i><span class="description">Add custom area</span></li>
                        	<li><i class="fa fa-map-marker"></i><span class="description">Add POI</span></li>
                        	<li><i class="fa fa-flash"></i><span class="description">Add docking station</span></li>
                        	<li><i class="fa fa-eraser"></i><span class="description">Erase pixel</span></li>
                        </ul>
                        
                        <p>Click to hide</p>
                    </div>
                    
                    
                </div>
                
                <div id="zoom_popup" style="position:absolute; top:20px; left:20px; width:101px; height:101px; border:1px solid #000; overflow:hidden; display:none; z-index:8000;">
                    <div id="zoom_popup_content" style="position:absolute; top:0; height:0;"></div>
                    <div id="zoom_popup_mire" style="position:absolute; width:101px; height:101px; top:0; left:0; background-image:url(assets/images/mire.png);"></div>
                </div>
            </div>
            <footer>
            	<a href="#" class="btn btn-warning button_goto bSaveEditMap" data-goto="install_by_step_test_map" style="position:absolute; width:100%; left:0; bottom:0px; font-size:30px;"><?php echo __('Test');?></a>
            </footer>
        </section>
    </div>

	<div id="pages_install_normal" class="global_sub_page <?php echo $INSTALL_STEP >= 100?'active':'';?>">
        <section id="install_dashbord" class="page hmi_tuile active">
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Dashboard');?></h2>
            </header>
            <div class="content">
                <ul class="tuiles row">
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile1" data-goto="install_map" href="#"><i class="fa fa-map-o"></i><?php echo __('Maps');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile2" data-goto="install_setup" href="#"><i class="fa fa-gears"></i><?php echo __('Setup');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile3" data-goto="install_move" href="#"><i class="fa fa-gamepad"></i><?php echo __('Control robot');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile4" data-goto="install_users" href="#"><i class="fa fa-group"></i><?php echo __('Managers');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile5" data-goto="install_servicebook" href="#"><i class="fa fa-book"></i><?php echo __('Service book');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile6" data-goto="install_help" href="#"><i class="fa fa-question"></i><?php echo __('Help');?></a></li>
                </ul>
            </div>
        </section>
        
        <section id="install_map" class="page with_footer">
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Maps');?></h2>
            </header>
            <div class="content">
                MAPS
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        
        <section id="install_setup" class="page hmi_tuile with_footer">
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Setup');?></h2>
            </header>
            <div class="content">
                <ul class="tuiles row">
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile1" data-goto="install_map" href="#"><i class="fa fa-gear"></i><?php echo __('System');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile2" data-goto="install_setup" href="#"><i class="fa fa-building"></i><?php echo __('Sites');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile3" data-goto="install_move" href="#"><i class="fa fa-android"></i><?php echo __('Vehicule');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile4" data-goto="install_users" href="#"><i class="fa fa-upload"></i><?php echo __('Save config');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile5" data-goto="install_servicebook" href="#"><i class="fa fa-download"></i><?php echo __('Load config');?></a></li>
                </ul>
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        
        <section id="install_move" class="page with_footer">
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Control robot');?></h2>
            </header>
            <div class="content">
                CONTROL ROBOTS
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        
        <section id="install_users" class="page with_footer">
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Managers');?></h2>
            </header>
            <div class="content">
                MANAGERS
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        
        <section id="install_servicebook" class="page with_footer">
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Service book');?></h2>
            </header>
            <div class="content">
                SERVICE BOOK
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        
        <section id="install_help" class="page with_footer">
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Help');?></h2>
            </header>
            <div class="content">
                HELP
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
    </div>
</div>