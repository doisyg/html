<?php if (!isset($_SESSION['id_groupe_user']) || $_SESSION['id_groupe_user'] > 3) die('ERROR');?>
<div id="pages_manager" class="global_page <?php echo $_SESSION['id_groupe_user'] == 3?'active':'';?>">
    <section id="install_dashbord" class="page hmi_tuile  active">
        <header>
            <div class="pull-left"><img src="assets/images/logo.png" /></div>
            <h2><?php echo __('Dashboard');?></h2>
        </header>
        <div class="content">
        </div>
    </section>
</div>