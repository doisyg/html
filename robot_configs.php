<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "setup";
$sectionSousMenu = "configuration";

if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) { header('location:index.php?notallow=1'); exit; }

$canControl = $userConnected->CanDo('robots', 'control', 'view');

if (isset($_GET['set_robot_config']))
{
	if ($userConnected->CanDo('robots', 'configuration', 'edit'))
	{
		$config = new RobotConfig((int)$_GET['set_robot_config']);
		$config->Dupliquer();
		$config->update_by = 'Server';
		$config->modifications = 'Set config '.((int)$_GET['set_robot_config']).' as active';
		$config->Save();
		
		header('location:robot.php?id_robot='.$_GET['id_robot']);
	}
}

$titre = __('All config');

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
            <section class="panel">
                <header class="panel-heading panel-heading-transparent">
                    <div class="panel-actions">
                        <a href="#" class="fa fa-caret-down"></a>
                        <!--<a href="#" class="fa fa-times"></a>-->
                    </div>

                    <h2 class="panel-title"><?php echo __('Configurations');?></h2>
                </header>
                <div class="panel-body">
                    <div class="table-responsive2">
                        <table id="table_config" class="table table-striped mb-none">
                            <thead>
                                <tr>
                                	<th></th>
                                    <th><?php echo __('ID');?></th>
                                    <th><?php echo __('Date');?></th>
                                    <th><?php echo __('Update by');?></th>
                                    <th><?php echo __('Update');?></th>
                                    <th><?php echo __('Actions');?></th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
								$configs = $currentSite->GetRobotConfigs('date', 'desc');
								$ic = 0;
								foreach($configs as $config)
								{
									$ic++;
									?>
                                    <tr>
                                    	<td><input class="cb_id_config" type="checkbox" name="id_configs[]" value="<?php echo $config->id_robot_config;?>" /></td>
                                        <td><?php echo $config->id_robot_config;?></td>
                                        <td><?php echo AffDatetimeHeure($config->date);?></td>
                                        <td><?php echo $config->update_by;?></td>
                                        <td><?php 
											$modifs = explode("\n", $config->modifications);
											if (count($modifs) > 4)
											{
												for($i=0; $i<3; $i++) echo $modifs[0].'<br />';
												echo '...';
											}
											else
												echo nl2br($config->modifications);?></td>
                                        <td>
                                        	<a href="robot_config.php?id_robot_config=<?php echo $config->id_robot_config;?>" title="<?php echo __('Consulter');?>" class="btn btn-primary btn-sm btn-grad" style="margin-right:10px;"><i class="fa fa-eye "></i></a>
                                            <?php
											if ($ic!=1 && $userConnected->CanDo('robots', 'configuration', 'edit'))
											{ 
												?>
                                        	<a href="robot.php?id_robot=<?php echo (int)$_GET['id_robot'];?>&set_robot_config=<?php echo $config->id_robot_config;?>" title="<?php echo __('Mettre en prod');?>" class="btn btn-warning btn-sm btn-grad" style="margin-right:10px;"><i class="fa fa-upload "></i> <?php echo __('Set as active');?></a>
	                                            <?php
											}
											?>
										</td>
                                    </tr>
                                    <?php
								}
								?>
                            </tbody>
                            <tfoot>
                            	<tr>
                                	<td colspan="6"><a href="#" id="bCompare" class="btn btn-primary">Compare</a></td>
                                </tr>
                            </tfoot>
                        </table>
                        
                    </div>
                </div>
            </section>
        </div>
    </div>
    <!-- end: page -->
</section>

</div>		

<?php 
include ('template/footer.php');
?>
<script>
(function( $ ) {

	'use strict';

	var datatableInit = function() {

		$('#table_config').dataTable({
			"language": {
                "url": "/lang/js/datatables.<?php echo $_COOKIE['lang'];?>.json"
            },
			"paging": false,
			"aoColumnDefs": [ 
				{ "bSortable": false, "aTargets": [ 0, 5 ] }
			],
		});

	};

	$(function() {
		datatableInit();
	});

}).apply( this, [ jQuery ]);

$(document).ready(function(e) {
	
	$('#bCompare').click(function(e) {
        e.preventDefault();
		
		if($('.cb_id_config:checked').length != 2)
		{
			alert("<?php echo __('Vous devez sélectionner 2 configurations pour les comparer');?>");
		}
		else
		{
			id_1 = -1;
			id_2 = -1;
			$('.cb_id_config:checked').each(function(index, element) {
                if (id_1 == -1) id_1 =$(this).val();
                else id_2 =$(this).val();
            });
			
			location.href='robot_config_compare.php?id_1='+id_1+'&id_2='+id_2;
		}
    });
});
</script>

