<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "traduction";
$sectionSousMenu = "";

if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) { header('location:index.php?notallow=1'); exit; }


if (isset($_GET['index']))
{
	Translate::IndexAllFiles();
	$translate = new Translate('fr');
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
                
					
                    <div class="row">
    
<div class="col-md-6">
<p><a class="btn btn-primary btn-md btn-grad" href="traduction.php?index=1" title="<?php echo __('Indexer tous les fichiers');?>"><?php echo __('Indexer tous les fichiers');?></a></p>

<p><span style="display:inline-block; width:200px;"><?php echo __('Traduire tous les textes :');?></span>
<?php
$liens = array();
$langues = Lang::GetLangs();
foreach ($langues as $lang)
{
    $liens[] = '<a href="traduire.php?tlang='.$lang->iso.'&all=1">'.$lang->langue.'</a>';
}
echo implode($liens, ' | ');
?></p>


<p><span style="display:inline-block; width:200px;"><?php echo __('Traduire les emails :');?></span>
<?php
$liens = array();
$langues = Lang::GetLangs();
foreach ($langues as $lang)
{
    $liens[] = '<a href="traduire_mail.php?tlang='.$lang->id_lang.'&all=1">'.$lang->langue.'</a>';
}
echo implode($liens, ' | ');
?></p>
<!--
<p><span style="display:inline-block; width:200px;"><?php echo __('Traduire les textes manquants :');?></span>
<?php
$liens = array();
foreach ($langues as $lang)
{
    $liens[] = '<a href="traduire.php?tlang='.$lang->iso.'">'.$lang->langue.'</a>';
}
echo implode($liens, ' | ');
?></p>
-->
<p><a class="btn btn-primary btn-md btn-grad" href="traduction_export.php" title="<?php echo __('Export CSV');?>"><?php echo __('Export CSV');?></a></p>

</div>


<div class="col-md-6">
<p>
<form method="post" action="traduction_import.php" enctype="multipart/form-data">
<fieldset><legend><?php echo __('Import CSV');?></legend>
<label for="csv"><?php echo __('Fichier CSV');?></label><input type="file" name="csv" /><br />
<input type="submit" class="btn btn-primary btn-md btn-grad" value="<?php echo __('Importer CSV');?>" />
</fieldset>
</form>
</p>
</div>

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