<?php
class ApiServiceCore
{
	public $id_service = -1;
	public $groupe = "";
	public $nom = "";
	public $messageType = "";
	public $function_name = "";
	public $details = "";

	public function __construct( $id_service = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_service);
		}
		elseif(! is_null($id_service) && $id_service != -1 )
		{
			$object = ApiService::getApiService( $id_service );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_service = $object->id_service;
		$this->groupe = $object->groupe;
		$this->nom = $object->nom;
		$this->messageType = $object->messageType;
		$this->function_name = $object->function_name;
		$this->details = $object->details;
	}

	public static function getApiService( $id_service )
	{
		$query = "SELECT * FROM api_service a1 WHERE id_service = '".mysqli_real_escape_string(DB::$connexion, $id_service)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_service == -1 || is_null($this->id_service) )
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
		$query = "INSERT INTO api_service ( groupe, nom, messageType, function_name, details ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->groupe) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->nom) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->messageType) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->function_name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->details) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert ApiService : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_service = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE api_service SET

			groupe = '". mysqli_real_escape_string(DB::$connexion,  $this->groupe )."', 
			nom = '". mysqli_real_escape_string(DB::$connexion,  $this->nom )."', 
			messageType = '". mysqli_real_escape_string(DB::$connexion,  $this->messageType )."', 
			function_name = '". mysqli_real_escape_string(DB::$connexion,  $this->function_name )."', 
			details = '". mysqli_real_escape_string(DB::$connexion,  $this->details )."'
		WHERE id_service = '". mysqli_real_escape_string(DB::$connexion, $this->id_service)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update ApiService : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_service WHERE id_service = '".mysqli_real_escape_string(DB::$connexion, $this->id_service)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiService : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetApiServices($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM api_service";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_service ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiService($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>