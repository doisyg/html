<?php
class Site extends SiteCore
{
	public static function GenerateHash()
	{
		$nbLetters = 16;
		$charUniverse="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-*%|.,(){}?<>#:;";
		$nbChars = strlen($charUniverse);
		$randString="";
		
		for($i=0; $i<$nbLetters; $i++){
		   $randInt=rand(0,$nbChars-1);
			$randChar=$charUniverse[$randInt];
			$randString .= $randChar;
		}
		return $randString;
	}
	
	public static function GenerateRandomString($length = 6) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++)
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		return $randomString;
	}
	
	public static function GenerateRandomInt($length = 4) {
		$characters = '0123456789';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++)
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		return $randomString;
	}
	
	public function GetPlans($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM plan WHERE id_site=".(int)$this->id_site;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_plan ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Plan($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}

	public function GetRobotConfigs($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM robot_config";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_robot_config ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new RobotConfig($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
	
	public function GetLastConfig()
	{
		$query='SELECT * FROM robot_config WHERE id_site='.((int)$this->id_site).' ORDER BY date DESC LIMIT 1';
		$result = mysqli_query(DB::$connexion, $query);
		$config = null;
		if ($row = @mysqli_fetch_object( $result ) )
		{
			$config = new RobotConfig($row, true);
		}
		@mysqli_free_result( $result );
		return $config;
	}
}
?>