<?php if (!isset($userConnected) || $userConnected->id_groupe_user > 1) die('ERROR');?>
<div id="pages_wyca" class="global_page <?php echo $userConnected->id_groupe_user == 1?'active':'';?>">
    <section id="install_dashbord" class="page hmi_tuile  active">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Dashboard');?></h2>
        </header>
        <div class="content">
        </div>
    </section>
</div>