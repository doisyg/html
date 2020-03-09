<?php
class Top extends TopCore
{
	public static function GetAvailableTops($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM top available=1";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_top ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Top($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
	
	public static function DisabledAll()
	{
		$query = "UPDATE top SET available=0 WHERE 1";
		$result = mysqli_query(DB::$connexion, $query);
	}
	
	public static function DesactivateAll()
	{
		$query = "UPDATE top SET active=0 WHERE 1";
		$result = mysqli_query(DB::$connexion, $query);
	}
		
	public static function GetActiveTop($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM top WHERE active=1";
		$result = mysqli_query(DB::$connexion, $query);
		$top = new Top();
		if ($row = @mysqli_fetch_object( $result ) )
		{
			$top= new Top($row, true);
		}
		@mysqli_free_result( $result );
		return $top;
	}
}
?>