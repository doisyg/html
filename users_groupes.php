<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = 'setup';
$sectionSousMenu = 'user_groups';

if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) header('location:index.php?notallow=1');

if (isset($_GET['delete']))
{
	if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'delete'))
	{
		$groupe = new GroupeUser($_GET['delete']);
		$groupe->Supprimer();
		header('location:users_groupes.php?ok=1');
	}
}

$titre = __('Groups management');

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
                <?php $groupes = GroupeUser::GetGroupeUsers();?>
                
                <div class="panel-body">
                
					<?php if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')){?>
                    <a class="btn btn-primary btn-sm btn-grad" href="users_groupe_add.php" title="<?php echo __('Ajouter un groupe');?>"><i class="fa fa-plus"></i> <?php echo __('Ajouter un groupe');?></a>
                    <?php }?>
                    
                    <div style="clear:both; height:20px;"></div>
                    
                    
                    <table border="0" width="100%" cellpadding="0" cellspacing="0" id="sortable-table" class="table table-sortable table-bordered table-striped mb-none">
                    <thead>
                        <tr>
                            <th><?php echo __('Nom');?></th>
                            <th><?php echo __('Options');?></th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
					$i=0;
					foreach ($groupes as $groupe)
					{
						$i++;
						?>
						<tr <?php if ($i%2==0) {?>class="alternate-row"<?php }?>>
							<td><?php echo $groupe->nom;?></td>
							<td style="text-align:center;"><?php if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'edit')){?><a href="users_groupe_edit.php?id_groupe_user=<?php echo $groupe->id_groupe_user;?>" title="<?php echo __('Modifier');?>" class="btn btn-primary btn-sm btn-grad" style="margin-right:10px;"><i class="fa fa-pencil "></i></a><?php } if ($userConnected->CanDo($sectionMenu, $sectionSousMenu, 'delete') && !$groupe->HaveUsers() && !$groupe->id_groupe_user>4) { ?><a href="javascript:ConfirmDelete('users_groupes.php?delete=<?php echo $groupe->id_groupe_user;?>');" title="<?php echo __('Supprimer');?>" class="btn btn-danger btn-sm btn-grad"><i class="fa fa-times "></i></a><?php }?></td>
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
