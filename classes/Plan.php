<?php
class Plan extends PlanCore
{
	public function SetAsActive()
	{
		die('TODO plan->SetAsActive()');
	}
	
	public function GetAreas($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM area WHERE deleted=0 AND is_forbidden=0 AND id_plan=".(int)$this->id_plan;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_area ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Area($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
	
	public function GetForbiddenAreas($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM area WHERE deleted=0 AND is_forbidden=1 AND id_plan=".(int)$this->id_plan;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_area ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Area($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}

	public function GetStationRecharges($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM station_recharge WHERE id_plan=".(int)$this->id_plan;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_station_recharge ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new StationRecharge($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}

	public function GetPois($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM poi WHERE id_plan=".(int)$this->id_plan;
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_poi ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Poi($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>