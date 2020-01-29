<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "maps";
$sectionSousMenu = "";

if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')) { echo json_encode(array('id_plan' => $plan->id_plan, 'error' => 'not allow')); exit; }

if (isset($_POST['nom']))
{
	$plan = new Plan();
	$plan->id_site = $currentIdSite;
	if (strlen($_POST['image']) > 22)
	{
		
		ob_start();
		imagepng(substr($_POST['image'], 22));
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

		$plan->image = $contents;
	}
	
	if (strlen($_POST['image_tri']) > 22)
	{
		
		ob_start();
		imagepng(substr($_POST['image_tri'], 22));
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

		$plan->image_tri = $contents;
	}
	$plan->nom = $_POST['nom'];
	$plan->ros_resolution = 5;
	$plan->ros_hauteur = $_POST['ros_hauteur'];
	$plan->ros_largeur = $_POST['ros_largeur'];
	$plan->Save();
	
	echo json_encode(array('id_plan' => $plan->id_plan, 'error' => ''));
}
else
	echo json_encode(array('id_plan' => -1, 'error' => 'no param'));

?>
