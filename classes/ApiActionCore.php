<?php
class ApiActionCore
{
	public $id_action = -1;
	public $groupe = "";
	public $nom = "";
	public $messageType = "";
	public $function_name = "";
	public $details = "";

	public function __construct( $id_action = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_action);
		}
		elseif(! is_null($id_action) && $id_action != -1 )
		{
			$object = ApiAction::getApiAction( $id_action );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_action = $object->id_action;
		$this->groupe = $object->groupe;
		$this->nom = $object->nom;
		$this->messageType = $object->messageType;
		$this->function_name = $object->function_name;
		$this->details = $object->details;
	}

	public static function getApiAction( $id_action )
	{
		$query = "SELECT * FROM api_action a1 WHERE id_action = '".mysqli_real_escape_string(DB::$connexion, $id_action)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_action == -1 || is_null($this->id_action) )
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
		$query = "INSERT INTO api_action ( groupe, nom, messageType, function_name, details ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->groupe) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->nom) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->messageType) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->function_name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->details) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert ApiAction : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_action = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE api_action SET

			groupe = '". mysqli_real_escape_string(DB::$connexion,  $this->groupe )."', 
			nom = '". mysqli_real_escape_string(DB::$connexion,  $this->nom )."', 
			messageType = '". mysqli_real_escape_string(DB::$connexion,  $this->messageType )."', 
			function_name = '". mysqli_real_escape_string(DB::$connexion,  $this->function_name )."', 
			details = '". mysqli_real_escape_string(DB::$connexion,  $this->details )."'
		WHERE id_action = '". mysqli_real_escape_string(DB::$connexion, $this->id_action)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update ApiAction : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_action WHERE id_action = '".mysqli_real_escape_string(DB::$connexion, $this->id_action)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiAction : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetApiActions($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM api_action";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_action ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiAction($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>