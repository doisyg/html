<?php
function __($texte)
{
	return Translate::l($texte);
}

function __m($id_lang, $texte)
{
	return Translate::m($id_lang, $texte);
}

class Translate
{ 
	private $dossier_lang;
	private static $current_lang;
	public function __construct( $lang = 'fr' ) 
	{
		global $_LANG_MAIL;
		
		self::$current_lang = $lang;
		include(dirname(__FILE__).'/../lang/'.$lang.'.php');
		
		$_LANG_MAIL = array();
		for ($i=1; $i<10; $i++)
		{
			if (file_exists(dirname(__FILE__).'/../lang/mail/'.$i.'.php'))
			{
				$LANG_MAIL_T = array();
				include(dirname(__FILE__).'/../lang/mail/'.$i.'.php');
				$_LANG_MAIL[$i] = $LANG_MAIL_T;
			}
		}
		
	}
	
	public static function l($texte)
	{
		global $_LANG;
		$key = md5(str_replace('\'', '\\\'', $texte));
		
		if (isset($_LANG[$key])) return $_LANG[$key];
		else
		{
			// On l'ajoute aux fichier de traduction...
			$_LANG[$key] = $texte;
			self::CreateFileLang($_LANG, self::$current_lang);
			
			return $_LANG[$key];
		}
		
		//return (isset($_LANG[$key]))?$_LANG[$key]:$texte;
	}
	
	public static function m($id_lang, $texte)
	{
		global $_LANG_MAIL;
		$key = md5(str_replace('\'', '\\\'', $texte));
		
		if (isset($_LANG_MAIL[$id_lang][$key])) return $_LANG_MAIL[$id_lang][$key];
		else
		{
			// On l'ajoute aux fichier de traduction...
			$_LANG_MAIL[$id_lang][$key] = $texte;
			self::CreateFileLangMail($_LANG_MAIL[$id_lang], $id_lang);
			
			return $_LANG_MAIL[$id_lang][$key];
		}
		
		//return (isset($_LANG[$key]))?$_LANG[$key]:$texte;
	}
	
	public static function GetTraductions($lang)
	{
		global $_LANG;
		$saveLang = $_LANG;
		
		include(dirname(__FILE__).'/../lang/'.$lang.'.php');
		$langRetour = $_LANG;
		
		$_LANG = $saveLang;
		
		return $langRetour;
		
	}
	
	public static function GetTraductionsMail($id_lang)
	{
		global $_LANG_MAIL;
		return $_LANG_MAIL[$id_lang];
		
	}
	
	public static function CreateFileLang($to_insert, $lang)
	{
		$file_path = dirname(__FILE__).'/../lang/'.$lang.'.php';
		if ($fd = fopen($file_path, 'w'))
		{	
			fwrite($fd, "<?php\n\nglobal \$_LANG;\n\$_LANG = array();\n");
			foreach ($to_insert as $key => $value)
				fwrite($fd, '$_LANG[\''.$key.'\'] = \''.addslashes(stripslashes($value)).'\';'."\n");
			fwrite($fd, "\n?>");
			fclose($fd);
		}
	}
	
	public static function CreateFileLangMail($to_insert, $lang)
	{
		$file_path = dirname(__FILE__).'/../lang/mail/'.$lang.'.php';
		if ($fd = fopen($file_path, 'w'))
		{	
			fwrite($fd, "<?php\n\n\$LANG_MAIL_T = array();\n");
			foreach ($to_insert as $key => $value)
				fwrite($fd, '$LANG_MAIL_T[\''.$key.'\'] = \''.addslashes(stripslashes($value)).'\';'."\n");
			fwrite($fd, "\n?>");
			fclose($fd);
		}
	}
	
	public static function ParseFile($content)
	{
		$regex = array();
		$regex[] = '/__\(\''._TRANS_PATTERN_.'\'[\)|\,]/U';
		$regex[] = '/Translate::l\(\''._TRANS_PATTERN_.'\'(,\s*(.+))?\)/U';

		if (is_array($regex))
		{
			$matches = array(1 => array());
			foreach ($regex as $regex_row)
			{
				preg_match_all($regex_row, $content, $matches2);
				if (isset($matches2[1]))
					$matches[1] = array_merge($matches[1], $matches2[1]);
			}
		}
		else
			preg_match_all($regex, $content, $matches);
	
		return $matches[1];
	}
	
	public static function GetFilesToTranslate($Directory)
	{
		$fichiers = array();
		
		$resultat = array();
		$MyDirectory = opendir($Directory) or die('Erreur');
		while($Entry = @readdir($MyDirectory))
		{
			if(is_dir($Directory.'/'.$Entry) && $Entry!='.' && $Entry!='..' && $Entry!='lang')
			{
				$fichiers = array_merge($fichiers, self::GetFilesToTranslate($Directory.'/'.$Entry));
			}
			elseif ($Entry!='.' && $Entry!='..')
			{
				if (substr($Entry, strlen($Entry)-4, 4)=='.php')
					$fichiers[] = $Directory."/".$Entry;
			}
		}
		closedir($MyDirectory);
		
		return $fichiers;
	}
	
	public static function IndexAllFiles()
	{
		global $_CONFIG;
		$fichiers = self::GetFilesToTranslate(dirname(__FILE__).'/../_admin_/');
		
		$to_insert = array();
		foreach ($fichiers as $fichier)
		{
			$contenu = file_get_contents($fichier);
			$textes = self::ParseFile($contenu);
			
			foreach ($textes as $texte)
			{
				$to_insert[md5(str_replace('\'', '\\\'', $texte))] = $texte;
			}
		}
		
		$fichiers = self::GetFilesToTranslate(dirname(__FILE__).'/../robot_hmi/');
		
		foreach ($fichiers as $fichier)
		{
			$contenu = file_get_contents($fichier);
			$textes = self::ParseFile($contenu);
			
			foreach ($textes as $texte)
			{
				$to_insert[md5(str_replace('\'', '\\\'', $texte))] = $texte;
			}
		}
		
		$langues = Lang::GetLangs();
		foreach ($langues as $lang)
		{
			$to_insert_fr = self::MatchExistingTraduction($to_insert, $lang->iso);
			self::CreateFileLang($to_insert_fr, $lang->iso);
		}
	}
	
	public static function MatchExistingTraduction($to_insert, $lang)
	{
		include (dirname(__FILE__).'/../lang/'.$lang.'.php');
		foreach($to_insert as $key=>$value)
		{
			if (isset($_LANG[$key]) && $_LANG[$key]!='')
				$to_insert[$key] = $_LANG[$key];
			
		}
		
		return $to_insert;
	}
		
	
}