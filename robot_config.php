<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "setup";
$sectionSousMenu = "configuration";

if (isset($_POST['id_robot_config']))
{
	if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'edit')) { header('location:robot_config.php?id_robot_config='.$_POST['id_robot_config'].'&notallow=1'); exit; }

	$config = new RobotConfig($_POST['id_robot_config']);
	
	$configToUpdate = new RobotConfigValue($_POST['id_robot_config_value']);
	
	$config->Dupliquer();
	$config->update_by = 'Server';
	$config->modifications = $_POST['titre_commit'];
	
	// On cherche le fichier à modifier
	$fichiers = $config->GetListByFile();
	foreach($fichiers as $file)
	{
		if ($file->directory == $configToUpdate->directory && $file->file == $configToUpdate->file)
		{
			$file->data = html_entity_decode($_POST['file_content'], ENT_QUOTES | ENT_XML1, 'UTF-8');
			$file->date_upd_server = date('Y-m-d H:i:s');
			$file->date_upd_robot = '0000-00-00 00:00:00';
			$file->Save();
			break;
		}
	}
	
	$config->Save();
	
	header('location:robot_config.php?id_robot_config='.$config->id_robot_config.'&ok=1');
}

if (!isset($_GET['id_robot_config']))  { header('location:index.php?notallow=1'); exit; }
if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) { header('location:index.php?notallow=1'); exit; }

$config = new RobotConfig($_GET['id_robot_config']);


$titre = __('Configuration');

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
        <div class="col-md-3">
            <div class="row">
                <section class="panel">
                	<div class="panel-body" style="max-height:80vh; overflow:auto;">
                        <div id="treeFiles">
                            <ul>
                                <li class="folder" data-jstree='{ "opened" : true }'>
                                    Configuration
                                    <ul>
                                    	<?php
										$confs = $config->GetConfigValues('directory ASC, file ASC', '');
										$curDir = '';
										$isOpenDir = false;
										foreach($confs as $conf)
										{
											if ($curDir != $conf->directory)
											{
												$curDir = $conf->directory;
												if ($isOpenDir)
												{
													?></ul></li><?php
												}
												$isOpenDir = true;
											
												?><li data-jstree='{ "opened" : true }'><?php echo trim($conf->directory, '/');?>
													<ul>
												<?php
											}
											?>
											<li class="file_button colored-icon" data-id_conf="<?php echo $conf->id_robot_config_value;?>" <?php echo $conf->is_file==0?'data-jstree=\'{ "type" : "file" }\'':'data-jstree=\'{ "icon" : "fa fa-picture-o" }\'';?>>
												 <?php echo $conf->file;?>
											</li>
                                            <?php
										}
										?>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
                
            </div>
        </div>
        <div class="col-md-9">
            <div class="">
	            <?php
				foreach($confs as $conf)
				{
					$t = explode('.', $conf->file);
					$extension = array_pop($t);
					?>
                    <section class="panel fichier_contenu" id="fichier_<?php echo $conf->id_robot_config_value;?>">
                        <header class="panel-heading">
                            <div class="" style="float:right; margin-top:-5px;">
                                <a href="#" data-id_conf="<?php echo $conf->id_robot_config_value;?>" class="bHistory btn btn-default"><?php echo __('History');?></a>
                                <?php if ($canEdit && $extension != 'png') {?><a href="#" data-id_conf="<?php echo $conf->id_robot_config_value;?>" class="bEdit btn btn-default"><i class="fa fa-pencil"></i> <?php echo __('Modifier');?></a><?php }?>
                            </div>
    
                            <h2 class="panel-title"><?php echo $conf->file;?></h2>
                        </header>
                        <div class="panel-body" style="max-height:80vh; overflow:auto;">
                            
                            <div class="file_content">
                                <?php 
								if ($extension != 'png')
									echo '<pre class="normal">'.htmlspecialchars ($conf->data).'</pre>';
								else
								{
									?><img src="data:image/png;base64,<?php echo $conf->data;?>" style="max-width:45%; max-height:50vh;" /><?php
								}
								?>
                            </div>
                            <?php if ($canEdit && $extension != 'png')
							{
								?>
                            <div class="file_edit">
                            	<textarea class="form-control" rows="10" id="" name="" data-plugin-codemirror data-plugin-options='{ "mode": "text/x-yaml", "autoRefresh": true }'><?php echo $conf->data;?></textarea>
                            
                            	<fieldset style="margin-top:20px;">
                                	<legend>Commit changes</legend>
                                    <input type="text" class="form-control titre-commit" value="<?php echo 'Update '.$conf->directory.'/'.$conf->file;?>" />
                            		<a href="#" data-id_conf="<?php echo $conf->id_robot_config_value;?>" class="bSaveCommit btn btn-primary pull-right" style="margin-top:10px;"><?php echo __('Sauver');?></a>
                                </fieldset>
                            </div>
                            	<?php
							}
							?>
                            
                            <div class="file_history" data-loaded="no">
                            	<i class="fa fa-refresh fa-spin" style="font-size:24px;"></i>
                            </div>
                        </div>
                    </section>
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

