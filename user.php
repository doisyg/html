<?php if (!isset($_SESSION['id_groupe_user']) || $_SESSION['id_groupe_user'] > 4) die('ERROR');?>
<div id="pages_user" class="global_page <?php echo $_SESSION['id_groupe_user'] == 4?'active':'';?>">
    <section id="user_dashbord" class="page hmi_tuile active">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Dashboard');?></h2>
        </header>
        <div class="content">
            <ul class="tuiles row">
                <li class="col-xs-4"><a class="button_goto anim_tuiles tuile1 todo" data-goto="user_map" href="#"><i class="fa fa-map-o"></i><?php echo __('Map');?></a></li>
                <li class="col-xs-4"><a class="button_goto anim_tuiles tuile2 todo" data-goto="user_move" href="#"><i class="fa fa-gamepad"></i><?php echo __('Control robot');?></a></li>
                <li class="col-xs-4"><a class="button_goto anim_tuiles tuile3 todo" data-goto="user_recovery" href="#"><i class="fa fa-search"></i><?php echo __('Recovery');?></a></li>
                <li class="col-xs-4"><a class="button_goto anim_tuiles tuile4 todo" data-goto="user_help" href="#"><i class="fa fa-question"></i><?php echo __('Help');?></a></li>
            </ul>
        </div>
    </section>
        
    <section id="user_map" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Map');?></h2>
        </header>
        <div class="content">
            <?php echo __('Comming soon');?>
        </div>
        <footer>
            <a href="#" class="btn btn-wyca button_goto" data-goto="user_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
        </footer>
    </section>
        
    <section id="user_move" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Control robot');?></h2>
        </header>
        <div class="content">
            <?php echo __('Comming soon');?>
        </div>
        <footer>
            <a href="#" class="btn btn-wyca button_goto" data-goto="user_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
        </footer>
    </section>
        
    <section id="user_recovery" class="page with_footer">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Recovery');?></h2>
        </header>
        <div class="content">
            <?php echo __('Comming soon');?>
        </div>
        <footer>
            <a href="#" class="btn btn-wyca button_goto" data-goto="user_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
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
            <a href="#" class="btn btn-wyca button_goto" data-goto="user_dashbord"><i class="fa fa-chevron-left"></i> <?php echo __('Back');?></a>
        </footer>
    </section>
</div>