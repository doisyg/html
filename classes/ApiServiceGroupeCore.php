<?php
class ApiServiceGroupeCore
{
	public $id_service_user = -1;
	public $id_service = -1;
	public $id_groupe_user = -1;

	public function __construct( $id_service_user = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_service_user);
		}
		elseif(! is_null($id_service_user) && $id_service_user != -1 )
		{
			$object = ApiServiceGroupe::getApiServiceGroupe( $id_service_user );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_service_user = $object->id_service_user;
		$this->id_service = $object->id_service;
		$this->id_groupe_user = $object->id_groupe_user;
	}

	public static function getApiServiceGroupe( $id_service_user )
	{
		$query = "SELECT * FROM api_service_groupe a1 WHERE id_service_user = '".mysqli_real_escape_string(DB::$connexion, $id_service_user)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_service_user == -1 || is_null($this->id_service_user) )
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
		$query = "INSERT INTO api_service_groupe ( id_service, id_groupe_user ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_service) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_groupe_user) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert ApiServiceGroupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_service_user = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE api_service_groupe SET

			id_service = '". mysqli_real_escape_string(DB::$connexion,  $this->id_service )."', 
			id_groupe_user = '". mysqli_real_escape_string(DB::$connexion,  $this->id_groupe_user )."'
		WHERE id_service_user = '". mysqli_real_escape_string(DB::$connexion, $this->id_service_user)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update ApiServiceGroupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_service_groupe WHERE id_service_user = '".mysqli_real_escape_string(DB::$connexion, $this->id_service_user)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiServiceGroupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetApiServiceGroupes($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM api_service_groupe";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_service_user ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiServiceGroupe($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>