<?php if (!isset($_SESSION['id_groupe_user']) || $_SESSION['id_groupe_user'] > 4) die('ERROR');?>
<div id="pages_user" class="global_page <?php echo $_SESSION['id_groupe_user'] == 4?'active':'';?>">
    <section id="user_dashbord" class="page hmi_tuile active">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Dashboard');?></h2>
        </header>
        <div class="content">
            <ul class="tuiles row">
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile1" data-goto="user_edit_map" href="#"><i class="fa fa-map-o"></i><?php echo __('Map');?></a></li>
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile2" data-goto="user_move" href="#"><i class="fa fa-gamepad"></i><?php echo __('Control robot');?></a></li>
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile3" data-goto="user_recovery" href="#"><i class="fa fa-search"></i><?php echo __('Recovery');?></a></li>
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile4 todo" data-goto="user_help" href="#"><i class="fa fa-question"></i><?php echo __('Help');?></a></li>
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
                    
                    <a href="#" id="user_edit_map_bStop" class="btn btn-circle btn-danger btn-lg"><i class="fa fa-stop"></i></a>
                    
                    <div id="user_edit_map_menu" class="menu_icon_touch" style="position:absolute; left:50%; top:50%;">
                    	<ul>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bMoveTo"><i class="fa fa-crosshairs"></i></a></li>
                        	<li><a href="#" class="btn btn-circle btn-default btn-lg bMove" data-toggle="modal" data-target="#user_edit_map_modalTeleop"><i class="fa fa-gamepad"></i></a></li>
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
                                       
                                        <a href="#" class="btn btn-primary btn_footer_w100" data-dismiss="modal" ><?php echo __('Close');?></a>
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
                                       
                                        <a href="#" class="btn btn-primary btn_footer_w100" data-dismiss="modal" ><?php echo __('Close');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="user_edit_map_modalDoSaveBeforeTestDock" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                            
                                            <h3 style="color:#F90; padding-bottom:20px;">Send robot to this docking station</h3>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" class="btn btn-default btn_footer_w50_left" data-dismiss="modal" ><?php echo __('Cancel');?></a>
                                        <a href="#" class="btn btn-primary btn_footer_w50_right bTestDock" data-dismiss="modal"><?php echo __('Continue');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="user_edit_map_modalDoSaveBeforeTestPoi" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                            
                                            <h3 style="color:#F90; padding-bottom:20px;">Send robot to this POI</h3>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" class="btn btn-default btn_footer_w50_left" data-dismiss="modal"><?php echo __('Cancel');?></a>
                                        <a href="#" class="btn btn-primary btn_footer_w50_right bTestPoi" data-dismiss="modal"><?php echo __('Continue');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="user_edit_map_modalDoSaveBeforeTestAugmentedPose" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                        <div class="modal-dialog" role="dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <div class="actions mh100vh_55">
                                        <div class="h100vh_160" style="overflow:auto; text-align:center">
                                            
                                            <h3 style="color:#F90; padding-bottom:20px;">Send robot to this Augmented pose</h3>
                                            
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" class="btn btn-default btn_footer_w50_left" data-dismiss="modal"><?php echo __('Cancel');?></a>
                                        <a href="#" class="btn btn-primary bTestAugmentedPose btn_footer_w50_right" data-dismiss="modal"><?php echo __('Continue');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="popupHelp">
                    	<h2>Help</h2>
                    	<ul style="color:#000;">
                        	<li><i class="fa fa-crosshairs"></i><span class="description">Move the robot to this point</span></li>
                        	<li><i class="fa fa-gamepad"></i><span class="description">Teleop the robot</span></li>
                        	<li><i class="fa fa-check"></i><span class="description">Test go to POI or dock</span></li>
                        	<li><span style="display:inline-block; margin-right:25px; width:15px; height:15px; border-radius:100%; background-color:#009900;"></span><span class="description">Robot position</span></li>
                        </ul>
                        
                        <p>Click to hide</p>
                    </div>
                    
                    
                </div>
                
                <div id="user_edit_map_zoom_popup" style="position:absolute; top:20px; left:20px; width:101px; height:101px; border:1px solid #000; overflow:hidden; display:none; z-index:8000;">
                    <div id="user_edit_map_zoom_popup_content" style="position:absolute; top:0; height:0;"></div>
                    <div id="user_edit_map_zoom_popup_mire" style="position:absolute; width:101px; height:101px; top:0; left:0; background-image:url(assets/images/mire.png);"></div>
                </div>
            </div>
        <footer>
            <a href="#" class="btn btn-default btn_footer_w100 button_goto" data-goto="user_dashbord"><?php echo __('Back');?></a>
        </footer>
    </section>
        
    <section id="user_move" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Control robot');?></h2>
        </header>
        <div class="content" style="text-align:center;">
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
            <a href="#" class="btn btn-default btn_footer_w100 button_goto" data-goto="user_dashbord"><?php echo __('Back');?></a>
        </footer>
    </section>
        
    <section id="user_recovery" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Recovery');?></h2>
        </header>
        <div class="content">
            
            	<h3>Move the robot near a reflector then click on the recovery button</h3>
                
                <div style="text-align:center; margin-top:20px;"><a href="#" class="bRecovery btn btn-warning btn_big_popup ">Recovery</a></div>
                
            
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
            <a href="#" class="btn btn-default btn_footer_w100 button_goto" data-goto="user_dashbord"><?php echo __('Back');?></a>
        </footer>
    </section>
        
    <section id="user_help" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Help');?></h2>
        </header>
        <div class="content">
            <?php echo __('Comming soon');?>
        </div>
        <footer>
            <a href="#" class="btn btn-default btn_footer_w100 button_goto" data-goto="user_dashbord"><?php echo __('Back');?></a>
        </footer>
    </section>
</div>