<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "tasks";
$sectionSousMenu = "";


if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) { header('location:index.php?notallow=1'); exit; }

$titre = __('Tasks');

$canEditAdmin = $userConnected->CanDo($sectionMenu, $sectionSousMenu, 'delete');

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
                
                <div class="panel-body">
                
                    <?php if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')){?>
                    <a class="btn btn-primary btn-sm btn-grad" href="task_edit.php?id_tache=-1" title="<?php echo __('Add task');?>"><i class="fa fa-plus"></i> <?php echo __('Add task');?></a>
                    <div style="clear:both; height:20px;"></div>
                    <?php }?>
                        
                
					<table border="0" width="100%" cellpadding="0" cellspacing="0" id="sortable-table" class="table table-sortable table-bordered table-striped mb-none">
                    <thead>
                        <tr>
                            <th class="table-header-repeat line-left minwidth-1"><?php echo __('Task');?></th>
                            <th class="table-header-repeat line-left minwidth-1"></th>
                        </tr>
                    </thead>
                    <?php
					$canEdit = $userConnected->CanDo($sectionMenu, $sectionSousMenu, 'edit');
					$canDelete = $userConnected->CanDo($sectionMenu, $sectionSousMenu, 'delete');
					
					$taches = $currentMap->GetTaches();
					?>
                    <tbody>
                    	<?php foreach($taches as $tache)
						{
							?>
                    	<tr>
                        	<td><?php echo $tache->name;?></td>
                            <td>
                            	<?php if ($canEdit){?><a href="task_edit.php?id_tache=<?php echo $tache->id_tache;?>" class="btn btn-xs btn-success" title="<?php echo __('Edit');?>"><i class="fa fa-pencil"></i></a><?php }?>
                                <?php if ($canDelete){?><a href="tasks.php?delete=<?php echo $tache->id_tache;?>" class="btn btn-xs btn-danger confirmDelete" title="<?php echo __('Delete');?>"><i class="fa fa-times"></i></a><?php }?>
                            </td>
                        </tr>
                        	<?php
						}?>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <!-- end: page -->
</section>

</div>		

</section>

<?php if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')){?>
<div id="modalCreateTask" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions mh100vh_55">
                    <div style="text-align:center;">
                    
                    	<input type="text" placeholder="<?php echo __('Task name')?>" class="form-control" style="margin-bottom:20px;" />
                    
                    	<div class="row" style="margin-bottom:20px;">
                            <div class="col-xs-4" style="padding:0 5px;"><a href="#" class="btn btn-i btn-primary" style="height:54px;" data-toggle="modal" data-target="#modalCreateTaskPOI"><?php echo __('Go to POI');?></a></div>
                            <div class="col-xs-4" style="padding:0 5px;"><a href="#" class="btn btn-i btn-primary" style="height:54px;" data-toggle="modal" data-target="#modalCreateTaskWaitS"><?php echo __('Wait x secondes');?></a></div>
                            <div class="col-xs-4" style="padding:0 5px;"><a href="#" class="btn btn-i btn-primary" style="height:54px;"><?php echo __('Wait click on screen');?></a></div>
                        </div>
                        
                            
                        <ul class="widget-todo-list" style="text-align:left">
                            <li>
                                <div class="">Go to POI <strong><em>POI 3</em></strong></div>
                                <div class="todo-actions"><a class="todo-remove" href="#"><i class="fa fa-times"></i></a></div>
                            </li>
                            <li>
                                <div class="">Wait click on screen</div>
                                <div class="todo-actions"><a class="todo-remove" href="#"><i class="fa fa-times"></i></a></div>
                            </li>
                            <li>
                                <div class="">Go to POI <strong><em>POI 1</em></strong></div>
                                <div class="todo-actions"><a class="todo-remove" href="#"><i class="fa fa-times"></i></a></div>
                            </li>
                            <li>
                                <div class="">Wait <strong><em>10</em></strong> secondes</div>
                                <div class="todo-actions"><a class="todo-remove" href="#"><i class="fa fa-times"></i></a></div>
                            </li>
                        </ul>
                        
                        
                    </div>
                    <div style="clear:both;"></div>
                    
                    <a href="#" class="btn btn-primary" data-dismiss="modal" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Save');?></a>
                    <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="modalCreateTaskPOI" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions mh100vh_55">
                    <div style="text-align:center;">
                    
                    	<ul class="listBoutons">
                            <li><a class="btn btn-primary" data-dismiss="modal" href="#">POI 1</a></li>
                            <li><a class="btn btn-primary" data-dismiss="modal" href="#">POI 2</a></li>
                            <li><a class="btn btn-primary" data-dismiss="modal" href="#">POI 3</a></li>
                            <li><a class="btn btn-primary" data-dismiss="modal" href="#">POI 4</a></li>
                        </ul>
                        
                        
                    </div>
                    <div style="clear:both;"></div>
                    
                    <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:100%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="modalCreateTaskWaitS" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions mh100vh_55">
                    <div style="text-align:center;">
                    
                    	<input type="number" placeholder="<?php echo __('Number of secondes to wait')?>" class="form-control" style="margin-bottom:20px;" />
                        
                        
                    </div>
                    <div style="clear:both;"></div>
                    
                    <a href="#" class="btn btn-primary" data-dismiss="modal" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Save');?></a>
                    <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                </div>
            </div>
        </div>
    </div>
</div>
<?php
}?>

<?php 
include ('template/footer.php');
?>
<script>
(function( $ ) {

	'use strict';

	var datatableInit = function() {

		$('.table-sortable').dataTable({
			"language": {
                "url": "/lang/js/datatables.<?php echo $_COOKIE['lang'];?>.json"
            },
			"aoColumnDefs": [ 
				{ "bSortable": false, "aTargets": [ 1 ] }
			],
		});

	};

	$(function() {
		datatableInit();
	});

}).apply( this, [ jQuery ]);
</script>

