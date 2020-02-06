<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "maps";
$sectionSousMenu = "";


if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'edit')) { header('location:index.php?notallow=1'); exit; }

$plan = new Plan((int)$_POST['id_plan']);

$_POST['forbiddens'] = str_replace('&#34;', '"', $_POST['forbiddens']);
$forbiddens = json_decode($_POST['forbiddens']);
foreach($forbiddens as $forbidden)
{
	if ((int)$_POST['id_plan'] != (int)$forbidden->id_plan) continue;
	if ($forbidden->id_area < 300000)
		$f = new Area($forbidden->id_area);
	else
		$f = new Area();
	$f->comment = $forbidden->comment;
	$f->couleur_r = $forbidden->couleur_r;
	$f->couleur_g = $forbidden->couleur_g;
	$f->couleur_b = $forbidden->couleur_b;
	$f->id_plan = $forbidden->id_plan;
	$f->is_forbidden = 1;
	$f->nom = $forbidden->nom;
	$f->points = $forbidden->points;
	$f->deleted = $forbidden->deleted;
	$f->Save(true);
}


$_POST['areas'] = str_replace('&#34;', '"', $_POST['areas']);
$areas = json_decode($_POST['areas']);
foreach($areas as $area)
{
	if ((int)$_POST['id_plan'] != (int)$area->id_plan) continue;
	if ($area->id_area < 300000)
		$a = new Area($area->id_area);
	else
		$a = new Area();
	$a->comment = $area->comment;
	$a->couleur_r = $area->couleur_r;
	$a->couleur_g = $area->couleur_g;
	$a->couleur_b = $area->couleur_b;
	$a->id_plan = $area->id_plan;
	$a->is_forbidden = 0;
	$a->nom = $area->nom;
	$a->points = $area->points;
	$a->configs = $area->configs;
	$a->deleted = $area->deleted;
	$a->Save(true, true);
}

$_POST['docks'] = str_replace('&#34;', '"', $_POST['docks']);
$docks = json_decode($_POST['docks']);
foreach($docks as $dock)
{
	if ((int)$_POST['id_plan'] != (int)$dock->id_plan) continue;
	if ($dock->id_station_recharge < 300000)
		$s = new StationRecharge($dock->id_station_recharge);
	else
		$s = new StationRecharge();
	if (isset($dock->deleted) && $dock->deleted==1)
	{
		$s->Supprimer();
	}
	else
	{
		$s->id_plan = $dock->id_plan;
		$s->num = $dock->num;
		$s->x_ros = $dock->x_ros;
		$s->y_ros = $dock->y_ros;
		$s->t_ros = $dock->t_ros;
		$s->Save();
	}
}

$_POST['pois'] = str_replace('&#34;', '"', $_POST['pois']);
$pois = json_decode($_POST['pois']);
foreach($pois as $poi)
{
	if ((int)$_POST['id_plan'] != (int)$poi->id_plan) continue;
	if ($poi->id_poi < 300000)
		$p = new Poi($poi->id_poi);
	else
		$p = new Poi();
	if (isset($poi->deleted) && $poi->deleted==1)
	{
		$p->Supprimer();
	}
	else
	{
		$p->id_plan = $poi->id_plan;
		$p->name = $poi->name;
		$p->x_ros = $poi->x_ros;
		$p->y_ros = $poi->y_ros;
		$p->t_ros = $poi->t_ros;
		$p->Save();
	}
}
$image = imagecreatefromstring(base64_decode($plan->image_tri));

$blanc = imagecolorallocate($image, 255,255,255);

imagesetthickness($image, 2);

$_POST['gommes'] = str_replace('&#34;', '"', $_POST['gommes']);
$gommes = json_decode($_POST['gommes']);

foreach($gommes as $points)
{
	for ($i=0; $i<count($points); $i++)
	{
		$ip1 = $i+1;
		if ($i == count($points)-1) $ip1 = 0;
		
		$x1 = $points[$i]->x / 5 * 100;
		$y1 = $plan->ros_hauteur - $points[$i]->y / 5 * 100;
		$x2 = $points[$ip1]->x / 5 * 100;
		$y2 = $plan->ros_hauteur - $points[$ip1]->y / 5 * 100;
		
		imageline($image, $x1, $y1, $x2, $y2, $blanc);
	}
}

ob_start();
imagepng($image);
$contents = ob_get_contents();
ob_end_clean();

try
{
	if (class_exists('Imagick'))
	{
		$imagick = new Imagick();
		$imagick->readImageBlob($contents);
		$imagick->transformImageColorspace(Imagick::COLORSPACE_TRANSPARENT);
		$imagick->setImageType(Imagick::IMGTYPE_GRAYSCALE);
		$imagick->setImageFormat('png32');
		//$imagick->setImageAlphaChannel(Imagick::ALPHACHANNEL_ACTIVATE );		
				
		ob_start();
		echo $imagick;
		$contents = ob_get_contents();
		ob_end_clean();
	}
}
catch(Excepion $e)
{
}

$plan->image_tri = base64_encode($contents);
$plan->save();

if ($plan->id_plan == $currentIdPlan)
{
	// On sauvegarde sur le robot
	$plan->ExportToConfig();
	$plan->SendToRobot();
	
}

?>
