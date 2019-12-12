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
            <div class="row">
                
                <?php if (isset($_GET['notallow']))
				{
					?>
				<div class="alert alert-danger">
					<p class="m-none text-semibold h6"><?php echo __('Vous n\'êtes pas autorisé à faire cette action');?></p>
				</div>
					<?php
				}?>
                
                <div class="col-md-12 col-lg-6 col-xl-6">
                    <section class="panel panel-featured-left panel-featured-tertiary">
                        <div class="panel-body">
                            <div class="widget-summary">
                                <div class="widget-summary-col widget-summary-col-icon">
                                    <div class="summary-icon bg-tertiary">
                                        <a href="#" style="color:#FFFFFF;"><i class="fa fa-pause"></i></a>
                                    </div>
                                </div>
                                <div class="widget-summary-col">
                                    <div class="summary">
                                        <h4 class="title"><?php echo __('Current task');?></h4>
                                        <div class="info">
                                            <strong class="amount">Task 1</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                
            </div>
            
        </div>
        <div class="col-md-12">
            <section class="panel">
                <header class="panel-heading panel-heading-transparent">
                    <div class="panel-actions" style="float:right;">
	                    <a href="#" class="fa fa-play"></a>
                        <a href="#" class="fa fa-pause"></a>
                        <!--<a href="#" class="fa fa-times"></a>-->
                    </div>
                    <h2 class="panel-title"><?php echo __('Task Queue');?></h2>
                </header>
                <div class="panel-body" style="padding-top:0; padding-bottom:0; min-height:calc(100vh - 400px);">
                    <ul class="widget-todo-list">
                        <li>
                            <div class="">Task 2</div>
                            <div class="todo-actions"><a class="todo-remove" href="#"><i class="fa fa-times"></i></a></div>
                        </li>
                        <li>
                            <div class="">Task 3</div>
                            <div class="todo-actions"><a class="todo-remove" href="#"><i class="fa fa-times"></i></a></div>
                        </li>
                        <li>
                            <div class="">Task 4</div>
                            <div class="todo-actions"><a class="todo-remove" href="#"><i class="fa fa-times"></i></a></div>
                        </li>
                        <li>
                            <div class="">Task 5</div>
                            <div class="todo-actions"><a class="todo-remove" href="#"><i class="fa fa-times"></i></a></div>
                        </li>
                    </ul>
                </div>
                <footer>
                	<a href="#" class="btn btn-primary" data-toggle="modal" data-target="#modalAddTask" style="width:100%; margin:10px 0;">Add task</a>
                </footer>
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