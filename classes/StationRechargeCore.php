<?php
class StationRechargeCore
{
	public $id_station_recharge = -1;
	public $id_plan = -1;
	public $x_ros = 0.0;
	public $y_ros = 0.0;
	public $t_ros = 0.0;
	public $num = -1;

	public function __construct( $id_station_recharge = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_station_recharge);
		}
		elseif(! is_null($id_station_recharge) && $id_station_recharge != -1 )
		{
			$object = StationRecharge::getStationRecharge( $id_station_recharge );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_station_recharge = $object->id_station_recharge;
		$this->id_plan = $object->id_plan;
		$this->x_ros = $object->x_ros;
		$this->y_ros = $object->y_ros;
		$this->t_ros = $object->t_ros;
		$this->num = $object->num;
	}

	public static function getStationRecharge( $id_station_recharge )
	{
		$query = "SELECT * FROM station_recharge a1 WHERE id_station_recharge = '".mysqli_real_escape_string(DB::$connexion, $id_station_recharge)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_station_recharge == -1 || is_null($this->id_station_recharge) )
		{
			$this->Insert( );	
		}
		else
		{
			$this->Update( );
		}
	}

	public function Insert()
	{
		global $_CONFIG;
		$query = "INSERT INTO station_recharge ( id_plan, x_ros, y_ros, t_ros, num ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_plan) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->x_ros) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->y_ros) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->t_ros) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->num) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert StationRecharge : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_station_recharge = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE station_recharge SET

			id_plan = '". mysqli_real_escape_string(DB::$connexion,  $this->id_plan )."', 
			x_ros = '". mysqli_real_escape_string(DB::$connexion,  $this->x_ros )."', 
			y_ros = '". mysqli_real_escape_string(DB::$connexion,  $this->y_ros )."', 
			t_ros = '". mysqli_real_escape_string(DB::$connexion,  $this->t_ros )."', 
			num = '". mysqli_real_escape_string(DB::$connexion,  $this->num )."'
		WHERE id_station_recharge = '". mysqli_real_escape_string(DB::$connexion, $this->id_station_recharge)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update StationRecharge : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM station_recharge WHERE id_station_recharge = '".mysqli_real_escape_string(DB::$connexion, $this->id_station_recharge)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete StationRecharge : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetStationRecharges($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM station_recharge";
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
}
?>