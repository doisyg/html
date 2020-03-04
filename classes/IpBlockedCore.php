<?php
class IpBlockedCore
{
	public $IP = "";
	public $date = "";

	public function __construct( $IP = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($IP);
		}
		elseif(! is_null($IP) && $IP != -1 )
		{
			$object = IpBlocked::getIpBlocked( $IP );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->IP = $object->IP;
		$this->date = $object->date;
	}

	public static function getIpBlocked( $IP )
	{
		$query = "SELECT * FROM ip_blocked a1 WHERE IP = '".mysqli_real_escape_string(DB::$connexion, $IP)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->IP == -1 || is_null($this->IP) )
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
		$query = "INSERT INTO ip_blocked ( ip, date ) VALUES ( 
			'". mysqli_real_escape_string(DB::$connexion, $this->IP) ."',
			'". mysqli_real_escape_string(DB::$connexion, $this->date) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert IpBlocked : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->IP = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		$query = "UPDATE ip_blocked SET

			date = '" . mysqli_real_escape_string(DB::$connexion,  $this->date )."'
		WHERE IP = '". mysqli_real_escape_string(DB::$connexion, $this->IP)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update IpBlocked : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM ip_blocked WHERE IP = '".mysqli_real_escape_string(DB::$connexion, $this->IP)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete IpBlocked : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetIpBlockeds($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM ip_blocked";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY IP ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new IpBlocked($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>