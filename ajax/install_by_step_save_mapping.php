<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();
if ($userConnected->id_groupe_user > 2) die();


if (isset($_POST['nom']))
{
	$plan = new Map();
	$plan->id_site = $currentIdSite;
	
	$plan->threshold_free = $_POST['threshold_free'];
	$plan->threshold_occupied = $_POST['threshold_occupied'];
	
	if (strlen($_POST['image']) > 22)
	{
		$plan->image = substr($_POST['image'], 22);
	}
	
	if (strlen($_POST['image_tri']) > 22)
	{
		$image = imagecreatefromstring(base64_decode(substr($_POST['image_tri'], 22)));
		imagesetthickness($image, 2);
		
		$gris =  imagecolorallocate ( $image , 205, 205, 205 );
		
		$width = imagesx($image);
    	$height = imagesy($image);
		
		for($x = 0; $x < $width; $x++) {
			for($y = 0; $y < $height; $y++) {
				// pixel color at (x, y)
				$rgba = imagecolorat($image, $x, $y);
				$alpha     = ($rgba & 0x7F000000) >> 24;
				if ($alpha == 127)
				{
					 imagesetpixel ($image , $x , $y , $gris );
				}
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
	}
	$plan->nom = $_POST['nom'];
	$plan->ros_resolution = 5;
	$plan->ros_height = $_POST['ros_hauteur'];
	$plan->ros_width = $_POST['ros_largeur'];
	$plan->Save();
	
	$forbiddens = $plan->GetForbiddenAreas();
	foreach($forbiddens as $forbidden)
	{
		$forbidden->GetPoints();
	}
	$areas = $plan->GetAreas();
	foreach($areas as $area)
	{
		$area->GetPoints();
		$area->GetConfigs();
	}
	$docks = $plan->GetStationRecharges();
	$pois = $plan->GetPois();
	
	echo json_encode(array(
		'id_map' => $plan->id_map, 
		'forbiddens' => $forbiddens, 
		'areas' => $areas, 
		'docks' => $docks, 
		'pois' => $pois,
		'plan' => $plan,
		'error' => ''
	));
}
else
	echo json_encode(array('id_map' => -1, 'error' => 'no param'));
	
$confStep = Configuration::GetFromVariable('INSTALL_STEP');
$confStep->valeur = 8;
$confStep->Save();
?>
