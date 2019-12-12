<?php
class ApiServiceUserCore
{
	public $id_service_user = -1;
	public $id_service = -1;
	public $id_user = -1;

	public function __construct( $id_service_user = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_service_user);
		}
		elseif(! is_null($id_service_user) && $id_service_user != -1 )
		{
			$object = ApiServiceUser::getApiServiceUser( $id_service_user );
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
		$this->id_user = $object->id_user;
	}

	public static function getApiServiceUser( $id_service_user )
	{
		$query = "SELECT * FROM api_service_user a1 WHERE id_service_user = '".mysqli_real_escape_string(DB::$connexion, $id_service_user)."'";
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
		$query = "INSERT INTO api_service_user ( id_service, id_user ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_service) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_user) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert ApiServiceUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_service_user = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE api_service_user SET

			id_service = '". mysqli_real_escape_string(DB::$connexion,  $this->id_service )."', 
			id_user = '". mysqli_real_escape_string(DB::$connexion,  $this->id_user )."'
		WHERE id_service_user = '". mysqli_real_escape_string(DB::$connexion, $this->id_service_user)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update ApiServiceUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_service_user WHERE id_service_user = '".mysqli_real_escape_string(DB::$connexion, $this->id_service_user)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiServiceUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetApiServiceUsers($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM api_service_user";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_service_user ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiServiceUser($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>