<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = 'setup';
$sectionSousMenu = 'robot';

if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'edit')) { header('location:index.php?notallow=1'); exit; }


if (isset($_POST['save_setup']))
{
	$c = Configuration::GetFromVariable('level_min_gotodock');
	$c->valeur = $_POST['level_min_gotodock'];
	$c->Save();	
		
	$c = Configuration::GetFromVariable('level_min_dotask');
	$c->valeur = $_POST['level_min_dotask'];
	$c->Save();	
		
	header('location:robot_setup.php?ok=1');
}

$titre = __('Robot setup');

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
                <form method="post" class="form-horizontal">
				    <input type="hidden" name="save_setup" value="1" />
    
                        <div class="form-group">
                            <label for="level_min_gotodock" class="control-label col-xs-8"><?php echo __('Battery min before return to charge');?></label>
                            <div class="col-xs-4">
                                <div class="input-group">
                                    <input type="number" min="10" max="80" name="level_min_gotodock" value="<?php echo Configuration::GetValue('level_min_gotodock');?>" class="form-control" />
                                    <span class="input-group-addon">%</span>
                                </div>
                            </div>
                        </div>
                              
                        <div class="form-group">
                            <label for="level_min_dotask" class="control-label col-xs-8"><?php echo __('Battery min to leave the charge');?></label>
                            <div class="col-xs-4">
                                <div class="input-group">
                                    <input type="number" min="10" max="80" name="level_min_dotask" value="<?php echo Configuration::GetValue('level_min_dotask');?>" class="form-control" />
                                    <span class="input-group-addon">%</span>
                                </div>
                            </div>
                        </div>
                              
                        <div style="clear:both; height:30px;"></div>  
                        
                        <input type="submit" value="<?php echo __('Sauver');?>" class="btn btn-success btn-lg btn-grad" />
                        
                        <a href="index.php" class="btn btn-warning btn-lg btn-grad"><?php echo __('Annuler');?></a>
                                
                               
                    </form>
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



$(document).ready(function(e) {
	$('.bChoixLangue').click(function(e) {
		e.preventDefault();
		id = $(this).data('id_lang');
		$('#id_lang').val(id);
		$('.bChoixLangue').removeClass('actif');
		$(this).addClass('actif');
	});
	
});

</script>