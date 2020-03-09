<?php
class ApiActionGroupeCore
{
	public $id_action_groupe = -1;
	public $id_action = -1;
	public $id_groupe_user = -1;

	public function __construct( $id_action_groupe = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_action_groupe);
		}
		elseif(! is_null($id_action_groupe) && $id_action_groupe != -1 )
		{
			$object = ApiActionGroupe::getApiActionGroupe( $id_action_groupe );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_action_groupe = $object->id_action_groupe;
		$this->id_action = $object->id_action;
		$this->id_groupe_user = $object->id_groupe_user;
	}

	public static function getApiActionGroupe( $id_action_groupe )
	{
		$query = "SELECT * FROM api_action_groupe a1 WHERE id_action_groupe = '".mysqli_real_escape_string(DB::$connexion, $id_action_groupe)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_action_groupe == -1 || is_null($this->id_action_groupe) )
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
		$query = "INSERT INTO api_action_groupe ( id_action, id_groupe_user ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_action) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_groupe_user) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert ApiActionGroupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_action_groupe = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE api_action_groupe SET

			id_action = '". mysqli_real_escape_string(DB::$connexion,  $this->id_action )."', 
			id_groupe_user = '". mysqli_real_escape_string(DB::$connexion,  $this->id_groupe_user )."'
		WHERE id_action_groupe = '". mysqli_real_escape_string(DB::$connexion, $this->id_action_groupe)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update ApiActionGroupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_action_groupe WHERE id_action_groupe = '".mysqli_real_escape_string(DB::$connexion, $this->id_action_groupe)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiActionGroupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetApiActionGroupes($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM api_action_groupe";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_action_groupe ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiActionGroupe($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>