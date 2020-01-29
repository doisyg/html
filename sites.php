<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "setup";
$sectionSousMenu = "sites";

if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) { header('location:index.php?notallow=1'); exit; }

if (isset($_GET['add']))
{
	if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add'))
	{
		$site = new Site();
		$site->nom = $_GET['add'];
		$site->Save();
		header('location:sites.php?added=1');
	}
}


if (isset($_GET['edit']))
{
	if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'edit'))
	{
		$site = new Site($_GET['is']);
		$site->nom = $_GET['edit'];
		$site->Save();
		header('location:sites.php');
	}
}


if (isset($_GET['um']))
{
	$plan = new Plan($_GET['um']);
	if ($plan->id_plan > 0 && $plan->id_site == $currentSite->id_site)
	{
		$plan->SetAsActive();
		header('location:sites.php');
	}
}

if (isset($_GET['us']))
{
	$site = new Site($_GET['us']);
	if ($site->id_site > 0)
	{
		$cs = Configuration::GetFromVariable('CURRENT_SITE');
		
		if ($cs->valeur != $_GET['us'])
			TacheQueue::ClearQueue();
		
		$cs->valeur = $_GET['us'];
		$cs->Save();
		
		$plans = $site->GetPlans();
		if (count($plans) == 0)
			header('location:maps.php?create=1');
		else
		{
			$plans[0]->SetAsActive();
			header('location:sites.php?select_map='.$_GET['us']);
		}
	}
	//header('location:sites.php');
}

$titre = __('Sites');

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
                    <a class="btn btn-primary btn-sm btn-grad" href="#" data-toggle="modal" data-target="#modalCreateSite" title="<?php echo __('Add site');?>"><i class="fa fa-plus"></i> <?php echo __('Add site');?></a>
                    <div style="clear:both; height:20px;"></div>
                    <?php }?>
                        
                
					<table border="0" width="100%" cellpadding="0" cellspacing="0" id="sortable-table" class="table table-sortable table-bordered table-striped mb-none">
                    <thead>
                        <tr>
                            <th class="table-header-repeat line-left minwidth-1"><?php echo __('Site');?></th>
                            <th class="table-header-repeat line-left minwidth-1"></th>
                        </tr>
                    </thead>
                    <?php
					$canEdit = $userConnected->CanDo($sectionMenu, $sectionSousMenu, 'edit');
					$canDelete = $userConnected->CanDo($sectionMenu, $sectionSousMenu, 'delete');
					
					$sites = Site::GetSites('nom', 'ASC');
					
					?>
                    <tbody>
                    	<?php foreach ($sites as $site)
						{
							$current = $currentSite->id_site == $site->id_site;
							?>
                    	<tr>
                        	<td <?php echo $current?'style="font-weight:bold"':'';?>><?php echo $site->nom;?></td>
                            <td>
                            	<?php if ($canEdit){?><a href="#" class="btn btn-xs btn-success bEditSite" data-id_site="<?php echo $site->id_site;?>" data-nom="<?php echo addslashes(stripslashes($site->nom));?>" title="<?php echo __('Edit');?>"><i class="fa fa-pencil"></i></a><?php }?>
                            	<?php if (!$current) {?><a href="#" class="btn btn-xs btn-primary bUseThisSite" data-id_site="<?php echo $site->id_site;?>" title="<?php echo __('Use this site on robot');?>"><i class="fa fa-upload"></i> <?php echo __('Use this');?></a><?php }?>
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

<?php if (isset($_GET['selectMap'])){?>

<div id="modalSelectMap" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center; font-size:26px;">
                    
                        <h2><?php echo __('Select map to use');?></h2>
                    
                    	<ul class="listBoutons">
                        	<?php
							$plans = $currentSite->GetPlans('nom', 'ASC');
							foreach($plans as $plan)
							{
								?><li><a href="sites.php?um=<?php echo $plan->id_plan;?>" class="btn btn-primary"><?php echo $plan->nom;?></a></li><?php
							}
							?>             
                        </ul>
                        
                    </div>
                    <div style="clear:both;"></div>
                    
                </div>
            </div>
        </div>
    </div>
</div>

<?php }?>

<div id="modalUseSite" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center; font-size:26px;">
                    
                        <h2><?php echo __('Use this site ?');?></h2>
                        
                        <p class="aide"><?php echo __('Change the configuration of the robot to use this site.');?></p>
                        
                    </div>
                    <div style="clear:both;"></div>
                    
                    <a href="#" id="bUseSite" data-id_site="<?php echo isset($_GET['added'])?$_GET['added']:'';?>" class="btn btn-primary" data-dismiss="modal" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Yes');?></a>
                    <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('No');?></a>
                </div>
            </div>
        </div>
    </div>
</div>

<?php if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'edit')){?>
<div id="modalEditSite" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center; font-size:26px;">
                    
                    	<input type="text" id="inputNomEditSite" placeholder="<?php echo __('Site name')?>" class="form-control" style="margin-bottom:20px;" />
                        
                    </div>
                    <div style="clear:both;"></div>
                    
                    <a href="#" id="bSaveEdit" class="btn btn-primary" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Save');?></a>
                    <a href="#" class="btn btn-warning" data-dismiss="modal" style="width:50%; position:absolute; right:0; bottom:0px; font-size:30px;"><?php echo __('Cancel');?></a>
                </div>
            </div>
        </div>
    </div>
</div>
<?php }?>

<?php if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')){?>
<div id="modalCreateSite" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="actions" style="min-height:calc(100vh - 110px);">
                    <div style="text-align:center; font-size:26px;">
                    
                    	<input type="text" id="inputNomSite" placeholder="<?php echo __('Site name')?>" class="form-control" style="margin-bottom:20px;" />
                        
                    </div>
                    <div style="clear:both;"></div>
                    
                    <a href="#" id="bSave" class="btn btn-primary" style="width:50%; position:absolute; left:0; bottom:0px; font-size:30px;"><?php echo __('Save');?></a>
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
var currentSiteEdit = -1;
$(document).ready(function(e) {
	
	<?php echo (isset($_GET['added']))?'$(\'#modalUseSite\').modal(\'show\');':'';?>
	<?php echo (isset($_GET['selectMap']))?'$(\'#modalSelectMap\').modal(\'show\');':'';?>
	
	
	$('.bEditSite').click(function(e) {
        e.preventDefault();
		currentSiteEdit = $(this).data('id_site');
		$('#inputNomEditSite').val($(this).data('nom'));
		$('#modalEditSite').modal('show');
    });
	
	$('.bUseThisSite').click(function(e) {
        e.preventDefault();
		$('#bUseSite').data('id_site', $(this).data('id_site'));
		$('#modalUseSite').modal('show');
    });
	
	$('#bUseSite').click(function(e) {
		location.href = 'sites.php?us=' + $('#bUseSite').data('id_site');
	});
	
	$('#bSaveEdit').click(function(e) {
        e.preventDefault();
		if ($('#inputNomEditSite').val().trim() == '')
		{
			alert('<?php echo __('You must indicate a name');?>');
		}
		else
		{
			$('#modalEditSite').modal('hide');
			location.href = 'sites.php?is=' + currentSiteEdit + '&edit=' + $('#inputNomEditSite').val().trim();
		}
    });
	
    $('#bSave').click(function(e) {
        e.preventDefault();
		if ($('#inputNomSite').val().trim() == '')
		{
			alert('<?php echo __('You must indicate a name');?>');
		}
		else
		{
			$('#modalCreateSite').modal('hide');
			location.href = 'sites.php?add=' + $('#inputNomSite').val().trim();
		}
    });
});
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

