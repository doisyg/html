<?php
class Droit extends DroitCore
{
	private static $idFromSection = array();
	public static function GetIdFromSection($menu, $sousmenu, $action)
	{
		$id = -1;
		
		if (isset(self::$idFromSection[$menu.'||'.$sousmenu.'||'.$action])) return self::$idFromSection[$menu.'||'.$sousmenu.'||'.$action];
		
		$query='SELECT id_droit FROM droit WHERE section="'.mysqli_real_escape_string(DB::$connexion, $menu).'" AND sous_section="'.mysqli_real_escape_string(DB::$connexion, $sousmenu).'" AND action="'.mysqli_real_escape_string(DB::$connexion, $action).'"';
		$resultat=mysqli_query(DB::$connexion, $query);
		if ($a = mysqli_fetch_array($resultat))
		{
			$id = $a[0];
		}
		
		@mysqli_free_result( $resultat );
		
		self::$idFromSection[$menu.'||'.$sousmenu.'||'.$action] = $id;
		
		return $id;
	}
	
	public static function GetSectionAndSousSection()
	{
		$sections = array();
		$query='SELECT section, sous_section FROM droit GROUP BY section, sous_section ORDER BY section ASC, sous_section ASC';
		$resultat=mysqli_query(DB::$connexion, $query);
		while ($d = mysqli_fetch_array($resultat))
		{
			if (!isset($sections[$d[0]])) $sections[$d[0]] = array();
			$sections[$d[0]][] = $d[1];
		}
		
		@mysqli_free_result( $resultat );
		
		return $sections;
	}
}
?>