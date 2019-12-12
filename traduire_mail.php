<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "traduction";
$sectionSousMenu = "";

if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) { header('location:index.php?notallow=1'); exit; }

if (isset($_POST['lang']))
{
	$traductionLang = Translate::GetTraductionsMail($_POST['lang']);
	foreach($_POST as $key => $value)
	{
		if (strlen($key)>10)
			$traductionLang[$key] = $value;
	}
	
	Translate::CreateFileLangMail($traductionLang, $_POST['lang']);
	
	header('location:traduire_mail.php?ok=1&tlang='.$_POST['lang'].(isset($_POST['all'])?'&all=1':''));
}

$titre = __('Translation');

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
                
                	<?php
                    $traductionFr = Translate::GetTraductionsMail(1);
					$traductionLang = Translate::GetTraductionsMail($_GET['tlang']);
					
					$lang = new Lang($_GET['tlang']);
					?>
					
                    <div class="row">

        <form method="post" action="traduire_mail.php" class="col-md-12">
        <input type="hidden" name="lang" value="<?php echo $_GET['tlang'];?>" />
        <?php
		if (isset($_GET['all']))
		{
			?><input type="hidden" name="all" value="1" /><?php
		}
        ?>
        <table border="0" width="100%" cellpadding="0" cellspacing="0" id="sortable-table" class="table table-sortable table-bordered table-striped mb-none">
        <thead>
        	<tr>
            	<th style="width:40%;">FR</th>
                <th style="width:60%;"><?php echo strtoupper($lang->iso);?></th>
            </tr>
        </thead>
        <tbody>
        <?php
		foreach ($traductionFr as $key => $source)
		{
			if (isset($_GET['all']) || $traductionLang[$key]=='')
			{
				?>
				<tr>
					<td><?php echo $source;?></td>
					<td><input type="text" style="width:95%;" class="form-control" name="<?php echo $key;?>" value="<?php echo (isset($traductionLang[$key])?$traductionLang[$key]:'');?>" /></td>
				</tr>
				<?php	
			}
		}
		?>
        </tbody>
        </table>
        <p style="text-align:right; margin-top:50px;"><input type="submit" class="btn btn-primary btn-md btn-grad" value="<?php echo __('Sauver');?>" /></p>
		</form>

</div>
                    
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
			paging:false
		});

	};

	$(function() {
		datatableInit();
	});

}).apply( this, [ jQuery ]);
</script>
