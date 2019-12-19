<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "maps";
$sectionSousMenu = "";


if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) { header('location:index.php?notallow=1'); exit; }

if (isset($_GET['um']))
{
	$plan = new Plan($_GET['um']);
	if ($plan->id_plan > 0 && $plan->id_site == $currentSite->id_site)
	{
		$cm = Configuration::GetFromVariable('CURRENT_MAP');
		$cm->valeur = $_GET['um'];
		$cm->Save();
		$plan->SetAsActive();
		header('location:maps.php');
	}
}

$titre = __('Maps tool');

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
                <?php 
				$maps = $currentSite->GetPlans('nom', 'ASC');
				?>
                
                <div class="panel-body">
                
                	<?php if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')){?>
                    <a class="btn btn-primary btn-sm btn-grad" href="#" data-toggle="modal" data-target="#modalCreateMap" title="<?php echo __('Create new map');?>"><i class="fa fa-plus"></i> <?php echo __('Create new map');?></a>
                    <div style="clear:both; height:20px;"></div>
                    <?php }?>
                
					<table border="0" width="100%" cellpadding="0" cellspacing="0" id="sortable-table" class="table table-sortable table-bordered table-striped mb-none">
                    <thead>
                        <tr>
                            <th class="table-header-repeat line-left minwidth-1"><?php echo __('Plan');?></th>
                            <th class="table-header-repeat line-left minwidth-1"><?php echo __('Nom');?></th>
                            <th class="table-header-repeat line-left minwidth-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    $canEdit = $userConnected->CanDo($sectionMenu, $sectionSousMenu, 'edit');
					$canDelete = $userConnected->CanDo($sectionMenu, $sectionSousMenu, 'delete');
					
                    foreach ($maps as $plan)
					{
						$current = $currentIdPlan == $plan->id_plan;
						?>
						<tr>
	                        <td><img src="data:image/png;base64,<?php echo $plan->image;?>" style="max-height:40px; max-width:150px;" /></td>
							<td><?php echo $plan->nom;?></td>
							<td>
								<?php if ($canEdit) {?><a href="map.php?id_plan=<?php echo $plan->id_plan;?>" class="btn btn-primary" title="<?php echo __('Edit map');?>"><i class="fa fa-map-marker"></i></a><?php }?>
                                <?php if (!$current) {?><a href="#" class="btn btn-xs btn-primary bUseThisMap" data-id_plan="<?php echo $plan->id_plan;?>" title="<?php echo __('Use this map on robot');?>"><i class="fa fa-upload"></i> <?php echo __('Use this');?></a><?php }?>
                                <?php if ($canDelete && !$current){?><a href="#" class="btn btn-xs btn-danger" title="<?php echo __('Delete');?>"><i class="fa fa-times"></i></a><?php }?>
							</td>
						</tr>
						<?php
					}	
                    ?>
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


<div id="modalUseMap" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center; font-size:26px;">
                    
                        <h2><?php echo __('Use this map ?');?></h2>
                        
                        <p class="aide"><?php echo __('Change the configuration of the robot to use this map.');?></p>
                        
                    </div>
                    <div style="clear:both;"></div>
                    
                    <a href="#" id="bUseMap" data-id_plan="" class="btn btn-primary" data-dismiss="modal" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Yes');?></a>
                    <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('No');?></a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')){?>
<div id="modalCreateMap" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center; font-size:26px;">
                    
                    	<input type="text" placeholder="<?php echo __('Map name')?>" class="form-control" style="margin-bottom:20px;" />
                    
                    	<div class="row" style="margin-bottom:20px;">
                            <a href="#" class="btn btn-i btn-primary col-md-6"><i class="fa fa-play"></i><?php echo __('Start mapping');?></a>
                            <a href="#" class="btn btn-i btn-primary col-md-6"><i class="fa fa-stop"></i><?php echo __('Stop mapping');?></a>
                        </div>
                    
                        <img src="assets/images/map.png" style="max-height:150px; max-width:80%; margin:10px 0;" />
                        
                        <?php echo __('Enable joystick');?> <a href="#" class="bToggleJosytick"><i class="ico_jotick fa fa-toggle-off" style="font-size:30px;"></i></a>
                        
                        <div style="clear:both; height:10px;"></div>
                        
                        <div class="joystickDiv" draggable="false" style="margin:auto;">
                            <div class="fond"></div>
                            <div class="curseur"></div>
                        </div>
                        
                        
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
	
	$('.bUseThisMap').click(function(e) {
        e.preventDefault();
		$('#bUseMap').data('id_plan', $(this).data('id_plan'));
		$('#modalUseMap').modal('show');
    });
	
	$('#bUseMap').click(function(e) {
		location.href = 'maps.php?um=' + $('#bUseMap').data('id_plan');
	});

	var datatableInit = function() {

		$('.table-sortable').dataTable({
			"language": {
                "url": "/lang/js/datatables.<?php echo $_COOKIE['lang'];?>.json"
            },
			"aoColumnDefs": [ 
				{ "bSortable": false, "aTargets": [ 0, 2 ] }
			],
		});

	};

	$(function() {
		datatableInit();
	});

}).apply( this, [ jQuery ]);
</script>

