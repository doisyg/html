<?php
class Lang extends LangCore
{
	
	private static $_idbyiso = array();
	public static function GetIdByIso($iso)
	{
		if (isset(self::$_idbyiso[$iso])) return self::$_idbyiso[$iso];
		
		$query='SELECT id_lang FROM lang WHERE iso="'.$iso.'"';
		$resultat=mysqli_query(DB::$connexion, $query);
		if ($r=mysqli_fetch_object($resultat))
			return $r->id_lang;
		
		return 1;
	}
}
?>