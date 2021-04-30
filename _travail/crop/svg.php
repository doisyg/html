<?php

$dir = "images_source";
$dir2 = "images_cropped";
$img_name = scandir($dir, 1)[0];
$im = imagecreatefrompng($dir.'/'.$img_name);
$maxX = imagesx($im);
$maxY = imagesy($im);
$b64 = base64_encode(file_get_contents($dir.'/'.$img_name));

//DEFAULT VALUES
$defaultX = 45;
$defaultY = 187;
$defaultWidth = $maxX/2;
$defaultHeight = $maxY/2;
$defaultWidth = 414;
$defaultHeight = 736;
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Bulk Crop Tool</title>
<style>
	input{max-width:100px;}
	form{display:flex;flex-direction:column;border:1px solid black;max-width:200px;padding:20px;margin-left:20px;max-height:200px;}
	form div {width:200px;}
	form p {margin-top:0px;}
	svg{width:<?= $maxX ?>px;height:<?= $maxY ?>px;}
	svg rect{fill: rgb(255 255 255 / 40%);stroke: orangered;};
</style>

</head>

<body style="display:flex">
<svg>
	<image id="img" xlink:href="data:image/png;base64,<?= $b64 ?>" x="0" y="0" height="<?= $maxY ?>" width="<?= $maxX ?>"></image>
	<rect id="RECT" x="<?= $defaultX ?>" y="<?= $defaultY ?>" height="<?= $defaultHeight ?>" width="<?= $defaultWidth ?>" stroke-width="1"></rect>
</svg>
<form method="POST" action="crop.php">
	<p>CROP ZONE</p>
	<div>
		<label for="X">X</label>
		<input type="number" value="<?= $defaultX ?>" name="X" id="X" max="<?= $maxX ?>" min ="0"/>
		px
	</div><div>
		<label for="Y">Y</label>
		<input type="number" value="<?= $defaultY ?>" name="Y" id="Y" max="<?= $maxY ?>" min ="0"/>
		px
	</div><div>
		<label for="WIDTH">Width</label>
		<input type="number" value="<?= $defaultWidth  ?>" name="WIDTH" id="WIDTH" max="<?= $maxX - $defaultX?>" min ="0"/>
		px
	</div><div>
		<label for="HEIGHT">Height</label>
		<input type="number" value="<?= $defaultHeight  ?>" name="HEIGHT" id="HEIGHT" max="<?= $maxY - $defaultY ?>" min ="0"/>
		px
	</div>
	<input type="submit" value="CROP" style="margin-top:10px">
	<input type="hidden" name="dirSource" value="<?= $dir ?>">
	<input type="hidden" name="dirDest" value="<?= $dir2 ?>">
</form>
</body>

<script>
	var maxX = <?= $maxX ?>;
	var maxY = <?= $maxY ?>;
	
	const svgRect = document.getElementById('RECT');
	const inputX = document.getElementById('X');
	const inputY = document.getElementById('Y');
	const inputWidth = document.getElementById('WIDTH');
	const inputHeight = document.getElementById('HEIGHT');
	
	inputX.addEventListener('change', (event) => {
		svgRect.setAttribute("x", event.target.value);
		inputWidth.setAttribute("max", maxX - event.target.value);
	});
	
	inputY.addEventListener('change', (event) => {
		svgRect.setAttribute("y", event.target.value);
		inputHeight.setAttribute("max", maxY - event.target.value);
	});
	
	inputWidth.addEventListener('change', (event) => {
		svgRect.setAttribute("width", event.target.value);
	});
	
	inputHeight.addEventListener('change', (event) => {
		svgRect.setAttribute("height", event.target.value);
	});
	
	
</script>
</html>