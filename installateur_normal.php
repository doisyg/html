
	<div id="pages_install_normal" class="global_sub_page <?php echo $INSTALL_STEP >= 100?'active':'';?>">
        <section id="install_normal_dashbord" class="page hmi_tuile active">
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Dashboard');?></h2>
            </header>
            <div class="content">
                <ul class="tuiles row">
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile1 todo" data-goto="install_normal_map" href="#"><i class="fa fa-map-o"></i><?php echo __('Map');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile2" data-goto="install_normal_move" href="#"><i class="fa fa-gamepad"></i><?php echo __('Control robot');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile3" data-goto="install_normal_recovery" href="#"><i class="fa fa-search"></i><?php echo __('Recovery');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile4" data-goto="install_normal_setup" href="#"><i class="fa fa-gears"></i><?php echo __('Setup');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile5" data-goto="install_normal_manager" href="#"><i class="fa fa-group"></i><?php echo __('Managers');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile6" data-goto="install_normal_service_book" href="#"><i class="fa fa-book"></i><?php echo __('Service book');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile7 todo" data-goto="install_normal_help" href="#"><i class="fa fa-question"></i><?php echo __('Help');?></a></li>
                </ul>
            </div>
        </section>
        
        <section id="install_normal_map" class="page with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_normal_dashbord"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Map');?></h2>
            </header>
            <div class="content">
                <?php echo __('Comming soon');?>
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_normal_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        
        <section id="install_normal_setup" class="page hmi_tuile with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_normal_dashbord"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Setup');?></h2>
            </header>
            <div class="content">
                <ul class="tuiles row">
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile1 todo" data-goto="install_normal_setup_sites" href="#"><i class="fa fa-building"></i><?php echo __('Sites');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile2" data-goto="install_normal_setup_language" href="#"><i class="fa fa-language"></i><?php echo __('Language');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile3" data-goto="install_normal_setup_wifi" href="#"><i class="fa fa-gear"></i><?php echo __('Wifi');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile4" data-goto="install_normal_setup_vehicule" href="#"><i class="fa fa-android"></i><?php echo __('Vehicule');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile5" data-goto="install_normal_setup_tops" href="#"><i class="fa fa-cube"></i><?php echo __('Tops');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile6 todo" data-goto="install_normal_setup_export" href="#"><i class="fa fa-upload"></i><?php echo __('Save config');?></a></li>
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile7 todo" data-goto="install_normal_setup_import" href="#"><i class="fa fa-download"></i><?php echo __('Load config');?></a></li>
                </ul>
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_normal_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        
        <section id="install_normal_setup_language" class="page hmi_tuile with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_normal_setup"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Language');?></h2>
            </header>
            <div class="content">
            
            	<ul class="tuiles heightauto row">
                	<li class="col-xs-4">
                        <a href="#" class="select_langue anim_tuiles tuile_img tuile1" data-id_lang="1">
                            <img src="assets/images/lang/fr_big.jpg" />
                        </a>
                    </li>
                	<li class="col-xs-4">
                        <a href="#" class="select_langue anim_tuiles tuile_img tuile2" data-id_lang="2">
                            <img src="assets/images/lang/en_big.jpg" />
                        </a>
                    </li>
                </ul>
                
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_normal_setup"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        <section id="install_normal_setup_wifi" class="page with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_normal_setup"></a>
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
                
                <a href="#" class="set_passwd_wifi button_goto" data-goto="install_normal_setup_wifi_password" style="display:none;"></a>
                
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_normal_setup"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        <section id="install_normal_setup_wifi_password" class="page">
        	<a href="#" class="bBackButton button_goto" data-goto="install_normal_setup_wifi"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Wifi');?></h2>
            </header>
            <div class="content">
            
            	<h3><?php echo __('Set password');?></h3>
                
                <form class="form_site" action="" method="post" style="margin-bottom:20px;">
	                <input type="password" class="form-control i_wifi_passwd_name" value="" />
	                <button type="submit" class="install_normal_setup_wifi_password_save btn btn-default pull-right" style="margin-top:20px;">Connect</button>
                </form>
                
                <div class="wifi_connexion_error"></div>
                
                <div class="wifi_connexion_progress"><i class="fa fa fa-spinner fa-pulse"></i></div>
                
            </div>
        </section>
        <section id="install_normal_setup_vehicule" class="page with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_normal_setup"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Vehicule');?></h2>
            </header>
            <form class="form_site" action="" method="post" style="margin-bottom:20px;">
            <div class="content">
                
                <div class="install_normal_setup_vehicule_loading loading_big" style="padding-top:50px;"><i class="fa fa fa-spinner fa-pulse"></i></div>
                
                <div class="loaded col-md-12" style="padding-top:50px;">
                    
                    
                    
                    <div class="form-group">
                        <label for="i_level_min_gotocharge" class="col-xs-12 col-md-6 control-label"><?php echo __('Emergency battery level (execute a go to charge if the battery drops below this level)');?></label>
                        <div class="col-md-6 input-group mb-md">
                            <input type="text" value="0" class="form-control" name="i_level_min_gotocharge" id="install_normal_setup_vehicule_i_level_min_gotocharge" />
                            <span class="input-group-addon">%</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="i_level_min_dotask" class="col-xs-12 col-md-6 control-label"><?php echo __('Minimum battery level before move:');?></label>
                        <div class="col-md-6 input-group mb-md">
                            <input type="text" value="0" class="form-control" name="i_level_min_dotask" id="install_normal_setup_vehicule_i_level_min_dotask" />
                            <span class="input-group-addon">%</span>
                        </div>
                    </div>
                    
                    <a href="#" class="bConfigurationSave btn btn-primary"><?php echo __('Save');?></a>
                </div>
                
            </div>
            </form>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_normal_setup"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        <section id="install_normal_setup_tops" class="page hmi_tuile with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_normal_setup"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Tops');?></h2>
            </header>
            <div class="content">
            	<div class="install_normal_setup_tops_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
                <ul class="tuiles row">
                </ul>
                
                <a href="#" class="save_tops btn btn-default pull-right">Save</a> 
                <div style="clear:both; height:20px;"></div>
                <a href="#" class="import_top btn btn-default pull-left">Import new top</a>   
                  
                <a href="#" class="button_goto btn btn-default pull-right" data-goto="install_normal_setup_top" >Select active Top</a>
            
                <div class="modal fade modalImportTop" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                    <div class="modal-dialog" role="dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="actions mh100vh_55">
                                    <div class="h100vh_160" style="overflow:auto; text-align:center">
                                    
                                        <div class="modalImportTop_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
                                        <div class="modalImportTop_content">
	                                        <input class="file_import_top" type="file" class="form-control" />
                                        </div>
                                        
                                    </div>
                                    
                                    <div style="clear:both;"></div>
                                   
                                    <a href="#" class="btn btn-primary bImportTopDo" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Import');?></a>
                                    <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_normal_setup"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        <section id="install_normal_setup_top" class="page hmi_tuile with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_normal_setup_tops"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Seclect active top');?></h2>
            </header>
            <div class="content">
            	<div class="install_by_step_top_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
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
                                            <h3><?php echo __('Set active top');?></h3>
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
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_normal_setup"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        
        <section id="install_normal_move" class="page with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_normal_dashbord"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Control robot');?></h2>
            </header>
            <div class="content">
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
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_normal_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        
        
        <section id="install_normal_recovery" class="page with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_normal_dashbord"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Recovery');?></h2>
            </header>
            <div class="content">
            
            	<h3>Move the robot near a reflector then click on the recovery button</h3>
                
                <div style="text-align:center; margin-top:20px;"><a href="#" class="bRecovery btn btn-warning btn_big_popup ">Recovery</a></div>
                
            
                <div style="text-align:center"><a href="#" class="bUndock btn btn-primary btn_big_popup ifDocked"><i class="fa fa-upload"></i> <?php echo __('Undock robot');?></a></div>
                                        
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
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_normal_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        
        <section id="install_normal_manager" class="page with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_normal_dashbord"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Managers');?></h2>
            </header>
            <div class="content">
                
                <div class="install_normal_manager_loading loading_big" style="padding-top:50px;"><i class="fa fa fa-spinner fa-pulse"></i></div>
                
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
                                            	<input type="hidden" name="i_id_manager" id="install_normal_manager_i_id_manager" value="-1" />
                                                <div class="form-group">
                                                    <label class="col-xs-12 col-md-3 control-label" for="societe"><?php echo __('Company');?></label>
                                                    <div class="col-xs-12 col-md-6">
                                                        <input id="install_normal_manager_i_manager_societe" name="societe" type="text" class="form-control">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-12 col-md-3 control-label" for="prenom"><?php echo __('Firstname');?></label>
                                                    <div class="col-xs-12 col-md-6">
                                                        <input id="install_normal_manager_i_manager_prenom" name="prenom" type="text" class="form-control">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-12 col-md-3 control-label" for="nom"><?php echo __('Lastname');?></label>
                                                    <div class="col-xs-12 col-md-6">
                                                        <input id="install_normal_manager_i_manager_nom" name="nom" type="text" class="form-control">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-12 col-md-3 control-label" for="email"><?php echo __('Email');?></label>
                                                    <div class="col-xs-12 col-md-6">
                                                        <input id="install_normal_manager_i_manager_email" name="email" type="text" class="form-control">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-12 col-md-3 control-label" for="password"><?php echo __('Password');?></label>
                                                    <div class="col-xs-12 col-md-6">
                                                        <input id="install_normal_manager_i_manager_password" name="password" type="password" class="form-control">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-12 col-md-3 control-label" for="cpassword"><?php echo __('Confirm password');?></label>
                                                    <div class="col-xs-12 col-md-6">
                                                        <input id="install_normal_manager_i_manager_cpassword" name="cpassword" type="password" class="form-control">
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" id="install_normal_manager_bManagerSave" class="btn btn-primary" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Save');?></a>
                                        <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_normal_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        
        <section id="install_normal_service_book" class="page with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_normal_dashbord"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Service book');?></h2>
            </header>
            <div class="content">
                
                <div class="install_normal_service_book_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
                
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
                                                        <input id="install_normal_service_book_i_service_book_title" name="title" type="text" class="form-control">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label class="col-xs-12 col-md-3 control-label" for="comment"><?php echo __('Comment');?></label>
                                                    <div class="col-xs-12 col-md-6">
                                                        <textarea id="install_normal_service_book_i_service_book_comment" name="comment" style="height:50vh;" class="form-control"></textarea>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <div style="clear:both;"></div>
                                       
                                        <a href="#" id="install_normal_service_book_bServiceBookSave" class="btn btn-primary" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Save');?></a>
                                        <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
				</div>
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_normal_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
        
        <section id="install_normal_help" class="page with_footer">
	        <a href="#" class="bBackButton button_goto" data-goto="install_normal_dashbord"></a>
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Help');?></h2>
            </header>
            <div class="content">
                <?php echo __('Comming soon');?>
            </div>
            <footer>
                <a href="#" class="btn btn-wyca button_goto" data-goto="install_normal_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
            </footer>
        </section>
    </div>