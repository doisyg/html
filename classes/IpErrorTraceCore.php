<?php
class IpErrorTraceCore
{
	public $id_ip_error_trace = -1;
	public $type = "";
	public $date = "";
	public $IP = "";

	public function __construct( $id_ip_error_trace = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_ip_error_trace);
		}
		elseif(! is_null($id_ip_error_trace) && $id_ip_error_trace != -1 )
		{
			$object = IpErrorTrace::getIpErrorTrace( $id_ip_error_trace );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_ip_error_trace = $object->id_ip_error_trace;
		$this->type = $object->type;
		$this->date = $object->date;
		$this->IP = $object->IP;
	}

	public static function getIpErrorTrace( $id_ip_error_trace )
	{
		$query = "SELECT * FROM ip_error_trace a1 WHERE id_ip_error_trace = '".mysqli_real_escape_string(DB::$connexion, $id_ip_error_trace)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_ip_error_trace == -1 || is_null($this->id_ip_error_trace) )
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
		$query = "INSERT INTO ip_error_trace ( type, date, IP ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->type) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->date) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->IP) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert IpErrorTrace : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_ip_error_trace = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		$query = "UPDATE ip_error_trace SET

			type = '" . mysqli_real_escape_string(DB::$connexion,  $this->type )."', 
			date = '" . mysqli_real_escape_string(DB::$connexion,  $this->date )."', 
			IP = '" . mysqli_real_escape_string(DB::$connexion,  $this->IP )."'
		WHERE id_ip_error_trace = '". mysqli_real_escape_string(DB::$connexion, $this->id_ip_error_trace)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update IpErrorTrace : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM ip_error_trace WHERE id_ip_error_trace = '".mysqli_real_escape_string(DB::$connexion, $this->id_ip_error_trace)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete IpErrorTrace : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetIpErrorTraces($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM ip_error_trace";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_ip_error_trace ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new IpErrorTrace($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>