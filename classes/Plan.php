<?php
class Plan extends PlanCore
{
	public function SetAsActive()
	{
		die('TODO plan->SetAsActive()');
	}
	
	public function GetAreas($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM area WHERE deleted=0 AND id_plan=".(int)$this->id_plan;
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
}
?>