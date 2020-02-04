<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "setup";
$sectionSousMenu = "";

$titre = __('Setup');

include ('template/header.php');
?>

<div class="inner-wrapper">

	<?php include ('template/gauche.php');?>


<section role="main" class="content-body">
    <header class="page-header">
        <h2><?php echo $titre;?></h2>
    
        <div class="right-wrapper pull-right">
            <ol class="breadcrumbs" style="margin-right:20px;">
                <li>
                    <a href="index.php">
                        <i class="fa fa-home"></i>
                    </a>
                </li>
                <li><span><?php echo $titre;?></span></li>
            </ol>
    
            <!--<a class="sidebar-right-toggle" data-open="sidebar-right"><i class="fa fa-chevron-left"></i></a>-->
        </div>
    </header>

	<?php include ('template/alertes.php');?>

    <!-- start: page -->
    <div class="row">
        <div class="col-md-12">
        	<?php if (isset($_GET['notallow']))
			{
				?>
                <div class="row">
                    <div class="alert alert-danger">
                        <p class="m-none text-semibold h6"><?php echo __('Vous n\'êtes pas autorisé à faire cette action');?></p>
                    </div>
                </div>
                <?php
			}?>
                
        	<section class="panel">
                <header class="panel-heading panel-heading-transparent">
                    <h2 class="panel-title"><?php echo __('Setup');?></h2>
                </header>
                <div class="panel-body" style="padding-top:0; padding-bottom:0; min-height:calc(100vh - 400px);">
                    <ul id="listBoutonHome">                        
                        <?php 
						if ($userConnected->CanDo('setup', '', 'edit')){?>
						<li class="col-xs-6 col-md-3">
							<a class="btn btn-primary" href="<?php echo $_CONFIG['URL'];?>robot_setup.php">
								<i class="fa fa-android" aria-hidden="true"></i>
								<span><?php echo __('Robot');?><br />&nbsp;</span>
							</a>
						</li>
						<?php
						}
						if ($userConnected->CanDo('setup', 'sites', 'view')){?>
						<li class="col-xs-6 col-md-3">
							<a class="btn btn-primary" href="<?php echo $_CONFIG['URL'];?>sites.php">
								<i class="fa fa-building-o" aria-hidden="true"></i>
								<span><?php echo __('Sites');?><br />&nbsp;</span>
							</a>
						</li>
						<?php
						}
						if ($userConnected->CanDo('setup', 'users', 'view')){?>
						<li class="col-xs-6 col-md-3">
							<a class="btn btn-primary" href="<?php echo $_CONFIG['URL'];?>users.php">
								<i class="fa fa-users" aria-hidden="true"></i>
								<span><?php echo __('Users management');?></span>
							</a>
						</li>
						<?php }
						if ($userConnected->CanDo('setup', 'configuration', 'view')){?>
						<li class="col-xs-6 col-md-3">
							<a class="btn btn-primary" href="<?php echo $_CONFIG['URL'];?>robot_configs.php">
								<i class="fa fa-gears" aria-hidden="true"></i>
								<span><?php echo __('Configurations');?><br />&nbsp;</span>
							</a>
						</li>
						<?php }
						if ($userConnected->CanDo('setup', 'export', 'view')){?>
						<li class="col-xs-6 col-md-3">
							<a class="btn btn-primary" href="<?php echo $_CONFIG['URL'];?>export.php">
								<i class="fa fa-upload" aria-hidden="true"></i>
								<span><?php echo __('Import / Export');?><br />&nbsp;</span>
							</a>
						</li>
						<?php }
						if ($userConnected->CanDo('setup', 'export', 'view')){?>
						<li class="col-xs-6 col-md-3">
							<a id="bDevStartNav" class="btn btn-primary" href="#">
								<i class="fa fa-map" aria-hidden="true"></i>
								<span><?php echo __('Start navigation');?><br />&nbsp;</span>
							</a>
						</li>
						<?php }?>
                    </ul>
                </div>
            </section>
            
        </div>
        
    </div>
    <!-- end: page -->
</section>

</div>

<div id="modalAddTask" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="height:calc(100vh - 110px); overflow:auto; padding-bottom:50px;">
                    <div style="text-align:center; font-size:26px;">
                        <h3>Add task</h3>
                    
                    	<ul class="listBoutons">
                        	<li><a href="#" class="btn btn-primary" data-dismiss="modal">Task 1</a></li>
                        	<li><a href="#" class="btn btn-primary" data-dismiss="modal">Task 2</a></li>
                        	<li><a href="#" class="btn btn-primary" data-dismiss="modal">Task 3</a></li>
                        	<li><a href="#" class="btn btn-primary" data-dismiss="modal">Task 4</a></li>
                        </ul>
                        
                    </div>
                    <div style="clear:both; height:50px;"></div>
                    
                    <a href="#" class="btn btn-primary" data-dismiss="modal" style="width:100%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Close');?></a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php 
include ('template/footer.php');
?>

<script>
  $( function() {
    $( ".sortable_task" ).sortable();
    $( ".sortable_task" ).disableSelection();
  } );
</script>