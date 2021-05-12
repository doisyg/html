<?php

$dir = "images_source";
$dir2 = "images_replaced";
$dir3 = "header_footer";

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Bulk Replace Image Tool</title>
<style>
	input{max-width:100px;}
	form{display:flex;flex-direction:column;border:1px solid black;max-width:300px;padding:20px;margin-left:20px;max-height:200px;}
	form div {width:300px;}
	form p {margin-top:0px;}
	
</style>

</head>

<body style="display:flex">
<form method="POST" action="replace.php">
	<p>Replace Header and/or Footer </p>
	<div>
		<input type="checkbox" id="header" name="header" checked>
		<label for="header">Header</label>
	</div><div>
		<select id="header_name" name="header_name">
			<?php 
				foreach(scandir($dir3) as $filename) { 
					if (!($filename === '.' || $filename === '..' ) && !(strpos($filename,'header') === false)){
						echo '<option value="'.$dir3.'/'.$filename.'">'.$filename.'</option>';
					}
				}
			?>
		</select>
	</div><hr><div>
		<input type="checkbox" id="footer" name="footer" checked>
		<label for="footer">Footer</label>
	</div><div>
		<select id="footer_name" name="footer_name">
			<?php 
				foreach(scandir($dir3) as $filename) { 
					if (!($filename === '.' || $filename === '..' ) && !(strpos($filename,'footer') === false)){
						echo '<option value="'.$dir3.'/'.$filename.'">'.$filename.'</option>';
					}
				}
			?>
		</select>
	</div>
	<input type="submit" value="REPLACE" style="margin-top:10px">
	<input type="hidden" name="dirSource" value="<?= $dir ?>">
	<input type="hidden" name="dirDest" value="<?= $dir2 ?>">
	<input type="hidden" name="dirHeaderFooter" value="<?= $dir3 ?>">
</form>
</body>

<script>

</script>
</html>