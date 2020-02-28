<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }


$dossier_config = $_CONFIG['CONFIG_PATH'];

$plan = $currentMap;

$i = 1;
echo 'Test '.$i.'<br>';
file_put_contents($dossier_config.'test_'.$i.'_original.png', base64_decode($plan->image));
echo 'test_'.$i.'_original.png<br><br>';


$image = imagecreatefromstring(base64_decode($plan->image_tri));

$noir = imagecolorallocate($image, 255, 255, 255);
$gris = imagecolorallocate($image, 200, 200, 200);

imagesetthickness($image, 2);

$width = imagesx($image);
$height = imagesy($image);

for($x = 0; $x < $width; $x++) {
	for($y = 0; $y < $height; $y++) {
		// pixel color at (x, y)
		$rgb = imagecolorat($image, $x, $y);
		$colors = imagecolorsforindex($image, $rgb);
		if ($colors['alpha'] == 0)
		{
			 imagesetpixel ($image , $x , $y , $gris );
		}
	}
}


ob_start();
imagepng($image);
$contents = ob_get_contents();
ob_end_clean();

$i++;
echo 'Test '.$i.'<br>';
file_put_contents($dossier_config.'test_'.$i.'_after_image.png', $contents);
echo 'test_'.$i.'_after_image.png<br><br>';


try
{
	if (class_exists('Imagick'))
	{
		$i++;
		echo 'Test '.$i.'<br>';
		
		$imagick = new Imagick();
		$imagick->readImageBlob($contents);
		$imagick->transformImageColorspace(Imagick::COLORSPACE_TRANSPARENT);
		$imagick->setImageType(Imagick::IMGTYPE_GRAYSCALE);
		$imagick->setImageFormat('png32');
		

		ob_start();
		echo $imagick; 
		$contentsImagick = ob_get_contents();
		ob_end_clean();
		$imagick->clear();
		$imagick->destroy();
		
		file_put_contents($dossier_config.'test_'.$i.'_imagick_PNG32.png', $contents);
		echo 'test_'.$i.'_imagick_PNG32.png<br><br>';
		
		$i++;
		echo 'Test '.$i.'<br>';
		$imagick = new Imagick();
		$imagick->readImageBlob($contents);
		$imagick->transformImageColorspace(Imagick::COLORSPACE_TRANSPARENT);
		$imagick->setImageFormat('png32');

		ob_start();
		echo $imagick;
		$contentsImagick = ob_get_contents();
		ob_end_clean();
		$imagick->clear();
		$imagick->destroy();
		
		file_put_contents($dossier_config.'test_'.$i.'_imagick_COLORSPACE_TRANSPARENT_PNG32.png', $contents);
		echo 'test_'.$i.'_imagick_COLORSPACE_TRANSPARENT_PNG32.png<br><br>';
		
		$i++;
		echo 'Test '.$i.'<br>';
		$imagick = new Imagick();
		$imagick->readImageBlob($contents);
		$imagick->setImageType(Imagick::IMGTYPE_GRAYSCALE);
		$imagick->setImageFormat('png32');

		ob_start();
		echo $imagick;
		$contentsImagick = ob_get_contents();
		ob_end_clean();
		$imagick->clear();
		$imagick->destroy();
		
		file_put_contents($dossier_config.'test_'.$i.'_imagick_IMGTYPE_GRAYSCALE_PNG32.png', $contents);
		echo 'test_'.$i.'_imagick_IMGTYPE_GRAYSCALE_PNG32.png<br><br>';
		
		
		$i++;
		echo 'Test '.$i.'<br>';
		$imagick = new Imagick();
		$imagick->readImageBlob($contents);
		$imagick->transformImageColorspace(Imagick::COLORSPACE_TRANSPARENT);
		$imagick->setImageType(Imagick::IMGTYPE_GRAYSCALE);
		$imagick->setImageFormat('png32');

		ob_start();
		echo $imagick;
		$contentsImagick = ob_get_contents();
		ob_end_clean();
		$imagick->clear();
		$imagick->destroy();
		
		file_put_contents($dossier_config.'test_'.$i.'_imagick_COLORSPACE_TRANSPARENT_IMGTYPE_GRAYSCALE_PNG32.png', $contents);
		echo 'test_'.$i.'_imagick_COLORSPACE_TRANSPARENT_IMGTYPE_GRAYSCALE_PNG32.png<br><br>';
		
		
		
		$i++;
		echo 'Test '.$i.'<br>';
		
		$imagick = new Imagick();
		$imagick->readImageBlob($contents);
		$imagick->transformImageColorspace(Imagick::COLORSPACE_TRANSPARENT);
		$imagick->setImageType(Imagick::IMGTYPE_GRAYSCALE);
		$imagick->setImageFormat('png');

		ob_start();
		echo $imagick;
		$contentsImagick = ob_get_contents();
		ob_end_clean();
		$imagick->clear();
		$imagick->destroy();
		
		file_put_contents($dossier_config.'test_'.$i.'_imagick_PNG.png', $contents);
		echo 'test_'.$i.'_imagick_PNG.png<br><br>';
		
		$i++;
		echo 'Test '.$i.'<br>';
		$imagick = new Imagick();
		$imagick->readImageBlob($contents);
		$imagick->transformImageColorspace(Imagick::COLORSPACE_TRANSPARENT);
		$imagick->setImageFormat('png');

		ob_start();
		echo $imagick;
		$contentsImagick = ob_get_contents();
		ob_end_clean();
		$imagick->clear();
		$imagick->destroy();
		
		file_put_contents($dossier_config.'test_'.$i.'_imagick_COLORSPACE_TRANSPARENT_PNG.png', $contents);
		echo 'test_'.$i.'_imagick_COLORSPACE_TRANSPARENT_PNG.png<br><br>';
		
		$i++;
		echo 'Test '.$i.'<br>';
		$imagick = new Imagick();
		$imagick->readImageBlob($contents);
		$imagick->setImageType(Imagick::IMGTYPE_GRAYSCALE);
		$imagick->setImageFormat('png');

		ob_start();
		echo $imagick;
		$contentsImagick = ob_get_contents();
		ob_end_clean();
		$imagick->clear();
		$imagick->destroy();
		
		file_put_contents($dossier_config.'test_'.$i.'_imagick_IMGTYPE_GRAYSCALE_PNG.png', $contents);
		echo 'test_'.$i.'_imagick_IMGTYPE_GRAYSCALE_PNG.png<br><br>';
		
		
		$i++;
		echo 'Test '.$i.'<br>';
		$imagick = new Imagick();
		$imagick->readImageBlob($contents);
		$imagick->transformImageColorspace(Imagick::COLORSPACE_TRANSPARENT);
		$imagick->setImageType(Imagick::IMGTYPE_GRAYSCALE);
		$imagick->setImageFormat('png');

		ob_start();
		echo $imagick;
		$contentsImagick = ob_get_contents();
		ob_end_clean();
		$imagick->clear();
		$imagick->destroy();
		
		file_put_contents($dossier_config.'test_'.$i.'_imagick_COLORSPACE_TRANSPARENT_IMGTYPE_GRAYSCALE_PNG.png', $contents);
		echo 'test_'.$i.'_imagick_COLORSPACE_TRANSPARENT_IMGTYPE_GRAYSCALE_PNG.png<br><br>';
	
	}
}
catch(Excepion $e)
{
}



