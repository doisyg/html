<?php if (!isset($_SESSION['id_groupe_user']) || $_SESSION['id_groupe_user'] > 1) die('ERROR');?>
<div id="pages_wyca" class="global_page <?php echo $_SESSION['id_groupe_user'] == 1?'active':'';?>">
    <section id="wyca_dashbord" class="page hmi_tuile  active">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Dashboard');?></h2>
        </header>
        <div class="content">
            <ul class="tuiles row">
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile1" data-goto="wyca_demo_mode_start_stop" href="#"><i class="fa fa-recycle"></i><?php echo __('Demo mode');?><br /><?php echo __('Start / Stop');?></a></li>
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile1" data-goto="wyca_demo_mode_config" href="#"><i class="fa fa-gears"></i><?php echo __('Demo mode');?><br /><?php echo __('Config');?></a></li>
                <li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile4 todo" data-goto="wyca_help" href="#"><i class="fa fa-question"></i><?php echo __('Help');?></a></li>
            </ul>
        </div>
    </section>
    
    <section id="wyca_demo_mode_start_stop" class="page hmi_tuile ">
    	<a href="#" class="bBackButton button_goto" data-goto="wyca_dashbord"></a>
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Demo mode Start / Stop');?></h2>
        </header>
        <div class="content">
        	<div class="wyca_demo_mode_start_stop_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
                
            <div class="loaded">
                <ul class="tuiles row">
                    <li class="col-xs-4 col-md-3 col-lg-2"><a id="wyca_demo_mode_start_stop_bStart" class="anim_tuiles tuile1" href="#"><i class="fa fa-play"></i><?php echo __('Start');?></a></li>
                    <li class="col-xs-4 col-md-3 col-lg-2"><a id="wyca_demo_mode_start_stop_bStop" class="anim_tuiles tuile1 todo" href="#"><i class="fa fa-gears"></i><?php echo __('Stop');?></a></li>
                </ul>
            </div>
        </div>
    </section>
    
    
    
    
    <section id="wyca_demo_mode_config" class="page with_footer">
        <a href="#" class="bBackButton button_goto" data-goto="wyca_dashbord"></a>
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Demo mode configuration');?></h2>
        </header>
        <div class="content">
            
            <div class="wyca_demo_mode_config_loading loading_big"><i class="fa fa fa-spinner fa-pulse"></i></div>
            
            <div class="loaded">
            	<h4>Battery level config</h4>
                 <form>
                    <div class="form-group col-xs-6">
                        <label class="col-xs-12 control-label">Min battery level<br />=> Start demo</label>
                        <div class="col-xs-12 input-group mb-md">
                            <input type="text" id="wyca_demo_mode_config_min_goto_demo" name="min_goto_demo" value="" class="form-control input-sm mb-md" />
                            <span class="input-group-addon ">%</span>
                        </div>
                    </div>
                    <div class="form-group col-xs-6">
                        <label class="col-xs-12 control-label">Min battery level<br />=> Go to charge</label>
                        <div class="col-xs-12 input-group mb-md">
                            <input type="text" id="wyca_demo_mode_config_min_goto_charge" name="min_goto_charge" value="" class="form-control input-sm mb-md" />
                            <span class="input-group-addon ">%</span>
                        </div>
                    </div>
                </form>
                
                <h4>Actions list</h4>
                <ul class="list_actions list_elem">
                </ul>

                <h4 style="margin-top:20px;">POI list</h4>
                <ul class="list_all_poi list_elem">
                </ul>
            
                <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#wyca_demo_mode_config_modalWaitOptions" style="margin-bottom:50px;"><?php echo __('Add wait step');?></a>
                
               	<div style="clear:both;"></div>
                
                <div id="wyca_demo_mode_config_modalWaitOptions" class="modal fade modalWaitOptions" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
                    <div class="modal-dialog" role="dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="actions mh100vh_55">
                                    <div class="h100vh_160" style="overflow:auto; text-align:center">
                                    
                                        <form>
                                            <input type="hidden" id="wyca_demo_mode_config_id_li_wait" value="-1" />
                                            <div class="form-group">
                                                <label class="col-xs-4 control-label">Duration</label>
                                                <div class="col-xs-8 input-group mb-md">
                                                    <input type="text" id="wyca_demo_mode_config_duration" name="duration" value="" class="form-control input-sm mb-md" />
                                                    <span class="input-group-addon ">secondes</span>
                                                </div>
                                            </div>
                                        </form>
                                        
                                    </div>
                                    
                                    <div style="clear:both;"></div>
                                   
                                    <a href="#" id="wyca_demo_mode_config_bSaveWait" class="btn btn-primary" data-dismiss="modal" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Save');?></a>
                                    <a href="#" id="wyca_demo_mode_config_bCancelWait" class="btn btn-warning" data-dismiss="modal" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer>
        
            
            <a href="#" class="btn btn-primary button_goto" data-goto="wyca_dashbord" style="position:absolute; width:50%; left:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
        
            <a href="#" class="btn btn-warning button_goto bSaveDemoMode" data-goto="wyca_demo_mode_config" style="position:absolute; width:50%; right:0; left:auto; bottom:0px; font-size:30px;"><?php echo __('Save');?></a>
        </footer>
    </section>
</div>