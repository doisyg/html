<?php
class ApiActionUserCore
{
	public $id_action_user = -1;
	public $id_action = -1;
	public $id_user = -1;

	public function __construct( $id_action_user = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_action_user);
		}
		elseif(! is_null($id_action_user) && $id_action_user != -1 )
		{
			$object = ApiActionUser::getApiActionUser( $id_action_user );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_action_user = $object->id_action_user;
		$this->id_action = $object->id_action;
		$this->id_user = $object->id_user;
	}

	public static function getApiActionUser( $id_action_user )
	{
		$query = "SELECT * FROM api_action_user a1 WHERE id_action_user = '".mysqli_real_escape_string(DB::$connexion, $id_action_user)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_action_user == -1 || is_null($this->id_action_user) )
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
		$query = "INSERT INTO api_action_user ( id_action, id_user ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_action) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_user) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert ApiActionUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_action_user = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE api_action_user SET

			id_action = '". mysqli_real_escape_string(DB::$connexion,  $this->id_action )."', 
			id_user = '". mysqli_real_escape_string(DB::$connexion,  $this->id_user )."'
		WHERE id_action_user = '". mysqli_real_escape_string(DB::$connexion, $this->id_action_user)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update ApiActionUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_action_user WHERE id_action_user = '".mysqli_real_escape_string(DB::$connexion, $this->id_action_user)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiActionUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetApiActionUsers($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM api_action_user";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_action_user ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiActionUser($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>