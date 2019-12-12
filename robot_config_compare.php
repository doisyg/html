<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }


require_once './lib/class.Diff.php';

$sectionMenu = "setup";
$sectionSousMenu = "configuration";

if (!isset($_GET['id_1']) || !isset($_GET['id_2']))  { header('location:index.php?notallow=1'); exit; }
if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) { header('location:index.php?notallow=1'); exit; }

$config_1 = new RobotConfig($_GET['id_1']);
$config_2 = new RobotConfig($_GET['id_2']);

$titre = __('Configuration - compare');

$canEdit = $userConnected->CanDo($sectionMenu, $sectionSousMenu, 'edit');

include ('template/header.php');
?>

<style>
.fichier_contenu { display:none; }

.diff { border-top:1px solid #000; border-left:1px solid #000; width:100%; }
.diff td { border-bottom:1px solid #000; border-right:1px solid #000; }
.diff td{
  vertical-align : top;
  white-space    : pre;
  white-space    : pre-wrap;
  font-family    : monospace;
}
del { color:#F00; text-decoration:none; }
ins { color:#090; }
h5 { font-weight:bold; }

</style>

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
            <div class="">
	            <?php
				$confs_1 = $config_1->GetConfigValues('directory ASC, file ASC', '');
				$confs_byname = array();
				foreach($confs_1 as $conf)
				{
					$confs_byname[$conf->directory.'/'.$conf->file] = array(0 => $conf);
				}
				$confs_2 = $config_2->GetConfigValues('directory ASC, file ASC', '');
				foreach($confs_2 as $conf)
				{
					if (isset($confs_byname[$conf->directory.'/'.$conf->file]))
						$confs_byname[$conf->directory.'/'.$conf->file][1] = $conf;
					else
						$confs_byname[$conf->directory.'/'.$conf->file] = array(1 => $conf);
				}
				
				foreach($confs_byname as $confs)
				{
					if (isset($confs[0]) && isset($confs[1]))
					{
						$extension = array_pop(explode('.', $confs[0]->file));
						if ($extension != 'png')
						{
							// Compare
							$diff = Diff::compare($confs[1]->data, $confs[0]->data, false);
							$diffHTML = Diff::toHTMLLight($diff);
							if ($diffHTML != '')
							{
								?>
								<section class="panel">
									<header class="panel-heading">
										<h2 class="panel-title"><?php echo $confs[0]->directory.'/'.$confs[0]->file;?></h2>
									</header>
									<div class="panel-body" style="max-height:80vh; overflow:auto;">
									   <?php echo $diffHTML;?>
									</div>
								</section>
								<?php
							}
						}
						else
						{
							if ($confs[0]->data != $confs[1]->data)
							{
								?>
								<section class="panel">
									<header class="panel-heading">
										<h2 class="panel-title"><?php echo $confs[0]->directory.'/'.$confs[0]->file;?></h2>
									</header>
									<div class="panel-body" style="max-height:80vh; overflow:auto;">
										<img src="data:image/png;base64,<?php echo $confs[0]->data;?>" style="max-width:45%; max-height:50vh;" />
										<img src="data:image/png;base64,<?php echo $confs[1]->data;?>" style="max-width:45%; max-height:50vh;" />
									</div>
								</section>
								<?php
							}
						}
					}
					elseif (!isset($confs[0]))
					{
						// Que à droite -> suppression
						?>
                        <section class="panel">
                            <header class="panel-heading">
                                <h2 class="panel-title"><?php echo $confs[1]->directory.'/'.$confs[1]->file;?></h2>
                            </header>
                            <div class="panel-body" style="max-height:80vh; overflow:auto;">
                               <?php echo __('Suppression du fichier');?>
                            </div>
                        </section>
                        <?php
					}
					else
					{
						// Que à gauche -> ajout
						?>
                        <section class="panel">
                            <header class="panel-heading">
                                <h2 class="panel-title"><?php echo $confs[0]->directory.'/'.$confs[0]->file;?></h2>
                            </header>
                            <div class="panel-body" style="max-height:80vh; overflow:auto;">
                               <?php echo __('Ajout du fichier');?>
                            </div>
                        </section>
                        <?php
					}
					
					?>
                    
					<?php
                }
                ?>
                
            </div>
        </div>
    </div>
    <!-- end: page -->
</section>

</div>		

</section>

<div style="display:none;">

<?php if ($canEdit)
{
	?>
    <form method="post" id="formSaveFile">
        <input type="hidden" name="id_robot_config" value="<?php echo $config->id_robot_config;?>" />
        <input type="hidden" id="form_id_robot_config_value" name="id_robot_config_value" value="" />
        <input type="hidden" id="form_titre_commit" name="titre_commit" value="" />
        <input type="hidden" id="form_file_content" name="file_content" value="" />
    </form>
    <?php
}
?>

</div>

<?php 
include ('template/footer.php');
?>
<script>
(function( $ ) {

	'use strict';
	
	$('#treeFiles').jstree({
		'core' : {
			'themes' : {
				'responsive': false
			}
		},
		'types' : {
			'default' : {
				'icon' : 'fa fa-folder'
			},
			'file' : {
				'icon' : 'fa fa-file'
			}
		},
		'plugins': ['types']
	});

}).apply( this, [ jQuery ]);

var id_conf;
$(document).ready(function(e) {
    $('.file_button').click(function(e) {
        $('.fichier_contenu').hide();
		id_conf = $(this).data('id_conf');
		
		$('#fichier_'+id_conf+' div.file_edit').hide();
		$('#fichier_'+id_conf+' div.file_history').hide();
		$('#fichier_'+id_conf+' div.file_content').show();
		
        $('#fichier_'+id_conf).show();
    });
	
	$('.bEdit').click(function(e) {
        e.preventDefault();
		
		id_conf = $(this).data('id_conf');
		
		$('#fichier_'+id_conf+' div.file_content').hide();
		$('#fichier_'+id_conf+' div.file_history').hide();
		$('#fichier_'+id_conf+' div.file_edit').show();
		
		$('#fichier_'+id_conf+' textarea').get(0).editor.refresh();
    });
	
	$('.bHistory').click(function(e) {
        e.preventDefault();
		
		id_conf = $(this).data('id_conf');
		
		$('#fichier_'+id_conf+' div.file_content').hide();
		$('#fichier_'+id_conf+' div.file_history').show();
		$('#fichier_'+id_conf+' div.file_edit').hide();
		
		if ($('#fichier_'+id_conf+' div.file_history').data('loaded') == 'no')
		{
			// Chargement ajax de l'historique
			jQuery.ajax({
				url: 'ajax/get_history.php',
				type: "post",
				timeout: 15000,
				data: { 
					id_robot_config_value:id_conf,
					},
				error: function(jqXHR, textStatus, errorThrown) {
					},
				success: function(data) {
					$('#fichier_'+id_conf+' div.file_history').html(data);
					}
			});
		}
    });
	
	$('.bSaveCommit').click(function(e) {
		
		id_conf = $(this).data('id_conf');
		
		$('#form_id_robot_config_value').val( id_conf );
		$('#form_titre_commit').val( $('#fichier_'+id_conf+' .titre-commit').val() );
		$('#form_file_content').val( $('#fichier_'+id_conf+' textarea').get(0).editor.getValue() );
		$('#formSaveFile').submit();
	});
});
</script>

