<?php if (!isset($userConnected) || $userConnected->id_groupe_user > 2) die('ERROR');

$INSTALL_STEP = Configuration::GetValue('INSTALL_STEP');
?>
<div id="pages_install" class="global_page <?php echo $userConnected->id_groupe_user == 2?'active':'';?>">

	<div id="pages_install_by_step" class="global_page <?php echo $INSTALL_STEP < 100?'active':'';?>">
    	<section id="install_by_step_lang" class="page <?php echo $INSTALL_STEP == 0?'active':'';?>">
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Language');?></h2>
            </header>
            <div class="content">
            
            	<h3><?php echo __('Select language');?></h3>
                
                <a class="select_langue button_goto" data-goto="install_by_step_wifi" data-id_lang="1" href="#"><img src="assets/images/lang/fr_big.jpg" /></a>
                
                <a class="select_langue button_goto" data-goto="install_by_step_wifi" data-id_lang="2" href="#"><img src="assets/images/lang/en_big.jpg" /></a>
                
            </div>
        </section>
    
    	<section id="install_by_step_wifi" class="page <?php echo $INSTALL_STEP == 1?'active':'';?>">
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Wifi');?></h2>
            </header>
            <div class="content">
            
            	<h3><?php echo __('Configure Wifi');?></h3>
                
                <h4>A FAIRE</h4>
                
                <a class="skip_wifi button_goto" data-goto="install_by_step_date" data-id_lang="2" href="#"><img src="assets/images/lang/en_big.jpg" /></a>
                
            </div>
        </section>
        
    
    	<section id="install_by_step_wifi" class="page <?php echo $INSTALL_STEP == 2?'active':'';?>">
            <header>
                <div class="pull-left"><img src="assets/images/logo.png" /></div>
                <h2><?php echo __('Date');?></h2>
            </header>
            <div class="content">
            
            	<h3><?php echo __('Configure date');?></h3>
                
                <h4>A FAIRE</h4>
                
            </div>
        </section>
    </div>

	<div id="pages_install_normal" class="global_page <?php echo $INSTALL_STEP >= 100?'active':'';?>">
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
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile4" data-goto="install_servicebook" href="#"><i class="fa fa-book"></i><?php echo __('Service book');?></a></li>
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
                    <li class="col-xs-4"><a class="button_goto anim_tuiles tuile4" data-goto="install_servicebook" href="#"><i class="fa fa-download"></i><?php echo __('Load config');?></a></li>
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