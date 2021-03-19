<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die('no_auth');
if ($_SESSION['id_groupe_user'] > 2) die('no_right');

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
			$imagick->setImageAlphaChannel(Imagick::ALPHACHANNEL_ACTIVATE );		
					
			ob_start();
			echo $imagick;
			$contents = ob_get_contents();
			ob_end_clean();
		}
	}
	catch(Excepion $e)
	{
	}

	$r = array('error' => false, 'image' => base64_encode($contents));
}
else
	$r = array('error' => true, 'image' => '');
	
echo json_encode($r);
?>
