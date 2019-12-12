<?php
class Configuration extends ConfigurationCore
{
	public static function GetConfigurations($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM configuration";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion,$order)." ".mysqli_real_escape_string(DB::$connexion,$order_sens);
		else 
			$query .= " ORDER BY id_configuration ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Configuration($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
	
	public static function GetValue($variable)
	{
		$query = "SELECT * FROM configuration WHERE nom = '".$variable."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		
		if ($r = mysqli_fetch_object($resultat))
			return $r->valeur;
		else
		{
			return -1;
		}
	}
		
	public static function GetFromVariable($variable)
	{
		$query = "SELECT * FROM configuration WHERE nom = '".$variable."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		
		if ($r = mysqli_fetch_object($resultat))
			return new Configuration($r, true);
		else
		{
			$c = new Configuration();
			$c->nom = $variable;
			return $c;			
			//debug_print_backtrace();
			//die ($variable." non définie en base");
		}
	}
}
?>