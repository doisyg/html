<?php
function CheckComplecityPass($pass)
{
	$nbChiffreMin = 2;
	$nbLettreMin = 2;
	$nbCarMin = 8;
	
	if (strlen($pass) < $nbCarMin)
		return false;
	
	$nbChiffre = 0;
	$nbLettre = 0;
	for ($i=0 ; $i<strlen($pass) ; $i++)
	{
		if (preg_match("#[0-9]#", $pass[$i]))
			$nbChiffre++;
		else
			$nbLettre++;
	}
	
	if ($nbChiffre<$nbChiffreMin) return false;
	if ($nbLettre<$nbLettreMin) return false;
	
	return true;
}
function _remove_evil_attributes($str, $is_image=false)
{
	// All javascript event handlers (e.g. onload, onclick, onmouseover), style, and xmlns
	$evil_attributes = array('on\w*', 'style', 'xmlns', 'formaction');

	if ($is_image === TRUE)
	{
		/*
		 * Adobe Photoshop puts XML metadata into JFIF images, 
		 * including namespacing, so we have to allow this for images.
		 */
		unset($evil_attributes[array_search('xmlns', $evil_attributes)]);
	}

	do {
		$count = 0;
		$attribs = array();

		// find occurrences of illegal attribute strings with quotes (042 and 047 are octal quotes)
		preg_match_all('/('.implode('|', $evil_attributes).')\s*=\s*(\042|\047)([^\\2]*?)(\\2)/is', $str, $matches, PREG_SET_ORDER);

		foreach ($matches as $attr)
		{
			$attribs[] = preg_quote($attr[0], '/');
		}

		// find occurrences of illegal attribute strings without quotes
		preg_match_all('/('.implode('|', $evil_attributes).')\s*=\s*([^\s>]*)/is', $str, $matches, PREG_SET_ORDER);

		foreach ($matches as $attr)
		{
			$attribs[] = preg_quote($attr[0], '/');
		}

		// replace illegal attribute strings that are inside an html tag
		if (count($attribs) > 0)
		{
			$str = preg_replace('/(<?)(\/?[^><]+?)([^A-Za-z<>\-])(.*?)('.implode('|', $attribs).')(.*?)([\s><]?)([><]*)/i', '$1$2 $4$6$7$8', $str, -1, $count);
		}

	} while ($count);

	return $str;
}	

function xss_clean($data)
{
	// Fix &entity\n;

    $data = str_replace(array('&amp;','&lt;','&gt;'), array('&amp;amp;','&amp;lt;','&amp;gt;'), $data);
    $data = preg_replace('/(&#*\w+)[\x00-\x20]+;/u', '$1;', $data);
    $data = preg_replace('/(&#x*[0-9A-F]+);*/iu', '$1;', $data);
    $data = html_entity_decode($data, ENT_COMPAT, 'UTF-8');

	// Remove any attribute starting with "on" or xmlns
    $data = preg_replace('#(<[^>]+?[\x00-\x20"\'])(?:on|xmlns)[^>]*+>#iu', '$1>', $data);
	
	// Steph
	$data = _remove_evil_attributes($data);

	// Remove javascript: and vbscript: protocols
    $data = preg_replace('#([a-z]*)[\x00-\x20]*=[\x00-\x20]*([`\'"]*)[\x00-\x20]*j[\x00-\x20]*a[\x00-\x20]*v[\x00-\x20]*a[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2nojavascript...', $data);
    $data = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*v[\x00-\x20]*b[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2novbscript...', $data);
    $data = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*-moz-binding[\x00-\x20]*:#u', '$1=$2nomozbinding...', $data);

	// Only works in IE: <span style="width: expression(alert('Ping!'));"></span>
    $data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?expression[\x00-\x20]*\([^>]*+>#i', '$1>', $data);
    $data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?behaviour[\x00-\x20]*\([^>]*+>#i', '$1>', $data);
    $data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:*[^>]*+>#iu', '$1>', $data);

	// Remove namespaced elements (we do not need them)
    $data = preg_replace('#</*\w+:\w[^>]*+>#i', '', $data);

    do
    {
        // Remove really unwanted tags
        $old_data = $data;
        $data = preg_replace('#</*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|i(?:frame|layer)|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|title|xml)[^>]*+>#i', '', $data);
    }
    while ($old_data !== $data);
    $data=filter_var($data, FILTER_SANITIZE_STRING);
	
	// Steph
	$data = str_replace(array('&amp;','&lt;','&gt;','<','>','='), array('&amp;amp;','&amp;lt;','&amp;gt;','','',''), $data);
	
	// we are done...
    return strip_tags($data);
}

function ConvertWtoDW($mot1, $mot2)
{
	$bin1 = decbin($mot1)."";
	if (strlen($bin1)>16) $bin1 = substr($bin1, 16, 16);
	
	$bin2 = decbin($mot2)."";
	if (strlen($bin2)>16) $bin2 = substr($bin2, 16, 16);
	
	$bin = str_pad($bin1, 16, '0', STR_PAD_LEFT).str_pad($bin2, 16, '0', STR_PAD_LEFT);
	
	return bindec($bin);
}


function GetImage($imageBD)
{
	if (file_exists('produit/'.$imageBD.'.png'))
		return 'produit/'.$imageBD.'.png';
	else	
	{
		return "";
	}
}

function replaces_in_all_files($replaces)
{
	$directory = dirname(__FILE__).'/../';
	$scanned_directory = array_diff(scandir($directory), array('..', '.'));
	foreach($scanned_directory as $file)
	{
		if (is_dir($directory.$file) || substr($file, -3)!='php')
		{
		}
		else
		{
			replaces_in_file($directory.$file, $replaces);
		}
		
	}
}

function replaces_in_file($nom_fichier, $replaces)
{
	$str=file_get_contents($nom_fichier);
	foreach($replaces as $rep)
	{
		$str=str_replace($rep['from'], $rep['to'], $str);
	}
	file_put_contents($nom_fichier, $str);
}

function replace_in_all_files($serach_text, $replace_text)
{
	$directory = dirname(__FILE__).'/../';
	$scanned_directory = array_diff(scandir($directory), array('..', '.'));
	foreach($scanned_directory as $file)
	{
		if (is_dir($directory.$file) || substr($file, -3)!='php')
		{
		}
		else
		{
			replace_in_file($directory.$file, $serach_text, $replace_text);
		}
		
	}
}

function replace_in_file($nom_fichier, $serach_text, $replace_text)
{
	$str=file_get_contents($nom_fichier);
	$str=str_replace($serach_text, $replace_text, $str);
	file_put_contents($nom_fichier, $str);
}

if (!function_exists('str_getcsv')) { 
  
function str_getcsv($input, $delimiter=',', $enclosure='"', $escape=null, $eol=null) {
   $temp=fopen("php://memory", "rw"); 
  fwrite($temp, $input); 
  fseek($temp, 0); 
  $r = NULL; 
  while (($data = fgetcsv($temp, 4096, $delimiter, $enclosure)) !== false) { 
    if(!$r)
		 $r = $data;
	 else
		 $r[] = array_combine($header, $data);
  } 
  fclose($temp); 
  return $r; 
} 
  
}


function AffOuiNon($name, $value, $class='')
{
	?>
	<input class="<?php echo $class;?>" type="radio" style="float:none;" name="<?php echo $name;?>" id="<?php echo $name;?>_oui" value="1" <?php if ($value==1){?> checked="checked"<?php }?> />
    <label for="<?php echo $name;?>_oui" style="min-width:30px !important;">Oui</label>
    <input class="<?php echo $class;?>" type="radio" style="float:none;" name="<?php echo $name;?>" id="<?php echo $name;?>_non" value="0" <?php if ($value==0){?> checked="checked"<?php }?> />
    <label for="<?php echo $name;?>_non" style="min-width:30px !important;">Non</label>
    <?php
}

function AffOuiNonValue($value)
{
	echo ($value==-1)?'':(($value==1)?'Oui':'Non');
}


function make_safe($variable)
{
    $variable = mysql_real_escape_string(trim($variable));
    return $variable;
}

function AffDatetime($date)
{
	$d = explode (" ", $date);
	$d = explode ("-", $d[0]);
	return $d[2]."/".$d[1]."/".$d[0];
}

function AffDatetimeHeure($date)
{
	$d = explode (" ", $date);
	$h = explode (":", $d[1]);
	$d = explode ("-", $d[0]);
	return $d[2]."/".$d[1]."/".$d[0].' - '.$h[0].'h'.$h[1];
}

function loadFile($sFilename, $sCharset = 'UTF-8')
{
    if (floatval(phpversion()) >= 4.3) {
        $sData = file_get_contents($sFilename);
    } else {
        if (!file_exists($sFilename)) return -3;
        $rHandle = fopen($sFilename, 'r');
        if (!$rHandle) return -2;

        $sData = '';
        while(!feof($rHandle))
            $sData .= fread($rHandle, filesize($sFilename));
        fclose($rHandle);
    }
	
    return $sData;
}

function TrimChamp(&$value)
{
	$value = trim(utf8_encode($value), "\" \n\r");
	$value = str_replace("iî", "î", $value);
}

function CheckConnexionAdmin()
{
	if (!isset($_SESSION['idAdminConnected']))
	{
		return false;
	}
	if ($_SESSION['IP'] != $_SERVER["REMOTE_ADDR"])
	{
		return false;
	}
	
	return true;
}

function CheckConnexion()
{
	if (!isset($_SESSION['idMembre']))
	{
		return false;
	}
	if ($_SESSION['ip'] != $_SERVER["REMOTE_ADDR"])
	{
		return false;
	}
	
	return true;
}

function affDate($date,$langue)
{
	$date=explode("-",$date);
	// 25 Mars 2002
	if ($langue=="FR" || $langue=="fr")
	{
		$tab=array(1=>'Janvier',2=>'F&eacute;vrier',3=>'Mars',4=>'Avril',5=>'Mai',6=>'Juin',7=>'Juillet',8=>'Aout',9=>'Septembre',10=>'Octobre',11=>'Novembre',12=>'D&eacute;cembre');
		$case=(int)$date[1];
		echo $date[2]." ".$tab[$case]." ".$date[0];
	}
	
	// March, 25th 2002
	if ($langue=="EN")
	{
		$tab=array(1=>'January',2=>'Febrary',3=>'March',4=>'April',5=>'May',6=>'June',7=>'July',8=>'August',9=>'September',10=>'October',11=>'November',12=>'December');
		$case=(int)$date[1];
		echo $tab[$case]." ".$date[2];
		if ($date[2]==1 || $date[2]==21 || $date[2]==31) echo "<exp>st</exp>";
		else
			if ($date[2]==2 || $date[2]==22) echo "<exp>nd</exp>";
			else
				if ($date[2]==3 || $date[2]==23) echo "<exp>rd</exp>";
				else
					echo "<exp>th</exp>";
					
		echo ", ".$date[0];
	}
	
	// 25 March 2002
	if ($langue=="EN2" || $langue=="en")
	{
		$tab=array(1=>'January',2=>'Febrary',3=>'March',4=>'April',5=>'May',6=>'June',7=>'July',8=>'August',9=>'September',10=>'October',11=>'November',12=>'December');
		$case=(int)$date[1];
		echo $date[2]." ".$tab[$case]." ".$date[0]; // 25 March
	}
}

function resize($fichier, $fichier_name, $width, $height)
{
	list($width_orig, $height_orig) = getimagesize($fichier);
		
	// Cacul des nouvelles dimensions
	if ($width && ($width_orig < $height_orig)) {
		$width = ($height / $height_orig) * $width_orig;
	} else {
		$height = ($width / $width_orig) * $height_orig;
	}
	
	// Redimensionnement
	$image_p = imagecreatetruecolor($width, $height);
	$image = imagecreatefromjpeg($fichier);
	imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);
	
	imagejpeg($image_p,$fichier_name, 80);
	  imagedestroy($image_p);
}

function resize2($fichier, $fichier_name, $width, $height)
{
  $size = getimagesize($fichier);
  $rapportWidth = $size[0]/$width;

  $rapportHeight = $size[1]/$height;

	if ($rapportWidth>1 && $rapportHeight>1)
	{
		//echo $rapportWidth.':'.$rapportHeight."<br>";

  	  if ($rapportHeight < $rapportWidth)

	  {

	  	$widthOri =$size[0];

		$heightOri = explode(".",$height*$rapportHeight);

		$heightOri = $heightOri[0];

	  }

	  else

	  {

	  	$widthOri = explode(".",$width*$rapportWidth);

		$widthOri = $widthOri[0];

		$heightOri = $size[1];

	  }

	  $src_img = imagecreatefromjpeg($fichier);
	  $dst_img = imagecreatetruecolor($width, $height);
	  $src_x = explode(".",($size[0]-$widthOri)/2);

	  $src_x = $src_x[0];
	  
	  $src_y = explode(".",($size[1]-$heightOri)/2);

	  $src_y = $src_y[0];
	  
	 /* echo $src_x.":".$src_y."<br>";
	  
	  echo $widthOri.":".$heightOri."<br>";
	  echo $width.":".$height."<br>";*/

	  imagecopyresampled($dst_img, $src_img, 0, 0, $src_x, $src_y, $width, $height, $widthOri, $heightOri);

	  //imagejpeg($dst_img, null, 100);

	  imagejpeg($dst_img,$fichier_name, 80);
	  imagedestroy($dst_img);

	  	return 0;
	 }
	 else
	 {
		 return -1;
	 }
	 
	 return -1;
}

function resizeCrop($fichier, $fichier_name, $width, $height)
{
	$size = getimagesize($fichier);
	$rapportWidth = $size[0]/$width;
	$rapportHeight = $size[1]/$height;
	
	if (true || ($rapportWidth>1 && $rapportHeight>1))
	{
		if ($rapportHeight > $rapportWidth)
		{
			$widthOri =$size[0];
			$heightOri = explode(".",$height*$rapportWidth);
			$heightOri = $heightOri[0];
		}
		else
		{
			$widthOri = explode(".",$width*$rapportHeight);
			$widthOri = $widthOri[0];
			$heightOri = $size[1];
		}
		
		$src_img = imagecreatefromjpeg($fichier);
		$dst_img = imagecreatetruecolor($width, $height);
		$src_x = explode(".",($size[0]-$widthOri)/2);
		
		$src_x = $src_x[0];
		
		$src_y = explode(".",($size[1]-$heightOri)/2);
		
		$src_y = $src_y[0];
		
		/* echo $src_x.":".$src_y."<br>";
		
		echo $widthOri.":".$heightOri."<br>";
		echo $width.":".$height."<br>";*/
		
		imagecopyresampled($dst_img, $src_img, 0, 0, $src_x, $src_y, $width, $height, $widthOri, $heightOri);
		
		//imagejpeg($dst_img, null, 100);
		
		imagejpeg($dst_img,$fichier_name, 80);
		imagedestroy($dst_img);
		
		return 0;
	}
	else
	{
		return -1;
	}
	
	return -1;
}
?>