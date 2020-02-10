<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "home";
$sectionSousMenu = "";

$titre = __('Dashboard');

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
                <div class="panel-body" style="padding-top:0; padding-bottom:0; min-height:calc(100vh - 400px);">
                    <ul id="listBoutonHome">
                        <li class="col-xs-6 col-md-3">
                            <a class="btn btn-primary" href="<?php echo $_CONFIG['URL'];?>tasks_queue.php">
                                <i class="fa fa-list" aria-hidden="true"></i>
                                <span><?php echo __('Tasks queue');?></span>
                            </a>
                        </li>
                        <?php if ($userConnected->CanDo('tasks', '', 'view')){?>
                        <li class="col-xs-6 col-md-3">
                            <a class="btn btn-primary" href="<?php echo $_CONFIG['URL'];?>tasks.php">
                                <i class="fa fa-share-alt" aria-hidden="true"></i>
                                <span><?php echo __('Tasks');?></span>
                            </a>
                        </li>
                        <?php }?>
                        <?php if ($userConnected->CanDo('maps', '', 'view')){?>
                        <li class="col-xs-6 col-md-3">
                            <a class="btn btn-primary" href="<?php echo $_CONFIG['URL'];?>maps.php">
                                <i class="fa fa-map-marker" aria-hidden="true"></i>
                                <span><?php echo __('Maps');?></span>
                            </a>
                        </li>
                        <?php }?>         
                        <?php if ($userConnected->CanDo('setup', '', 'view')){?>
                        <li class="col-xs-6 col-md-3">
                            <a class="btn btn-primary" href="setup.php">
                                <i class="fa fa-tasks" aria-hidden="true"></i>
                                <span><?php echo __('Setup');?></span>
                            </a>
                        </li>
                        <?php 
                        }?>         
                        
                        <li class="col-xs-6 col-md-3">
                            <a class="btn btn-primary" href="#" data-toggle="modal" data-target="#modalJoystick">
                                <i class="fa fa-gamepad" aria-hidden="true"></i>
                                <span><?php echo __('Control robot');?></span>
                            </a>
                        </li>
                        
                        <?php 
                        if ($userConnected->CanDo('traduction', '', 'view')){?>
                        <li class="col-xs-6 col-md-3">
                            <a class="btn btn-primary" href="<?php echo $_CONFIG['URL'];?>traduction.php">
                                <i class="fa fa-language" aria-hidden="true"></i>
                                <span><?php echo __('Translation');?></span>
                            </a>
                        </li>
                        <?php 
                        }
                        ?>
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