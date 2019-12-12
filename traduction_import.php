<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "traduction";
$sectionSousMenu = "";

if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) { header('location:index.php?notallow=1'); exit; }



$saved = false;

$langues = array();
$languesOrder = array();
foreach ($_FILES as $file)
{
	if ($file['error']==0)
	{
		$fp = fopen($file['tmp_name'],'r');
		$first = true;
		while($csv_line = fgetcsv($fp,1024, ';'))
		{
			if ($first)
			{
				$first = false;
				foreach ($csv_line as $colonne)
				{
					if ($colonne!='ID')
						$languesOrder[] = $colonne;
				}
				
				// On Initialise les langue 
				foreach ($languesOrder as $lang)
				{
					$langues[$lang] = Translate::GetTraductions($lang);
				}
			}
			else
			{
				$keyLang = '';
				foreach ($csv_line as $key => $valeur)
				{
					if ($key==0) $keyLang = $valeur;
					else
					{
						$langues[$languesOrder[$key-1]][$keyLang] = utf8_encode($valeur);
					}
				}
			}
			 
		}
		
		foreach ($languesOrder as $lang)
		{
			Translate::CreateFileLang($langues[$lang], $lang);
		}
		fclose($fp);
		
		$saved = true;
	}
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
                    if ($saved)
                    {
                        ?><h2><?php echo __('Fichier importé');?></h2><?php
                    }
                    else
                    {
                        
                        ?><h2><?php echo __('Erreur durant l\'import');?></h2><?php
                    }
                    ?>

                    
                    
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