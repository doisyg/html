<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "tasks";
$sectionSousMenu = "";



if (isset($_POST['id_tache']))
{
	if ($_POST['id_tache'] <= 0)
	{
		if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')) { header('location:index.php?notallow=1'); exit; }
		$tache = new Tache();
	}
	else
	{
		if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'edit')) { header('location:index.php?notallow=1'); exit; }
		$tache = new Tache($_POST['id_tache']);
	}
	
	$actions_old = $tache->GetActions();
	
	$tache->id_plan = $currentIdPlan;
	$tache->id_site = $currentIdSite;
	$tache->name = $_POST['name'];
	if (isset($_POST['redo']) && $_POST['redo']=='on')
		$tache->action_fin = TacheAction::$FIN_Redo;
	else
		$tache->action_fin = TacheAction::$FIN_Stop;
	$tache->Save();
	
	$actions_not_deleted = array();
	
	foreach($_POST['ids_action'] as $id_action)
	{
		if ($id_action >= 500000)
			$action = new TacheAction();
		else
		{
			$action = new TacheAction($id_action);
			if ($action->id_tache != $tache->id_tache) continue;
		}
		
		$action->id_tache = $tache->id_tache;
		$action->action_type = $_POST['action_type_'.$id_action];
		$action->action_detail = $_POST['action_detail_'.$id_action];
		$action->position = $_POST['position_'.$id_action];
		$action->Save();
				
		$actions_not_deleted[] = $action->id_tache_action;
	}
	
	foreach($actions_old as $action)
	{
		if (!in_array($action->id_tache_action, $actions_not_deleted))
		{
			$action->Supprimer();
		}
	}
	
	header('location:tasks.php?ok=1');
	die();
}

if (!isset($_GET['id_tache'])) { header('location:index.php?notallow=1'); exit; }

if ($_GET['id_tache'] <= 0)
{
	if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')) { header('location:index.php?notallow=1'); exit; }
	$tache = new Tache();
}
else
{
	if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'edit')) { header('location:index.php?notallow=1'); exit; }
	$tache = new Tache($_GET['id_tache']);
}

$titre = __('Tasks');




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
                
                <div class="panel-body" style="padding-bottom:0;">
                	<form id="formTache" method="post" action="task_edit.php">
	                   	<input type="hidden" name="id_tache" value="<?php echo (int)$_GET['id_tache'];?>" />
                        
                        
                	<div style="text-align:center; min-height:calc(100vh - 220px);">
                    
                    	<input type="text" id="name_tache" name="name" placeholder="<?php echo __('Task name')?>" value="<?php echo $tache->name;?>" class="form-control" style="margin-bottom:20px;" />

                        <div class="checkbox" style="padding-bottom:20px; text-align:left; padding-left:5px;">
                            <label>
                                <input type="checkbox" name="redo" <?php echo $tache->action_fin == TacheAction::$FIN_Redo?'checked="checked"':'';?>>
                                Repeat until there are no new tasks in the queue.
                            </label>
                        </div>
                        
                    
                    	<div>
                            <div class="col-xs-4" style="padding:0 5px;"><a href="#" class="btn btn-i btn-primary" style="height:54px; width:100%;" data-toggle="modal" data-target="#modalCreateTaskPOI"><?php echo __('Go to<br />POI');?></a></div>
                            <div class="col-xs-4" style="padding:0 5px;"><a href="#" class="btn btn-i btn-primary" style="height:54px; width:100%;" data-toggle="modal" data-target="#modalCreateTaskWaitS"><?php echo __('Wait x secondes');?></a></div>
                            <div class="col-xs-4" style="padding:0 5px;"><a href="#" id="bAddWaitScreen" class="btn btn-i btn-primary" style="height:54px; width:100%;"><?php echo __('Wait click on screen');?></a></div>
                        </div>
                        
                        <div style="clear:both; height:20px;"></div>
                            
                        <ul id="list_actions" class="widget-todo-list" style="text-align:left">
                        	<?php
							$actions = $tache->GetActions();
							foreach($actions as $action)
							{
								?>
                            <li id="action_<?php echo $action->id_tache_action;?>">
                            	<input type="hidden" name="ids_action[]" value="<?php echo $action->id_tache_action;?>">
                            	<input type="hidden" id="action_type_<?php echo $action->id_tache_action;?>" name="action_type_<?php echo $action->id_tache_action;?>" value="<?php echo $action->action_type;?>">
                            	<input type="hidden" id="action_detail_<?php echo $action->id_tache_action;?>" name="action_detail_<?php echo $action->id_tache_action;?>" value="<?php echo $action->action_detail;?>">
                            	<input type="hidden" id="position_<?php echo $action->id_tache_action;?>" name="position_<?php echo $action->id_tache_action;?>" value="-1">
                                <div class="">
								<?php if ($action->action_type!=TacheAction::$TYPE_WaitClick){?><a href="#" class="todo-edit" data-id_tache_action="<?php echo $action->id_tache_action;?>" data-action_type="<?php echo $action->action_type;?>" data-action_detail="<?php echo $action->action_detail;?>"><i class="fa fa-pencil"></i></a><?php } else {?><span style="display:inline-block; width:11.16px;"></span><?php }?>
								<span class="texte"><?php
                                switch($action->action_type)
								{
									case TacheAction::$TYPE_GotoPOI: // Go to POI
										$poi = new Poi($action->action_detail);
										echo __('Go to POI');?> <strong><em><?php echo $poi->name;?></em></strong><?php
										break;
									case TacheAction::$TYPE_WaitClick: // Wait click on screen
										echo __('Wait click on screen');
										break;
									case TacheAction::$TYPE_WaitTime: // Wait x secondes
										echo __('Wait');?> <strong><em><?php echo $action->action_detail;?></em></strong> <?php echo __('seconde'); echo ((int)$action->action_detail)>1?'s':'';
										break;
								}
								?>
                                </span>
								</div>
                                <div class="todo-actions"><a class="todo-remove" href="#"><i class="fa fa-times"></i></a></div>
                            </li>
                            	<?php
							}
							?>
                        </ul>
                        
                        <div style="clear:both;"></div>
                    </div>
                    <div style="clear:both; height:50px;"></div>
                    
                    <div class="row">
                        <a href="tasks.php" class="btn btn-warning" style="width:50%; float:left; font-size:30px; border-radius:0;"><?php echo __('Back');?></a>
                        <a href="#" id="bSaveTask" class="btn btn-primary" style="width:50%; float:left; font-size:30px; border-radius:0;"><?php echo __('Save');?></a>
                    </div>
                    <div style="clear:both;"></div>
                </div>
            </div>
        </div>
    </div>
    <!-- end: page -->
</section>

</div>		

</section>

<div id="modalCreateTaskPOI" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center;">
                    
                    	<ul class="listBoutons">
							<?php 
                            $pois = $currentMap->GetPois();
                            foreach($pois as $poi)
							{
								?><li><a href="#" class="btn btn-primary bSelectPOI" data-id_poi="<?php echo $poi->id_poi;?>" data-dismiss="modal"><?php echo $poi->name;?></a></li><?php
							}?>
                        </ul>
                        
                        
                    </div>
                    <div style="clear:both;"></div>
                    
                    <a href="#" id="bCancelEditPoi" class="btn btn-warning" data-dismiss="modal" style="width:100%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="modalCreateTaskWaitS" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center;">
                    
                    	<input type="number" id="timeToWait" placeholder="<?php echo __('Number of secondes to wait')?>" class="form-control" style="margin-bottom:20px;" />
                        
                        
                    </div>
                    <div style="clear:both;"></div>
                    
                    <a href="#" id="bSaveTimeWait" class="btn btn-primary" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Save');?></a>
                    <a href="#" id="bCancelTimeWait" class="btn btn-warning" data-dismiss="modal" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                </div>
            </div>
        </div>
    </div>
</div>

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


var textGotoPOI = '<?php echo __('Go to POI');?>';
var textWaitClick = '<?php echo __('Wait click on screen');?>';
var textWait = '<?php echo __('Wait');?>';
var textSeconde = '<?php echo __('seconde');?>';

var pois = Array();
var pois_by_id = Array();
<?php
foreach($pois as $poi)
{
	?>pois.push(<?php echo json_encode($poi);?>);
	pois_by_id[<?php echo $poi->id_poi;?>] = <?php echo json_encode($poi);?>;
<?php
}
?>

var nextIdAction = 500000;
var position = 0;

var currentAction = '';
var currentActionId = 0;

$(document).ready(function(e) {
	
	$('#bCancelTimeWait').click(function(e) {
        currentAction = '';
    });
	$('#bCancelEditPoi').click(function(e) {
        currentAction = '';
    });
	
	$('.todo-edit').click(function(e) {
        e.preventDefault();
		
		switch($(this).data('action_type'))
		{
			case <?php echo TacheAction::$TYPE_GotoPOI;?>:
				currentAction = 'editPoi';
				currentActionId = $(this).data('id_tache_action');
				$('#modalCreateTaskPOI').modal('show');
				break;
			case <?php echo TacheAction::$TYPE_WaitClick;?>:
				// Pas de modif
				break;
			case <?php echo TacheAction::$TYPE_WaitTime;?>:
				currentAction = 'editTime';
				currentActionId = $(this).data('id_tache_action');
				$('#timeToWait').val($(this).data('action_detail'));
				$('#modalCreateTaskWaitS').modal('show');
				break;
		}
		
    });
	
	$('#bSaveTimeWait').click(function(e) {
        
		if ( $('#timeToWait').val() == '')
		{
			alert('<?php echo __('You must provide a time to wait.');?>');
			e.preventDefault();
		}
		else
		{
			if (currentAction == 'editTime')
			{
				time = $('#timeToWait').val();
				$('#action_detail_'+currentActionId).val(time);
				$('#action_'+currentActionId+' span.texte').html(textWait + ' <strong><em>'+time+'</em></strong> '+ textSeconde + ((time>1)?'s':''));
			}
			else
			{
				nextIdAction++;
				
				time = $('#timeToWait').val();
				
				html = '<li id="action_'+nextIdAction+'">'+
				'	<input type="hidden" name="ids_action[]" value="'+nextIdAction+'">'+
				'	<input type="hidden" id="action_type_'+nextIdAction+'" name="action_type_'+nextIdAction+'" value="<?php echo TacheAction::$TYPE_WaitTime;?>">'+
				'	<input type="hidden" id="action_detail_'+nextIdAction+'" name="action_detail_'+nextIdAction+'" value="'+time+'">'+
				'	<input type="hidden" id="position_'+nextIdAction+'" name="position_'+nextIdAction+'" value="-1">'+
				'	<div class="">'+
				'	<a href="#" class="todo-edit" data-id_tache_action="'+nextIdAction+'" data-action_type="<?php echo TacheAction::$TYPE_WaitTime;?>" data-action_detail="'+time+'"><i class="fa fa-pencil"></i></a> '+
				'	<span class="texte">' + textWait + ' <strong><em>'+time+'</em></strong> '+ textSeconde + ((time>1)?'s':'') + '</span>' +
				'	</div>'+
				'	<div class="todo-actions"><a class="todo-remove" href="#"><i class="fa fa-times"></i></a></div>'+
				'</li>'
				
				$('#list_actions').append(html);
			}
			
			$('#modalCreateTaskWaitS').modal('hide');
				
			currentAction = '';
		}
		
    });
	
	
    $('.bSelectPOI').click(function(e) {
        
		
		if (currentAction == 'editPoi')
		{
			id_poi = $(this).data('id_poi');
			
			$('#action_detail_'+currentActionId).val(id_poi);
			$('#action_'+currentActionId+' span.texte em').html(pois_by_id[id_poi].name);
		}
		else
		{
			nextIdAction++;
			
			id_poi = $(this).data('id_poi');
			
			html = '<li id="action_'+nextIdAction+'">'+
			'	<input type="hidden" name="ids_action[]" value="'+nextIdAction+'">'+
			'	<input type="hidden" id="action_type_'+nextIdAction+'" name="action_type_'+nextIdAction+'" value="<?php echo TacheAction::$TYPE_GotoPOI;?>">'+
			'	<input type="hidden" id="action_detail_'+nextIdAction+'" name="action_detail_'+nextIdAction+'" value="'+id_poi+'">'+
			'	<input type="hidden" id="position_'+nextIdAction+'" name="position_'+nextIdAction+'" value="-1">'+
			'	<div class="">'+
			'	<a href="#" class="todo-edit" data-id_tache_action="'+nextIdAction+'" data-action_type="<?php echo TacheAction::$TYPE_GotoPOI;?>" data-action_detail="'+id_poi+'"><i class="fa fa-pencil"></i></a> '+
			'	<span class="texte">' + textGotoPOI + ' <strong><em>'+pois_by_id[id_poi].name+'</em></strong></span>' +
			'	</div>'+
			'	<div class="todo-actions"><a class="todo-remove" href="#"><i class="fa fa-times"></i></a></div>'+
			'</li>'
			
			$('#list_actions').append(html);
		}
		
		currentAction = '';
		
    });
	
	$('#bAddWaitScreen').click(function(e) {
        e.preventDefault();
		
		nextIdAction++;
		
		html = '<li id="action_'+nextIdAction+'">'+
		'	<input type="hidden" name="ids_action[]" value="'+nextIdAction+'">'+
		'	<input type="hidden" id="action_type_'+nextIdAction+'" name="action_type_'+nextIdAction+'" value="<?php echo TacheAction::$TYPE_WaitClick;?>">'+
		'	<input type="hidden" id="action_detail_'+nextIdAction+'" name="action_detail_'+nextIdAction+'" value="">'+
		'	<input type="hidden" id="position_'+nextIdAction+'" name="position_'+nextIdAction+'" value="-1">'+
		'	<div class="">'+
		'	<span style="display:inline-block; width:11.16px;"></span> '+
			textWaitClick +
		'	</div>'+
		'	<div class="todo-actions"><a class="todo-remove" href="#"><i class="fa fa-times"></i></a></div>'+
		'</li>'
		
		$('#list_actions').append(html);
    });
	
	$('#bSaveTask').click(function(e) {
        e.preventDefault();
		if ($('#name_tache').val() == '')
		{
			alert('<?php echo __('You must provide a name for the task.');?>');
		}
		else
		{
			sorted = $( "#list_actions" ).sortable( "toArray" );
			position = 0;
			$.each(sorted, function(indexInArray, id_li){
				id_action = id_li.substr(7);
				$('#position_'+id_action).val(position);
				position++;
			});
			
			$('#formTache').submit();
		}
    });
	
	
});

</script>

