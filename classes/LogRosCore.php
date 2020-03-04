<?php
class LogRosCore
{
	public $id_log_ros = -1;
	public $level = "";
	public $type = "";
	public $detail = "";
	public $date = "";

	public function __construct( $id_log_ros = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_log_ros);
		}
		elseif(! is_null($id_log_ros) && $id_log_ros != -1 )
		{
			$object = LogRos::getLogRos( $id_log_ros );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_log_ros = $object->id_log_ros;
		$this->level = $object->level;
		$this->type = $object->type;
		$this->detail = $object->detail;
		$this->date = $object->date;
	}

	public static function getLogRos( $id_log_ros )
	{
		$query = "SELECT * FROM log_ros a1 WHERE id_log_ros = '".mysqli_real_escape_string(DB::$connexion, $id_log_ros)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_log_ros == -1 || is_null($this->id_log_ros) )
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
		$query = "INSERT INTO log_ros ( level, type, detail, date ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->level) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->type) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->detail) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->date) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert LogRos : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_log_ros = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE log_ros SET

			level = '". mysqli_real_escape_string(DB::$connexion,  $this->level )."', 
			type = '". mysqli_real_escape_string(DB::$connexion,  $this->type )."', 
			detail = '". mysqli_real_escape_string(DB::$connexion,  $this->detail )."', 
			date = '". mysqli_real_escape_string(DB::$connexion,  $this->date )."'
		WHERE id_log_ros = '". mysqli_real_escape_string(DB::$connexion, $this->id_log_ros)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update LogRos : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM log_ros WHERE id_log_ros = '".mysqli_real_escape_string(DB::$connexion, $this->id_log_ros)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete LogRos : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetLogRoss($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM log_ros";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_log_ros ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new LogRos($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>